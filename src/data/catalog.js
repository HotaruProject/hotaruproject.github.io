export const CATALOG_METHODS = [
  {
    "name": "set_checklist_completed",
    "rpc": "messages.toggleTodoCompleted",
    "namespace": "messages",
    "signature": "await ctx.set_checklist_completed(peer: InputPeer, msg_id: int, completed: Vector<int>, incompleted: Vector<int>)",
    "returns": "list[dict[str, Any]]",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "msg_id",
        "type": "int",
        "required": true,
        "default": "$message"
      },
      {
        "name": "completed",
        "type": "Vector<int>",
        "required": true,
        "default": null
      },
      {
        "name": "incompleted",
        "type": "Vector<int>",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.toggleTodoCompleted. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.toggleTodoCompleted. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "add_poll_answer",
    "rpc": "messages.addPollAnswer",
    "namespace": "messages",
    "signature": "await ctx.add_poll_answer(peer: InputPeer, msg_id: int, answer: PollAnswer)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "msg_id",
        "type": "int",
        "required": true,
        "default": "$message"
      },
      {
        "name": "answer",
        "type": "PollAnswer",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.addPollAnswer. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.addPollAnswer. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "remove_poll_answer",
    "rpc": "messages.deletePollAnswer",
    "namespace": "messages",
    "signature": "await ctx.remove_poll_answer(peer: InputPeer, msg_id: int, option: bytes)",
    "returns": "bool",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "msg_id",
        "type": "int",
        "required": true,
        "default": "$message"
      },
      {
        "name": "option",
        "type": "bytes",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.deletePollAnswer. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.deletePollAnswer. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "unread_poll_votes",
    "rpc": "messages.getUnreadPollVotes",
    "namespace": "messages",
    "signature": "await ctx.unread_poll_votes(peer: InputPeer, top_msg_id: flags.0?int = None, offset_id: int, add_offset: int, limit: int, max_id: int, min_id: int)",
    "returns": "bool",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "top_msg_id",
        "type": "flags.0?int",
        "required": false,
        "default": null
      },
      {
        "name": "offset_id",
        "type": "int",
        "required": true,
        "default": "0"
      },
      {
        "name": "add_offset",
        "type": "int",
        "required": true,
        "default": "0"
      },
      {
        "name": "limit",
        "type": "int",
        "required": true,
        "default": "50"
      },
      {
        "name": "max_id",
        "type": "int",
        "required": true,
        "default": "0"
      },
      {
        "name": "min_id",
        "type": "int",
        "required": true,
        "default": "0"
      }
    ],
    "desc_en": "Calls Telegram messages.getUnreadPollVotes. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.getUnreadPollVotes. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "mark_poll_votes_read",
    "rpc": "messages.readPollVotes",
    "namespace": "messages",
    "signature": "await ctx.mark_poll_votes_read(peer: InputPeer, top_msg_id: flags.0?int = None)",
    "returns": "bool",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "top_msg_id",
        "type": "flags.0?int",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.readPollVotes. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.readPollVotes. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "poll_statistics",
    "rpc": "stats.getPollStats",
    "namespace": "stats",
    "signature": "await ctx.poll_statistics(dark: flags.0?true = None, peer: InputPeer, msg_id: int)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "dark",
        "type": "flags.0?true",
        "required": false,
        "default": null
      },
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "msg_id",
        "type": "int",
        "required": true,
        "default": "$message"
      }
    ],
    "desc_en": "Calls Telegram stats.getPollStats. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram stats.getPollStats. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "scheduled_messages",
    "rpc": "messages.getScheduledHistory",
    "namespace": "messages",
    "signature": "await ctx.scheduled_messages(peer: InputPeer, hash: long)",
    "returns": "list[dict[str, Any]]",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "hash",
        "type": "long",
        "required": true,
        "default": "0"
      }
    ],
    "desc_en": "Calls Telegram messages.getScheduledHistory. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.getScheduledHistory. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "scheduled_by_ids",
    "rpc": "messages.getScheduledMessages",
    "namespace": "messages",
    "signature": "await ctx.scheduled_by_ids(peer: InputPeer, id: Vector<int>)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "id",
        "type": "Vector<int>",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.getScheduledMessages. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.getScheduledMessages. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "publish_scheduled",
    "rpc": "messages.sendScheduledMessages",
    "namespace": "messages",
    "signature": "await ctx.publish_scheduled(peer: InputPeer, id: Vector<int>)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "id",
        "type": "Vector<int>",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.sendScheduledMessages. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.sendScheduledMessages. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "cancel_scheduled",
    "rpc": "messages.deleteScheduledMessages",
    "namespace": "messages",
    "signature": "await ctx.cancel_scheduled(peer: InputPeer, id: Vector<int>)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "id",
        "type": "Vector<int>",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.deleteScheduledMessages. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.deleteScheduledMessages. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "configure_chat_reactions",
    "rpc": "messages.setChatAvailableReactions",
    "namespace": "messages",
    "signature": "await ctx.configure_chat_reactions(peer: InputPeer, available_reactions: ChatReactions, reactions_limit: flags.0?int = None, paid_enabled: flags.1?Bool = None)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "available_reactions",
        "type": "ChatReactions",
        "required": true,
        "default": null
      },
      {
        "name": "reactions_limit",
        "type": "flags.0?int",
        "required": false,
        "default": null
      },
      {
        "name": "paid_enabled",
        "type": "flags.1?Bool",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.setChatAvailableReactions. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.setChatAvailableReactions. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "available_reactions",
    "rpc": "messages.getAvailableReactions",
    "namespace": "messages",
    "signature": "await ctx.available_reactions(hash: int)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "hash",
        "type": "int",
        "required": true,
        "default": "0"
      }
    ],
    "desc_en": "Calls Telegram messages.getAvailableReactions. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.getAvailableReactions. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "set_default_reaction",
    "rpc": "messages.setDefaultReaction",
    "namespace": "messages",
    "signature": "await ctx.set_default_reaction(reaction: Reaction)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "reaction",
        "type": "Reaction",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.setDefaultReaction. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.setDefaultReaction. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "unread_reactions",
    "rpc": "messages.getUnreadReactions",
    "namespace": "messages",
    "signature": "await ctx.unread_reactions(peer: InputPeer, top_msg_id: flags.0?int = None, saved_peer_id: flags.1?InputPeer = None, offset_id: int, add_offset: int, limit: int, max_id: int, min_id: int)",
    "returns": "bool",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "top_msg_id",
        "type": "flags.0?int",
        "required": false,
        "default": null
      },
      {
        "name": "saved_peer_id",
        "type": "flags.1?InputPeer",
        "required": false,
        "default": null
      },
      {
        "name": "offset_id",
        "type": "int",
        "required": true,
        "default": "0"
      },
      {
        "name": "add_offset",
        "type": "int",
        "required": true,
        "default": "0"
      },
      {
        "name": "limit",
        "type": "int",
        "required": true,
        "default": "50"
      },
      {
        "name": "max_id",
        "type": "int",
        "required": true,
        "default": "0"
      },
      {
        "name": "min_id",
        "type": "int",
        "required": true,
        "default": "0"
      }
    ],
    "desc_en": "Calls Telegram messages.getUnreadReactions. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.getUnreadReactions. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "mark_reactions_read",
    "rpc": "messages.readReactions",
    "namespace": "messages",
    "signature": "await ctx.mark_reactions_read(peer: InputPeer, top_msg_id: flags.0?int = None, saved_peer_id: flags.1?InputPeer = None)",
    "returns": "bool",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "top_msg_id",
        "type": "flags.0?int",
        "required": false,
        "default": null
      },
      {
        "name": "saved_peer_id",
        "type": "flags.1?InputPeer",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.readReactions. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.readReactions. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "popular_reactions",
    "rpc": "messages.getTopReactions",
    "namespace": "messages",
    "signature": "await ctx.popular_reactions(limit: int, hash: long)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "limit",
        "type": "int",
        "required": true,
        "default": "50"
      },
      {
        "name": "hash",
        "type": "long",
        "required": true,
        "default": "0"
      }
    ],
    "desc_en": "Calls Telegram messages.getTopReactions. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.getTopReactions. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "recent_reactions",
    "rpc": "messages.getRecentReactions",
    "namespace": "messages",
    "signature": "await ctx.recent_reactions(limit: int, hash: long)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "limit",
        "type": "int",
        "required": true,
        "default": "50"
      },
      {
        "name": "hash",
        "type": "long",
        "required": true,
        "default": "0"
      }
    ],
    "desc_en": "Calls Telegram messages.getRecentReactions. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.getRecentReactions. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "clear_recent_reactions",
    "rpc": "messages.clearRecentReactions",
    "namespace": "messages",
    "signature": "await ctx.clear_recent_reactions()",
    "returns": "bool",
    "params": [],
    "desc_en": "Calls Telegram messages.clearRecentReactions. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.clearRecentReactions. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "remove_member_reactions",
    "rpc": "messages.deleteParticipantReactions",
    "namespace": "messages",
    "signature": "await ctx.remove_member_reactions(peer: InputPeer, participant: InputPeer)",
    "returns": "bool",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "participant",
        "type": "InputPeer",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.deleteParticipantReactions. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.deleteParticipantReactions. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "remove_member_message_reaction",
    "rpc": "messages.deleteParticipantReaction",
    "namespace": "messages",
    "signature": "await ctx.remove_member_message_reaction(peer: InputPeer, msg_id: int, participant: InputPeer)",
    "returns": "bool",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "msg_id",
        "type": "int",
        "required": true,
        "default": "$message"
      },
      {
        "name": "participant",
        "type": "InputPeer",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.deleteParticipantReaction. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.deleteParticipantReaction. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "saved_dialogs",
    "rpc": "messages.getSavedDialogs",
    "namespace": "messages",
    "signature": "await ctx.saved_dialogs(exclude_pinned: flags.0?true = None, parent_peer: flags.1?InputPeer = None, offset_date: int, offset_id: int, offset_peer: InputPeer, limit: int, hash: long)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "exclude_pinned",
        "type": "flags.0?true",
        "required": false,
        "default": null
      },
      {
        "name": "parent_peer",
        "type": "flags.1?InputPeer",
        "required": false,
        "default": null
      },
      {
        "name": "offset_date",
        "type": "int",
        "required": true,
        "default": "0"
      },
      {
        "name": "offset_id",
        "type": "int",
        "required": true,
        "default": "0"
      },
      {
        "name": "offset_peer",
        "type": "InputPeer",
        "required": true,
        "default": "{'_': 'inputPeerEmpty'}"
      },
      {
        "name": "limit",
        "type": "int",
        "required": true,
        "default": "50"
      },
      {
        "name": "hash",
        "type": "long",
        "required": true,
        "default": "0"
      }
    ],
    "desc_en": "Calls Telegram messages.getSavedDialogs. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.getSavedDialogs. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "saved_history",
    "rpc": "messages.getSavedHistory",
    "namespace": "messages",
    "signature": "await ctx.saved_history(parent_peer: flags.0?InputPeer = None, peer: InputPeer, offset_id: int, offset_date: int, add_offset: int, limit: int, max_id: int, min_id: int, hash: long)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "parent_peer",
        "type": "flags.0?InputPeer",
        "required": false,
        "default": null
      },
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": null
      },
      {
        "name": "offset_id",
        "type": "int",
        "required": true,
        "default": "0"
      },
      {
        "name": "offset_date",
        "type": "int",
        "required": true,
        "default": "0"
      },
      {
        "name": "add_offset",
        "type": "int",
        "required": true,
        "default": "0"
      },
      {
        "name": "limit",
        "type": "int",
        "required": true,
        "default": "50"
      },
      {
        "name": "max_id",
        "type": "int",
        "required": true,
        "default": "0"
      },
      {
        "name": "min_id",
        "type": "int",
        "required": true,
        "default": "0"
      },
      {
        "name": "hash",
        "type": "long",
        "required": true,
        "default": "0"
      }
    ],
    "desc_en": "Calls Telegram messages.getSavedHistory. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.getSavedHistory. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "clear_saved_history",
    "rpc": "messages.deleteSavedHistory",
    "namespace": "messages",
    "signature": "await ctx.clear_saved_history(parent_peer: flags.0?InputPeer = None, peer: InputPeer, max_id: int, min_date: flags.2?int = None, max_date: flags.3?int = None)",
    "returns": "bool",
    "params": [
      {
        "name": "parent_peer",
        "type": "flags.0?InputPeer",
        "required": false,
        "default": null
      },
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": null
      },
      {
        "name": "max_id",
        "type": "int",
        "required": true,
        "default": null
      },
      {
        "name": "min_date",
        "type": "flags.2?int",
        "required": false,
        "default": null
      },
      {
        "name": "max_date",
        "type": "flags.3?int",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.deleteSavedHistory. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.deleteSavedHistory. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "pinned_saved_dialogs",
    "rpc": "messages.getPinnedSavedDialogs",
    "namespace": "messages",
    "signature": "await ctx.pinned_saved_dialogs()",
    "returns": "dict[str, Any]",
    "params": [],
    "desc_en": "Calls Telegram messages.getPinnedSavedDialogs. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.getPinnedSavedDialogs. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "set_saved_dialog_pinned",
    "rpc": "messages.toggleSavedDialogPin",
    "namespace": "messages",
    "signature": "await ctx.set_saved_dialog_pinned(pinned: flags.0?true = None, peer: InputDialogPeer)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "pinned",
        "type": "flags.0?true",
        "required": false,
        "default": null
      },
      {
        "name": "peer",
        "type": "InputDialogPeer",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.toggleSavedDialogPin. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.toggleSavedDialogPin. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "reorder_saved_pins",
    "rpc": "messages.reorderPinnedSavedDialogs",
    "namespace": "messages",
    "signature": "await ctx.reorder_saved_pins(force: flags.0?true = None, order: Vector<InputDialogPeer>)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "force",
        "type": "flags.0?true",
        "required": false,
        "default": null
      },
      {
        "name": "order",
        "type": "Vector<InputDialogPeer>",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.reorderPinnedSavedDialogs. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.reorderPinnedSavedDialogs. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "saved_reaction_tags",
    "rpc": "messages.getSavedReactionTags",
    "namespace": "messages",
    "signature": "await ctx.saved_reaction_tags(peer: flags.0?InputPeer = None, hash: long)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "peer",
        "type": "flags.0?InputPeer",
        "required": false,
        "default": null
      },
      {
        "name": "hash",
        "type": "long",
        "required": true,
        "default": "0"
      }
    ],
    "desc_en": "Calls Telegram messages.getSavedReactionTags. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.getSavedReactionTags. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "rename_saved_tag",
    "rpc": "messages.updateSavedReactionTag",
    "namespace": "messages",
    "signature": "await ctx.rename_saved_tag(reaction: Reaction, title: flags.0?string = None)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "reaction",
        "type": "Reaction",
        "required": true,
        "default": null
      },
      {
        "name": "title",
        "type": "flags.0?string",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.updateSavedReactionTag. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.updateSavedReactionTag. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "suggested_saved_tags",
    "rpc": "messages.getDefaultTagReactions",
    "namespace": "messages",
    "signature": "await ctx.suggested_saved_tags(hash: long)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "hash",
        "type": "long",
        "required": true,
        "default": "0"
      }
    ],
    "desc_en": "Calls Telegram messages.getDefaultTagReactions. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.getDefaultTagReactions. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "saved_dialogs_by_peers",
    "rpc": "messages.getSavedDialogsByID",
    "namespace": "messages",
    "signature": "await ctx.saved_dialogs_by_peers(parent_peer: flags.1?InputPeer = None, ids: Vector<InputPeer>)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "parent_peer",
        "type": "flags.1?InputPeer",
        "required": false,
        "default": null
      },
      {
        "name": "ids",
        "type": "Vector<InputPeer>",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.getSavedDialogsByID. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.getSavedDialogsByID. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "mark_saved_history_read",
    "rpc": "messages.readSavedHistory",
    "namespace": "messages",
    "signature": "await ctx.mark_saved_history_read(parent_peer: InputPeer, peer: InputPeer, max_id: int)",
    "returns": "bool",
    "params": [
      {
        "name": "parent_peer",
        "type": "InputPeer",
        "required": true,
        "default": null
      },
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": null
      },
      {
        "name": "max_id",
        "type": "int",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.readSavedHistory. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.readSavedHistory. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "forum_topics",
    "rpc": "messages.getForumTopics",
    "namespace": "messages",
    "signature": "await ctx.forum_topics(peer: InputPeer, q: flags.0?string = None, offset_date: int, offset_id: int, offset_topic: int, limit: int)",
    "returns": "list[dict[str, Any]]",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "q",
        "type": "flags.0?string",
        "required": false,
        "default": null
      },
      {
        "name": "offset_date",
        "type": "int",
        "required": true,
        "default": "0"
      },
      {
        "name": "offset_id",
        "type": "int",
        "required": true,
        "default": "0"
      },
      {
        "name": "offset_topic",
        "type": "int",
        "required": true,
        "default": "0"
      },
      {
        "name": "limit",
        "type": "int",
        "required": true,
        "default": "50"
      }
    ],
    "desc_en": "Calls Telegram messages.getForumTopics. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.getForumTopics. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "forum_topics_by_ids",
    "rpc": "messages.getForumTopicsByID",
    "namespace": "messages",
    "signature": "await ctx.forum_topics_by_ids(peer: InputPeer, topics: Vector<int>)",
    "returns": "list[dict[str, Any]]",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "topics",
        "type": "Vector<int>",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.getForumTopicsByID. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.getForumTopicsByID. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "edit_forum_topic",
    "rpc": "messages.editForumTopic",
    "namespace": "messages",
    "signature": "await ctx.edit_forum_topic(peer: InputPeer, topic_id: int, title: flags.0?string = None, icon_emoji_id: flags.1?long = None, closed: flags.2?Bool = None, hidden: flags.3?Bool = None)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "topic_id",
        "type": "int",
        "required": true,
        "default": null
      },
      {
        "name": "title",
        "type": "flags.0?string",
        "required": false,
        "default": null
      },
      {
        "name": "icon_emoji_id",
        "type": "flags.1?long",
        "required": false,
        "default": null
      },
      {
        "name": "closed",
        "type": "flags.2?Bool",
        "required": false,
        "default": null
      },
      {
        "name": "hidden",
        "type": "flags.3?Bool",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.editForumTopic. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.editForumTopic. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "set_forum_topic_pinned",
    "rpc": "messages.updatePinnedForumTopic",
    "namespace": "messages",
    "signature": "await ctx.set_forum_topic_pinned(peer: InputPeer, topic_id: int, pinned: Bool)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "topic_id",
        "type": "int",
        "required": true,
        "default": null
      },
      {
        "name": "pinned",
        "type": "Bool",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.updatePinnedForumTopic. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.updatePinnedForumTopic. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "reorder_forum_pins",
    "rpc": "messages.reorderPinnedForumTopics",
    "namespace": "messages",
    "signature": "await ctx.reorder_forum_pins(force: flags.0?true = None, peer: InputPeer, order: Vector<int>)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "force",
        "type": "flags.0?true",
        "required": false,
        "default": null
      },
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "order",
        "type": "Vector<int>",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.reorderPinnedForumTopics. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.reorderPinnedForumTopics. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "create_forum_topic",
    "rpc": "messages.createForumTopic",
    "namespace": "messages",
    "signature": "await ctx.create_forum_topic(title_missing: flags.4?true = None, peer: InputPeer, title: string, icon_color: flags.0?int = None, icon_emoji_id: flags.3?long = None, random_id: long, send_as: flags.2?InputPeer = None)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "title_missing",
        "type": "flags.4?true",
        "required": false,
        "default": null
      },
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "title",
        "type": "string",
        "required": true,
        "default": null
      },
      {
        "name": "icon_color",
        "type": "flags.0?int",
        "required": false,
        "default": null
      },
      {
        "name": "icon_emoji_id",
        "type": "flags.3?long",
        "required": false,
        "default": null
      },
      {
        "name": "random_id",
        "type": "long",
        "required": true,
        "default": "$random"
      },
      {
        "name": "send_as",
        "type": "flags.2?InputPeer",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.createForumTopic. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.createForumTopic. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "remove_forum_topic",
    "rpc": "messages.deleteTopicHistory",
    "namespace": "messages",
    "signature": "await ctx.remove_forum_topic(peer: InputPeer, top_msg_id: int)",
    "returns": "bool",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "top_msg_id",
        "type": "int",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.deleteTopicHistory. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.deleteTopicHistory. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "set_forum_enabled",
    "rpc": "channels.toggleForum",
    "namespace": "channels",
    "signature": "await ctx.set_forum_enabled(channel: InputChannel, enabled: Bool, tabs: Bool)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "enabled",
        "type": "Bool",
        "required": true,
        "default": null
      },
      {
        "name": "tabs",
        "type": "Bool",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram channels.toggleForum. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram channels.toggleForum. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "set_forum_message_view",
    "rpc": "channels.toggleViewForumAsMessages",
    "namespace": "channels",
    "signature": "await ctx.set_forum_message_view(channel: InputChannel, enabled: Bool)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "enabled",
        "type": "Bool",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram channels.toggleViewForumAsMessages. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram channels.toggleViewForumAsMessages. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "story_posting_quota",
    "rpc": "stories.canSendStory",
    "namespace": "stories",
    "signature": "await ctx.story_posting_quota(peer: InputPeer)",
    "returns": "int",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram stories.canSendStory. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram stories.canSendStory. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "post_story",
    "rpc": "stories.sendStory",
    "namespace": "stories",
    "signature": "await ctx.post_story(pinned: flags.2?true = None, noforwards: flags.4?true = None, fwd_modified: flags.7?true = None, peer: InputPeer, media: InputMedia, media_areas: flags.5?Vector<MediaArea> = None, caption: flags.0?string = None, entities: flags.1?Vector<MessageEntity> = None, privacy_rules: Vector<InputPrivacyRule>, random_id: long, period: flags.3?int = None, fwd_from_id: flags.6?InputPeer = None, fwd_from_story: flags.6?int = None, albums: flags.8?Vector<int> = None, music: flags.9?InputDocument = None)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "pinned",
        "type": "flags.2?true",
        "required": false,
        "default": null
      },
      {
        "name": "noforwards",
        "type": "flags.4?true",
        "required": false,
        "default": null
      },
      {
        "name": "fwd_modified",
        "type": "flags.7?true",
        "required": false,
        "default": null
      },
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": null
      },
      {
        "name": "media",
        "type": "InputMedia",
        "required": true,
        "default": null
      },
      {
        "name": "media_areas",
        "type": "flags.5?Vector<MediaArea>",
        "required": false,
        "default": null
      },
      {
        "name": "caption",
        "type": "flags.0?string",
        "required": false,
        "default": null
      },
      {
        "name": "entities",
        "type": "flags.1?Vector<MessageEntity>",
        "required": false,
        "default": null
      },
      {
        "name": "privacy_rules",
        "type": "Vector<InputPrivacyRule>",
        "required": true,
        "default": null
      },
      {
        "name": "random_id",
        "type": "long",
        "required": true,
        "default": "$random"
      },
      {
        "name": "period",
        "type": "flags.3?int",
        "required": false,
        "default": null
      },
      {
        "name": "fwd_from_id",
        "type": "flags.6?InputPeer",
        "required": false,
        "default": null
      },
      {
        "name": "fwd_from_story",
        "type": "flags.6?int",
        "required": false,
        "default": null
      },
      {
        "name": "albums",
        "type": "flags.8?Vector<int>",
        "required": false,
        "default": null
      },
      {
        "name": "music",
        "type": "flags.9?InputDocument",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram stories.sendStory. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram stories.sendStory. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "edit_story",
    "rpc": "stories.editStory",
    "namespace": "stories",
    "signature": "await ctx.edit_story(peer: InputPeer, id: int, media: flags.0?InputMedia = None, media_areas: flags.3?Vector<MediaArea> = None, caption: flags.1?string = None, entities: flags.1?Vector<MessageEntity> = None, privacy_rules: flags.2?Vector<InputPrivacyRule> = None, music: flags.4?InputDocument = None)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": null
      },
      {
        "name": "id",
        "type": "int",
        "required": true,
        "default": null
      },
      {
        "name": "media",
        "type": "flags.0?InputMedia",
        "required": false,
        "default": null
      },
      {
        "name": "media_areas",
        "type": "flags.3?Vector<MediaArea>",
        "required": false,
        "default": null
      },
      {
        "name": "caption",
        "type": "flags.1?string",
        "required": false,
        "default": null
      },
      {
        "name": "entities",
        "type": "flags.1?Vector<MessageEntity>",
        "required": false,
        "default": null
      },
      {
        "name": "privacy_rules",
        "type": "flags.2?Vector<InputPrivacyRule>",
        "required": false,
        "default": null
      },
      {
        "name": "music",
        "type": "flags.4?InputDocument",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram stories.editStory. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram stories.editStory. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "delete_stories",
    "rpc": "stories.deleteStories",
    "namespace": "stories",
    "signature": "await ctx.delete_stories(peer: InputPeer, id: Vector<int>)",
    "returns": "bool",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": null
      },
      {
        "name": "id",
        "type": "Vector<int>",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram stories.deleteStories. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram stories.deleteStories. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "set_stories_on_profile",
    "rpc": "stories.togglePinned",
    "namespace": "stories",
    "signature": "await ctx.set_stories_on_profile(peer: InputPeer, id: Vector<int>, pinned: Bool)",
    "returns": "list[dict[str, Any]]",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": null
      },
      {
        "name": "id",
        "type": "Vector<int>",
        "required": true,
        "default": null
      },
      {
        "name": "pinned",
        "type": "Bool",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram stories.togglePinned. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram stories.togglePinned. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "story_feed",
    "rpc": "stories.getAllStories",
    "namespace": "stories",
    "signature": "await ctx.story_feed(next: flags.1?true = None, hidden: flags.2?true = None, state: flags.0?string = None)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "next",
        "type": "flags.1?true",
        "required": false,
        "default": null
      },
      {
        "name": "hidden",
        "type": "flags.2?true",
        "required": false,
        "default": null
      },
      {
        "name": "state",
        "type": "flags.0?string",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram stories.getAllStories. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram stories.getAllStories. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "profile_stories",
    "rpc": "stories.getPinnedStories",
    "namespace": "stories",
    "signature": "await ctx.profile_stories(peer: InputPeer, offset_id: int, limit: int)",
    "returns": "list[dict[str, Any]]",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": null
      },
      {
        "name": "offset_id",
        "type": "int",
        "required": true,
        "default": "0"
      },
      {
        "name": "limit",
        "type": "int",
        "required": true,
        "default": "50"
      }
    ],
    "desc_en": "Calls Telegram stories.getPinnedStories. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram stories.getPinnedStories. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "archived_stories",
    "rpc": "stories.getStoriesArchive",
    "namespace": "stories",
    "signature": "await ctx.archived_stories(peer: InputPeer, offset_id: int, limit: int)",
    "returns": "list[dict[str, Any]]",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": null
      },
      {
        "name": "offset_id",
        "type": "int",
        "required": true,
        "default": "0"
      },
      {
        "name": "limit",
        "type": "int",
        "required": true,
        "default": "50"
      }
    ],
    "desc_en": "Calls Telegram stories.getStoriesArchive. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram stories.getStoriesArchive. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "stories_by_ids",
    "rpc": "stories.getStoriesByID",
    "namespace": "stories",
    "signature": "await ctx.stories_by_ids(peer: InputPeer, id: Vector<int>)",
    "returns": "list[dict[str, Any]]",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": null
      },
      {
        "name": "id",
        "type": "Vector<int>",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram stories.getStoriesByID. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram stories.getStoriesByID. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "mark_stories_read",
    "rpc": "stories.readStories",
    "namespace": "stories",
    "signature": "await ctx.mark_stories_read(peer: InputPeer, max_id: int)",
    "returns": "bool",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": null
      },
      {
        "name": "max_id",
        "type": "int",
        "required": true,
        "default": "0"
      }
    ],
    "desc_en": "Calls Telegram stories.readStories. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram stories.readStories. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "story_viewers",
    "rpc": "stories.getStoryViewsList",
    "namespace": "stories",
    "signature": "await ctx.story_viewers(just_contacts: flags.0?true = None, reactions_first: flags.2?true = None, forwards_first: flags.3?true = None, peer: InputPeer, q: flags.1?string = None, id: int, offset: string, limit: int)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "just_contacts",
        "type": "flags.0?true",
        "required": false,
        "default": null
      },
      {
        "name": "reactions_first",
        "type": "flags.2?true",
        "required": false,
        "default": null
      },
      {
        "name": "forwards_first",
        "type": "flags.3?true",
        "required": false,
        "default": null
      },
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": null
      },
      {
        "name": "q",
        "type": "flags.1?string",
        "required": false,
        "default": null
      },
      {
        "name": "id",
        "type": "int",
        "required": true,
        "default": null
      },
      {
        "name": "offset",
        "type": "string",
        "required": true,
        "default": ""
      },
      {
        "name": "limit",
        "type": "int",
        "required": true,
        "default": "50"
      }
    ],
    "desc_en": "Calls Telegram stories.getStoryViewsList. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram stories.getStoryViewsList. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "story_view_counts",
    "rpc": "stories.getStoriesViews",
    "namespace": "stories",
    "signature": "await ctx.story_view_counts(peer: InputPeer, id: Vector<int>)",
    "returns": "int",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": null
      },
      {
        "name": "id",
        "type": "Vector<int>",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram stories.getStoriesViews. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram stories.getStoriesViews. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "story_link",
    "rpc": "stories.exportStoryLink",
    "namespace": "stories",
    "signature": "await ctx.story_link(peer: InputPeer, id: int)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": null
      },
      {
        "name": "id",
        "type": "int",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram stories.exportStoryLink. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram stories.exportStoryLink. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "activate_story_stealth",
    "rpc": "stories.activateStealthMode",
    "namespace": "stories",
    "signature": "await ctx.activate_story_stealth(past: flags.0?true = None, future: flags.1?true = None)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "past",
        "type": "flags.0?true",
        "required": false,
        "default": null
      },
      {
        "name": "future",
        "type": "flags.1?true",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram stories.activateStealthMode. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram stories.activateStealthMode. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "react_to_story",
    "rpc": "stories.sendReaction",
    "namespace": "stories",
    "signature": "await ctx.react_to_story(add_to_recent: flags.0?true = None, peer: InputPeer, story_id: int, reaction: Reaction)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "add_to_recent",
        "type": "flags.0?true",
        "required": false,
        "default": null
      },
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": null
      },
      {
        "name": "story_id",
        "type": "int",
        "required": true,
        "default": null
      },
      {
        "name": "reaction",
        "type": "Reaction",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram stories.sendReaction. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram stories.sendReaction. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "peer_stories",
    "rpc": "stories.getPeerStories",
    "namespace": "stories",
    "signature": "await ctx.peer_stories(peer: InputPeer)",
    "returns": "list[dict[str, Any]]",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram stories.getPeerStories. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram stories.getPeerStories. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "story_read_markers",
    "rpc": "stories.getAllReadPeerStories",
    "namespace": "stories",
    "signature": "await ctx.story_read_markers()",
    "returns": "bool",
    "params": [],
    "desc_en": "Calls Telegram stories.getAllReadPeerStories. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram stories.getAllReadPeerStories. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "peer_latest_story_ids",
    "rpc": "stories.getPeerMaxIDs",
    "namespace": "stories",
    "signature": "await ctx.peer_latest_story_ids(id: Vector<InputPeer>)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "id",
        "type": "Vector<InputPeer>",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram stories.getPeerMaxIDs. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram stories.getPeerMaxIDs. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "story_posting_chats",
    "rpc": "stories.getChatsToSend",
    "namespace": "stories",
    "signature": "await ctx.story_posting_chats()",
    "returns": "dict[str, Any]",
    "params": [],
    "desc_en": "Calls Telegram stories.getChatsToSend. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram stories.getChatsToSend. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "set_peer_stories_hidden",
    "rpc": "stories.togglePeerStoriesHidden",
    "namespace": "stories",
    "signature": "await ctx.set_peer_stories_hidden(peer: InputPeer, hidden: Bool)",
    "returns": "list[dict[str, Any]]",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": null
      },
      {
        "name": "hidden",
        "type": "Bool",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram stories.togglePeerStoriesHidden. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram stories.togglePeerStoriesHidden. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "story_reaction_senders",
    "rpc": "stories.getStoryReactionsList",
    "namespace": "stories",
    "signature": "await ctx.story_reaction_senders(forwards_first: flags.2?true = None, peer: InputPeer, id: int, reaction: flags.0?Reaction = None, offset: flags.1?string = None, limit: int)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "forwards_first",
        "type": "flags.2?true",
        "required": false,
        "default": null
      },
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": null
      },
      {
        "name": "id",
        "type": "int",
        "required": true,
        "default": null
      },
      {
        "name": "reaction",
        "type": "flags.0?Reaction",
        "required": false,
        "default": null
      },
      {
        "name": "offset",
        "type": "flags.1?string",
        "required": false,
        "default": null
      },
      {
        "name": "limit",
        "type": "int",
        "required": true,
        "default": "50"
      }
    ],
    "desc_en": "Calls Telegram stories.getStoryReactionsList. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram stories.getStoryReactionsList. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "reorder_profile_story_pins",
    "rpc": "stories.togglePinnedToTop",
    "namespace": "stories",
    "signature": "await ctx.reorder_profile_story_pins(peer: InputPeer, id: Vector<int>)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": null
      },
      {
        "name": "id",
        "type": "Vector<int>",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram stories.togglePinnedToTop. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram stories.togglePinnedToTop. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "search_stories",
    "rpc": "stories.searchPosts",
    "namespace": "stories",
    "signature": "await ctx.search_stories(hashtag: flags.0?string = None, area: flags.1?MediaArea = None, peer: flags.2?InputPeer = None, offset: string, limit: int)",
    "returns": "list[dict[str, Any]]",
    "params": [
      {
        "name": "hashtag",
        "type": "flags.0?string",
        "required": false,
        "default": null
      },
      {
        "name": "area",
        "type": "flags.1?MediaArea",
        "required": false,
        "default": null
      },
      {
        "name": "peer",
        "type": "flags.2?InputPeer",
        "required": false,
        "default": null
      },
      {
        "name": "offset",
        "type": "string",
        "required": true,
        "default": ""
      },
      {
        "name": "limit",
        "type": "int",
        "required": true,
        "default": "50"
      }
    ],
    "desc_en": "Calls Telegram stories.searchPosts. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram stories.searchPosts. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "create_story_album",
    "rpc": "stories.createAlbum",
    "namespace": "stories",
    "signature": "await ctx.create_story_album(peer: InputPeer, title: string, stories: Vector<int>)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": null
      },
      {
        "name": "title",
        "type": "string",
        "required": true,
        "default": null
      },
      {
        "name": "stories",
        "type": "Vector<int>",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram stories.createAlbum. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram stories.createAlbum. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "edit_story_album",
    "rpc": "stories.updateAlbum",
    "namespace": "stories",
    "signature": "await ctx.edit_story_album(peer: InputPeer, album_id: int, title: flags.0?string = None, delete_stories: flags.1?Vector<int> = None, add_stories: flags.2?Vector<int> = None, order: flags.3?Vector<int> = None)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": null
      },
      {
        "name": "album_id",
        "type": "int",
        "required": true,
        "default": null
      },
      {
        "name": "title",
        "type": "flags.0?string",
        "required": false,
        "default": null
      },
      {
        "name": "delete_stories",
        "type": "flags.1?Vector<int>",
        "required": false,
        "default": null
      },
      {
        "name": "add_stories",
        "type": "flags.2?Vector<int>",
        "required": false,
        "default": null
      },
      {
        "name": "order",
        "type": "flags.3?Vector<int>",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram stories.updateAlbum. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram stories.updateAlbum. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "reorder_story_albums",
    "rpc": "stories.reorderAlbums",
    "namespace": "stories",
    "signature": "await ctx.reorder_story_albums(peer: InputPeer, order: Vector<int>)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": null
      },
      {
        "name": "order",
        "type": "Vector<int>",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram stories.reorderAlbums. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram stories.reorderAlbums. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "remove_story_album",
    "rpc": "stories.deleteAlbum",
    "namespace": "stories",
    "signature": "await ctx.remove_story_album(peer: InputPeer, album_id: int)",
    "returns": "bool",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": null
      },
      {
        "name": "album_id",
        "type": "int",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram stories.deleteAlbum. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram stories.deleteAlbum. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "story_albums",
    "rpc": "stories.getAlbums",
    "namespace": "stories",
    "signature": "await ctx.story_albums(peer: InputPeer, hash: long)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": null
      },
      {
        "name": "hash",
        "type": "long",
        "required": true,
        "default": "0"
      }
    ],
    "desc_en": "Calls Telegram stories.getAlbums. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram stories.getAlbums. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "story_album_items",
    "rpc": "stories.getAlbumStories",
    "namespace": "stories",
    "signature": "await ctx.story_album_items(peer: InputPeer, album_id: int, offset: int, limit: int)",
    "returns": "list[dict[str, Any]]",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": null
      },
      {
        "name": "album_id",
        "type": "int",
        "required": true,
        "default": null
      },
      {
        "name": "offset",
        "type": "int",
        "required": true,
        "default": "0"
      },
      {
        "name": "limit",
        "type": "int",
        "required": true,
        "default": "50"
      }
    ],
    "desc_en": "Calls Telegram stories.getAlbumStories. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram stories.getAlbumStories. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "stickers_for_emoji",
    "rpc": "messages.getStickers",
    "namespace": "messages",
    "signature": "await ctx.stickers_for_emoji(emoticon: string, hash: long)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "emoticon",
        "type": "string",
        "required": true,
        "default": null
      },
      {
        "name": "hash",
        "type": "long",
        "required": true,
        "default": "0"
      }
    ],
    "desc_en": "Calls Telegram messages.getStickers. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.getStickers. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "installed_sticker_sets",
    "rpc": "messages.getAllStickers",
    "namespace": "messages",
    "signature": "await ctx.installed_sticker_sets(hash: long)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "hash",
        "type": "long",
        "required": true,
        "default": "0"
      }
    ],
    "desc_en": "Calls Telegram messages.getAllStickers. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.getAllStickers. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "sticker_set",
    "rpc": "messages.getStickerSet",
    "namespace": "messages",
    "signature": "await ctx.sticker_set(stickerset: InputStickerSet, hash: int)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "stickerset",
        "type": "InputStickerSet",
        "required": true,
        "default": null
      },
      {
        "name": "hash",
        "type": "int",
        "required": true,
        "default": "0"
      }
    ],
    "desc_en": "Calls Telegram messages.getStickerSet. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.getStickerSet. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "install_sticker_set",
    "rpc": "messages.installStickerSet",
    "namespace": "messages",
    "signature": "await ctx.install_sticker_set(stickerset: InputStickerSet, archived: Bool)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "stickerset",
        "type": "InputStickerSet",
        "required": true,
        "default": null
      },
      {
        "name": "archived",
        "type": "Bool",
        "required": true,
        "default": "False"
      }
    ],
    "desc_en": "Calls Telegram messages.installStickerSet. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.installStickerSet. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "uninstall_sticker_set",
    "rpc": "messages.uninstallStickerSet",
    "namespace": "messages",
    "signature": "await ctx.uninstall_sticker_set(stickerset: InputStickerSet)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "stickerset",
        "type": "InputStickerSet",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.uninstallStickerSet. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.uninstallStickerSet. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "reorder_sticker_sets",
    "rpc": "messages.reorderStickerSets",
    "namespace": "messages",
    "signature": "await ctx.reorder_sticker_sets(masks: flags.0?true = None, emojis: flags.1?true = None, order: Vector<long>)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "masks",
        "type": "flags.0?true",
        "required": false,
        "default": null
      },
      {
        "name": "emojis",
        "type": "flags.1?true",
        "required": false,
        "default": null
      },
      {
        "name": "order",
        "type": "Vector<long>",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.reorderStickerSets. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.reorderStickerSets. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "saved_gifs",
    "rpc": "messages.getSavedGifs",
    "namespace": "messages",
    "signature": "await ctx.saved_gifs(hash: long)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "hash",
        "type": "long",
        "required": true,
        "default": "0"
      }
    ],
    "desc_en": "Calls Telegram messages.getSavedGifs. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.getSavedGifs. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "set_gif_saved",
    "rpc": "messages.saveGif",
    "namespace": "messages",
    "signature": "await ctx.set_gif_saved(id: InputDocument, unsave: Bool)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "id",
        "type": "InputDocument",
        "required": true,
        "default": null
      },
      {
        "name": "unsave",
        "type": "Bool",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.saveGif. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.saveGif. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "featured_sticker_sets",
    "rpc": "messages.getFeaturedStickers",
    "namespace": "messages",
    "signature": "await ctx.featured_sticker_sets(hash: long)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "hash",
        "type": "long",
        "required": true,
        "default": "0"
      }
    ],
    "desc_en": "Calls Telegram messages.getFeaturedStickers. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.getFeaturedStickers. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "mark_featured_stickers_seen",
    "rpc": "messages.readFeaturedStickers",
    "namespace": "messages",
    "signature": "await ctx.mark_featured_stickers_seen(id: Vector<long>)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "id",
        "type": "Vector<long>",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.readFeaturedStickers. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.readFeaturedStickers. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "recent_stickers",
    "rpc": "messages.getRecentStickers",
    "namespace": "messages",
    "signature": "await ctx.recent_stickers(attached: flags.0?true = None, hash: long)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "attached",
        "type": "flags.0?true",
        "required": false,
        "default": null
      },
      {
        "name": "hash",
        "type": "long",
        "required": true,
        "default": "0"
      }
    ],
    "desc_en": "Calls Telegram messages.getRecentStickers. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.getRecentStickers. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "set_sticker_recent",
    "rpc": "messages.saveRecentSticker",
    "namespace": "messages",
    "signature": "await ctx.set_sticker_recent(attached: flags.0?true = None, id: InputDocument, unsave: Bool)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "attached",
        "type": "flags.0?true",
        "required": false,
        "default": null
      },
      {
        "name": "id",
        "type": "InputDocument",
        "required": true,
        "default": null
      },
      {
        "name": "unsave",
        "type": "Bool",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.saveRecentSticker. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.saveRecentSticker. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "clear_recent_stickers",
    "rpc": "messages.clearRecentStickers",
    "namespace": "messages",
    "signature": "await ctx.clear_recent_stickers(attached: flags.0?true = None)",
    "returns": "bool",
    "params": [
      {
        "name": "attached",
        "type": "flags.0?true",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.clearRecentStickers. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.clearRecentStickers. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "archived_sticker_sets",
    "rpc": "messages.getArchivedStickers",
    "namespace": "messages",
    "signature": "await ctx.archived_sticker_sets(masks: flags.0?true = None, emojis: flags.1?true = None, offset_id: long, limit: int)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "masks",
        "type": "flags.0?true",
        "required": false,
        "default": null
      },
      {
        "name": "emojis",
        "type": "flags.1?true",
        "required": false,
        "default": null
      },
      {
        "name": "offset_id",
        "type": "long",
        "required": true,
        "default": "0"
      },
      {
        "name": "limit",
        "type": "int",
        "required": true,
        "default": "50"
      }
    ],
    "desc_en": "Calls Telegram messages.getArchivedStickers. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.getArchivedStickers. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "installed_masks",
    "rpc": "messages.getMaskStickers",
    "namespace": "messages",
    "signature": "await ctx.installed_masks(hash: long)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "hash",
        "type": "long",
        "required": true,
        "default": "0"
      }
    ],
    "desc_en": "Calls Telegram messages.getMaskStickers. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.getMaskStickers. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "media_sticker_sets",
    "rpc": "messages.getAttachedStickers",
    "namespace": "messages",
    "signature": "await ctx.media_sticker_sets(media: InputStickeredMedia)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "media",
        "type": "InputStickeredMedia",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.getAttachedStickers. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.getAttachedStickers. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "favorite_stickers",
    "rpc": "messages.getFavedStickers",
    "namespace": "messages",
    "signature": "await ctx.favorite_stickers(hash: long)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "hash",
        "type": "long",
        "required": true,
        "default": "0"
      }
    ],
    "desc_en": "Calls Telegram messages.getFavedStickers. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.getFavedStickers. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "set_sticker_favorite",
    "rpc": "messages.faveSticker",
    "namespace": "messages",
    "signature": "await ctx.set_sticker_favorite(id: InputDocument, unfave: Bool)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "id",
        "type": "InputDocument",
        "required": true,
        "default": null
      },
      {
        "name": "unfave",
        "type": "Bool",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.faveSticker. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.faveSticker. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "search_sticker_sets",
    "rpc": "messages.searchStickerSets",
    "namespace": "messages",
    "signature": "await ctx.search_sticker_sets(exclude_featured: flags.0?true = None, q: string, hash: long)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "exclude_featured",
        "type": "flags.0?true",
        "required": false,
        "default": null
      },
      {
        "name": "q",
        "type": "string",
        "required": true,
        "default": null
      },
      {
        "name": "hash",
        "type": "long",
        "required": true,
        "default": "0"
      }
    ],
    "desc_en": "Calls Telegram messages.searchStickerSets. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.searchStickerSets. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "bulk_sticker_set_action",
    "rpc": "messages.toggleStickerSets",
    "namespace": "messages",
    "signature": "await ctx.bulk_sticker_set_action(uninstall: flags.0?true = None, archive: flags.1?true = None, unarchive: flags.2?true = None, stickersets: Vector<InputStickerSet>)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "uninstall",
        "type": "flags.0?true",
        "required": false,
        "default": null
      },
      {
        "name": "archive",
        "type": "flags.1?true",
        "required": false,
        "default": null
      },
      {
        "name": "unarchive",
        "type": "flags.2?true",
        "required": false,
        "default": null
      },
      {
        "name": "stickersets",
        "type": "Vector<InputStickerSet>",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.toggleStickerSets. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.toggleStickerSets. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "older_featured_sticker_sets",
    "rpc": "messages.getOldFeaturedStickers",
    "namespace": "messages",
    "signature": "await ctx.older_featured_sticker_sets(offset: int, limit: int, hash: long)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "offset",
        "type": "int",
        "required": true,
        "default": "0"
      },
      {
        "name": "limit",
        "type": "int",
        "required": true,
        "default": "50"
      },
      {
        "name": "hash",
        "type": "long",
        "required": true,
        "default": "0"
      }
    ],
    "desc_en": "Calls Telegram messages.getOldFeaturedStickers. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.getOldFeaturedStickers. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "custom_emoji_documents",
    "rpc": "messages.getCustomEmojiDocuments",
    "namespace": "messages",
    "signature": "await ctx.custom_emoji_documents(document_id: Vector<long>)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "document_id",
        "type": "Vector<long>",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.getCustomEmojiDocuments. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.getCustomEmojiDocuments. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "installed_emoji_sets",
    "rpc": "messages.getEmojiStickers",
    "namespace": "messages",
    "signature": "await ctx.installed_emoji_sets(hash: long)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "hash",
        "type": "long",
        "required": true,
        "default": "0"
      }
    ],
    "desc_en": "Calls Telegram messages.getEmojiStickers. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.getEmojiStickers. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "featured_emoji_sets",
    "rpc": "messages.getFeaturedEmojiStickers",
    "namespace": "messages",
    "signature": "await ctx.featured_emoji_sets(hash: long)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "hash",
        "type": "long",
        "required": true,
        "default": "0"
      }
    ],
    "desc_en": "Calls Telegram messages.getFeaturedEmojiStickers. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.getFeaturedEmojiStickers. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "search_custom_emoji",
    "rpc": "messages.searchCustomEmoji",
    "namespace": "messages",
    "signature": "await ctx.search_custom_emoji(emoticon: string, hash: long)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "emoticon",
        "type": "string",
        "required": true,
        "default": null
      },
      {
        "name": "hash",
        "type": "long",
        "required": true,
        "default": "0"
      }
    ],
    "desc_en": "Calls Telegram messages.searchCustomEmoji. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.searchCustomEmoji. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "search_emoji_sets",
    "rpc": "messages.searchEmojiStickerSets",
    "namespace": "messages",
    "signature": "await ctx.search_emoji_sets(exclude_featured: flags.0?true = None, q: string, hash: long)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "exclude_featured",
        "type": "flags.0?true",
        "required": false,
        "default": null
      },
      {
        "name": "q",
        "type": "string",
        "required": true,
        "default": null
      },
      {
        "name": "hash",
        "type": "long",
        "required": true,
        "default": "0"
      }
    ],
    "desc_en": "Calls Telegram messages.searchEmojiStickerSets. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.searchEmojiStickerSets. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "owned_sticker_sets",
    "rpc": "messages.getMyStickers",
    "namespace": "messages",
    "signature": "await ctx.owned_sticker_sets(offset_id: long, limit: int)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "offset_id",
        "type": "long",
        "required": true,
        "default": "0"
      },
      {
        "name": "limit",
        "type": "int",
        "required": true,
        "default": "50"
      }
    ],
    "desc_en": "Calls Telegram messages.getMyStickers. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.getMyStickers. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "search_stickers",
    "rpc": "messages.searchStickers",
    "namespace": "messages",
    "signature": "await ctx.search_stickers(emojis: flags.0?true = None, q: string, emoticon: string, lang_code: Vector<string>, offset: int, limit: int, hash: long)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "emojis",
        "type": "flags.0?true",
        "required": false,
        "default": null
      },
      {
        "name": "q",
        "type": "string",
        "required": true,
        "default": null
      },
      {
        "name": "emoticon",
        "type": "string",
        "required": true,
        "default": null
      },
      {
        "name": "lang_code",
        "type": "Vector<string>",
        "required": true,
        "default": null
      },
      {
        "name": "offset",
        "type": "int",
        "required": true,
        "default": "0"
      },
      {
        "name": "limit",
        "type": "int",
        "required": true,
        "default": "50"
      },
      {
        "name": "hash",
        "type": "long",
        "required": true,
        "default": "0"
      }
    ],
    "desc_en": "Calls Telegram messages.searchStickers. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.searchStickers. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "create_sticker_set",
    "rpc": "stickers.createStickerSet",
    "namespace": "stickers",
    "signature": "await ctx.create_sticker_set(masks: flags.0?true = None, emojis: flags.5?true = None, text_color: flags.6?true = None, user_id: InputUser, title: string, short_name: string, thumb: flags.2?InputDocument = None, stickers: Vector<InputStickerSetItem>, software: flags.3?string = None)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "masks",
        "type": "flags.0?true",
        "required": false,
        "default": null
      },
      {
        "name": "emojis",
        "type": "flags.5?true",
        "required": false,
        "default": null
      },
      {
        "name": "text_color",
        "type": "flags.6?true",
        "required": false,
        "default": null
      },
      {
        "name": "user_id",
        "type": "InputUser",
        "required": true,
        "default": null
      },
      {
        "name": "title",
        "type": "string",
        "required": true,
        "default": null
      },
      {
        "name": "short_name",
        "type": "string",
        "required": true,
        "default": null
      },
      {
        "name": "thumb",
        "type": "flags.2?InputDocument",
        "required": false,
        "default": null
      },
      {
        "name": "stickers",
        "type": "Vector<InputStickerSetItem>",
        "required": true,
        "default": null
      },
      {
        "name": "software",
        "type": "flags.3?string",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram stickers.createStickerSet. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram stickers.createStickerSet. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "remove_sticker",
    "rpc": "stickers.removeStickerFromSet",
    "namespace": "stickers",
    "signature": "await ctx.remove_sticker(sticker: InputDocument)",
    "returns": "bool",
    "params": [
      {
        "name": "sticker",
        "type": "InputDocument",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram stickers.removeStickerFromSet. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram stickers.removeStickerFromSet. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "move_sticker",
    "rpc": "stickers.changeStickerPosition",
    "namespace": "stickers",
    "signature": "await ctx.move_sticker(sticker: InputDocument, position: int)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "sticker",
        "type": "InputDocument",
        "required": true,
        "default": null
      },
      {
        "name": "position",
        "type": "int",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram stickers.changeStickerPosition. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram stickers.changeStickerPosition. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "add_sticker",
    "rpc": "stickers.addStickerToSet",
    "namespace": "stickers",
    "signature": "await ctx.add_sticker(stickerset: InputStickerSet, sticker: InputStickerSetItem)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "stickerset",
        "type": "InputStickerSet",
        "required": true,
        "default": null
      },
      {
        "name": "sticker",
        "type": "InputStickerSetItem",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram stickers.addStickerToSet. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram stickers.addStickerToSet. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "set_sticker_set_thumbnail",
    "rpc": "stickers.setStickerSetThumb",
    "namespace": "stickers",
    "signature": "await ctx.set_sticker_set_thumbnail(stickerset: InputStickerSet, thumb: flags.0?InputDocument = None, thumb_document_id: flags.1?long = None)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "stickerset",
        "type": "InputStickerSet",
        "required": true,
        "default": null
      },
      {
        "name": "thumb",
        "type": "flags.0?InputDocument",
        "required": false,
        "default": null
      },
      {
        "name": "thumb_document_id",
        "type": "flags.1?long",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram stickers.setStickerSetThumb. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram stickers.setStickerSetThumb. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "check_sticker_set_name",
    "rpc": "stickers.checkShortName",
    "namespace": "stickers",
    "signature": "await ctx.check_sticker_set_name(short_name: string)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "short_name",
        "type": "string",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram stickers.checkShortName. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram stickers.checkShortName. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "suggest_sticker_set_name",
    "rpc": "stickers.suggestShortName",
    "namespace": "stickers",
    "signature": "await ctx.suggest_sticker_set_name(title: string)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "title",
        "type": "string",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram stickers.suggestShortName. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram stickers.suggestShortName. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "edit_sticker_metadata",
    "rpc": "stickers.changeSticker",
    "namespace": "stickers",
    "signature": "await ctx.edit_sticker_metadata(sticker: InputDocument, emoji: flags.0?string = None, mask_coords: flags.1?MaskCoords = None, keywords: flags.2?string = None)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "sticker",
        "type": "InputDocument",
        "required": true,
        "default": null
      },
      {
        "name": "emoji",
        "type": "flags.0?string",
        "required": false,
        "default": null
      },
      {
        "name": "mask_coords",
        "type": "flags.1?MaskCoords",
        "required": false,
        "default": null
      },
      {
        "name": "keywords",
        "type": "flags.2?string",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram stickers.changeSticker. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram stickers.changeSticker. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "rename_sticker_set",
    "rpc": "stickers.renameStickerSet",
    "namespace": "stickers",
    "signature": "await ctx.rename_sticker_set(stickerset: InputStickerSet, title: string)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "stickerset",
        "type": "InputStickerSet",
        "required": true,
        "default": null
      },
      {
        "name": "title",
        "type": "string",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram stickers.renameStickerSet. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram stickers.renameStickerSet. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "remove_sticker_set",
    "rpc": "stickers.deleteStickerSet",
    "namespace": "stickers",
    "signature": "await ctx.remove_sticker_set(stickerset: InputStickerSet)",
    "returns": "bool",
    "params": [
      {
        "name": "stickerset",
        "type": "InputStickerSet",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram stickers.deleteStickerSet. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram stickers.deleteStickerSet. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "replace_sticker",
    "rpc": "stickers.replaceSticker",
    "namespace": "stickers",
    "signature": "await ctx.replace_sticker(sticker: InputDocument, new_sticker: InputStickerSetItem)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "sticker",
        "type": "InputDocument",
        "required": true,
        "default": null
      },
      {
        "name": "new_sticker",
        "type": "InputStickerSetItem",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram stickers.replaceSticker. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram stickers.replaceSticker. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "contact_ids",
    "rpc": "contacts.getContactIDs",
    "namespace": "contacts",
    "signature": "await ctx.contact_ids(hash: long)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "hash",
        "type": "long",
        "required": true,
        "default": "0"
      }
    ],
    "desc_en": "Calls Telegram contacts.getContactIDs. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram contacts.getContactIDs. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "contact_statuses",
    "rpc": "contacts.getStatuses",
    "namespace": "contacts",
    "signature": "await ctx.contact_statuses()",
    "returns": "dict[str, Any]",
    "params": [],
    "desc_en": "Calls Telegram contacts.getStatuses. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram contacts.getStatuses. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "contacts_list",
    "rpc": "contacts.getContacts",
    "namespace": "contacts",
    "signature": "await ctx.contacts_list(hash: long)",
    "returns": "list[dict[str, Any]]",
    "params": [
      {
        "name": "hash",
        "type": "long",
        "required": true,
        "default": "0"
      }
    ],
    "desc_en": "Calls Telegram contacts.getContacts. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram contacts.getContacts. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "import_contacts",
    "rpc": "contacts.importContacts",
    "namespace": "contacts",
    "signature": "await ctx.import_contacts(contacts: Vector<InputContact>)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "contacts",
        "type": "Vector<InputContact>",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram contacts.importContacts. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram contacts.importContacts. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "remove_contacts",
    "rpc": "contacts.deleteContacts",
    "namespace": "contacts",
    "signature": "await ctx.remove_contacts(id: Vector<InputUser>)",
    "returns": "bool",
    "params": [
      {
        "name": "id",
        "type": "Vector<InputUser>",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram contacts.deleteContacts. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram contacts.deleteContacts. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "remove_contacts_by_phone",
    "rpc": "contacts.deleteByPhones",
    "namespace": "contacts",
    "signature": "await ctx.remove_contacts_by_phone(phones: Vector<string>)",
    "returns": "bool",
    "params": [
      {
        "name": "phones",
        "type": "Vector<string>",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram contacts.deleteByPhones. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram contacts.deleteByPhones. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "block_peer",
    "rpc": "contacts.block",
    "namespace": "contacts",
    "signature": "await ctx.block_peer(my_stories_from: flags.0?true = None, id: InputPeer)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "my_stories_from",
        "type": "flags.0?true",
        "required": false,
        "default": null
      },
      {
        "name": "id",
        "type": "InputPeer",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram contacts.block. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram contacts.block. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "unblock_peer",
    "rpc": "contacts.unblock",
    "namespace": "contacts",
    "signature": "await ctx.unblock_peer(my_stories_from: flags.0?true = None, id: InputPeer)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "my_stories_from",
        "type": "flags.0?true",
        "required": false,
        "default": null
      },
      {
        "name": "id",
        "type": "InputPeer",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram contacts.unblock. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram contacts.unblock. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "blocked_peers",
    "rpc": "contacts.getBlocked",
    "namespace": "contacts",
    "signature": "await ctx.blocked_peers(my_stories_from: flags.0?true = None, offset: int, limit: int)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "my_stories_from",
        "type": "flags.0?true",
        "required": false,
        "default": null
      },
      {
        "name": "offset",
        "type": "int",
        "required": true,
        "default": "0"
      },
      {
        "name": "limit",
        "type": "int",
        "required": true,
        "default": "50"
      }
    ],
    "desc_en": "Calls Telegram contacts.getBlocked. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram contacts.getBlocked. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "search_public_peers",
    "rpc": "contacts.search",
    "namespace": "contacts",
    "signature": "await ctx.search_public_peers(broadcasts: flags.0?true = None, bots: flags.1?true = None, q: string, limit: int)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "broadcasts",
        "type": "flags.0?true",
        "required": false,
        "default": null
      },
      {
        "name": "bots",
        "type": "flags.1?true",
        "required": false,
        "default": null
      },
      {
        "name": "q",
        "type": "string",
        "required": true,
        "default": null
      },
      {
        "name": "limit",
        "type": "int",
        "required": true,
        "default": "50"
      }
    ],
    "desc_en": "Calls Telegram contacts.search. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram contacts.search. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "frequent_peers",
    "rpc": "contacts.getTopPeers",
    "namespace": "contacts",
    "signature": "await ctx.frequent_peers(correspondents: flags.0?true = None, bots_pm: flags.1?true = None, bots_inline: flags.2?true = None, phone_calls: flags.3?true = None, forward_users: flags.4?true = None, forward_chats: flags.5?true = None, groups: flags.10?true = None, channels: flags.15?true = None, bots_app: flags.16?true = None, bots_guestchat: flags.17?true = None, offset: int, limit: int, hash: long)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "correspondents",
        "type": "flags.0?true",
        "required": false,
        "default": null
      },
      {
        "name": "bots_pm",
        "type": "flags.1?true",
        "required": false,
        "default": null
      },
      {
        "name": "bots_inline",
        "type": "flags.2?true",
        "required": false,
        "default": null
      },
      {
        "name": "phone_calls",
        "type": "flags.3?true",
        "required": false,
        "default": null
      },
      {
        "name": "forward_users",
        "type": "flags.4?true",
        "required": false,
        "default": null
      },
      {
        "name": "forward_chats",
        "type": "flags.5?true",
        "required": false,
        "default": null
      },
      {
        "name": "groups",
        "type": "flags.10?true",
        "required": false,
        "default": null
      },
      {
        "name": "channels",
        "type": "flags.15?true",
        "required": false,
        "default": null
      },
      {
        "name": "bots_app",
        "type": "flags.16?true",
        "required": false,
        "default": null
      },
      {
        "name": "bots_guestchat",
        "type": "flags.17?true",
        "required": false,
        "default": null
      },
      {
        "name": "offset",
        "type": "int",
        "required": true,
        "default": "0"
      },
      {
        "name": "limit",
        "type": "int",
        "required": true,
        "default": "50"
      },
      {
        "name": "hash",
        "type": "long",
        "required": true,
        "default": "0"
      }
    ],
    "desc_en": "Calls Telegram contacts.getTopPeers. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram contacts.getTopPeers. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "reset_peer_rating",
    "rpc": "contacts.resetTopPeerRating",
    "namespace": "contacts",
    "signature": "await ctx.reset_peer_rating(category: TopPeerCategory, peer: InputPeer)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "category",
        "type": "TopPeerCategory",
        "required": true,
        "default": null
      },
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram contacts.resetTopPeerRating. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram contacts.resetTopPeerRating. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "clear_imported_contacts",
    "rpc": "contacts.resetSaved",
    "namespace": "contacts",
    "signature": "await ctx.clear_imported_contacts()",
    "returns": "bool",
    "params": [],
    "desc_en": "Calls Telegram contacts.resetSaved. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram contacts.resetSaved. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "imported_contacts",
    "rpc": "contacts.getSaved",
    "namespace": "contacts",
    "signature": "await ctx.imported_contacts()",
    "returns": "dict[str, Any]",
    "params": [],
    "desc_en": "Calls Telegram contacts.getSaved. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram contacts.getSaved. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "set_frequent_peers_enabled",
    "rpc": "contacts.toggleTopPeers",
    "namespace": "contacts",
    "signature": "await ctx.set_frequent_peers_enabled(enabled: Bool)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "enabled",
        "type": "Bool",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram contacts.toggleTopPeers. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram contacts.toggleTopPeers. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "add_contact",
    "rpc": "contacts.addContact",
    "namespace": "contacts",
    "signature": "await ctx.add_contact(add_phone_privacy_exception: flags.0?true = None, id: InputUser, first_name: string, last_name: string, phone: string, note: flags.1?TextWithEntities = None)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "add_phone_privacy_exception",
        "type": "flags.0?true",
        "required": false,
        "default": null
      },
      {
        "name": "id",
        "type": "InputUser",
        "required": true,
        "default": null
      },
      {
        "name": "first_name",
        "type": "string",
        "required": true,
        "default": null
      },
      {
        "name": "last_name",
        "type": "string",
        "required": true,
        "default": null
      },
      {
        "name": "phone",
        "type": "string",
        "required": true,
        "default": null
      },
      {
        "name": "note",
        "type": "flags.1?TextWithEntities",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram contacts.addContact. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram contacts.addContact. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "accept_contact",
    "rpc": "contacts.acceptContact",
    "namespace": "contacts",
    "signature": "await ctx.accept_contact(id: InputUser)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "id",
        "type": "InputUser",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram contacts.acceptContact. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram contacts.acceptContact. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "set_close_friends",
    "rpc": "contacts.editCloseFriends",
    "namespace": "contacts",
    "signature": "await ctx.set_close_friends(id: Vector<long>)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "id",
        "type": "Vector<long>",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram contacts.editCloseFriends. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram contacts.editCloseFriends. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "replace_blocklist",
    "rpc": "contacts.setBlocked",
    "namespace": "contacts",
    "signature": "await ctx.replace_blocklist(my_stories_from: flags.0?true = None, id: Vector<InputPeer>, limit: int)",
    "returns": "list[dict[str, Any]]",
    "params": [
      {
        "name": "my_stories_from",
        "type": "flags.0?true",
        "required": false,
        "default": null
      },
      {
        "name": "id",
        "type": "Vector<InputPeer>",
        "required": true,
        "default": null
      },
      {
        "name": "limit",
        "type": "int",
        "required": true,
        "default": "50"
      }
    ],
    "desc_en": "Calls Telegram contacts.setBlocked. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram contacts.setBlocked. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "contact_birthdays",
    "rpc": "contacts.getBirthdays",
    "namespace": "contacts",
    "signature": "await ctx.contact_birthdays()",
    "returns": "dict[str, Any]",
    "params": [],
    "desc_en": "Calls Telegram contacts.getBirthdays. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram contacts.getBirthdays. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "edit_contact_note",
    "rpc": "contacts.updateContactNote",
    "namespace": "contacts",
    "signature": "await ctx.edit_contact_note(id: InputUser, note: TextWithEntities)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "id",
        "type": "InputUser",
        "required": true,
        "default": null
      },
      {
        "name": "note",
        "type": "TextWithEntities",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram contacts.updateContactNote. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram contacts.updateContactNote. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "dialogs",
    "rpc": "messages.getDialogs",
    "namespace": "messages",
    "signature": "await ctx.dialogs(exclude_pinned: flags.0?true = None, folder_id: flags.1?int = None, offset_date: int, offset_id: int, offset_peer: InputPeer, limit: int, hash: long)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "exclude_pinned",
        "type": "flags.0?true",
        "required": false,
        "default": null
      },
      {
        "name": "folder_id",
        "type": "flags.1?int",
        "required": false,
        "default": null
      },
      {
        "name": "offset_date",
        "type": "int",
        "required": true,
        "default": "0"
      },
      {
        "name": "offset_id",
        "type": "int",
        "required": true,
        "default": "0"
      },
      {
        "name": "offset_peer",
        "type": "InputPeer",
        "required": true,
        "default": "{'_': 'inputPeerEmpty'}"
      },
      {
        "name": "limit",
        "type": "int",
        "required": true,
        "default": "50"
      },
      {
        "name": "hash",
        "type": "long",
        "required": true,
        "default": "0"
      }
    ],
    "desc_en": "Calls Telegram messages.getDialogs. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.getDialogs. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "chat_history",
    "rpc": "messages.getHistory",
    "namespace": "messages",
    "signature": "await ctx.chat_history(peer: InputPeer, offset_id: int, offset_date: int, add_offset: int, limit: int, max_id: int, min_id: int, hash: long)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "offset_id",
        "type": "int",
        "required": true,
        "default": "0"
      },
      {
        "name": "offset_date",
        "type": "int",
        "required": true,
        "default": "0"
      },
      {
        "name": "add_offset",
        "type": "int",
        "required": true,
        "default": "0"
      },
      {
        "name": "limit",
        "type": "int",
        "required": true,
        "default": "50"
      },
      {
        "name": "max_id",
        "type": "int",
        "required": true,
        "default": "0"
      },
      {
        "name": "min_id",
        "type": "int",
        "required": true,
        "default": "0"
      },
      {
        "name": "hash",
        "type": "long",
        "required": true,
        "default": "0"
      }
    ],
    "desc_en": "Calls Telegram messages.getHistory. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.getHistory. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "search_chat_messages",
    "rpc": "messages.search",
    "namespace": "messages",
    "signature": "await ctx.search_chat_messages(peer: InputPeer, q: string, from_id: flags.0?InputPeer = None, saved_peer_id: flags.2?InputPeer = None, saved_reaction: flags.3?Vector<Reaction> = None, top_msg_id: flags.1?int = None, filter: MessagesFilter, min_date: int, max_date: int, offset_id: int, add_offset: int, limit: int, max_id: int, min_id: int, hash: long)",
    "returns": "list[dict[str, Any]]",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "q",
        "type": "string",
        "required": true,
        "default": null
      },
      {
        "name": "from_id",
        "type": "flags.0?InputPeer",
        "required": false,
        "default": null
      },
      {
        "name": "saved_peer_id",
        "type": "flags.2?InputPeer",
        "required": false,
        "default": null
      },
      {
        "name": "saved_reaction",
        "type": "flags.3?Vector<Reaction>",
        "required": false,
        "default": null
      },
      {
        "name": "top_msg_id",
        "type": "flags.1?int",
        "required": false,
        "default": null
      },
      {
        "name": "filter",
        "type": "MessagesFilter",
        "required": true,
        "default": "{'_': 'inputMessagesFilterEmpty'}"
      },
      {
        "name": "min_date",
        "type": "int",
        "required": true,
        "default": "0"
      },
      {
        "name": "max_date",
        "type": "int",
        "required": true,
        "default": "0"
      },
      {
        "name": "offset_id",
        "type": "int",
        "required": true,
        "default": "0"
      },
      {
        "name": "add_offset",
        "type": "int",
        "required": true,
        "default": "0"
      },
      {
        "name": "limit",
        "type": "int",
        "required": true,
        "default": "50"
      },
      {
        "name": "max_id",
        "type": "int",
        "required": true,
        "default": "0"
      },
      {
        "name": "min_id",
        "type": "int",
        "required": true,
        "default": "0"
      },
      {
        "name": "hash",
        "type": "long",
        "required": true,
        "default": "0"
      }
    ],
    "desc_en": "Calls Telegram messages.search. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.search. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "mark_chat_read",
    "rpc": "messages.readHistory",
    "namespace": "messages",
    "signature": "await ctx.mark_chat_read(peer: InputPeer, max_id: int)",
    "returns": "bool",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "max_id",
        "type": "int",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.readHistory. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.readHistory. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "clear_chat_history",
    "rpc": "messages.deleteHistory",
    "namespace": "messages",
    "signature": "await ctx.clear_chat_history(just_clear: flags.0?true = None, revoke: flags.1?true = None, peer: InputPeer, max_id: int, min_date: flags.2?int = None, max_date: flags.3?int = None)",
    "returns": "bool",
    "params": [
      {
        "name": "just_clear",
        "type": "flags.0?true",
        "required": false,
        "default": null
      },
      {
        "name": "revoke",
        "type": "flags.1?true",
        "required": false,
        "default": null
      },
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "max_id",
        "type": "int",
        "required": true,
        "default": null
      },
      {
        "name": "min_date",
        "type": "flags.2?int",
        "required": false,
        "default": null
      },
      {
        "name": "max_date",
        "type": "flags.3?int",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.deleteHistory. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.deleteHistory. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "peer_settings",
    "rpc": "messages.getPeerSettings",
    "namespace": "messages",
    "signature": "await ctx.peer_settings(peer: InputPeer)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": "$peer"
      }
    ],
    "desc_en": "Calls Telegram messages.getPeerSettings. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.getPeerSettings. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "basic_groups",
    "rpc": "messages.getChats",
    "namespace": "messages",
    "signature": "await ctx.basic_groups(id: Vector<long>)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "id",
        "type": "Vector<long>",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.getChats. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.getChats. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "basic_group_details",
    "rpc": "messages.getFullChat",
    "namespace": "messages",
    "signature": "await ctx.basic_group_details(chat_id: long)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "chat_id",
        "type": "long",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.getFullChat. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.getFullChat. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "search_all_messages",
    "rpc": "messages.searchGlobal",
    "namespace": "messages",
    "signature": "await ctx.search_all_messages(broadcasts_only: flags.1?true = None, groups_only: flags.2?true = None, users_only: flags.3?true = None, folder_id: flags.0?int = None, community: flags.4?InputChannel = None, q: string, filter: MessagesFilter, min_date: int, max_date: int, offset_rate: int, offset_peer: InputPeer, offset_id: int, limit: int)",
    "returns": "list[dict[str, Any]]",
    "params": [
      {
        "name": "broadcasts_only",
        "type": "flags.1?true",
        "required": false,
        "default": null
      },
      {
        "name": "groups_only",
        "type": "flags.2?true",
        "required": false,
        "default": null
      },
      {
        "name": "users_only",
        "type": "flags.3?true",
        "required": false,
        "default": null
      },
      {
        "name": "folder_id",
        "type": "flags.0?int",
        "required": false,
        "default": null
      },
      {
        "name": "community",
        "type": "flags.4?InputChannel",
        "required": false,
        "default": null
      },
      {
        "name": "q",
        "type": "string",
        "required": true,
        "default": null
      },
      {
        "name": "filter",
        "type": "MessagesFilter",
        "required": true,
        "default": "{'_': 'inputMessagesFilterEmpty'}"
      },
      {
        "name": "min_date",
        "type": "int",
        "required": true,
        "default": "0"
      },
      {
        "name": "max_date",
        "type": "int",
        "required": true,
        "default": "0"
      },
      {
        "name": "offset_rate",
        "type": "int",
        "required": true,
        "default": "0"
      },
      {
        "name": "offset_peer",
        "type": "InputPeer",
        "required": true,
        "default": "{'_': 'inputPeerEmpty'}"
      },
      {
        "name": "offset_id",
        "type": "int",
        "required": true,
        "default": "0"
      },
      {
        "name": "limit",
        "type": "int",
        "required": true,
        "default": "50"
      }
    ],
    "desc_en": "Calls Telegram messages.searchGlobal. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.searchGlobal. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "message_editability",
    "rpc": "messages.getMessageEditData",
    "namespace": "messages",
    "signature": "await ctx.message_editability(peer: InputPeer, id: int)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "id",
        "type": "int",
        "required": true,
        "default": "$message"
      }
    ],
    "desc_en": "Calls Telegram messages.getMessageEditData. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.getMessageEditData. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "peer_dialogs",
    "rpc": "messages.getPeerDialogs",
    "namespace": "messages",
    "signature": "await ctx.peer_dialogs(peers: Vector<InputDialogPeer>)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "peers",
        "type": "Vector<InputDialogPeer>",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.getPeerDialogs. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.getPeerDialogs. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "all_drafts",
    "rpc": "messages.getAllDrafts",
    "namespace": "messages",
    "signature": "await ctx.all_drafts()",
    "returns": "dict[str, Any]",
    "params": [],
    "desc_en": "Calls Telegram messages.getAllDrafts. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.getAllDrafts. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "mutual_groups",
    "rpc": "messages.getCommonChats",
    "namespace": "messages",
    "signature": "await ctx.mutual_groups(user_id: InputUser, max_id: long, limit: int)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "user_id",
        "type": "InputUser",
        "required": true,
        "default": null
      },
      {
        "name": "max_id",
        "type": "long",
        "required": true,
        "default": "0"
      },
      {
        "name": "limit",
        "type": "int",
        "required": true,
        "default": "50"
      }
    ],
    "desc_en": "Calls Telegram messages.getCommonChats. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.getCommonChats. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "set_dialog_pinned",
    "rpc": "messages.toggleDialogPin",
    "namespace": "messages",
    "signature": "await ctx.set_dialog_pinned(pinned: flags.0?true = None, peer: InputDialogPeer)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "pinned",
        "type": "flags.0?true",
        "required": false,
        "default": null
      },
      {
        "name": "peer",
        "type": "InputDialogPeer",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.toggleDialogPin. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.toggleDialogPin. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "reorder_dialog_pins",
    "rpc": "messages.reorderPinnedDialogs",
    "namespace": "messages",
    "signature": "await ctx.reorder_dialog_pins(force: flags.0?true = None, folder_id: int, order: Vector<InputDialogPeer>)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "force",
        "type": "flags.0?true",
        "required": false,
        "default": null
      },
      {
        "name": "folder_id",
        "type": "int",
        "required": true,
        "default": null
      },
      {
        "name": "order",
        "type": "Vector<InputDialogPeer>",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.reorderPinnedDialogs. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.reorderPinnedDialogs. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "pinned_dialogs",
    "rpc": "messages.getPinnedDialogs",
    "namespace": "messages",
    "signature": "await ctx.pinned_dialogs(folder_id: int)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "folder_id",
        "type": "int",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.getPinnedDialogs. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.getPinnedDialogs. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "unread_mentions",
    "rpc": "messages.getUnreadMentions",
    "namespace": "messages",
    "signature": "await ctx.unread_mentions(peer: InputPeer, top_msg_id: flags.0?int = None, offset_id: int, add_offset: int, limit: int, max_id: int, min_id: int)",
    "returns": "bool",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "top_msg_id",
        "type": "flags.0?int",
        "required": false,
        "default": null
      },
      {
        "name": "offset_id",
        "type": "int",
        "required": true,
        "default": "0"
      },
      {
        "name": "add_offset",
        "type": "int",
        "required": true,
        "default": "0"
      },
      {
        "name": "limit",
        "type": "int",
        "required": true,
        "default": "50"
      },
      {
        "name": "max_id",
        "type": "int",
        "required": true,
        "default": "0"
      },
      {
        "name": "min_id",
        "type": "int",
        "required": true,
        "default": "0"
      }
    ],
    "desc_en": "Calls Telegram messages.getUnreadMentions. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.getUnreadMentions. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "mark_mentions_read",
    "rpc": "messages.readMentions",
    "namespace": "messages",
    "signature": "await ctx.mark_mentions_read(peer: InputPeer, top_msg_id: flags.0?int = None)",
    "returns": "bool",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "top_msg_id",
        "type": "flags.0?int",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.readMentions. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.readMentions. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "recent_live_locations",
    "rpc": "messages.getRecentLocations",
    "namespace": "messages",
    "signature": "await ctx.recent_live_locations(peer: InputPeer, limit: int, hash: long)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "limit",
        "type": "int",
        "required": true,
        "default": "50"
      },
      {
        "name": "hash",
        "type": "long",
        "required": true,
        "default": "0"
      }
    ],
    "desc_en": "Calls Telegram messages.getRecentLocations. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.getRecentLocations. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "set_dialog_unread",
    "rpc": "messages.markDialogUnread",
    "namespace": "messages",
    "signature": "await ctx.set_dialog_unread(unread: flags.0?true = None, parent_peer: flags.1?InputPeer = None, peer: InputDialogPeer)",
    "returns": "bool",
    "params": [
      {
        "name": "unread",
        "type": "flags.0?true",
        "required": false,
        "default": null
      },
      {
        "name": "parent_peer",
        "type": "flags.1?InputPeer",
        "required": false,
        "default": null
      },
      {
        "name": "peer",
        "type": "InputDialogPeer",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.markDialogUnread. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.markDialogUnread. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "unread_dialog_marks",
    "rpc": "messages.getDialogUnreadMarks",
    "namespace": "messages",
    "signature": "await ctx.unread_dialog_marks(parent_peer: flags.0?InputPeer = None)",
    "returns": "bool",
    "params": [
      {
        "name": "parent_peer",
        "type": "flags.0?InputPeer",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.getDialogUnreadMarks. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.getDialogUnreadMarks. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "clear_all_drafts",
    "rpc": "messages.clearAllDrafts",
    "namespace": "messages",
    "signature": "await ctx.clear_all_drafts()",
    "returns": "bool",
    "params": [],
    "desc_en": "Calls Telegram messages.clearAllDrafts. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.clearAllDrafts. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "chat_online_count",
    "rpc": "messages.getOnlines",
    "namespace": "messages",
    "signature": "await ctx.chat_online_count(peer: InputPeer)",
    "returns": "int",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": "$peer"
      }
    ],
    "desc_en": "Calls Telegram messages.getOnlines. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.getOnlines. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "message_type_counts",
    "rpc": "messages.getSearchCounters",
    "namespace": "messages",
    "signature": "await ctx.message_type_counts(peer: InputPeer, saved_peer_id: flags.2?InputPeer = None, top_msg_id: flags.0?int = None, filters: Vector<MessagesFilter>)",
    "returns": "int",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "saved_peer_id",
        "type": "flags.2?InputPeer",
        "required": false,
        "default": null
      },
      {
        "name": "top_msg_id",
        "type": "flags.0?int",
        "required": false,
        "default": null
      },
      {
        "name": "filters",
        "type": "Vector<MessagesFilter>",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.getSearchCounters. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.getSearchCounters. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "dismiss_peer_settings_bar",
    "rpc": "messages.hidePeerSettingsBar",
    "namespace": "messages",
    "signature": "await ctx.dismiss_peer_settings_bar(peer: InputPeer)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": "$peer"
      }
    ],
    "desc_en": "Calls Telegram messages.hidePeerSettingsBar. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.hidePeerSettingsBar. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "mark_discussion_read",
    "rpc": "messages.readDiscussion",
    "namespace": "messages",
    "signature": "await ctx.mark_discussion_read(peer: InputPeer, msg_id: int, read_max_id: int)",
    "returns": "bool",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "msg_id",
        "type": "int",
        "required": true,
        "default": "$message"
      },
      {
        "name": "read_max_id",
        "type": "int",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.readDiscussion. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.readDiscussion. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "unpin_all_chat_messages",
    "rpc": "messages.unpinAllMessages",
    "namespace": "messages",
    "signature": "await ctx.unpin_all_chat_messages(peer: InputPeer, top_msg_id: flags.0?int = None, saved_peer_id: flags.1?InputPeer = None)",
    "returns": "list[dict[str, Any]]",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "top_msg_id",
        "type": "flags.0?int",
        "required": false,
        "default": null
      },
      {
        "name": "saved_peer_id",
        "type": "flags.1?InputPeer",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.unpinAllMessages. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.unpinAllMessages. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "message_readers",
    "rpc": "messages.getMessageReadParticipants",
    "namespace": "messages",
    "signature": "await ctx.message_readers(peer: InputPeer, msg_id: int)",
    "returns": "bool",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "msg_id",
        "type": "int",
        "required": true,
        "default": "$message"
      }
    ],
    "desc_en": "Calls Telegram messages.getMessageReadParticipants. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.getMessageReadParticipants. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "message_search_calendar",
    "rpc": "messages.getSearchResultsCalendar",
    "namespace": "messages",
    "signature": "await ctx.message_search_calendar(peer: InputPeer, saved_peer_id: flags.2?InputPeer = None, filter: MessagesFilter, offset_id: int, offset_date: int)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "saved_peer_id",
        "type": "flags.2?InputPeer",
        "required": false,
        "default": null
      },
      {
        "name": "filter",
        "type": "MessagesFilter",
        "required": true,
        "default": "{'_': 'inputMessagesFilterEmpty'}"
      },
      {
        "name": "offset_id",
        "type": "int",
        "required": true,
        "default": "0"
      },
      {
        "name": "offset_date",
        "type": "int",
        "required": true,
        "default": "0"
      }
    ],
    "desc_en": "Calls Telegram messages.getSearchResultsCalendar. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.getSearchResultsCalendar. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "message_search_positions",
    "rpc": "messages.getSearchResultsPositions",
    "namespace": "messages",
    "signature": "await ctx.message_search_positions(peer: InputPeer, saved_peer_id: flags.2?InputPeer = None, filter: MessagesFilter, offset_id: int, limit: int)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "saved_peer_id",
        "type": "flags.2?InputPeer",
        "required": false,
        "default": null
      },
      {
        "name": "filter",
        "type": "MessagesFilter",
        "required": true,
        "default": "{'_': 'inputMessagesFilterEmpty'}"
      },
      {
        "name": "offset_id",
        "type": "int",
        "required": true,
        "default": "0"
      },
      {
        "name": "limit",
        "type": "int",
        "required": true,
        "default": "50"
      }
    ],
    "desc_en": "Calls Telegram messages.getSearchResultsPositions. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.getSearchResultsPositions. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "set_default_send_as",
    "rpc": "messages.saveDefaultSendAs",
    "namespace": "messages",
    "signature": "await ctx.set_default_send_as(peer: InputPeer, send_as: InputPeer)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "send_as",
        "type": "InputPeer",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.saveDefaultSendAs. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.saveDefaultSendAs. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "sent_media_search",
    "rpc": "messages.searchSentMedia",
    "namespace": "messages",
    "signature": "await ctx.sent_media_search(q: string, filter: MessagesFilter, limit: int)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "q",
        "type": "string",
        "required": true,
        "default": null
      },
      {
        "name": "filter",
        "type": "MessagesFilter",
        "required": true,
        "default": "{'_': 'inputMessagesFilterEmpty'}"
      },
      {
        "name": "limit",
        "type": "int",
        "required": true,
        "default": "50"
      }
    ],
    "desc_en": "Calls Telegram messages.searchSentMedia. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.searchSentMedia. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "outgoing_read_date",
    "rpc": "messages.getOutboxReadDate",
    "namespace": "messages",
    "signature": "await ctx.outgoing_read_date(peer: InputPeer, msg_id: int)",
    "returns": "bool",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "msg_id",
        "type": "int",
        "required": true,
        "default": "$message"
      }
    ],
    "desc_en": "Calls Telegram messages.getOutboxReadDate. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.getOutboxReadDate. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "channel_message_author",
    "rpc": "channels.getMessageAuthor",
    "namespace": "channels",
    "signature": "await ctx.channel_message_author(channel: InputChannel, id: int)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "id",
        "type": "int",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram channels.getMessageAuthor. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram channels.getMessageAuthor. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "move_dialogs_to_archive",
    "rpc": "folders.editPeerFolders",
    "namespace": "folders",
    "signature": "await ctx.move_dialogs_to_archive(folder_peers: Vector<InputFolderPeer>)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "folder_peers",
        "type": "Vector<InputFolderPeer>",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram folders.editPeerFolders. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram folders.editPeerFolders. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "chat_folders",
    "rpc": "messages.getDialogFilters",
    "namespace": "messages",
    "signature": "await ctx.chat_folders()",
    "returns": "dict[str, Any]",
    "params": [],
    "desc_en": "Calls Telegram messages.getDialogFilters. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.getDialogFilters. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "suggested_chat_folders",
    "rpc": "messages.getSuggestedDialogFilters",
    "namespace": "messages",
    "signature": "await ctx.suggested_chat_folders()",
    "returns": "dict[str, Any]",
    "params": [],
    "desc_en": "Calls Telegram messages.getSuggestedDialogFilters. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.getSuggestedDialogFilters. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "save_chat_folder",
    "rpc": "messages.updateDialogFilter",
    "namespace": "messages",
    "signature": "await ctx.save_chat_folder(id: int, filter: flags.0?DialogFilter = None)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "id",
        "type": "int",
        "required": true,
        "default": null
      },
      {
        "name": "filter",
        "type": "flags.0?DialogFilter",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.updateDialogFilter. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.updateDialogFilter. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "reorder_chat_folders",
    "rpc": "messages.updateDialogFiltersOrder",
    "namespace": "messages",
    "signature": "await ctx.reorder_chat_folders(order: Vector<int>)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "order",
        "type": "Vector<int>",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.updateDialogFiltersOrder. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.updateDialogFiltersOrder. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "set_folder_tags_visible",
    "rpc": "messages.toggleDialogFilterTags",
    "namespace": "messages",
    "signature": "await ctx.set_folder_tags_visible(enabled: Bool)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "enabled",
        "type": "Bool",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.toggleDialogFilterTags. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.toggleDialogFilterTags. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "share_chat_folder",
    "rpc": "chatlists.exportChatlistInvite",
    "namespace": "chatlists",
    "signature": "await ctx.share_chat_folder(chatlist: InputChatlist, title: string, peers: Vector<InputPeer>)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "chatlist",
        "type": "InputChatlist",
        "required": true,
        "default": null
      },
      {
        "name": "title",
        "type": "string",
        "required": true,
        "default": null
      },
      {
        "name": "peers",
        "type": "Vector<InputPeer>",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram chatlists.exportChatlistInvite. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram chatlists.exportChatlistInvite. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "remove_folder_invite",
    "rpc": "chatlists.deleteExportedInvite",
    "namespace": "chatlists",
    "signature": "await ctx.remove_folder_invite(chatlist: InputChatlist, slug: string)",
    "returns": "bool",
    "params": [
      {
        "name": "chatlist",
        "type": "InputChatlist",
        "required": true,
        "default": null
      },
      {
        "name": "slug",
        "type": "string",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram chatlists.deleteExportedInvite. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram chatlists.deleteExportedInvite. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "edit_folder_invite",
    "rpc": "chatlists.editExportedInvite",
    "namespace": "chatlists",
    "signature": "await ctx.edit_folder_invite(chatlist: InputChatlist, slug: string, title: flags.1?string = None, peers: flags.2?Vector<InputPeer> = None)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "chatlist",
        "type": "InputChatlist",
        "required": true,
        "default": null
      },
      {
        "name": "slug",
        "type": "string",
        "required": true,
        "default": null
      },
      {
        "name": "title",
        "type": "flags.1?string",
        "required": false,
        "default": null
      },
      {
        "name": "peers",
        "type": "flags.2?Vector<InputPeer>",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram chatlists.editExportedInvite. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram chatlists.editExportedInvite. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "folder_invites",
    "rpc": "chatlists.getExportedInvites",
    "namespace": "chatlists",
    "signature": "await ctx.folder_invites(chatlist: InputChatlist)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "chatlist",
        "type": "InputChatlist",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram chatlists.getExportedInvites. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram chatlists.getExportedInvites. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "inspect_folder_invite",
    "rpc": "chatlists.checkChatlistInvite",
    "namespace": "chatlists",
    "signature": "await ctx.inspect_folder_invite(slug: string)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "slug",
        "type": "string",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram chatlists.checkChatlistInvite. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram chatlists.checkChatlistInvite. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "join_folder_invite",
    "rpc": "chatlists.joinChatlistInvite",
    "namespace": "chatlists",
    "signature": "await ctx.join_folder_invite(slug: string, peers: Vector<InputPeer>)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "slug",
        "type": "string",
        "required": true,
        "default": null
      },
      {
        "name": "peers",
        "type": "Vector<InputPeer>",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram chatlists.joinChatlistInvite. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram chatlists.joinChatlistInvite. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "folder_updates",
    "rpc": "chatlists.getChatlistUpdates",
    "namespace": "chatlists",
    "signature": "await ctx.folder_updates(chatlist: InputChatlist)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "chatlist",
        "type": "InputChatlist",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram chatlists.getChatlistUpdates. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram chatlists.getChatlistUpdates. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "accept_folder_updates",
    "rpc": "chatlists.joinChatlistUpdates",
    "namespace": "chatlists",
    "signature": "await ctx.accept_folder_updates(chatlist: InputChatlist, peers: Vector<InputPeer>)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "chatlist",
        "type": "InputChatlist",
        "required": true,
        "default": null
      },
      {
        "name": "peers",
        "type": "Vector<InputPeer>",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram chatlists.joinChatlistUpdates. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram chatlists.joinChatlistUpdates. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "dismiss_folder_updates",
    "rpc": "chatlists.hideChatlistUpdates",
    "namespace": "chatlists",
    "signature": "await ctx.dismiss_folder_updates(chatlist: InputChatlist)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "chatlist",
        "type": "InputChatlist",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram chatlists.hideChatlistUpdates. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram chatlists.hideChatlistUpdates. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "folder_leave_suggestions",
    "rpc": "chatlists.getLeaveChatlistSuggestions",
    "namespace": "chatlists",
    "signature": "await ctx.folder_leave_suggestions(chatlist: InputChatlist)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "chatlist",
        "type": "InputChatlist",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram chatlists.getLeaveChatlistSuggestions. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram chatlists.getLeaveChatlistSuggestions. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "leave_shared_folder",
    "rpc": "chatlists.leaveChatlist",
    "namespace": "chatlists",
    "signature": "await ctx.leave_shared_folder(chatlist: InputChatlist, peers: Vector<InputPeer>)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "chatlist",
        "type": "InputChatlist",
        "required": true,
        "default": null
      },
      {
        "name": "peers",
        "type": "Vector<InputPeer>",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram chatlists.leaveChatlist. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram chatlists.leaveChatlist. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "edit_profile",
    "rpc": "account.updateProfile",
    "namespace": "account",
    "signature": "await ctx.edit_profile(first_name: flags.0?string = None, last_name: flags.1?string = None, about: flags.2?string = None)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "first_name",
        "type": "flags.0?string",
        "required": false,
        "default": null
      },
      {
        "name": "last_name",
        "type": "flags.1?string",
        "required": false,
        "default": null
      },
      {
        "name": "about",
        "type": "flags.2?string",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram account.updateProfile. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram account.updateProfile. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "set_online_status",
    "rpc": "account.updateStatus",
    "namespace": "account",
    "signature": "await ctx.set_online_status(offline: Bool)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "offline",
        "type": "Bool",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram account.updateStatus. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram account.updateStatus. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "check_profile_username",
    "rpc": "account.checkUsername",
    "namespace": "account",
    "signature": "await ctx.check_profile_username(username: string)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "username",
        "type": "string",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram account.checkUsername. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram account.checkUsername. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "set_profile_username",
    "rpc": "account.updateUsername",
    "namespace": "account",
    "signature": "await ctx.set_profile_username(username: string)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "username",
        "type": "string",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram account.updateUsername. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram account.updateUsername. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "privacy_rules",
    "rpc": "account.getPrivacy",
    "namespace": "account",
    "signature": "await ctx.privacy_rules(key: InputPrivacyKey)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "key",
        "type": "InputPrivacyKey",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram account.getPrivacy. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram account.getPrivacy. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "account_inactivity_ttl",
    "rpc": "account.getAccountTTL",
    "namespace": "account",
    "signature": "await ctx.account_inactivity_ttl()",
    "returns": "int",
    "params": [],
    "desc_en": "Calls Telegram account.getAccountTTL. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram account.getAccountTTL. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "set_emoji_status",
    "rpc": "account.updateEmojiStatus",
    "namespace": "account",
    "signature": "await ctx.set_emoji_status(emoji_status: EmojiStatus)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "emoji_status",
        "type": "EmojiStatus",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram account.updateEmojiStatus. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram account.updateEmojiStatus. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "suggested_emoji_statuses",
    "rpc": "account.getDefaultEmojiStatuses",
    "namespace": "account",
    "signature": "await ctx.suggested_emoji_statuses(hash: long)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "hash",
        "type": "long",
        "required": true,
        "default": "0"
      }
    ],
    "desc_en": "Calls Telegram account.getDefaultEmojiStatuses. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram account.getDefaultEmojiStatuses. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "recent_emoji_statuses",
    "rpc": "account.getRecentEmojiStatuses",
    "namespace": "account",
    "signature": "await ctx.recent_emoji_statuses(hash: long)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "hash",
        "type": "long",
        "required": true,
        "default": "0"
      }
    ],
    "desc_en": "Calls Telegram account.getRecentEmojiStatuses. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram account.getRecentEmojiStatuses. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "clear_recent_emoji_statuses",
    "rpc": "account.clearRecentEmojiStatuses",
    "namespace": "account",
    "signature": "await ctx.clear_recent_emoji_statuses()",
    "returns": "bool",
    "params": [],
    "desc_en": "Calls Telegram account.clearRecentEmojiStatuses. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram account.clearRecentEmojiStatuses. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "reorder_profile_usernames",
    "rpc": "account.reorderUsernames",
    "namespace": "account",
    "signature": "await ctx.reorder_profile_usernames(order: Vector<string>)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "order",
        "type": "Vector<string>",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram account.reorderUsernames. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram account.reorderUsernames. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "set_profile_username_active",
    "rpc": "account.toggleUsername",
    "namespace": "account",
    "signature": "await ctx.set_profile_username_active(username: string, active: Bool)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "username",
        "type": "string",
        "required": true,
        "default": null
      },
      {
        "name": "active",
        "type": "Bool",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram account.toggleUsername. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram account.toggleUsername. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "profile_photo_emojis",
    "rpc": "account.getDefaultProfilePhotoEmojis",
    "namespace": "account",
    "signature": "await ctx.profile_photo_emojis(hash: long)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "hash",
        "type": "long",
        "required": true,
        "default": "0"
      }
    ],
    "desc_en": "Calls Telegram account.getDefaultProfilePhotoEmojis. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram account.getDefaultProfilePhotoEmojis. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "set_profile_color",
    "rpc": "account.updateColor",
    "namespace": "account",
    "signature": "await ctx.set_profile_color(for_profile: flags.1?true = None, color: flags.2?PeerColor = None)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "for_profile",
        "type": "flags.1?true",
        "required": false,
        "default": null
      },
      {
        "name": "color",
        "type": "flags.2?PeerColor",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram account.updateColor. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram account.updateColor. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "set_birthday",
    "rpc": "account.updateBirthday",
    "namespace": "account",
    "signature": "await ctx.set_birthday(birthday: flags.0?Birthday = None)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "birthday",
        "type": "flags.0?Birthday",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram account.updateBirthday. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram account.updateBirthday. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "set_personal_channel",
    "rpc": "account.updatePersonalChannel",
    "namespace": "account",
    "signature": "await ctx.set_personal_channel(channel: InputChannel)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram account.updatePersonalChannel. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram account.updatePersonalChannel. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "set_profile_tab",
    "rpc": "account.setMainProfileTab",
    "namespace": "account",
    "signature": "await ctx.set_profile_tab(tab: ProfileTab)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "tab",
        "type": "ProfileTab",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram account.setMainProfileTab. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram account.setMainProfileTab. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "set_music_saved",
    "rpc": "account.saveMusic",
    "namespace": "account",
    "signature": "await ctx.set_music_saved(unsave: flags.0?true = None, id: InputDocument, after_id: flags.1?InputDocument = None)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "unsave",
        "type": "flags.0?true",
        "required": false,
        "default": null
      },
      {
        "name": "id",
        "type": "InputDocument",
        "required": true,
        "default": null
      },
      {
        "name": "after_id",
        "type": "flags.1?InputDocument",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram account.saveMusic. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram account.saveMusic. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "saved_music_ids",
    "rpc": "account.getSavedMusicIds",
    "namespace": "account",
    "signature": "await ctx.saved_music_ids(hash: long)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "hash",
        "type": "long",
        "required": true,
        "default": "0"
      }
    ],
    "desc_en": "Calls Telegram account.getSavedMusicIds. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram account.getSavedMusicIds. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "user_details",
    "rpc": "users.getFullUser",
    "namespace": "users",
    "signature": "await ctx.user_details(id: InputUser)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "id",
        "type": "InputUser",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram users.getFullUser. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram users.getFullUser. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "contact_requirements",
    "rpc": "users.getRequirementsToContact",
    "namespace": "users",
    "signature": "await ctx.contact_requirements(id: Vector<InputUser>)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "id",
        "type": "Vector<InputUser>",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram users.getRequirementsToContact. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram users.getRequirementsToContact. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "user_music",
    "rpc": "users.getSavedMusic",
    "namespace": "users",
    "signature": "await ctx.user_music(id: InputUser, offset: int, limit: int, hash: long)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "id",
        "type": "InputUser",
        "required": true,
        "default": null
      },
      {
        "name": "offset",
        "type": "int",
        "required": true,
        "default": "0"
      },
      {
        "name": "limit",
        "type": "int",
        "required": true,
        "default": "50"
      },
      {
        "name": "hash",
        "type": "long",
        "required": true,
        "default": "0"
      }
    ],
    "desc_en": "Calls Telegram users.getSavedMusic. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram users.getSavedMusic. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "user_music_by_documents",
    "rpc": "users.getSavedMusicByID",
    "namespace": "users",
    "signature": "await ctx.user_music_by_documents(id: InputUser, documents: Vector<InputDocument>)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "id",
        "type": "InputUser",
        "required": true,
        "default": null
      },
      {
        "name": "documents",
        "type": "Vector<InputDocument>",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram users.getSavedMusicByID. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram users.getSavedMusicByID. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "suggest_contact_birthday",
    "rpc": "users.suggestBirthday",
    "namespace": "users",
    "signature": "await ctx.suggest_contact_birthday(id: InputUser, birthday: Birthday)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "id",
        "type": "InputUser",
        "required": true,
        "default": null
      },
      {
        "name": "birthday",
        "type": "Birthday",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram users.suggestBirthday. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram users.suggestBirthday. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "select_profile_photo",
    "rpc": "photos.updateProfilePhoto",
    "namespace": "photos",
    "signature": "await ctx.select_profile_photo(fallback: flags.0?true = None, bot: flags.1?InputUser = None, id: InputPhoto)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "fallback",
        "type": "flags.0?true",
        "required": false,
        "default": null
      },
      {
        "name": "bot",
        "type": "flags.1?InputUser",
        "required": false,
        "default": null
      },
      {
        "name": "id",
        "type": "InputPhoto",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram photos.updateProfilePhoto. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram photos.updateProfilePhoto. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "upload_profile_photo",
    "rpc": "photos.uploadProfilePhoto",
    "namespace": "photos",
    "signature": "await ctx.upload_profile_photo(fallback: flags.3?true = None, bot: flags.5?InputUser = None, file: flags.0?InputFile = None, video: flags.1?InputFile = None, video_start_ts: flags.2?double = None, video_emoji_markup: flags.4?VideoSize = None)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "fallback",
        "type": "flags.3?true",
        "required": false,
        "default": null
      },
      {
        "name": "bot",
        "type": "flags.5?InputUser",
        "required": false,
        "default": null
      },
      {
        "name": "file",
        "type": "flags.0?InputFile",
        "required": false,
        "default": null
      },
      {
        "name": "video",
        "type": "flags.1?InputFile",
        "required": false,
        "default": null
      },
      {
        "name": "video_start_ts",
        "type": "flags.2?double",
        "required": false,
        "default": null
      },
      {
        "name": "video_emoji_markup",
        "type": "flags.4?VideoSize",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram photos.uploadProfilePhoto. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram photos.uploadProfilePhoto. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "remove_profile_photos",
    "rpc": "photos.deletePhotos",
    "namespace": "photos",
    "signature": "await ctx.remove_profile_photos(id: Vector<InputPhoto>)",
    "returns": "bool",
    "params": [
      {
        "name": "id",
        "type": "Vector<InputPhoto>",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram photos.deletePhotos. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram photos.deletePhotos. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "profile_photos",
    "rpc": "photos.getUserPhotos",
    "namespace": "photos",
    "signature": "await ctx.profile_photos(user_id: InputUser, offset: int, max_id: long, limit: int)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "user_id",
        "type": "InputUser",
        "required": true,
        "default": null
      },
      {
        "name": "offset",
        "type": "int",
        "required": true,
        "default": "0"
      },
      {
        "name": "max_id",
        "type": "long",
        "required": true,
        "default": "0"
      },
      {
        "name": "limit",
        "type": "int",
        "required": true,
        "default": "50"
      }
    ],
    "desc_en": "Calls Telegram photos.getUserPhotos. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram photos.getUserPhotos. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "set_contact_photo",
    "rpc": "photos.uploadContactProfilePhoto",
    "namespace": "photos",
    "signature": "await ctx.set_contact_photo(suggest: flags.3?true = None, save: flags.4?true = None, user_id: InputUser, file: flags.0?InputFile = None, video: flags.1?InputFile = None, video_start_ts: flags.2?double = None, video_emoji_markup: flags.5?VideoSize = None)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "suggest",
        "type": "flags.3?true",
        "required": false,
        "default": null
      },
      {
        "name": "save",
        "type": "flags.4?true",
        "required": false,
        "default": null
      },
      {
        "name": "user_id",
        "type": "InputUser",
        "required": true,
        "default": null
      },
      {
        "name": "file",
        "type": "flags.0?InputFile",
        "required": false,
        "default": null
      },
      {
        "name": "video",
        "type": "flags.1?InputFile",
        "required": false,
        "default": null
      },
      {
        "name": "video_start_ts",
        "type": "flags.2?double",
        "required": false,
        "default": null
      },
      {
        "name": "video_emoji_markup",
        "type": "flags.5?VideoSize",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram photos.uploadContactProfilePhoto. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram photos.uploadContactProfilePhoto. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "notification_settings",
    "rpc": "account.getNotifySettings",
    "namespace": "account",
    "signature": "await ctx.notification_settings(peer: InputNotifyPeer)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "peer",
        "type": "InputNotifyPeer",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram account.getNotifySettings. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram account.getNotifySettings. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "set_notification_settings",
    "rpc": "account.updateNotifySettings",
    "namespace": "account",
    "signature": "await ctx.set_notification_settings(peer: InputNotifyPeer, settings: InputPeerNotifySettings)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "peer",
        "type": "InputNotifyPeer",
        "required": true,
        "default": null
      },
      {
        "name": "settings",
        "type": "InputPeerNotifySettings",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram account.updateNotifySettings. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram account.updateNotifySettings. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "reset_notification_settings",
    "rpc": "account.resetNotifySettings",
    "namespace": "account",
    "signature": "await ctx.reset_notification_settings()",
    "returns": "dict[str, Any]",
    "params": [],
    "desc_en": "Calls Telegram account.resetNotifySettings. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram account.resetNotifySettings. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "contact_signup_notifications",
    "rpc": "account.getContactSignUpNotification",
    "namespace": "account",
    "signature": "await ctx.contact_signup_notifications()",
    "returns": "dict[str, Any]",
    "params": [],
    "desc_en": "Calls Telegram account.getContactSignUpNotification. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram account.getContactSignUpNotification. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "set_contact_signup_notifications",
    "rpc": "account.setContactSignUpNotification",
    "namespace": "account",
    "signature": "await ctx.set_contact_signup_notifications(silent: Bool)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "silent",
        "type": "Bool",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram account.setContactSignUpNotification. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram account.setContactSignUpNotification. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "notification_exceptions",
    "rpc": "account.getNotifyExceptions",
    "namespace": "account",
    "signature": "await ctx.notification_exceptions(compare_sound: flags.1?true = None, compare_stories: flags.2?true = None, peer: flags.0?InputNotifyPeer = None)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "compare_sound",
        "type": "flags.1?true",
        "required": false,
        "default": null
      },
      {
        "name": "compare_stories",
        "type": "flags.2?true",
        "required": false,
        "default": null
      },
      {
        "name": "peer",
        "type": "flags.0?InputNotifyPeer",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram account.getNotifyExceptions. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram account.getNotifyExceptions. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "reaction_notification_settings",
    "rpc": "account.getReactionsNotifySettings",
    "namespace": "account",
    "signature": "await ctx.reaction_notification_settings()",
    "returns": "dict[str, Any]",
    "params": [],
    "desc_en": "Calls Telegram account.getReactionsNotifySettings. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram account.getReactionsNotifySettings. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "set_reaction_notification_settings",
    "rpc": "account.setReactionsNotifySettings",
    "namespace": "account",
    "signature": "await ctx.set_reaction_notification_settings(settings: ReactionsNotifySettings)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "settings",
        "type": "ReactionsNotifySettings",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram account.setReactionsNotifySettings. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram account.setReactionsNotifySettings. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "saved_notification_sounds",
    "rpc": "account.getSavedRingtones",
    "namespace": "account",
    "signature": "await ctx.saved_notification_sounds(hash: long)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "hash",
        "type": "long",
        "required": true,
        "default": "0"
      }
    ],
    "desc_en": "Calls Telegram account.getSavedRingtones. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram account.getSavedRingtones. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "set_notification_sound_saved",
    "rpc": "account.saveRingtone",
    "namespace": "account",
    "signature": "await ctx.set_notification_sound_saved(id: InputDocument, unsave: Bool)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "id",
        "type": "InputDocument",
        "required": true,
        "default": null
      },
      {
        "name": "unsave",
        "type": "Bool",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram account.saveRingtone. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram account.saveRingtone. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "upload_notification_sound",
    "rpc": "account.uploadRingtone",
    "namespace": "account",
    "signature": "await ctx.upload_notification_sound(file: InputFile, file_name: string, mime_type: string)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "file",
        "type": "InputFile",
        "required": true,
        "default": null
      },
      {
        "name": "file_name",
        "type": "string",
        "required": true,
        "default": null
      },
      {
        "name": "mime_type",
        "type": "string",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram account.uploadRingtone. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram account.uploadRingtone. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "rename_basic_group",
    "rpc": "messages.editChatTitle",
    "namespace": "messages",
    "signature": "await ctx.rename_basic_group(chat_id: long, title: string)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "chat_id",
        "type": "long",
        "required": true,
        "default": null
      },
      {
        "name": "title",
        "type": "string",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.editChatTitle. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.editChatTitle. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "set_basic_group_photo",
    "rpc": "messages.editChatPhoto",
    "namespace": "messages",
    "signature": "await ctx.set_basic_group_photo(chat_id: long, photo: InputChatPhoto)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "chat_id",
        "type": "long",
        "required": true,
        "default": null
      },
      {
        "name": "photo",
        "type": "InputChatPhoto",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.editChatPhoto. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.editChatPhoto. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "add_basic_group_member",
    "rpc": "messages.addChatUser",
    "namespace": "messages",
    "signature": "await ctx.add_basic_group_member(chat_id: long, user_id: InputUser, fwd_limit: int)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "chat_id",
        "type": "long",
        "required": true,
        "default": null
      },
      {
        "name": "user_id",
        "type": "InputUser",
        "required": true,
        "default": null
      },
      {
        "name": "fwd_limit",
        "type": "int",
        "required": true,
        "default": "0"
      }
    ],
    "desc_en": "Calls Telegram messages.addChatUser. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.addChatUser. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "remove_basic_group_member",
    "rpc": "messages.deleteChatUser",
    "namespace": "messages",
    "signature": "await ctx.remove_basic_group_member(revoke_history: flags.0?true = None, chat_id: long, user_id: InputUser)",
    "returns": "bool",
    "params": [
      {
        "name": "revoke_history",
        "type": "flags.0?true",
        "required": false,
        "default": null
      },
      {
        "name": "chat_id",
        "type": "long",
        "required": true,
        "default": null
      },
      {
        "name": "user_id",
        "type": "InputUser",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.deleteChatUser. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.deleteChatUser. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "create_basic_group",
    "rpc": "messages.createChat",
    "namespace": "messages",
    "signature": "await ctx.create_basic_group(users: Vector<InputUser>, title: string, ttl_period: flags.0?int = None)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "users",
        "type": "Vector<InputUser>",
        "required": true,
        "default": null
      },
      {
        "name": "title",
        "type": "string",
        "required": true,
        "default": null
      },
      {
        "name": "ttl_period",
        "type": "flags.0?int",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.createChat. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.createChat. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "set_basic_group_admin",
    "rpc": "messages.editChatAdmin",
    "namespace": "messages",
    "signature": "await ctx.set_basic_group_admin(chat_id: long, user_id: InputUser, is_admin: Bool)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "chat_id",
        "type": "long",
        "required": true,
        "default": null
      },
      {
        "name": "user_id",
        "type": "InputUser",
        "required": true,
        "default": null
      },
      {
        "name": "is_admin",
        "type": "Bool",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.editChatAdmin. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.editChatAdmin. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "upgrade_basic_group",
    "rpc": "messages.migrateChat",
    "namespace": "messages",
    "signature": "await ctx.upgrade_basic_group(chat_id: long)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "chat_id",
        "type": "long",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.migrateChat. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.migrateChat. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "edit_chat_description",
    "rpc": "messages.editChatAbout",
    "namespace": "messages",
    "signature": "await ctx.edit_chat_description(peer: InputPeer, about: string)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "about",
        "type": "string",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.editChatAbout. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.editChatAbout. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "set_default_member_restrictions",
    "rpc": "messages.editChatDefaultBannedRights",
    "namespace": "messages",
    "signature": "await ctx.set_default_member_restrictions(peer: InputPeer, banned_rights: ChatBannedRights)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "banned_rights",
        "type": "ChatBannedRights",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.editChatDefaultBannedRights. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.editChatDefaultBannedRights. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "remove_basic_group",
    "rpc": "messages.deleteChat",
    "namespace": "messages",
    "signature": "await ctx.remove_basic_group(chat_id: long)",
    "returns": "bool",
    "params": [
      {
        "name": "chat_id",
        "type": "long",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.deleteChat. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.deleteChat. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "set_chat_auto_delete",
    "rpc": "messages.setHistoryTTL",
    "namespace": "messages",
    "signature": "await ctx.set_chat_auto_delete(peer: InputPeer, period: int)",
    "returns": "bool",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "period",
        "type": "int",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.setHistoryTTL. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.setHistoryTTL. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "set_content_protection",
    "rpc": "messages.toggleNoForwards",
    "namespace": "messages",
    "signature": "await ctx.set_content_protection(peer: InputPeer, enabled: Bool, request_msg_id: flags.0?int = None)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "enabled",
        "type": "Bool",
        "required": true,
        "default": null
      },
      {
        "name": "request_msg_id",
        "type": "flags.0?int",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.toggleNoForwards. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.toggleNoForwards. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "mark_channel_read",
    "rpc": "channels.readHistory",
    "namespace": "channels",
    "signature": "await ctx.mark_channel_read(channel: InputChannel, max_id: int)",
    "returns": "bool",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "max_id",
        "type": "int",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram channels.readHistory. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram channels.readHistory. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "channel_members",
    "rpc": "channels.getParticipants",
    "namespace": "channels",
    "signature": "await ctx.channel_members(channel: InputChannel, filter: ChannelParticipantsFilter, offset: int, limit: int, hash: long)",
    "returns": "list[dict[str, Any]]",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "filter",
        "type": "ChannelParticipantsFilter",
        "required": true,
        "default": "{'_': 'channelParticipantsRecent'}"
      },
      {
        "name": "offset",
        "type": "int",
        "required": true,
        "default": "0"
      },
      {
        "name": "limit",
        "type": "int",
        "required": true,
        "default": "50"
      },
      {
        "name": "hash",
        "type": "long",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram channels.getParticipants. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram channels.getParticipants. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "channel_member",
    "rpc": "channels.getParticipant",
    "namespace": "channels",
    "signature": "await ctx.channel_member(channel: InputChannel, participant: InputPeer)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "participant",
        "type": "InputPeer",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram channels.getParticipant. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram channels.getParticipant. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "channel_details",
    "rpc": "channels.getFullChannel",
    "namespace": "channels",
    "signature": "await ctx.channel_details(channel: InputChannel)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": true,
        "default": "$peer"
      }
    ],
    "desc_en": "Calls Telegram channels.getFullChannel. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram channels.getFullChannel. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "create_channel",
    "rpc": "channels.createChannel",
    "namespace": "channels",
    "signature": "await ctx.create_channel(broadcast: flags.0?true = None, megagroup: flags.1?true = None, for_import: flags.3?true = None, forum: flags.5?true = None, title: string, about: string, geo_point: flags.2?InputGeoPoint = None, address: flags.2?string = None, ttl_period: flags.4?int = None)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "broadcast",
        "type": "flags.0?true",
        "required": false,
        "default": null
      },
      {
        "name": "megagroup",
        "type": "flags.1?true",
        "required": false,
        "default": null
      },
      {
        "name": "for_import",
        "type": "flags.3?true",
        "required": false,
        "default": null
      },
      {
        "name": "forum",
        "type": "flags.5?true",
        "required": false,
        "default": null
      },
      {
        "name": "title",
        "type": "string",
        "required": true,
        "default": null
      },
      {
        "name": "about",
        "type": "string",
        "required": true,
        "default": null
      },
      {
        "name": "geo_point",
        "type": "flags.2?InputGeoPoint",
        "required": false,
        "default": null
      },
      {
        "name": "address",
        "type": "flags.2?string",
        "required": false,
        "default": null
      },
      {
        "name": "ttl_period",
        "type": "flags.4?int",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram channels.createChannel. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram channels.createChannel. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "set_channel_admin",
    "rpc": "channels.editAdmin",
    "namespace": "channels",
    "signature": "await ctx.set_channel_admin(channel: InputChannel, user_id: InputUser, admin_rights: ChatAdminRights, rank: flags.0?string = None)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "user_id",
        "type": "InputUser",
        "required": true,
        "default": null
      },
      {
        "name": "admin_rights",
        "type": "ChatAdminRights",
        "required": true,
        "default": null
      },
      {
        "name": "rank",
        "type": "flags.0?string",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram channels.editAdmin. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram channels.editAdmin. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "rename_channel",
    "rpc": "channels.editTitle",
    "namespace": "channels",
    "signature": "await ctx.rename_channel(channel: InputChannel, title: string)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "title",
        "type": "string",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram channels.editTitle. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram channels.editTitle. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "set_channel_photo",
    "rpc": "channels.editPhoto",
    "namespace": "channels",
    "signature": "await ctx.set_channel_photo(channel: InputChannel, photo: InputChatPhoto)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "photo",
        "type": "InputChatPhoto",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram channels.editPhoto. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram channels.editPhoto. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "check_channel_username",
    "rpc": "channels.checkUsername",
    "namespace": "channels",
    "signature": "await ctx.check_channel_username(channel: InputChannel, username: string)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "username",
        "type": "string",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram channels.checkUsername. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram channels.checkUsername. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "set_channel_username",
    "rpc": "channels.updateUsername",
    "namespace": "channels",
    "signature": "await ctx.set_channel_username(channel: InputChannel, username: string)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "username",
        "type": "string",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram channels.updateUsername. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram channels.updateUsername. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "join_channel",
    "rpc": "channels.joinChannel",
    "namespace": "channels",
    "signature": "await ctx.join_channel(channel: InputChannel)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": true,
        "default": "$peer"
      }
    ],
    "desc_en": "Calls Telegram channels.joinChannel. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram channels.joinChannel. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "leave_channel",
    "rpc": "channels.leaveChannel",
    "namespace": "channels",
    "signature": "await ctx.leave_channel(channel: InputChannel)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": true,
        "default": "$peer"
      }
    ],
    "desc_en": "Calls Telegram channels.leaveChannel. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram channels.leaveChannel. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "invite_channel_members",
    "rpc": "channels.inviteToChannel",
    "namespace": "channels",
    "signature": "await ctx.invite_channel_members(channel: InputChannel, users: Vector<InputUser>)",
    "returns": "list[dict[str, Any]]",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "users",
        "type": "Vector<InputUser>",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram channels.inviteToChannel. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram channels.inviteToChannel. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "remove_channel",
    "rpc": "channels.deleteChannel",
    "namespace": "channels",
    "signature": "await ctx.remove_channel(channel: InputChannel)",
    "returns": "bool",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": true,
        "default": "$peer"
      }
    ],
    "desc_en": "Calls Telegram channels.deleteChannel. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram channels.deleteChannel. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "set_channel_signatures",
    "rpc": "channels.toggleSignatures",
    "namespace": "channels",
    "signature": "await ctx.set_channel_signatures(signatures_enabled: flags.0?true = None, profiles_enabled: flags.1?true = None, channel: InputChannel)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "signatures_enabled",
        "type": "flags.0?true",
        "required": false,
        "default": null
      },
      {
        "name": "profiles_enabled",
        "type": "flags.1?true",
        "required": false,
        "default": null
      },
      {
        "name": "channel",
        "type": "InputChannel",
        "required": true,
        "default": "$peer"
      }
    ],
    "desc_en": "Calls Telegram channels.toggleSignatures. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram channels.toggleSignatures. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "owned_public_channels",
    "rpc": "channels.getAdminedPublicChannels",
    "namespace": "channels",
    "signature": "await ctx.owned_public_channels(by_location: flags.0?true = None, check_limit: flags.1?true = None, for_personal: flags.2?true = None, for_community_peer: flags.3?true = None)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "by_location",
        "type": "flags.0?true",
        "required": false,
        "default": null
      },
      {
        "name": "check_limit",
        "type": "flags.1?true",
        "required": false,
        "default": null
      },
      {
        "name": "for_personal",
        "type": "flags.2?true",
        "required": false,
        "default": null
      },
      {
        "name": "for_community_peer",
        "type": "flags.3?true",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram channels.getAdminedPublicChannels. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram channels.getAdminedPublicChannels. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "restrict_channel_member",
    "rpc": "channels.editBanned",
    "namespace": "channels",
    "signature": "await ctx.restrict_channel_member(channel: InputChannel, participant: InputPeer, banned_rights: ChatBannedRights)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "participant",
        "type": "InputPeer",
        "required": true,
        "default": null
      },
      {
        "name": "banned_rights",
        "type": "ChatBannedRights",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram channels.editBanned. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram channels.editBanned. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "channel_admin_log",
    "rpc": "channels.getAdminLog",
    "namespace": "channels",
    "signature": "await ctx.channel_admin_log(channel: InputChannel, q: string, events_filter: flags.0?ChannelAdminLogEventsFilter = None, admins: flags.1?Vector<InputUser> = None, max_id: long, min_id: long, limit: int)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "q",
        "type": "string",
        "required": true,
        "default": ""
      },
      {
        "name": "events_filter",
        "type": "flags.0?ChannelAdminLogEventsFilter",
        "required": false,
        "default": null
      },
      {
        "name": "admins",
        "type": "flags.1?Vector<InputUser>",
        "required": false,
        "default": null
      },
      {
        "name": "max_id",
        "type": "long",
        "required": true,
        "default": null
      },
      {
        "name": "min_id",
        "type": "long",
        "required": true,
        "default": null
      },
      {
        "name": "limit",
        "type": "int",
        "required": true,
        "default": "50"
      }
    ],
    "desc_en": "Calls Telegram channels.getAdminLog. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram channels.getAdminLog. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "set_group_sticker_set",
    "rpc": "channels.setStickers",
    "namespace": "channels",
    "signature": "await ctx.set_group_sticker_set(channel: InputChannel, stickerset: InputStickerSet)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "stickerset",
        "type": "InputStickerSet",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram channels.setStickers. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram channels.setStickers. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "mark_channel_media_read",
    "rpc": "channels.readMessageContents",
    "namespace": "channels",
    "signature": "await ctx.mark_channel_media_read(channel: InputChannel, id: Vector<int>)",
    "returns": "bool",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "id",
        "type": "Vector<int>",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram channels.readMessageContents. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram channels.readMessageContents. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "clear_channel_history",
    "rpc": "channels.deleteHistory",
    "namespace": "channels",
    "signature": "await ctx.clear_channel_history(for_everyone: flags.0?true = None, channel: InputChannel, max_id: int)",
    "returns": "bool",
    "params": [
      {
        "name": "for_everyone",
        "type": "flags.0?true",
        "required": false,
        "default": null
      },
      {
        "name": "channel",
        "type": "InputChannel",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "max_id",
        "type": "int",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram channels.deleteHistory. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram channels.deleteHistory. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "set_prehistory_hidden",
    "rpc": "channels.togglePreHistoryHidden",
    "namespace": "channels",
    "signature": "await ctx.set_prehistory_hidden(channel: InputChannel, enabled: Bool)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "enabled",
        "type": "Bool",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram channels.togglePreHistoryHidden. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram channels.togglePreHistoryHidden. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "left_channels",
    "rpc": "channels.getLeftChannels",
    "namespace": "channels",
    "signature": "await ctx.left_channels(offset: int)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "offset",
        "type": "int",
        "required": true,
        "default": "0"
      }
    ],
    "desc_en": "Calls Telegram channels.getLeftChannels. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram channels.getLeftChannels. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "eligible_discussion_groups",
    "rpc": "channels.getGroupsForDiscussion",
    "namespace": "channels",
    "signature": "await ctx.eligible_discussion_groups()",
    "returns": "dict[str, Any]",
    "params": [],
    "desc_en": "Calls Telegram channels.getGroupsForDiscussion. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram channels.getGroupsForDiscussion. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "set_discussion_group",
    "rpc": "channels.setDiscussionGroup",
    "namespace": "channels",
    "signature": "await ctx.set_discussion_group(broadcast: InputChannel, group: InputChannel)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "broadcast",
        "type": "InputChannel",
        "required": true,
        "default": null
      },
      {
        "name": "group",
        "type": "InputChannel",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram channels.setDiscussionGroup. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram channels.setDiscussionGroup. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "set_group_location",
    "rpc": "channels.editLocation",
    "namespace": "channels",
    "signature": "await ctx.set_group_location(channel: InputChannel, geo_point: InputGeoPoint, address: string)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "geo_point",
        "type": "InputGeoPoint",
        "required": true,
        "default": null
      },
      {
        "name": "address",
        "type": "string",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram channels.editLocation. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram channels.editLocation. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "set_slow_mode",
    "rpc": "channels.toggleSlowMode",
    "namespace": "channels",
    "signature": "await ctx.set_slow_mode(channel: InputChannel, seconds: int)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "seconds",
        "type": "int",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram channels.toggleSlowMode. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram channels.toggleSlowMode. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "inactive_channels",
    "rpc": "channels.getInactiveChannels",
    "namespace": "channels",
    "signature": "await ctx.inactive_channels()",
    "returns": "dict[str, Any]",
    "params": [],
    "desc_en": "Calls Telegram channels.getInactiveChannels. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram channels.getInactiveChannels. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "send_as_identities",
    "rpc": "channels.getSendAs",
    "namespace": "channels",
    "signature": "await ctx.send_as_identities(for_paid_reactions: flags.0?true = None, for_live_stories: flags.1?true = None, peer: InputPeer)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "for_paid_reactions",
        "type": "flags.0?true",
        "required": false,
        "default": null
      },
      {
        "name": "for_live_stories",
        "type": "flags.1?true",
        "required": false,
        "default": null
      },
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": "$peer"
      }
    ],
    "desc_en": "Calls Telegram channels.getSendAs. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram channels.getSendAs. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "remove_member_history",
    "rpc": "channels.deleteParticipantHistory",
    "namespace": "channels",
    "signature": "await ctx.remove_member_history(channel: InputChannel, participant: InputPeer)",
    "returns": "bool",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "participant",
        "type": "InputPeer",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram channels.deleteParticipantHistory. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram channels.deleteParticipantHistory. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "set_join_to_send",
    "rpc": "channels.toggleJoinToSend",
    "namespace": "channels",
    "signature": "await ctx.set_join_to_send(channel: InputChannel, enabled: Bool)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "enabled",
        "type": "Bool",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram channels.toggleJoinToSend. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram channels.toggleJoinToSend. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "set_join_requests",
    "rpc": "channels.toggleJoinRequest",
    "namespace": "channels",
    "signature": "await ctx.set_join_requests(apply_to_invites: flags.1?true = None, channel: InputChannel, enabled: Bool, guard_bot: flags.0?InputUser = None)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "apply_to_invites",
        "type": "flags.1?true",
        "required": false,
        "default": null
      },
      {
        "name": "channel",
        "type": "InputChannel",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "enabled",
        "type": "Bool",
        "required": true,
        "default": null
      },
      {
        "name": "guard_bot",
        "type": "flags.0?InputUser",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram channels.toggleJoinRequest. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram channels.toggleJoinRequest. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "reorder_channel_usernames",
    "rpc": "channels.reorderUsernames",
    "namespace": "channels",
    "signature": "await ctx.reorder_channel_usernames(channel: InputChannel, order: Vector<string>)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "order",
        "type": "Vector<string>",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram channels.reorderUsernames. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram channels.reorderUsernames. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "set_channel_username_active",
    "rpc": "channels.toggleUsername",
    "namespace": "channels",
    "signature": "await ctx.set_channel_username_active(channel: InputChannel, username: string, active: Bool)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "username",
        "type": "string",
        "required": true,
        "default": null
      },
      {
        "name": "active",
        "type": "Bool",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram channels.toggleUsername. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram channels.toggleUsername. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "deactivate_channel_usernames",
    "rpc": "channels.deactivateAllUsernames",
    "namespace": "channels",
    "signature": "await ctx.deactivate_channel_usernames(channel: InputChannel)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": true,
        "default": "$peer"
      }
    ],
    "desc_en": "Calls Telegram channels.deactivateAllUsernames. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram channels.deactivateAllUsernames. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "set_antispam",
    "rpc": "channels.toggleAntiSpam",
    "namespace": "channels",
    "signature": "await ctx.set_antispam(channel: InputChannel, enabled: Bool)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "enabled",
        "type": "Bool",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram channels.toggleAntiSpam. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram channels.toggleAntiSpam. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "set_members_hidden",
    "rpc": "channels.toggleParticipantsHidden",
    "namespace": "channels",
    "signature": "await ctx.set_members_hidden(channel: InputChannel, enabled: Bool)",
    "returns": "list[dict[str, Any]]",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "enabled",
        "type": "Bool",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram channels.toggleParticipantsHidden. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram channels.toggleParticipantsHidden. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "set_channel_color",
    "rpc": "channels.updateColor",
    "namespace": "channels",
    "signature": "await ctx.set_channel_color(for_profile: flags.1?true = None, channel: InputChannel, color: flags.2?int = None, background_emoji_id: flags.0?long = None)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "for_profile",
        "type": "flags.1?true",
        "required": false,
        "default": null
      },
      {
        "name": "channel",
        "type": "InputChannel",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "color",
        "type": "flags.2?int",
        "required": false,
        "default": null
      },
      {
        "name": "background_emoji_id",
        "type": "flags.0?long",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram channels.updateColor. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram channels.updateColor. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "related_channels",
    "rpc": "channels.getChannelRecommendations",
    "namespace": "channels",
    "signature": "await ctx.related_channels(channel: flags.0?InputChannel = None)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "channel",
        "type": "flags.0?InputChannel",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram channels.getChannelRecommendations. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram channels.getChannelRecommendations. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "set_channel_emoji_status",
    "rpc": "channels.updateEmojiStatus",
    "namespace": "channels",
    "signature": "await ctx.set_channel_emoji_status(channel: InputChannel, emoji_status: EmojiStatus)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "emoji_status",
        "type": "EmojiStatus",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram channels.updateEmojiStatus. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram channels.updateEmojiStatus. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "set_group_emoji_set",
    "rpc": "channels.setEmojiStickers",
    "namespace": "channels",
    "signature": "await ctx.set_group_emoji_set(channel: InputChannel, stickerset: InputStickerSet)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "stickerset",
        "type": "InputStickerSet",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram channels.setEmojiStickers. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram channels.setEmojiStickers. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "set_channel_auto_translation",
    "rpc": "channels.toggleAutotranslation",
    "namespace": "channels",
    "signature": "await ctx.set_channel_auto_translation(channel: InputChannel, enabled: Bool)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "enabled",
        "type": "Bool",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram channels.toggleAutotranslation. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram channels.toggleAutotranslation. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "set_channel_profile_tab",
    "rpc": "channels.setMainProfileTab",
    "namespace": "channels",
    "signature": "await ctx.set_channel_profile_tab(channel: InputChannel, tab: ProfileTab)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "tab",
        "type": "ProfileTab",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram channels.setMainProfileTab. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram channels.setMainProfileTab. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "edit_member_rank",
    "rpc": "messages.editChatParticipantRank",
    "namespace": "messages",
    "signature": "await ctx.edit_member_rank(peer: InputPeer, participant: InputPeer, rank: string)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "participant",
        "type": "InputPeer",
        "required": true,
        "default": null
      },
      {
        "name": "rank",
        "type": "string",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.editChatParticipantRank. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.editChatParticipantRank. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "create_chat_invite",
    "rpc": "messages.exportChatInvite",
    "namespace": "messages",
    "signature": "await ctx.create_chat_invite(legacy_revoke_permanent: flags.2?true = None, request_needed: flags.3?true = None, peer: InputPeer, expire_date: flags.0?int = None, usage_limit: flags.1?int = None, title: flags.4?string = None, subscription_pricing: flags.5?StarsSubscriptionPricing = None)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "legacy_revoke_permanent",
        "type": "flags.2?true",
        "required": false,
        "default": null
      },
      {
        "name": "request_needed",
        "type": "flags.3?true",
        "required": false,
        "default": null
      },
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "expire_date",
        "type": "flags.0?int",
        "required": false,
        "default": null
      },
      {
        "name": "usage_limit",
        "type": "flags.1?int",
        "required": false,
        "default": null
      },
      {
        "name": "title",
        "type": "flags.4?string",
        "required": false,
        "default": null
      },
      {
        "name": "subscription_pricing",
        "type": "flags.5?StarsSubscriptionPricing",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.exportChatInvite. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.exportChatInvite. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "chat_invites",
    "rpc": "messages.getExportedChatInvites",
    "namespace": "messages",
    "signature": "await ctx.chat_invites(revoked: flags.3?true = None, peer: InputPeer, admin_id: InputUser, offset_date: flags.2?int = None, offset_link: flags.2?string = None, limit: int)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "revoked",
        "type": "flags.3?true",
        "required": false,
        "default": null
      },
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "admin_id",
        "type": "InputUser",
        "required": true,
        "default": null
      },
      {
        "name": "offset_date",
        "type": "flags.2?int",
        "required": false,
        "default": null
      },
      {
        "name": "offset_link",
        "type": "flags.2?string",
        "required": false,
        "default": null
      },
      {
        "name": "limit",
        "type": "int",
        "required": true,
        "default": "50"
      }
    ],
    "desc_en": "Calls Telegram messages.getExportedChatInvites. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.getExportedChatInvites. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "chat_invite_details",
    "rpc": "messages.getExportedChatInvite",
    "namespace": "messages",
    "signature": "await ctx.chat_invite_details(peer: InputPeer, link: string)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "link",
        "type": "string",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.getExportedChatInvite. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.getExportedChatInvite. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "edit_chat_invite",
    "rpc": "messages.editExportedChatInvite",
    "namespace": "messages",
    "signature": "await ctx.edit_chat_invite(revoked: flags.2?true = None, peer: InputPeer, link: string, expire_date: flags.0?int = None, usage_limit: flags.1?int = None, request_needed: flags.3?Bool = None, title: flags.4?string = None)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "revoked",
        "type": "flags.2?true",
        "required": false,
        "default": null
      },
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "link",
        "type": "string",
        "required": true,
        "default": null
      },
      {
        "name": "expire_date",
        "type": "flags.0?int",
        "required": false,
        "default": null
      },
      {
        "name": "usage_limit",
        "type": "flags.1?int",
        "required": false,
        "default": null
      },
      {
        "name": "request_needed",
        "type": "flags.3?Bool",
        "required": false,
        "default": null
      },
      {
        "name": "title",
        "type": "flags.4?string",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.editExportedChatInvite. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.editExportedChatInvite. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "purge_revoked_chat_invites",
    "rpc": "messages.deleteRevokedExportedChatInvites",
    "namespace": "messages",
    "signature": "await ctx.purge_revoked_chat_invites(peer: InputPeer, admin_id: InputUser)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "admin_id",
        "type": "InputUser",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.deleteRevokedExportedChatInvites. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.deleteRevokedExportedChatInvites. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "remove_chat_invite",
    "rpc": "messages.deleteExportedChatInvite",
    "namespace": "messages",
    "signature": "await ctx.remove_chat_invite(peer: InputPeer, link: string)",
    "returns": "bool",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "link",
        "type": "string",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.deleteExportedChatInvite. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.deleteExportedChatInvite. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "invite_admins",
    "rpc": "messages.getAdminsWithInvites",
    "namespace": "messages",
    "signature": "await ctx.invite_admins(peer: InputPeer)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": "$peer"
      }
    ],
    "desc_en": "Calls Telegram messages.getAdminsWithInvites. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.getAdminsWithInvites. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "invite_joiners",
    "rpc": "messages.getChatInviteImporters",
    "namespace": "messages",
    "signature": "await ctx.invite_joiners(requested: flags.0?true = None, subscription_expired: flags.3?true = None, peer: InputPeer, link: flags.1?string = None, q: flags.2?string = None, offset_date: int, offset_user: InputUser, limit: int)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "requested",
        "type": "flags.0?true",
        "required": false,
        "default": null
      },
      {
        "name": "subscription_expired",
        "type": "flags.3?true",
        "required": false,
        "default": null
      },
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "link",
        "type": "flags.1?string",
        "required": false,
        "default": null
      },
      {
        "name": "q",
        "type": "flags.2?string",
        "required": false,
        "default": null
      },
      {
        "name": "offset_date",
        "type": "int",
        "required": true,
        "default": "0"
      },
      {
        "name": "offset_user",
        "type": "InputUser",
        "required": true,
        "default": "{'_': 'inputUserEmpty'}"
      },
      {
        "name": "limit",
        "type": "int",
        "required": true,
        "default": "50"
      }
    ],
    "desc_en": "Calls Telegram messages.getChatInviteImporters. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.getChatInviteImporters. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "resolve_join_request",
    "rpc": "messages.hideChatJoinRequest",
    "namespace": "messages",
    "signature": "await ctx.resolve_join_request(approved: flags.0?true = None, peer: InputPeer, user_id: InputUser)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "approved",
        "type": "flags.0?true",
        "required": false,
        "default": null
      },
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "user_id",
        "type": "InputUser",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.hideChatJoinRequest. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.hideChatJoinRequest. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "resolve_all_join_requests",
    "rpc": "messages.hideAllChatJoinRequests",
    "namespace": "messages",
    "signature": "await ctx.resolve_all_join_requests(approved: flags.0?true = None, peer: InputPeer, link: flags.1?string = None)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "approved",
        "type": "flags.0?true",
        "required": false,
        "default": null
      },
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "link",
        "type": "flags.1?string",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram messages.hideAllChatJoinRequests. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram messages.hideAllChatJoinRequests. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "channel_statistics",
    "rpc": "stats.getBroadcastStats",
    "namespace": "stats",
    "signature": "await ctx.channel_statistics(dark: flags.0?true = None, channel: InputChannel)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "dark",
        "type": "flags.0?true",
        "required": false,
        "default": null
      },
      {
        "name": "channel",
        "type": "InputChannel",
        "required": true,
        "default": "$peer"
      }
    ],
    "desc_en": "Calls Telegram stats.getBroadcastStats. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram stats.getBroadcastStats. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "supergroup_statistics",
    "rpc": "stats.getMegagroupStats",
    "namespace": "stats",
    "signature": "await ctx.supergroup_statistics(dark: flags.0?true = None, channel: InputChannel)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "dark",
        "type": "flags.0?true",
        "required": false,
        "default": null
      },
      {
        "name": "channel",
        "type": "InputChannel",
        "required": true,
        "default": "$peer"
      }
    ],
    "desc_en": "Calls Telegram stats.getMegagroupStats. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram stats.getMegagroupStats. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "message_statistics",
    "rpc": "stats.getMessageStats",
    "namespace": "stats",
    "signature": "await ctx.message_statistics(dark: flags.0?true = None, channel: InputChannel, msg_id: int)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "dark",
        "type": "flags.0?true",
        "required": false,
        "default": null
      },
      {
        "name": "channel",
        "type": "InputChannel",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "msg_id",
        "type": "int",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Calls Telegram stats.getMessageStats. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram stats.getMessageStats. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "message_public_forwards",
    "rpc": "stats.getMessagePublicForwards",
    "namespace": "stats",
    "signature": "await ctx.message_public_forwards(channel: InputChannel, msg_id: int, offset: string, limit: int)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "msg_id",
        "type": "int",
        "required": true,
        "default": null
      },
      {
        "name": "offset",
        "type": "string",
        "required": true,
        "default": ""
      },
      {
        "name": "limit",
        "type": "int",
        "required": true,
        "default": "50"
      }
    ],
    "desc_en": "Calls Telegram stats.getMessagePublicForwards. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram stats.getMessagePublicForwards. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "story_statistics",
    "rpc": "stats.getStoryStats",
    "namespace": "stats",
    "signature": "await ctx.story_statistics(dark: flags.0?true = None, peer: InputPeer, id: int)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "dark",
        "type": "flags.0?true",
        "required": false,
        "default": null
      },
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "id",
        "type": "int",
        "required": true,
        "default": "$message"
      }
    ],
    "desc_en": "Calls Telegram stats.getStoryStats. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram stats.getStoryStats. Передает параметры и возвращает типизированный ответ."
  },
  {
    "name": "story_public_forwards",
    "rpc": "stats.getStoryPublicForwards",
    "namespace": "stats",
    "signature": "await ctx.story_public_forwards(peer: InputPeer, id: int, offset: string, limit: int)",
    "returns": "dict[str, Any]",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": "$peer"
      },
      {
        "name": "id",
        "type": "int",
        "required": true,
        "default": "$message"
      },
      {
        "name": "offset",
        "type": "string",
        "required": true,
        "default": ""
      },
      {
        "name": "limit",
        "type": "int",
        "required": true,
        "default": "50"
      }
    ],
    "desc_en": "Calls Telegram stats.getStoryPublicForwards. Dispatches typed parameters and returns structured result.",
    "desc_ru": "Вызывает метод Telegram stats.getStoryPublicForwards. Передает параметры и возвращает типизированный ответ."
  }
];
