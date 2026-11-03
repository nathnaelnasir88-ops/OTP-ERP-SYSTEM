import { ChatChannel, ChatMessage } from '../types';

export const initialChatChannels: ChatChannel[] = [
  {
    id: 'ch-general',
    name: 'general-hq',
    type: 'channel',
    description: 'Agency-wide announcements, daily standups, and Open Technology PLC headquarters coordination.',
    department: 'All Agency',
    createdBy: 'Nathnael Nasir',
    createdAt: '2025-01-10'
  },
  {
    id: 'ch-creative',
    name: 'creative-smm',
    type: 'channel',
    description: '6-stage SMM content production, Canva/video review links, and creative design sprints.',
    department: 'Creative & Design',
    createdBy: 'Hanna Girma',
    createdAt: '2025-01-12'
  },
  {
    id: 'ch-campaigns',
    name: 'campaigns-ads',
    type: 'channel',
    description: 'Meta, TikTok, Google & LinkedIn ad performance, ROAS optimization, and CRM lead handoffs.',
    department: 'Marketing',
    createdBy: 'Yonas Bekele',
    createdAt: '2025-01-14'
  },
  {
    id: 'ch-finance',
    name: 'finance-procurement',
    type: 'channel',
    description: 'White Bank & Black Cash ledger coordination, client invoice settlements, and PO approvals.',
    department: 'Finance',
    createdBy: 'Sara Alemayehu',
    createdAt: '2025-01-15'
  },
  {
    id: 'ch-leadership',
    name: 'executive-leadership',
    type: 'channel',
    description: 'Executive department heads, KPI targets, HR capacity planning, and quarterly strategy.',
    department: 'Management',
    createdBy: 'Dawit Tadesse',
    createdAt: '2025-01-16'
  }
];

export const initialChatMessages: ChatMessage[] = [
  {
    id: 'msg-101',
    channelId: 'ch-general',
    senderId: 'usr-1',
    senderName: 'Nathnael Nasir',
    senderRole: 'Super Administrator',
    senderDepartment: 'Management',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    content: 'Welcome to the Open Technology PLC Real-Time Communications Hub! Use department channels or 1-on-1 Direct Messages to coordinate deliverables, link live ERP projects/invoices, and keep our sprints aligned.',
    timestamp: '09:00 AM',
    createdAtMs: 1740387600000,
    priority: 'Announcement',
    isPinned: true,
    reactions: {
      '🔥': ['usr-2', 'usr-3', 'usr-5'],
      '👍': ['usr-4', 'usr-6', 'usr-7']
    }
  },
  {
    id: 'msg-102',
    channelId: 'ch-general',
    senderId: 'usr-2',
    senderName: 'Dawit Tadesse',
    senderRole: 'Managing Director',
    senderDepartment: 'Management',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    content: 'Morning team! Reminder that the Telebirr SuperApp Q4 deliverables review is at 2:30 PM today. Please make sure all SMM assets and campaign ROAS sheets are updated in the ERP.',
    timestamp: '09:14 AM',
    createdAtMs: 1740388440000,
    priority: 'Normal',
    linkedEntity: {
      entityType: 'Project',
      entityId: 'PRJ-24-01',
      title: 'Telebirr SuperApp Youth Campaign',
      statusOrValue: '75% Complete',
      targetModule: 'projects'
    },
    reactions: {
      '✅': ['usr-1', 'usr-4', 'usr-5']
    }
  },
  {
    id: 'msg-103',
    channelId: 'ch-general',
    senderId: 'usr-5',
    senderName: 'Hanna Girma',
    senderRole: 'Social Media Manager',
    senderDepartment: 'Marketing',
    senderAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    content: 'All 4 Instagram Reels and TikTok cuts for Telebirr and Entoto Kuriftu are uploaded to the SMM pipeline and ready for final executive sign-off!',
    timestamp: '09:28 AM',
    createdAtMs: 1740389280000,
    priority: 'Approval Needed',
    replyToMessageId: 'msg-102',
    replyToSenderName: 'Dawit Tadesse',
    replyToSnippet: 'Reminder that the Telebirr SuperApp Q4 deliverables review is at 2:30 PM today.',
    reactions: {
      '🎉': ['usr-1', 'usr-2', 'usr-7']
    }
  },
  {
    id: 'msg-104',
    channelId: 'ch-creative',
    senderId: 'usr-7',
    senderName: 'Abel Tesfaye',
    senderRole: 'Employee',
    senderDepartment: 'Creative & Design',
    senderAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    content: 'Hey @Hanna Girma, I finished the 3D motion storyboard and golden hexagon brand intro for the Abyssinia Bank pitch deck. Ready for your review in SMM Hub.',
    timestamp: '10:05 AM',
    createdAtMs: 1740391500000,
    priority: 'Normal',
    linkedEntity: {
      entityType: 'Task',
      entityId: 'TSK-102',
      title: '3D Motion Storyboard & Brand Intro',
      statusOrValue: 'In Review',
      targetModule: 'projects'
    },
    reactions: {
      '🔥': ['usr-5', 'usr-1']
    }
  },
  {
    id: 'msg-105',
    channelId: 'ch-finance',
    senderId: 'usr-3',
    senderName: 'Sara Alemayehu',
    senderRole: 'Finance Manager',
    senderDepartment: 'Finance',
    senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    content: 'Heads up @Nathnael Nasir: Purchase Order #PO-2024-044 for the DJI Mic 2 Wireless Audio System (85,000 ETB) is queued for executive approval before White Bank disbursement.',
    timestamp: '10:22 AM',
    createdAtMs: 1740392520000,
    priority: 'Approval Needed',
    linkedEntity: {
      entityType: 'PurchaseOrder',
      entityId: 'PO-2024-044',
      title: 'DJI Mic 2 Wireless Audio System',
      statusOrValue: '85,000 ETB · Requested',
      targetModule: 'procurement'
    },
    isPinned: true,
    reactions: {
      '👍': ['usr-1']
    }
  },
  {
    id: 'msg-106',
    channelId: 'ch-campaigns',
    senderId: 'usr-4',
    senderName: 'Yonas Bekele',
    senderRole: 'Project Manager',
    senderDepartment: 'Marketing',
    senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    content: 'Meta Ads ROAS on the Telebirr youth acquisition campaign just crossed 6.3x! Converting the new Real Estate prospect lead into an active project today.',
    timestamp: '10:40 AM',
    createdAtMs: 1740393600000,
    priority: 'Normal',
    linkedEntity: {
      entityType: 'Campaign',
      entityId: 'CMP-2024-01',
      title: 'Telebirr SuperApp Meta Conversion Ads',
      statusOrValue: 'ROAS 6.3x',
      targetModule: 'advertising'
    },
    reactions: {
      '🔥': ['usr-1', 'usr-2', 'usr-5']
    }
  }
];

