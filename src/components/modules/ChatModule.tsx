import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  MessageSquare,
  Hash,
  Send,
  Plus,
  Search,
  Pin,
  Reply,
  Trash2,
  Link2,
  Sparkles,
  Users,
  CheckCircle2,
  AlertTriangle,
  Megaphone,
  ArrowUpRight,
  X,
  Lock,
  Smile,
  Briefcase,
  FileText,
  ShoppingBag,
  ListTodo,
  Radio
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { useAuth } from '../../context/AuthContext';
import {
  ChatMessage,
  ChatAttachmentLink,
  Department,
  UserRole
} from '../../types';
import {
  filterMessagesForChannel,
  getDirectMessageChannelId
} from '../../utils/chatUtils';

const QUICK_EMOJIS = ['👍', '🔥', '✅', '🎉', '❤️'];

export const ChatModule: React.FC = () => {
  const {
    currentUser,
    chatChannels,
    chatMessages,
    activeChatChannelId,
    setActiveChatChannelId,
    isChatSocketConnected,
    typingUsers,
    sendChatMessage,
    toggleMessageReaction,
    togglePinMessage,
    deleteChatMessage,
    createChatChannel,
    openDirectMessageWithUser,
    broadcastTyping,
    projects,
    tasks,
    invoices,
    purchaseOrders,
    adCampaigns,
    navigateTo,
    userTimeRewards
  } = useERP();

  const { userProfile, managedAccounts } = useAuth();

  const activeUser = useMemo(
    () => ({
      id: userProfile?.id || currentUser.id || 'usr-1',
      fullName: userProfile?.fullName || currentUser.fullName || 'Nathnael Nasir',
      role: (userProfile?.role || currentUser.role || 'Super Administrator') as UserRole,
      department: (userProfile?.department || currentUser.department || 'Management') as Department,
      avatarUrl:
        userProfile?.avatarUrl ||
        currentUser.avatarUrl ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    }),
    [userProfile, currentUser]
  );

  const isSuperAdmin = activeUser.role === 'Super Administrator';

  const [messageInput, setMessageInput] = useState('');
  const [channelSearch, setChannelSearch] = useState('');
  const [messageSearch, setMessageSearch] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<ChatMessage['priority']>('Normal');
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [selectedEntityLink, setSelectedEntityLink] = useState<ChatAttachmentLink | null>(null);
  const [showEntityPicker, setShowEntityPicker] = useState(false);
  const [entityPickerTab, setEntityPickerTab] = useState<'Project' | 'Task' | 'PurchaseOrder' | 'Invoice' | 'Campaign'>('Project');
  const [showNewChannelModal, setShowNewChannelModal] = useState(false);
  const [newChannelForm, setNewChannelForm] = useState({
    name: '',
    description: '',
    department: 'All Agency' as Department | 'All Agency'
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChannel =
    chatChannels.find((c) => c.id === activeChatChannelId) || chatChannels[0];

  const channelMessages = useMemo(
    () => filterMessagesForChannel(chatMessages, activeChannel?.id || 'ch-general', messageSearch),
    [chatMessages, activeChannel?.id, messageSearch]
  );

  const pinnedMessages = useMemo(
    () => channelMessages.filter((m) => m.isPinned),
    [channelMessages]
  );

  const sharedLinksInChannel = useMemo(
    () => channelMessages.filter((m) => m.linkedEntity),
    [channelMessages]
  );

  // Auto-scroll to latest message when channel or message count changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [channelMessages.length, activeChannel?.id]);

  // Separate public/department channels vs DM threads
  const publicChannels = useMemo(
    () =>
      chatChannels.filter(
        (c) =>
          c.type === 'channel' &&
          (!channelSearch.trim() ||
            c.name.toLowerCase().includes(channelSearch.toLowerCase()) ||
            c.description.toLowerCase().includes(channelSearch.toLowerCase()))
      ),
    [chatChannels, channelSearch]
  );

  // Team directory for Direct Messages (excluding current user, or showing all with '(You)' tag)
  const teamRoster = useMemo(() => {
    return managedAccounts.filter(
      (acc) =>
        !channelSearch.trim() ||
        acc.fullName.toLowerCase().includes(channelSearch.toLowerCase()) ||
        acc.role.toLowerCase().includes(channelSearch.toLowerCase()) ||
        acc.department.toLowerCase().includes(channelSearch.toLowerCase())
    );
  }, [managedAccounts, channelSearch]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageInput.trim() || !activeChannel) return;

    sendChatMessage({
      channelId: activeChannel.id,
      content: messageInput,
      priority: selectedPriority,
      replyTo: replyingTo,
      linkedEntity: selectedEntityLink,
      senderOverride: activeUser
    });

    broadcastTyping(activeChannel.id, activeUser.fullName, false);
    setMessageInput('');
    setSelectedPriority('Normal');
    setReplyingTo(null);
    setSelectedEntityLink(null);
    setShowEntityPicker(false);
  };

  const handleCreateChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannelForm.name.trim()) return;
    createChatChannel(
      newChannelForm.name,
      newChannelForm.description,
      newChannelForm.department
    );
    setNewChannelForm({ name: '', description: '', department: 'All Agency' });
    setShowNewChannelModal(false);
  };

  // Resolve display title for Direct Message channels
  const getChannelDisplayTitle = () => {
    if (!activeChannel) return 'general-hq';
    if (activeChannel.type === 'dm') {
      const otherId = activeChannel.participantIds?.find((id) => id !== activeUser.id);
      const otherMember = managedAccounts.find((m) => m.id === otherId);
      if (otherMember) return otherMember.fullName;
      return activeChannel.name;
    }
    return activeChannel.name;
  };

  const activeTypingList = (typingUsers[activeChannel?.id || ''] || []).filter(
    (name) => name !== activeUser.fullName
  );

  return (
    <div className="space-y-4 pb-4">
      {/* Top Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-normal tracking-tight text-[#1d1d1f]">
              Team Chat & Communications Hub
            </h1>
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#1ec94c]/15 text-[#15803d] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#1ec94c] animate-pulse" />
              <span>{isChatSocketConnected ? 'Real-Time Socket Live' : 'Real-Time Sync Active'}</span>
            </span>
          </div>
          <p className="text-xs text-[#86868b] mt-0.5">
            Communicate across departments, start 1-on-1 Direct Messages, and attach live ERP projects, tasks, or purchase orders.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowNewChannelModal(true)}
            className="flex items-center gap-2 bg-[#1d1d1f] hover:bg-[#2c2c2f] text-white text-xs font-medium px-4 py-2.5 rounded-full shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Channel</span>
          </button>
        </div>
      </div>

      {/* Main 3-Column Bento Chat Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[680px]">
        {/* =====================================================================
            LEFT COLUMN (3 Cols): CHANNELS & DIRECT MESSAGES ROSTER
            ===================================================================== */}
        <div className="lg:col-span-3 bg-white rounded-[28px] p-4 shadow-[0_4px_24px_rgba(0,0,0,0.025)] flex flex-col justify-between border border-slate-100">
          <div className="space-y-4">
            {/* Search Channels & People */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={channelSearch}
                onChange={(e) => setChannelSearch(e.target.value)}
                placeholder="Filter channels or staff..."
                className="w-full pl-9 pr-3 py-2 rounded-2xl bg-[#f8f9fb] border border-slate-200/70 text-xs text-[#1d1d1f] focus:outline-hidden focus:border-[#1d1d1f]"
              />
            </div>

            {/* Department & Topic Channels */}
            <div>
              <div className="flex items-center justify-between px-2 mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#86868b]">
                  Agency Channels ({publicChannels.length})
                </span>
                <button
                  type="button"
                  onClick={() => setShowNewChannelModal(true)}
                  className="text-[11px] font-bold text-[#1d7dfa] hover:underline cursor-pointer"
                >
                  + Add
                </button>
              </div>

              <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
                {publicChannels.map((chan) => {
                  const isSelected = activeChannel?.id === chan.id;
                  const msgCount = chatMessages.filter((m) => m.channelId === chan.id).length;
                  return (
                    <button
                      key={chan.id}
                      type="button"
                      onClick={() => setActiveChatChannelId(chan.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-2xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#1d1d1f] text-white font-semibold shadow-xs'
                          : 'hover:bg-[#f5f6f8] text-[#1d1d1f]'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Hash
                          className={`w-3.5 h-3.5 shrink-0 ${
                            isSelected ? 'text-[#1ec94c]' : 'text-slate-400'
                          }`}
                        />
                        <span className="truncate">{chan.name}</span>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          isSelected
                            ? 'bg-white/15 text-white'
                            : 'bg-[#f4f5f7] text-[#86868b]'
                        }`}
                      >
                        {msgCount}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Direct Messages (1-on-1 Team Roster) */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between px-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#86868b]">
                  Direct Messages ({teamRoster.length})
                </span>
                <span className="text-[10px] text-[#1ec94c] font-semibold">● Online</span>
              </div>

              <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
                {teamRoster.map((member) => {
                  const dmId = getDirectMessageChannelId(activeUser.id, member.id);
                  const isSelected = activeChannel?.id === dmId;
                  const dmCount = chatMessages.filter((m) => m.channelId === dmId).length;
                  const isMe = member.id === activeUser.id;

                  return (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() =>
                        openDirectMessageWithUser(
                          { id: activeUser.id, fullName: activeUser.fullName },
                          {
                            id: member.id,
                            fullName: member.fullName,
                            role: member.role,
                            department: member.department
                          }
                        )
                      }
                      className={`w-full text-left px-2.5 py-2 rounded-2xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#1d1d1f] text-white shadow-xs'
                          : 'hover:bg-[#f5f6f8] text-[#1d1d1f]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="relative shrink-0">
                          <img
                            src={
                              member.avatarUrl ||
                              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                            }
                            alt={member.fullName}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200"
                          />
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#1ec94c] ring-2 ring-white" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold truncate flex items-center gap-1">
                            <span>{member.fullName}</span>
                            {isMe && (
                              <span
                                className={`text-[9px] px-1.5 py-0.2 rounded-full ${
                                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                                }`}
                              >
                                You
                              </span>
                            )}
                          </div>
                          <div
                            className={`text-[10px] truncate ${
                              isSelected ? 'text-slate-300' : 'text-[#86868b]'
                            }`}
                          >
                            {member.role}
                          </div>
                        </div>
                      </div>

                      {dmCount > 0 && (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${
                            isSelected ? 'bg-[#1ec94c] text-white' : 'bg-[#1d7dfa]/10 text-[#1d7dfa]'
                          }`}
                        >
                          {dmCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Active User Footer Card */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <img
                src={activeUser.avatarUrl}
                alt={activeUser.fullName}
                className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
              />
              <div className="min-w-0">
                <div className="font-bold text-[#1d1d1f] truncate">{activeUser.fullName}</div>
                <div className="text-[10px] text-[#86868b] truncate">{activeUser.role}</div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1ec94c]/15 text-[#15803d]">
              Active
            </span>
          </div>
        </div>

        {/* =====================================================================
            CENTER COLUMN (6 Cols): LIVE MESSAGE STREAM & COMPOSER
            ===================================================================== */}
        <div className="lg:col-span-6 bg-white rounded-[28px] shadow-[0_4px_24px_rgba(0,0,0,0.025)] border border-slate-100 flex flex-col justify-between overflow-hidden">
          {/* Conversation Top Header */}
          <div className="p-4 sm:px-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-white">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-[#1d1d1f] text-white flex items-center justify-center shrink-0">
                {activeChannel?.type === 'dm' ? (
                  <MessageSquare className="w-4 h-4 text-[#1ec94c]" />
                ) : (
                  <Hash className="w-4 h-4 text-[#feb913]" />
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm sm:text-base font-bold text-[#1d1d1f] truncate">
                    {activeChannel?.type === 'dm' ? getChannelDisplayTitle() : `#${getChannelDisplayTitle()}`}
                  </h2>
                  {activeChannel?.department && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#f4f5f7] text-[#1d1d1f]">
                      {activeChannel.department}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#86868b] truncate mt-0.5">
                  {activeChannel?.description}
                </p>
              </div>
            </div>

            {/* Search Within Conversation */}
            <div className="relative w-44 sm:w-52">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={messageSearch}
                onChange={(e) => setMessageSearch(e.target.value)}
                placeholder="Search messages..."
                className="w-full pl-8 pr-3 py-1.5 rounded-full bg-[#f8f9fb] border border-slate-200/70 text-xs text-[#1d1d1f] focus:outline-hidden focus:border-[#1d1d1f]"
              />
            </div>
          </div>

          {/* Pinned Messages Banner (If any) */}
          {pinnedMessages.length > 0 && (
            <div className="px-5 py-2 bg-amber-50/90 border-b border-amber-200/70 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <Pin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="font-bold text-amber-900 shrink-0">Pinned:</span>
                <span className="text-amber-800 truncate">
                  {pinnedMessages[pinnedMessages.length - 1].content}
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200/60 text-amber-900 shrink-0">
                {pinnedMessages.length} pinned
              </span>
            </div>
          )}

          {/* Scrollable Message Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 max-h-[450px] bg-[#f8f9fb]/50">
            {channelMessages.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6">
                <div className="w-12 h-12 rounded-2xl bg-[#ebedf0] text-[#1d1d1f] flex items-center justify-center mb-3">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-[#1d1d1f]">
                  Start the conversation in {activeChannel?.type === 'dm' ? getChannelDisplayTitle() : `#${getChannelDisplayTitle()}`}
                </h3>
                <p className="text-xs text-[#86868b] max-w-sm mt-1">
                  Send a message below or attach a live ERP project, task, invoice, or purchase order to collaborate in real time.
                </p>
              </div>
            ) : (
              channelMessages.map((msg) => {
                const isOwn = msg.senderId === activeUser.id;
                const canDelete = isOwn || isSuperAdmin;

                return (
                  <div
                    key={msg.id}
                    className={`group rounded-2xl p-4 transition-all border ${
                      msg.priority === 'Announcement'
                        ? 'bg-amber-50/70 border-amber-200'
                        : msg.priority === 'Urgent'
                        ? 'bg-rose-50/50 border-rose-200'
                        : msg.priority === 'Approval Needed'
                        ? 'bg-blue-50/40 border-blue-200'
                        : isOwn
                        ? 'bg-white border-slate-200/90 shadow-2xs'
                        : 'bg-white border-slate-100 shadow-2xs'
                    }`}
                  >
                    {/* Quoted Reply Context */}
                    {msg.replyToSnippet && (
                      <div className="mb-2.5 pl-3 border-l-2 border-[#1d7dfa] text-[11px] text-[#86868b] bg-slate-50/80 py-1 px-2.5 rounded-r-xl">
                        <span className="font-semibold text-[#1d1d1f]">
                          Replying to {msg.replyToSenderName}:
                        </span>{' '}
                        <span className="italic">"{msg.replyToSnippet}"</span>
                      </div>
                    )}

                    {/* Message Author & Metadata Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={
                            msg.senderAvatar ||
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                          }
                          alt={msg.senderName}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-xs font-bold text-[#1d1d1f]">
                              {msg.senderName}
                            </span>
                            <span className="px-2 py-0.2 rounded-full text-[10px] font-semibold bg-[#ebedf0] text-[#1d1d1f]">
                              {msg.senderRole}
                            </span>
                            {msg.priority && msg.priority !== 'Normal' && (
                              <span
                                className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                                  msg.priority === 'Urgent'
                                    ? 'bg-rose-600 text-white'
                                    : msg.priority === 'Approval Needed'
                                    ? 'bg-[#1d7dfa] text-white'
                                    : 'bg-[#feb913] text-black'
                                }`}
                              >
                                {msg.priority}
                              </span>
                            )}
                            {msg.isPinned && (
                              <Pin className="w-3 h-3 text-amber-600 inline" />
                            )}
                          </div>
                          <div className="text-[10px] text-[#86868b]">{msg.timestamp}</div>
                        </div>
                      </div>

                      {/* Quick Message Actions */}
                      <div className="flex items-center gap-1 opacity-85 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => setReplyingTo(msg)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-[#1d1d1f] cursor-pointer"
                          title="Reply to message"
                        >
                          <Reply className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => togglePinMessage(msg.id)}
                          className={`p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer ${
                            msg.isPinned ? 'text-amber-600' : 'text-slate-400 hover:text-[#1d1d1f]'
                          }`}
                          title={msg.isPinned ? 'Unpin message' : 'Pin message'}
                        >
                          <Pin className="w-3.5 h-3.5" />
                        </button>
                        {canDelete && (
                          <button
                            type="button"
                            onClick={() => deleteChatMessage(msg.id)}
                            className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 cursor-pointer"
                            title="Delete message"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Message Body Text */}
                    <p className="text-xs sm:text-[13px] text-[#1d1d1f] mt-2.5 leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </p>

                    {/* Linked ERP Entity Card (Interactive Jump to Module) */}
                    {msg.linkedEntity && (
                      <div
                        onClick={() => navigateTo(msg.linkedEntity!.targetModule)}
                        className="mt-3 p-3 rounded-2xl bg-[#f8f9fb] hover:bg-[#ebedf0] border border-slate-200/80 flex items-center justify-between gap-3 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-xl bg-[#1d1d1f] text-[#feb913] flex items-center justify-center shrink-0">
                            <Link2 className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.2 rounded bg-white border border-slate-200 text-slate-700">
                                {msg.linkedEntity.entityType} · {msg.linkedEntity.entityId}
                              </span>
                              {msg.linkedEntity.statusOrValue && (
                                <span className="text-[10px] font-bold text-[#1ec94c]">
                                  {msg.linkedEntity.statusOrValue}
                                </span>
                              )}
                            </div>
                            <div className="text-xs font-bold text-[#1d1d1f] truncate mt-0.5">
                              {msg.linkedEntity.title}
                            </div>
                          </div>
                        </div>
                        <span className="text-[11px] font-semibold text-[#1d7dfa] flex items-center gap-1 shrink-0">
                          <span>Open</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    )}

                    {/* Emoji Reactions Bar */}
                    <div className="mt-3 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {Object.entries(msg.reactions || {}).map(([emoji, users]) => {
                          const hasReacted = users.includes(activeUser.id);
                          return (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => toggleMessageReaction(msg.id, emoji, activeUser.id)}
                              className={`px-2 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                                hasReacted
                                  ? 'bg-[#1d1d1f] text-white'
                                  : 'bg-[#f4f5f7] hover:bg-[#e5e7ec] text-[#1d1d1f]'
                              }`}
                            >
                              <span>{emoji}</span>
                              <span>{users.length}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Quick Add Reaction Buttons */}
                      <div className="flex items-center gap-1">
                        {QUICK_EMOJIS.map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => toggleMessageReaction(msg.id, emoji, activeUser.id)}
                            className="w-6 h-6 rounded-full hover:bg-slate-100 flex items-center justify-center text-xs transition-transform hover:scale-110 cursor-pointer"
                            title={`React with ${emoji}`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Typing Indicator */}
          {activeTypingList.length > 0 && (
            <div className="px-6 py-1.5 bg-[#f8f9fb] text-[11px] text-[#1d7dfa] font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#1d7dfa] animate-ping" />
              <span>{activeTypingList.join(', ')} is typing...</span>
            </div>
          )}

          {/* Message Composer Area */}
          <div className="p-4 bg-white border-t border-slate-100 space-y-2.5">
            {/* Replying Banner */}
            {replyingTo && (
              <div className="px-3.5 py-2 rounded-xl bg-blue-50/70 border border-blue-200 flex items-center justify-between text-xs">
                <div className="truncate">
                  <span className="font-bold text-[#1d7dfa]">
                    Replying to {replyingTo.senderName}:
                  </span>{' '}
                  <span className="text-slate-600">{replyingTo.content}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setReplyingTo(null)}
                  className="text-slate-400 hover:text-slate-700 ml-2"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Selected ERP Attachment Preview */}
            {selectedEntityLink && (
              <div className="px-3.5 py-2 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <Link2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span className="font-bold text-emerald-950">
                    Linked {selectedEntityLink.entityType} ({selectedEntityLink.entityId}):
                  </span>
                  <span className="text-emerald-800 truncate">{selectedEntityLink.title}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedEntityLink(null)}
                  className="text-emerald-700 hover:text-emerald-950 ml-2"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* ERP Entity Link Picker Drawer */}
            {showEntityPicker && (
              <div className="p-3 rounded-2xl bg-[#f8f9fb] border border-slate-200 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {(['Project', 'Task', 'PurchaseOrder', 'Invoice', 'Campaign'] as const).map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setEntityPickerTab(tab)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold cursor-pointer ${
                          entityPickerTab === tab
                            ? 'bg-[#1d1d1f] text-white'
                            : 'bg-white text-slate-700 border border-slate-200'
                        }`}
                      >
                        {tab}s
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowEntityPicker(false)}
                    className="text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="max-h-32 overflow-y-auto space-y-1 pr-1">
                  {entityPickerTab === 'Project' &&
                    projects.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setSelectedEntityLink({
                            entityType: 'Project',
                            entityId: p.projectId,
                            title: p.name,
                            statusOrValue: `${p.progressPercentage}% · ${p.status}`,
                            targetModule: 'projects'
                          });
                          setShowEntityPicker(false);
                        }}
                        className="w-full text-left px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 flex items-center justify-between text-xs"
                      >
                        <span className="font-semibold text-[#1d1d1f] truncate">
                          {p.projectId} — {p.name}
                        </span>
                        <span className="text-[10px] text-[#1d7dfa] font-bold">{p.status}</span>
                      </button>
                    ))}

                  {entityPickerTab === 'Task' &&
                    tasks.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          setSelectedEntityLink({
                            entityType: 'Task',
                            entityId: t.taskId,
                            title: t.title,
                            statusOrValue: t.status,
                            targetModule: 'projects'
                          });
                          setShowEntityPicker(false);
                        }}
                        className="w-full text-left px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 flex items-center justify-between text-xs"
                      >
                        <span className="font-semibold text-[#1d1d1f] truncate">
                          {t.taskId} — {t.title}
                        </span>
                        <span className="text-[10px] text-[#1ec94c] font-bold">{t.status}</span>
                      </button>
                    ))}

                  {entityPickerTab === 'PurchaseOrder' &&
                    purchaseOrders.map((po) => (
                      <button
                        key={po.id}
                        type="button"
                        onClick={() => {
                          setSelectedEntityLink({
                            entityType: 'PurchaseOrder',
                            entityId: po.poNumber,
                            title: `${po.vendor}: ${po.description}`,
                            statusOrValue: `${po.totalAmount.toLocaleString()} ETB · ${po.status}`,
                            targetModule: 'procurement'
                          });
                          setShowEntityPicker(false);
                        }}
                        className="w-full text-left px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 flex items-center justify-between text-xs"
                      >
                        <span className="font-semibold text-[#1d1d1f] truncate">
                          {po.poNumber} — {po.vendor}
                        </span>
                        <span className="text-[10px] font-bold text-[#f73b9b]">
                          {po.totalAmount.toLocaleString()} ETB
                        </span>
                      </button>
                    ))}

                  {entityPickerTab === 'Invoice' &&
                    invoices.map((inv) => (
                      <button
                        key={inv.id}
                        type="button"
                        onClick={() => {
                          setSelectedEntityLink({
                            entityType: 'Invoice',
                            entityId: inv.invoiceNumber,
                            title: `Client Invoice ${inv.invoiceNumber}`,
                            statusOrValue: `${inv.total.toLocaleString()} ETB · ${inv.status}`,
                            targetModule: 'finance'
                          });
                          setShowEntityPicker(false);
                        }}
                        className="w-full text-left px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 flex items-center justify-between text-xs"
                      >
                        <span className="font-semibold text-[#1d1d1f] truncate">
                          {inv.invoiceNumber} — Total: {inv.total.toLocaleString()} ETB
                        </span>
                        <span className="text-[10px] font-bold text-[#1d7dfa]">{inv.status}</span>
                      </button>
                    ))}

                  {entityPickerTab === 'Campaign' &&
                    adCampaigns.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setSelectedEntityLink({
                            entityType: 'Campaign',
                            entityId: c.campaignId,
                            title: `${c.platform}: ${c.name}`,
                            statusOrValue: c.status,
                            targetModule: 'advertising'
                          });
                          setShowEntityPicker(false);
                        }}
                        className="w-full text-left px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 flex items-center justify-between text-xs"
                      >
                        <span className="font-semibold text-[#1d1d1f] truncate">
                          {c.campaignId} — {c.name}
                        </span>
                        <span className="text-[10px] font-bold text-[#1ec94c]">{c.platform}</span>
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* Composer Controls & Input Form */}
            <form onSubmit={handleSendMessage} className="space-y-2.5">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setShowEntityPicker(!showEntityPicker)}
                    className="px-3 py-1 rounded-full bg-[#f4f5f7] hover:bg-[#e5e7ec] text-[11px] font-semibold text-[#1d1d1f] flex items-center gap-1 cursor-pointer"
                  >
                    <Link2 className="w-3 h-3 text-[#1d7dfa]" />
                    <span>Attach ERP Item</span>
                  </button>

                  <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value as ChatMessage['priority'])}
                    aria-label="Message Priority"
                    className="px-2.5 py-1 rounded-full bg-[#f4f5f7] text-[11px] font-semibold text-[#1d1d1f] border-none focus:outline-hidden cursor-pointer"
                  >
                    <option value="Normal">Priority: Normal</option>
                    <option value="Urgent">🔥 Priority: Urgent</option>
                    <option value="Approval Needed">✅ Approval Needed</option>
                    <option value="Announcement">📢 Pin Announcement</option>
                  </select>
                </div>

                <span className="text-[10px] text-[#86868b]">
                  Sending as <strong className="text-[#1d1d1f]">{activeUser.fullName}</strong> ({activeUser.role})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => {
                    setMessageInput(e.target.value);
                    if (activeChannel) {
                      broadcastTyping(
                        activeChannel.id,
                        activeUser.fullName,
                        e.target.value.trim().length > 0
                      );
                    }
                  }}
                  placeholder={`Message ${
                    activeChannel?.type === 'dm'
                      ? getChannelDisplayTitle()
                      : `#${getChannelDisplayTitle()}`
                  }...`}
                  className="flex-1 px-4 py-3 rounded-2xl bg-[#f8f9fb] border border-slate-200/80 text-xs text-[#1d1d1f] focus:outline-hidden focus:border-[#1d1d1f]"
                />
                <button
                  type="submit"
                  disabled={!messageInput.trim()}
                  className={`px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    messageInput.trim()
                      ? 'bg-[#1d1d1f] hover:bg-[#1ec94c] text-white cursor-pointer shadow-xs'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* =====================================================================
            RIGHT COLUMN (3 Cols): SHARED ERP LINKS & TEAM FOCUS STATUS
            ===================================================================== */}
        <div className="lg:col-span-3 space-y-4">
          {/* Card 1: Shared ERP Deliverables in This Channel */}
          <div className="bg-white rounded-[28px] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.025)] border border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#86868b]">
                Linked ERP Items ({sharedLinksInChannel.length})
              </h3>
              <Link2 className="w-3.5 h-3.5 text-[#1d7dfa]" />
            </div>

            {sharedLinksInChannel.length === 0 ? (
              <p className="text-xs text-[#86868b] py-3">
                No ERP projects, tasks, or POs linked in this conversation yet. Use <strong>"Attach ERP Item"</strong> in the composer to reference live work.
              </p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {sharedLinksInChannel.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => navigateTo(m.linkedEntity!.targetModule)}
                    className="w-full text-left p-3 rounded-2xl bg-[#f8f9fb] hover:bg-[#ebedf0] transition-colors cursor-pointer space-y-1"
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-mono font-bold text-[#1d7dfa]">
                        {m.linkedEntity?.entityType} · {m.linkedEntity?.entityId}
                      </span>
                      <span className="text-[#86868b]">{m.timestamp}</span>
                    </div>
                    <div className="text-xs font-bold text-[#1d1d1f] truncate">
                      {m.linkedEntity?.title}
                    </div>
                    <div className="text-[10px] text-[#86868b]">
                      Shared by {m.senderName}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Card 2: Agency Team Focus & Quick DM */}
          <div className="bg-white rounded-[28px] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.025)] border border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#86868b]">
                Team Focus & Quick DM
              </h3>
              <Users className="w-3.5 h-3.5 text-[#1ec94c]" />
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {userTimeRewards.map((rec) => (
                <div
                  key={rec.userId}
                  className="p-2.5 rounded-2xl bg-[#f8f9fb] flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={rec.avatarUrl}
                      alt={rec.fullName}
                      className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#1d1d1f] truncate">
                        {rec.fullName}
                      </div>
                      <div className="text-[10px] text-[#86868b] truncate">
                        {Math.floor(rec.todayActiveMinutes / 60)}h {rec.todayActiveMinutes % 60}m active today
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      openDirectMessageWithUser(
                        { id: activeUser.id, fullName: activeUser.fullName },
                        {
                          id: rec.userId,
                          fullName: rec.fullName,
                          role: rec.role,
                          department: rec.department
                        }
                      )
                    }
                    className="px-2.5 py-1 rounded-full bg-white hover:bg-[#1d1d1f] hover:text-white text-[10px] font-bold text-[#1d1d1f] border border-slate-200 transition-colors cursor-pointer shrink-0"
                  >
                    Message
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Create New Channel Modal */}
      {showNewChannelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-[28px] p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#1d1d1f]">Create Team Channel</h3>
              <button
                type="button"
                onClick={() => setShowNewChannelModal(false)}
                className="w-8 h-8 rounded-full bg-[#f4f5f7] flex items-center justify-center text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateChannel} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Channel Name (Slug)
                </label>
                <input
                  type="text"
                  required
                  value={newChannelForm.name}
                  onChange={(e) => setNewChannelForm({ ...newChannelForm, name: e.target.value })}
                  placeholder="e.g. video-production-sprint"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Department Scope</label>
                <select
                  value={newChannelForm.department}
                  onChange={(e) =>
                    setNewChannelForm({ ...newChannelForm, department: e.target.value as any })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="All Agency">All Agency</option>
                  <option value="Management">Management</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Creative & Design">Creative & Design</option>
                  <option value="Video Production">Video Production</option>
                  <option value="Advertising">Advertising</option>
                  <option value="Finance">Finance</option>
                  <option value="Administration">Administration</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Channel Purpose</label>
                <textarea
                  rows={2}
                  value={newChannelForm.description}
                  onChange={(e) =>
                    setNewChannelForm({ ...newChannelForm, description: e.target.value })
                  }
                  placeholder="What does the team coordinate in this channel?"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewChannelModal(false)}
                  className="px-4 py-2 rounded-full bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#1d1d1f] text-white font-bold cursor-pointer"
                >
                  Create Channel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
