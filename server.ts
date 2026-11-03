import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';
import { initialChatChannels, initialChatMessages, mergeMessageIdempotent } from './src/utils/chatUtils';
import { ChatChannel, ChatMessage } from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Server-authoritative real-time state
let serverChannels: ChatChannel[] = [...initialChatChannels];
let serverMessages: ChatMessage[] = [...initialChatMessages];

interface PresenceUser {
  userId: string;
  fullName: string;
  role: string;
  department?: string;
  avatarUrl?: string;
  activeChannelId?: string;
  lastSeen: number;
}

const clientPresence = new Map<WebSocket, PresenceUser>();

function getDeduplicatedActiveUsers(): PresenceUser[] {
  const byUserId = new Map<string, PresenceUser>();
  for (const p of clientPresence.values()) {
    byUserId.set(p.userId, p);
  }
  return Array.from(byUserId.values());
}

function broadcast( wss: WebSocketServer, event: { type: string; payload: any }, excludeWs?: WebSocket) {
  const serialized = JSON.stringify(event);
  for (const client of wss.clients) {
    if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
      client.send(serialized);
    }
  }
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // REST endpoint for initial state or reconnection sync
  app.get('/api/chat/state', (_req, res) => {
    res.json({
      channels: serverChannels,
      messages: serverMessages,
      activeUsers: getDeduplicatedActiveUsers()
    });
  });

  const server = http.createServer(app);
  const wss = new WebSocketServer({ server, path: '/ws/chat' });

  wss.on('connection', (ws: WebSocket) => {
    // Send authoritative state immediately on connect
    ws.send(
      JSON.stringify({
        type: 'chat:init',
        payload: {
          channels: serverChannels,
          messages: serverMessages,
          activeUsers: getDeduplicatedActiveUsers()
        }
      })
    );

    ws.on('message', (rawData) => {
      try {
        const event = JSON.parse(rawData.toString());
        const { type, payload } = event;

        switch (type) {
          case 'user:join': {
            if (payload && payload.userId) {
              clientPresence.set(ws, {
                userId: payload.userId,
                fullName: payload.fullName || 'Team Member',
                role: payload.role || 'Employee',
                department: payload.department,
                avatarUrl: payload.avatarUrl,
                activeChannelId: payload.activeChannelId || 'ch-general',
                lastSeen: Date.now()
              });
              broadcast(wss, {
                type: 'presence:updated',
                payload: getDeduplicatedActiveUsers()
              });
            }
            break;
          }

          case 'message:create': {
            const msg = payload as ChatMessage;
            if (!msg || !msg.id || !msg.channelId) break;
            serverMessages = mergeMessageIdempotent(serverMessages, msg);
            broadcast(wss, {
              type: 'message:created',
              payload: msg
            });
            break;
          }

          case 'message:update': {
            const updatedMsg = payload as ChatMessage;
            if (!updatedMsg || !updatedMsg.id) break;
            serverMessages = mergeMessageIdempotent(serverMessages, updatedMsg);
            broadcast(wss, {
              type: 'message:updated',
              payload: updatedMsg
            });
            break;
          }

          case 'message:delete': {
            const messageId = payload?.id;
            if (!messageId) break;
            serverMessages = serverMessages.filter((m) => m.id !== messageId);
            broadcast(wss, {
              type: 'message:deleted',
              payload: { id: messageId }
            });
            break;
          }

          case 'channel:create': {
            const newChan = payload as ChatChannel;
            if (!newChan || !newChan.id) break;
            if (!serverChannels.some((c) => c.id === newChan.id)) {
              serverChannels = [...serverChannels, newChan];
            }
            broadcast(wss, {
              type: 'channel:created',
              payload: newChan
            });
            break;
          }

          case 'typing:update': {
            broadcast(
              wss,
              {
                type: 'typing:updated',
                payload
              },
              ws
            );
            break;
          }
        }
      } catch (err) {
        console.warn('WebSocket message parse error:', err);
      }
    });

    ws.on('close', () => {
      if (clientPresence.has(ws)) {
        clientPresence.delete(ws);
        broadcast(wss, {
          type: 'presence:updated',
          payload: getDeduplicatedActiveUsers()
        });
      }
    });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const PORT = 3000;
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`OTP ERP Server & Real-Time Chat WebSocket running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
