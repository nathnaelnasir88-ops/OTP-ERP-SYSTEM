import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getDirectMessageChannelId,
  mergeMessageIdempotent,
  toggleReactionOnMessage,
  filterMessagesForChannel,
  initialChatMessages
} from './chatUtils';
import { ChatMessage } from '../types';

test('getDirectMessageChannelId produces identical deterministic ID regardless of user order', () => {
  const id1 = getDirectMessageChannelId('usr-1', 'usr-5');
  const id2 = getDirectMessageChannelId('usr-5', 'usr-1');
  assert.equal(id1, 'dm-usr-1__usr-5');
  assert.equal(id1, id2);
});

test('mergeMessageIdempotent prevents duplicate message IDs and sorts chronologically', () => {
  const base: ChatMessage[] = [initialChatMessages[0], initialChatMessages[1]];
  // Re-merging existing message with same ID does not duplicate
  const afterDuplicate = mergeMessageIdempotent(base, initialChatMessages[0]);
  assert.equal(afterDuplicate.length, 2);

  // Updating content of existing message updates in-place
  const edited: ChatMessage = {
    ...initialChatMessages[0],
    content: 'Updated welcome message',
    isEdited: true
  };
  const afterEdit = mergeMessageIdempotent(base, edited);
  assert.equal(afterEdit.length, 2);
  assert.equal(afterEdit[0].content, 'Updated welcome message');
  assert.equal(afterEdit[0].isEdited, true);
});

test('toggleReactionOnMessage adds and removes user reaction cleanly', () => {
  const sample: ChatMessage = {
    id: 'msg-test',
    channelId: 'ch-general',
    senderId: 'usr-1',
    senderName: 'Nathnael Nasir',
    senderRole: 'Super Administrator',
    content: 'Testing reaction',
    timestamp: '11:00 AM',
    createdAtMs: 1740400000000,
    reactions: {}
  };

  const added = toggleReactionOnMessage(sample, '🚀', 'usr-2');
  assert.deepEqual(added.reactions?.['🚀'], ['usr-2']);

  const addedSecond = toggleReactionOnMessage(added, '🚀', 'usr-3');
  assert.deepEqual(addedSecond.reactions?.['🚀'], ['usr-2', 'usr-3']);

  const removedFirst = toggleReactionOnMessage(addedSecond, '🚀', 'usr-2');
  assert.deepEqual(removedFirst.reactions?.['🚀'], ['usr-3']);

  const removedAll = toggleReactionOnMessage(removedFirst, '🚀', 'usr-3');
  assert.equal(removedAll.reactions?.['🚀'], undefined);
});

test('filterMessagesForChannel filters by channelId and search keyword', () => {
  const generalMsgs = filterMessagesForChannel(initialChatMessages, 'ch-general');
  assert.equal(generalMsgs.length, 3);

  const filtered = filterMessagesForChannel(initialChatMessages, 'ch-general', 'Telebirr');
  assert.equal(filtered.length, 2);
});