/**
 * Generates a deterministic Direct Message channel ID for any two users
 * so both participants always read and write to the same conversation room.
 */
export function getDirectMessageChannelId(userAId: string, userBId: string): string {
  const sorted = [userAId.trim(), userBId.trim()].sort();
  return `dm-${sorted[0]}__${sorted[1]}`;
}

/**
 * Idempotently merges an incoming or updated message into a message list,
 * preventing duplicates on WebSocket / Firestore / BroadcastChannel reconnects
 * and maintaining chronological order.
 */
export function mergeMessageIdempotent(
  messages: ChatMessage[],
  incoming: ChatMessage
): ChatMessage[] {
  const exists = messages.some((m) => m.id === incoming.id);
  const next = exists
    ? messages.map((m) => (m.id === incoming.id ? { ...m, ...incoming } : m))
    : [...messages, incoming];
  return next.sort((a, b) => a.createdAtMs - b.createdAtMs);
}

/**
 * Pure immutable toggle for an emoji reaction by a specific user on a message.
 */
export function toggleReactionOnMessage(
  message: ChatMessage,
  emoji: string,
  userId: string
): ChatMessage {
  const currentReactions = { ...(message.reactions || {}) };
  const currentUsers = currentReactions[emoji] ? [...currentReactions[emoji]] : [];
  const hasReacted = currentUsers.includes(userId);

  if (hasReacted) {
    const filtered = currentUsers.filter((id) => id !== userId);
    if (filtered.length === 0) {
      delete currentReactions[emoji];
    } else {
      currentReactions[emoji] = filtered;
    }
  } else {
    currentReactions[emoji] = [...currentUsers, userId];
  }

  return {
    ...message,
    reactions: currentReactions
  };
}

/**
 * Filters messages for a given channelId and optional search query.
 */
export function filterMessagesForChannel(
  messages: ChatMessage[],
  channelId: string,
  searchQuery: string = ''
): ChatMessage[] {
  const inChannel = messages
    .filter((m) => m.channelId === channelId)
    .sort((a, b) => a.createdAtMs - b.createdAtMs);

  const q = searchQuery.trim().toLowerCase();
  if (!q) return inChannel;

  return inChannel.filter(
    (m) =>
      m.content.toLowerCase().includes(q) ||
      m.senderName.toLowerCase().includes(q) ||
      (m.linkedEntity && m.linkedEntity.title.toLowerCase().includes(q)) ||
      (m.linkedEntity && m.linkedEntity.entityId.toLowerCase().includes(q))
  );
}
