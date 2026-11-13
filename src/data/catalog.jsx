export const CATALOG_METHODS = [
  {
    "name": "set_checklist_completed",
    "rpc": "messages.toggleTodoCompleted",
    "namespace": "messages",
    "signature": "await ctx.set_checklist_completed(peer: InputPeer, msg_id: int, completed: Vector<int>, incompleted: Vector<int>)",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": false,
        "default": "$peer"
      },
      {
        "name": "msg_id",
        "type": "int",
        "required": false,
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
    "desc_en": "Mark one or more items of a todo list as completed or not completed.",
    "desc_ru": "Отметить один или несколько пунктов списка задач как выполненные или невыполненные."
  },
  {
    "name": "add_poll_answer",
    "rpc": "messages.addPollAnswer",
    "namespace": "messages",
    "signature": "await ctx.add_poll_answer(peer: InputPeer, msg_id: int, answer: PollAnswer)",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": false,
        "default": "$peer"
      },
      {
        "name": "msg_id",
        "type": "int",
        "required": false,
        "default": "$message"
      },
      {
        "name": "answer",
        "type": "PollAnswer",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Add an answer option to an open-answer poll",
    "desc_ru": "Добавить вариант ответа в открытый опрос."
  },
  {
    "name": "remove_poll_answer",
    "rpc": "messages.deletePollAnswer",
    "namespace": "messages",
    "signature": "await ctx.remove_poll_answer(peer: InputPeer, msg_id: int, option: bytes)",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": false,
        "default": "$peer"
      },
      {
        "name": "msg_id",
        "type": "int",
        "required": false,
        "default": "$message"
      },
      {
        "name": "option",
        "type": "bytes",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Remove an answer option from an open-answer poll",
    "desc_ru": "Удалить вариант ответа из открытого опроса."
  },
  {
    "name": "unread_poll_votes",
    "rpc": "messages.getUnreadPollVotes",
    "namespace": "messages",
    "signature": "await ctx.unread_poll_votes(peer: InputPeer, offset_id: int, add_offset: int, limit: int, max_id: int, min_id: int)",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": false,
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
        "required": false,
        "default": null
      },
      {
        "name": "add_offset",
        "type": "int",
        "required": false,
        "default": null
      },
      {
        "name": "limit",
        "type": "int",
        "required": false,
        "default": null
      },
      {
        "name": "max_id",
        "type": "int",
        "required": false,
        "default": null
      },
      {
        "name": "min_id",
        "type": "int",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Get messages containing polls with unread votes",
    "desc_ru": "Получить сообщения с опросами, в которых есть непрочитанные голоса."
  },
  {
    "name": "mark_poll_votes_read",
    "rpc": "messages.readPollVotes",
    "namespace": "messages",
    "signature": "await ctx.mark_poll_votes_read(peer: InputPeer)",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": false,
        "default": "$peer"
      },
      {
        "name": "top_msg_id",
        "type": "flags.0?int",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Mark all unread poll votes in a chat as read",
    "desc_ru": "Отметить все непрочитанные голоса в опросах чата как прочитанные."
  },
  {
    "name": "poll_statistics",
    "rpc": "stats.getPollStats",
    "namespace": "stats",
    "signature": "await ctx.poll_statistics(peer: InputPeer, msg_id: int)",
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
        "required": false,
        "default": "$peer"
      },
      {
        "name": "msg_id",
        "type": "int",
        "required": false,
        "default": "$message"
      }
    ],
    "desc_en": "Get statistics for a poll sent in a message.",
    "desc_ru": "Получить статистику опроса, отправленного в сообщении."
  },
  {
    "name": "scheduled_messages",
    "rpc": "messages.getScheduledHistory",
    "namespace": "messages",
    "signature": "await ctx.scheduled_messages(peer: InputPeer, hash: long)",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": false,
        "default": "$peer"
      },
      {
        "name": "hash",
        "type": "long",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Get scheduled messages",
    "desc_ru": "Получить отложенные сообщения."
  },
  {
    "name": "scheduled_by_ids",
    "rpc": "messages.getScheduledMessages",
    "namespace": "messages",
    "signature": "await ctx.scheduled_by_ids(peer: InputPeer, id: Vector<int>)",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": false,
        "default": "$peer"
      },
      {
        "name": "id",
        "type": "Vector<int>",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Get scheduled messages",
    "desc_ru": "Получить отложенные сообщения по их идентификаторам."
  },
  {
    "name": "publish_scheduled",
    "rpc": "messages.sendScheduledMessages",
    "namespace": "messages",
    "signature": "await ctx.publish_scheduled(peer: InputPeer, id: Vector<int>)",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": false,
        "default": "$peer"
      },
      {
        "name": "id",
        "type": "Vector<int>",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Send scheduled messages right away",
    "desc_ru": "Отправить отложенные сообщения немедленно."
  },
  {
    "name": "cancel_scheduled",
    "rpc": "messages.deleteScheduledMessages",
    "namespace": "messages",
    "signature": "await ctx.cancel_scheduled(peer: InputPeer, id: Vector<int>)",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": false,
        "default": "$peer"
      },
      {
        "name": "id",
        "type": "Vector<int>",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Delete scheduled messages",
    "desc_ru": "Удалить отложенные сообщения."
  },
  {
    "name": "configure_chat_reactions",
    "rpc": "messages.setChatAvailableReactions",
    "namespace": "messages",
    "signature": "await ctx.configure_chat_reactions(peer: InputPeer, available_reactions: ChatReactions)",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": false,
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
    "desc_en": "Change the set of message reactions that can be used in a certain group, supergroup or channel",
    "desc_ru": "Изменить набор реакций на сообщения, доступных в группе, супергруппе или канале."
  },
  {
    "name": "available_reactions",
    "rpc": "messages.getAvailableReactions",
    "namespace": "messages",
    "signature": "await ctx.available_reactions(hash: int)",
    "params": [
      {
        "name": "hash",
        "type": "int",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Obtain available message reactions",
    "desc_ru": "Получить доступные реакции на сообщения."
  },
  {
    "name": "set_default_reaction",
    "rpc": "messages.setDefaultReaction",
    "namespace": "messages",
    "signature": "await ctx.set_default_reaction(reaction: Reaction)",
    "params": [
      {
        "name": "reaction",
        "type": "Reaction",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Change default emoji reaction to use in the quick reaction menu: the value is synced across devices and can be fetched using help.getConfig, reactions_default field.",
    "desc_ru": "Задать реакцию по умолчанию для быстрого меню реакций. Значение синхронизируется между устройствами и читается через help.getConfig, поле reactions_default."
  },
  {
    "name": "unread_reactions",
    "rpc": "messages.getUnreadReactions",
    "namespace": "messages",
    "signature": "await ctx.unread_reactions(peer: InputPeer, offset_id: int, add_offset: int, limit: int, max_id: int, min_id: int)",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": false,
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
        "required": false,
        "default": null
      },
      {
        "name": "add_offset",
        "type": "int",
        "required": false,
        "default": null
      },
      {
        "name": "limit",
        "type": "int",
        "required": false,
        "default": null
      },
      {
        "name": "max_id",
        "type": "int",
        "required": false,
        "default": null
      },
      {
        "name": "min_id",
        "type": "int",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Get unread reactions to messages you sent",
    "desc_ru": "Получить непрочитанные реакции на отправленные нами сообщения."
  },
  {
    "name": "mark_reactions_read",
    "rpc": "messages.readReactions",
    "namespace": "messages",
    "signature": "await ctx.mark_reactions_read(peer: InputPeer)",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": false,
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
    "desc_en": "Mark message reactions as read",
    "desc_ru": "Отметить реакции на сообщения как прочитанные."
  },
  {
    "name": "popular_reactions",
    "rpc": "messages.getTopReactions",
    "namespace": "messages",
    "signature": "await ctx.popular_reactions(limit: int, hash: long)",
    "params": [
      {
        "name": "limit",
        "type": "int",
        "required": false,
        "default": null
      },
      {
        "name": "hash",
        "type": "long",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Got popular message reactions",
    "desc_ru": "Получить популярные реакции на сообщения."
  },
  {
    "name": "recent_reactions",
    "rpc": "messages.getRecentReactions",
    "namespace": "messages",
    "signature": "await ctx.recent_reactions(limit: int, hash: long)",
    "params": [
      {
        "name": "limit",
        "type": "int",
        "required": false,
        "default": null
      },
      {
        "name": "hash",
        "type": "long",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Get recently used message reactions",
    "desc_ru": "Получить недавно использованные реакции на сообщения."
  },
  {
    "name": "clear_recent_reactions",
    "rpc": "messages.clearRecentReactions",
    "namespace": "messages",
    "signature": "await ctx.clear_recent_reactions()",
    "params": [
    ],
    "desc_en": "Clear recently used message reactions",
    "desc_ru": "Очистить список недавно использованных реакций на сообщения."
  },
  {
    "name": "remove_member_reactions",
    "rpc": "messages.deleteParticipantReactions",
    "namespace": "messages",
    "signature": "await ctx.remove_member_reactions(peer: InputPeer, participant: InputPeer)",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": false,
        "default": "$peer"
      },
      {
        "name": "participant",
        "type": "InputPeer",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "As an admin, remove all of a specific participant's reactions from every message in a group or channel.",
    "desc_ru": "Снять все реакции конкретного участника со всех сообщений в группе или канале. Требуются права администратора."
  },
  {
    "name": "remove_member_message_reaction",
    "rpc": "messages.deleteParticipantReaction",
    "namespace": "messages",
    "signature": "await ctx.remove_member_message_reaction(peer: InputPeer, msg_id: int, participant: InputPeer)",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": false,
        "default": "$peer"
      },
      {
        "name": "msg_id",
        "type": "int",
        "required": false,
        "default": "$message"
      },
      {
        "name": "participant",
        "type": "InputPeer",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "As an admin, remove all of a specific participant's reactions from a single message.",
    "desc_ru": "Снять все реакции конкретного участника с одного сообщения. Требуются права администратора."
  },
  {
    "name": "saved_dialogs",
    "rpc": "messages.getSavedDialogs",
    "namespace": "messages",
    "signature": "await ctx.saved_dialogs(offset_date: int, offset_id: int, offset_peer: InputPeer, limit: int, hash: long)",
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
        "required": false,
        "default": null
      },
      {
        "name": "offset_id",
        "type": "int",
        "required": false,
        "default": null
      },
      {
        "name": "offset_peer",
        "type": "InputPeer",
        "required": false,
        "default": null
      },
      {
        "name": "limit",
        "type": "int",
        "required": false,
        "default": null
      },
      {
        "name": "hash",
        "type": "long",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Returns the current saved dialog list or monoforum topic list.",
    "desc_ru": "Вернуть текущий список диалогов сохранённых сообщений или тем монфорума."
  },
  {
    "name": "saved_history",
    "rpc": "messages.getSavedHistory",
    "namespace": "messages",
    "signature": "await ctx.saved_history(peer: InputPeer, offset_id: int, offset_date: int, add_offset: int, limit: int, max_id: int, min_id: int, hash: long)",
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
        "required": false,
        "default": null
      },
      {
        "name": "offset_date",
        "type": "int",
        "required": false,
        "default": null
      },
      {
        "name": "add_offset",
        "type": "int",
        "required": false,
        "default": null
      },
      {
        "name": "limit",
        "type": "int",
        "required": false,
        "default": null
      },
      {
        "name": "max_id",
        "type": "int",
        "required": false,
        "default": null
      },
      {
        "name": "min_id",
        "type": "int",
        "required": false,
        "default": null
      },
      {
        "name": "hash",
        "type": "long",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Fetch saved messages forwarded from a specific peer, or fetch messages from a monoforum topic.",
    "desc_ru": "Получить сохранённые сообщения, пересланные от конкретного собеседника, или сообщения из темы монфорума."
  },
  {
    "name": "clear_saved_history",
    "rpc": "messages.deleteSavedHistory",
    "namespace": "messages",
    "signature": "await ctx.clear_saved_history(peer: InputPeer, max_id: int)",
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
    "desc_en": "Deletes messages from a monoforum topic, or deletes messages forwarded from a specific peer to saved messages.",
    "desc_ru": "Удалить сообщения из темы монфорума или пересланные от конкретного собеседника в сохранённые сообщения."
  },
  {
    "name": "pinned_saved_dialogs",
    "rpc": "messages.getPinnedSavedDialogs",
    "namespace": "messages",
    "signature": "await ctx.pinned_saved_dialogs()",
    "params": [
    ],
    "desc_en": "Get pinned saved dialogs, see here for more info.",
    "desc_ru": "Получить закреплённые диалоги сохранённых сообщений."
  },
  {
    "name": "set_saved_dialog_pinned",
    "rpc": "messages.toggleSavedDialogPin",
    "namespace": "messages",
    "signature": "await ctx.set_saved_dialog_pinned(peer: InputDialogPeer)",
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
    "desc_en": "Pin or unpin a saved message dialog.",
    "desc_ru": "Закрепить или открепить диалог сохранённых сообщений."
  },
  {
    "name": "reorder_saved_pins",
    "rpc": "messages.reorderPinnedSavedDialogs",
    "namespace": "messages",
    "signature": "await ctx.reorder_saved_pins(order: Vector<InputDialogPeer>)",
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
    "desc_en": "Reorder pinned saved message dialogs.",
    "desc_ru": "Изменить порядок закреплённых диалогов сохранённых сообщений."
  },
  {
    "name": "saved_reaction_tags",
    "rpc": "messages.getSavedReactionTags",
    "namespace": "messages",
    "signature": "await ctx.saved_reaction_tags(hash: long)",
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
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Fetch the full list of saved message tags created by the user.",
    "desc_ru": "Получить полный список созданных пользователем тегов сохранённых сообщений."
  },
  {
    "name": "rename_saved_tag",
    "rpc": "messages.updateSavedReactionTag",
    "namespace": "messages",
    "signature": "await ctx.rename_saved_tag(reaction: Reaction)",
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
    "desc_en": "Update the description of a saved message tag.",
    "desc_ru": "Изменить описание тега сохранённых сообщений."
  },
  {
    "name": "suggested_saved_tags",
    "rpc": "messages.getDefaultTagReactions",
    "namespace": "messages",
    "signature": "await ctx.suggested_saved_tags(hash: long)",
    "params": [
      {
        "name": "hash",
        "type": "long",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Fetch a default recommended list of saved message tag reactions.",
    "desc_ru": "Получить рекомендуемый список тегов для сохранённых сообщений."
  },
  {
    "name": "saved_dialogs_by_peers",
    "rpc": "messages.getSavedDialogsByID",
    "namespace": "messages",
    "signature": "await ctx.saved_dialogs_by_peers(ids: Vector<InputPeer>)",
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
    "desc_en": "Obtain information about specific saved message dialogs or monoforum topics.",
    "desc_ru": "Получить сведения о конкретных диалогах сохранённых сообщений или темах монфорума."
  },
  {
    "name": "mark_saved_history_read",
    "rpc": "messages.readSavedHistory",
    "namespace": "messages",
    "signature": "await ctx.mark_saved_history_read(parent_peer: InputPeer, peer: InputPeer, max_id: int)",
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
    "desc_en": "Mark messages as read in a monoforum topic.",
    "desc_ru": "Отметить сообщения в теме монфорума как прочитанные."
  },
  {
    "name": "forum_topics",
    "rpc": "messages.getForumTopics",
    "namespace": "messages",
    "signature": "await ctx.forum_topics(peer: InputPeer, offset_date: int, offset_id: int, offset_topic: int, limit: int)",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": false,
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
        "required": false,
        "default": null
      },
      {
        "name": "offset_id",
        "type": "int",
        "required": false,
        "default": null
      },
      {
        "name": "offset_topic",
        "type": "int",
        "required": false,
        "default": null
      },
      {
        "name": "limit",
        "type": "int",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Get topics of a forum",
    "desc_ru": "Получить темы форума."
  },
  {
    "name": "forum_topics_by_ids",
    "rpc": "messages.getForumTopicsByID",
    "namespace": "messages",
    "signature": "await ctx.forum_topics_by_ids(peer: InputPeer, topics: Vector<int>)",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": false,
        "default": "$peer"
      },
      {
        "name": "topics",
        "type": "Vector<int>",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Get forum topics by their ID",
    "desc_ru": "Получить темы форума по их идентификаторам."
  },
  {
    "name": "edit_forum_topic",
    "rpc": "messages.editForumTopic",
    "namespace": "messages",
    "signature": "await ctx.edit_forum_topic(peer: InputPeer, topic_id: int)",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": false,
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
    "desc_en": "Edit forum topic.",
    "desc_ru": "Изменить тему форума."
  },
  {
    "name": "set_forum_topic_pinned",
    "rpc": "messages.updatePinnedForumTopic",
    "namespace": "messages",
    "signature": "await ctx.set_forum_topic_pinned(peer: InputPeer, topic_id: int, pinned: Bool)",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": false,
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
    "desc_en": "Pin or unpin forum topics",
    "desc_ru": "Закрепить или открепить темы форума."
  },
  {
    "name": "reorder_forum_pins",
    "rpc": "messages.reorderPinnedForumTopics",
    "namespace": "messages",
    "signature": "await ctx.reorder_forum_pins(peer: InputPeer, order: Vector<int>)",
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
        "required": false,
        "default": "$peer"
      },
      {
        "name": "order",
        "type": "Vector<int>",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Reorder pinned forum topics",
    "desc_ru": "Изменить порядок закреплённых тем форума."
  },
  {
    "name": "create_forum_topic",
    "rpc": "messages.createForumTopic",
    "namespace": "messages",
    "signature": "await ctx.create_forum_topic(peer: InputPeer, title: string, random_id: long)",
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
        "required": false,
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
        "required": false,
        "default": "$random_id"
      },
      {
        "name": "send_as",
        "type": "flags.2?InputPeer",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Create a forum topic.",
    "desc_ru": "Создать тему форума."
  },
  {
    "name": "remove_forum_topic",
    "rpc": "messages.deleteTopicHistory",
    "namespace": "messages",
    "signature": "await ctx.remove_forum_topic(peer: InputPeer, top_msg_id: int)",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": false,
        "default": "$peer"
      },
      {
        "name": "top_msg_id",
        "type": "int",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Delete message history of a forum topic",
    "desc_ru": "Удалить историю сообщений темы форума."
  },
  {
    "name": "set_forum_enabled",
    "rpc": "channels.toggleForum",
    "namespace": "channels",
    "signature": "await ctx.set_forum_enabled(channel: InputChannel, enabled: Bool, tabs: Bool)",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": false,
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
    "desc_en": "Enable or disable forum functionality in a supergroup.",
    "desc_ru": "Включить или выключить режим форума в супергруппе."
  },
  {
    "name": "set_forum_message_view",
    "rpc": "channels.toggleViewForumAsMessages",
    "namespace": "channels",
    "signature": "await ctx.set_forum_message_view(channel: InputChannel, enabled: Bool)",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": false,
        "default": "$peer"
      },
      {
        "name": "enabled",
        "type": "Bool",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Users may also choose to display messages from all topics of a forum as if they were sent to a normal group, using a \"View as messages\" setting in the local client: this setting only affects the current account, and is synced to other logged in sessions using this method. Invoking this method will update the value of the view_forum_as_messages flag of channelFull or dialog and emit an updateChannelViewForumAsMessages.",
    "desc_ru": "Пользователи могут показывать сообщения всех тем форума как сообщения обычной группы через настройку Показывать как сообщения. Настройка действует только на текущий аккаунт и синхронизируется с другими сессиями. Вызов обновляет флаг view_forum_as_messages у channelFull или dialog и вызывает updateChannelViewForumAsMessages."
  },
  {
    "name": "story_posting_quota",
    "rpc": "stories.canSendStory",
    "namespace": "stories",
    "signature": "await ctx.story_posting_quota(peer: InputPeer)",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Check whether we can post stories as the specified peer.",
    "desc_ru": "Проверить, можно ли публиковать истории от имени указанного собеседника."
  },
  {
    "name": "post_story",
    "rpc": "stories.sendStory",
    "namespace": "stories",
    "signature": "await ctx.post_story(peer: InputPeer, media: InputMedia, privacy_rules: Vector<InputPrivacyRule>, random_id: long)",
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
        "required": false,
        "default": "$random_id"
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
    "desc_en": "Uploads a Telegram Story. May also be used in a business connection, not by wrapping the query in invokeWithBusinessConnection, but rather by specifying the ID of a controlled business user in peer.",
    "desc_ru": "Опубликовать историю Telegram. Может использоваться и в бизнес-подключении: укажите ID управляемого бизнес-пользователя в peer."
  },
  {
    "name": "edit_story",
    "rpc": "stories.editStory",
    "namespace": "stories",
    "signature": "await ctx.edit_story(peer: InputPeer, id: int)",
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
    "desc_en": "Edit an uploaded story May also be used in a business connection, not by wrapping the query in invokeWithBusinessConnection, but rather by specifying the ID of a controlled business user in peer: in this context, the method can only be used to edit stories posted by the same business bot on behalf of the user with stories.sendStory.",
    "desc_ru": "Изменить загруженную историю. Может использоваться и в бизнес-подключении: укажите ID управляемого бизнес-пользователя в peer, тогда метод правит только истории, опубликованные тем же ботом от имени пользователя."
  },
  {
    "name": "delete_stories",
    "rpc": "stories.deleteStories",
    "namespace": "stories",
    "signature": "await ctx.delete_stories(peer: InputPeer, id: Vector<int>)",
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
    "desc_en": "Deletes some posted stories.",
    "desc_ru": "Удалить опубликованные истории."
  },
  {
    "name": "set_stories_on_profile",
    "rpc": "stories.togglePinned",
    "namespace": "stories",
    "signature": "await ctx.set_stories_on_profile(peer: InputPeer, id: Vector<int>, pinned: Bool)",
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
    "desc_en": "Pin or unpin one or more stories",
    "desc_ru": "Закрепить или открепить одну или несколько историй."
  },
  {
    "name": "story_feed",
    "rpc": "stories.getAllStories",
    "namespace": "stories",
    "signature": "await ctx.story_feed()",
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
    "desc_en": "Fetch the List of active (or active and hidden) stories, see here for more info on watching stories.",
    "desc_ru": "Получить список активных, а также активных и скрытых историй."
  },
  {
    "name": "profile_stories",
    "rpc": "stories.getPinnedStories",
    "namespace": "stories",
    "signature": "await ctx.profile_stories(peer: InputPeer, offset_id: int, limit: int)",
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
        "required": false,
        "default": null
      },
      {
        "name": "limit",
        "type": "int",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Fetch the stories pinned on a peer's profile.",
    "desc_ru": "Получить истории, закреплённые в профиле собеседника."
  },
  {
    "name": "archived_stories",
    "rpc": "stories.getStoriesArchive",
    "namespace": "stories",
    "signature": "await ctx.archived_stories(peer: InputPeer, offset_id: int, limit: int)",
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
        "required": false,
        "default": null
      },
      {
        "name": "limit",
        "type": "int",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Fetch the story archive of a peer we control.",
    "desc_ru": "Получить архив историй собеседника, которым мы управляем."
  },
  {
    "name": "stories_by_ids",
    "rpc": "stories.getStoriesByID",
    "namespace": "stories",
    "signature": "await ctx.stories_by_ids(peer: InputPeer, id: Vector<int>)",
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
    "desc_en": "Obtain full info about a set of stories by their IDs.",
    "desc_ru": "Получить полные сведения об историях по их идентификаторам."
  },
  {
    "name": "mark_stories_read",
    "rpc": "stories.readStories",
    "namespace": "stories",
    "signature": "await ctx.mark_stories_read(peer: InputPeer, max_id: int)",
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
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Mark all stories up to a certain ID as read, for a given peer; will emit an updateReadStories update to all logged-in sessions.",
    "desc_ru": "Отметить все истории до указанного идентификатора как прочитанные для заданного собеседника. Обновление updateReadStories уходит во все активные сессии."
  },
  {
    "name": "story_viewers",
    "rpc": "stories.getStoryViewsList",
    "namespace": "stories",
    "signature": "await ctx.story_viewers(peer: InputPeer, id: int, offset: string, limit: int)",
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
        "required": false,
        "default": null
      },
      {
        "name": "limit",
        "type": "int",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Obtain the list of users that have viewed a specific story we posted",
    "desc_ru": "Получить список пользователей, посмотревших опубликованную нами историю."
  },
  {
    "name": "story_view_counts",
    "rpc": "stories.getStoriesViews",
    "namespace": "stories",
    "signature": "await ctx.story_view_counts(peer: InputPeer, id: Vector<int>)",
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
    "desc_en": "Obtain info about the view count, forward count, reactions and recent viewers of one or more stories.",
    "desc_ru": "Получить число просмотров, пересылок, реакции и недавних зрителей одной или нескольких историй."
  },
  {
    "name": "story_link",
    "rpc": "stories.exportStoryLink",
    "namespace": "stories",
    "signature": "await ctx.story_link(peer: InputPeer, id: int)",
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
    "desc_en": "Generate a story deep link for a specific story",
    "desc_ru": "Сгенерировать ссылку на конкретную историю."
  },
  {
    "name": "activate_story_stealth",
    "rpc": "stories.activateStealthMode",
    "namespace": "stories",
    "signature": "await ctx.activate_story_stealth()",
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
    "desc_en": "Activates stories stealth mode, see here for more info. Will return an updateStoriesStealthMode.",
    "desc_ru": "Включить режим скрытности историй. Возвращает updateStoriesStealthMode."
  },
  {
    "name": "react_to_story",
    "rpc": "stories.sendReaction",
    "namespace": "stories",
    "signature": "await ctx.react_to_story(peer: InputPeer, story_id: int, reaction: Reaction)",
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
    "desc_en": "React to a story.",
    "desc_ru": "Отреагировать на историю."
  },
  {
    "name": "peer_stories",
    "rpc": "stories.getPeerStories",
    "namespace": "stories",
    "signature": "await ctx.peer_stories(peer: InputPeer)",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Fetch the full active story list of a specific peer.",
    "desc_ru": "Получить полный список активных историй конкретного собеседника."
  },
  {
    "name": "story_read_markers",
    "rpc": "stories.getAllReadPeerStories",
    "namespace": "stories",
    "signature": "await ctx.story_read_markers()",
    "params": [
    ],
    "desc_en": "Obtain the latest read story ID for all peers when first logging in, returned as a list of updateReadStories updates, see here for more info.",
    "desc_ru": "Получить последние прочитанные идентификаторы историй для всех собеседников при первом входе. Возвращается списком обновлений updateReadStories."
  },
  {
    "name": "peer_latest_story_ids",
    "rpc": "stories.getPeerMaxIDs",
    "namespace": "stories",
    "signature": "await ctx.peer_latest_story_ids(id: Vector<InputPeer>)",
    "params": [
      {
        "name": "id",
        "type": "Vector<InputPeer>",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Get compact active story summaries for a set of peers.",
    "desc_ru": "Получить краткие сводки активных историй для набора собеседников."
  },
  {
    "name": "story_posting_chats",
    "rpc": "stories.getChatsToSend",
    "namespace": "stories",
    "signature": "await ctx.story_posting_chats()",
    "params": [
    ],
    "desc_en": "Obtain a list of channels where the user can post stories",
    "desc_ru": "Получить список каналов, где пользователь может публиковать истории."
  },
  {
    "name": "set_peer_stories_hidden",
    "rpc": "stories.togglePeerStoriesHidden",
    "namespace": "stories",
    "signature": "await ctx.set_peer_stories_hidden(peer: InputPeer, hidden: Bool)",
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
    "desc_en": "Hide the active stories of a user, preventing them from being displayed on the action bar on the homescreen, see here for more info.",
    "desc_ru": "Скрыть активные истории пользователя, чтобы они не показывались на панели действий на главном экране."
  },
  {
    "name": "story_reaction_senders",
    "rpc": "stories.getStoryReactionsList",
    "namespace": "stories",
    "signature": "await ctx.story_reaction_senders(peer: InputPeer, id: int, limit: int)",
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
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Get the reaction and interaction list of a story posted to a channel, along with the sender of each reaction. Can only be used by channel admins.",
    "desc_ru": "Получить список реакций и взаимодействий с историей в канале вместе с автором каждой реакции. Доступно только администраторам канала."
  },
  {
    "name": "reorder_profile_story_pins",
    "rpc": "stories.togglePinnedToTop",
    "namespace": "stories",
    "signature": "await ctx.reorder_profile_story_pins(peer: InputPeer, id: Vector<int>)",
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
    "desc_en": "Pin some stories to the top of the profile, see here for more info.",
    "desc_ru": "Закрепить истории вверху профиля."
  },
  {
    "name": "search_stories",
    "rpc": "stories.searchPosts",
    "namespace": "stories",
    "signature": "await ctx.search_stories(offset: string, limit: int)",
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
        "required": false,
        "default": null
      },
      {
        "name": "limit",
        "type": "int",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Globally search for stories using a hashtag or a location media area, see here for more info on the full flow. Either hashtag or area must be set when invoking the method.",
    "desc_ru": "Искать истории по всему Telegram по хэштегу или географической области. При вызове должен быть задан хэштег или область."
  },
  {
    "name": "create_story_album",
    "rpc": "stories.createAlbum",
    "namespace": "stories",
    "signature": "await ctx.create_story_album(peer: InputPeer, title: string, stories: Vector<int>)",
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
    "desc_en": "Creates a story album.",
    "desc_ru": "Создать альбом историй."
  },
  {
    "name": "edit_story_album",
    "rpc": "stories.updateAlbum",
    "namespace": "stories",
    "signature": "await ctx.edit_story_album(peer: InputPeer, album_id: int)",
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
    "desc_en": "Rename a story albums, or add, delete or reorder stories in it.",
    "desc_ru": "Переименовать альбом историй, а также добавить, удалить или переставить в нём истории."
  },
  {
    "name": "reorder_story_albums",
    "rpc": "stories.reorderAlbums",
    "namespace": "stories",
    "signature": "await ctx.reorder_story_albums(peer: InputPeer, order: Vector<int>)",
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
    "desc_en": "Reorder story albums on a profile.",
    "desc_ru": "Изменить порядок альбомов историй в профиле."
  },
  {
    "name": "remove_story_album",
    "rpc": "stories.deleteAlbum",
    "namespace": "stories",
    "signature": "await ctx.remove_story_album(peer: InputPeer, album_id: int)",
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
    "desc_en": "Delete a story album.",
    "desc_ru": "Удалить альбом историй."
  },
  {
    "name": "story_albums",
    "rpc": "stories.getAlbums",
    "namespace": "stories",
    "signature": "await ctx.story_albums(peer: InputPeer, hash: long)",
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
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Get story albums created by a peer.",
    "desc_ru": "Получить альбомы историй, созданные собеседником."
  },
  {
    "name": "story_album_items",
    "rpc": "stories.getAlbumStories",
    "namespace": "stories",
    "signature": "await ctx.story_album_items(peer: InputPeer, album_id: int, offset: int, limit: int)",
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
        "required": false,
        "default": null
      },
      {
        "name": "limit",
        "type": "int",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Get stories in a story album.",
    "desc_ru": "Получить истории из альбома."
  },
  {
    "name": "stickers_for_emoji",
    "rpc": "messages.getStickers",
    "namespace": "messages",
    "signature": "await ctx.stickers_for_emoji(emoticon: string, hash: long)",
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
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Get stickers by emoji",
    "desc_ru": "Получить стикеры по эмодзи."
  },
  {
    "name": "installed_sticker_sets",
    "rpc": "messages.getAllStickers",
    "namespace": "messages",
    "signature": "await ctx.installed_sticker_sets(hash: long)",
    "params": [
      {
        "name": "hash",
        "type": "long",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Get all installed stickers",
    "desc_ru": "Получить все установленные наборы стикеров."
  },
  {
    "name": "sticker_set",
    "rpc": "messages.getStickerSet",
    "namespace": "messages",
    "signature": "await ctx.sticker_set(stickerset: InputStickerSet, hash: int)",
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
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Get info about a stickerset",
    "desc_ru": "Получить сведения о наборе стикеров."
  },
  {
    "name": "install_sticker_set",
    "rpc": "messages.installStickerSet",
    "namespace": "messages",
    "signature": "await ctx.install_sticker_set(stickerset: InputStickerSet, archived: Bool)",
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
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Install a stickerset",
    "desc_ru": "Установить набор стикеров."
  },
  {
    "name": "uninstall_sticker_set",
    "rpc": "messages.uninstallStickerSet",
    "namespace": "messages",
    "signature": "await ctx.uninstall_sticker_set(stickerset: InputStickerSet)",
    "params": [
      {
        "name": "stickerset",
        "type": "InputStickerSet",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Uninstall a stickerset",
    "desc_ru": "Удалить набор стикеров."
  },
  {
    "name": "reorder_sticker_sets",
    "rpc": "messages.reorderStickerSets",
    "namespace": "messages",
    "signature": "await ctx.reorder_sticker_sets(order: Vector<long>)",
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
    "desc_en": "Reorder installed stickersets",
    "desc_ru": "Изменить порядок установленных наборов стикеров."
  },
  {
    "name": "saved_gifs",
    "rpc": "messages.getSavedGifs",
    "namespace": "messages",
    "signature": "await ctx.saved_gifs(hash: long)",
    "params": [
      {
        "name": "hash",
        "type": "long",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Get saved GIFs.",
    "desc_ru": "Получить сохранённые GIF."
  },
  {
    "name": "set_gif_saved",
    "rpc": "messages.saveGif",
    "namespace": "messages",
    "signature": "await ctx.set_gif_saved(id: InputDocument, unsave: Bool)",
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
    "desc_en": "Add GIF to saved gifs list",
    "desc_ru": "Добавить GIF в список сохранённых."
  },
  {
    "name": "featured_sticker_sets",
    "rpc": "messages.getFeaturedStickers",
    "namespace": "messages",
    "signature": "await ctx.featured_sticker_sets(hash: long)",
    "params": [
      {
        "name": "hash",
        "type": "long",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Get featured stickers",
    "desc_ru": "Получить рекомендуемые стикеры."
  },
  {
    "name": "mark_featured_stickers_seen",
    "rpc": "messages.readFeaturedStickers",
    "namespace": "messages",
    "signature": "await ctx.mark_featured_stickers_seen(id: Vector<long>)",
    "params": [
      {
        "name": "id",
        "type": "Vector<long>",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Mark new featured stickers as read",
    "desc_ru": "Отметить новые рекомендуемые стикеры как просмотренные."
  },
  {
    "name": "recent_stickers",
    "rpc": "messages.getRecentStickers",
    "namespace": "messages",
    "signature": "await ctx.recent_stickers(hash: long)",
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
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Get recent stickers",
    "desc_ru": "Получить недавние стикеры."
  },
  {
    "name": "set_sticker_recent",
    "rpc": "messages.saveRecentSticker",
    "namespace": "messages",
    "signature": "await ctx.set_sticker_recent(id: InputDocument, unsave: Bool)",
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
    "desc_en": "Add/remove sticker from recent stickers list",
    "desc_ru": "Добавить или удалить стикер из списка недавних."
  },
  {
    "name": "clear_recent_stickers",
    "rpc": "messages.clearRecentStickers",
    "namespace": "messages",
    "signature": "await ctx.clear_recent_stickers()",
    "params": [
      {
        "name": "attached",
        "type": "flags.0?true",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Clear recent stickers",
    "desc_ru": "Очистить список недавних стикеров."
  },
  {
    "name": "archived_sticker_sets",
    "rpc": "messages.getArchivedStickers",
    "namespace": "messages",
    "signature": "await ctx.archived_sticker_sets(offset_id: long, limit: int)",
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
        "required": false,
        "default": null
      },
      {
        "name": "limit",
        "type": "int",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Get all archived stickers",
    "desc_ru": "Получить все архивные наборы стикеров."
  },
  {
    "name": "installed_masks",
    "rpc": "messages.getMaskStickers",
    "namespace": "messages",
    "signature": "await ctx.installed_masks(hash: long)",
    "params": [
      {
        "name": "hash",
        "type": "long",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Get installed mask stickers",
    "desc_ru": "Получить установленные стикеры-маски."
  },
  {
    "name": "media_sticker_sets",
    "rpc": "messages.getAttachedStickers",
    "namespace": "messages",
    "signature": "await ctx.media_sticker_sets(media: InputStickeredMedia)",
    "params": [
      {
        "name": "media",
        "type": "InputStickeredMedia",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Get stickers attached to a photo or video",
    "desc_ru": "Получить стикеры, прикреплённые к фото или видео."
  },
  {
    "name": "favorite_stickers",
    "rpc": "messages.getFavedStickers",
    "namespace": "messages",
    "signature": "await ctx.favorite_stickers(hash: long)",
    "params": [
      {
        "name": "hash",
        "type": "long",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Get faved stickers",
    "desc_ru": "Получить избранные стикеры."
  },
  {
    "name": "set_sticker_favorite",
    "rpc": "messages.faveSticker",
    "namespace": "messages",
    "signature": "await ctx.set_sticker_favorite(id: InputDocument, unfave: Bool)",
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
    "desc_en": "Mark or unmark a sticker as favorite",
    "desc_ru": "Отметить стикер как избранный или снять отметку."
  },
  {
    "name": "search_sticker_sets",
    "rpc": "messages.searchStickerSets",
    "namespace": "messages",
    "signature": "await ctx.search_sticker_sets(q: string, hash: long)",
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
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Search for stickersets",
    "desc_ru": "Искать наборы стикеров."
  },
  {
    "name": "bulk_sticker_set_action",
    "rpc": "messages.toggleStickerSets",
    "namespace": "messages",
    "signature": "await ctx.bulk_sticker_set_action(stickersets: Vector<InputStickerSet>)",
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
    "desc_en": "Apply changes to multiple stickersets",
    "desc_ru": "Применить изменения сразу к нескольким наборам стикеров."
  },
  {
    "name": "older_featured_sticker_sets",
    "rpc": "messages.getOldFeaturedStickers",
    "namespace": "messages",
    "signature": "await ctx.older_featured_sticker_sets(offset: int, limit: int, hash: long)",
    "params": [
      {
        "name": "offset",
        "type": "int",
        "required": false,
        "default": null
      },
      {
        "name": "limit",
        "type": "int",
        "required": false,
        "default": null
      },
      {
        "name": "hash",
        "type": "long",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Method for fetching previously featured stickers",
    "desc_ru": "Получить ранее рекомендуемые стикеры."
  },
  {
    "name": "custom_emoji_documents",
    "rpc": "messages.getCustomEmojiDocuments",
    "namespace": "messages",
    "signature": "await ctx.custom_emoji_documents(document_id: Vector<long>)",
    "params": [
      {
        "name": "document_id",
        "type": "Vector<long>",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Fetch custom emoji stickers. Returns a list of documents with the animated custom emoji in TGS format, and a documentAttributeCustomEmoji attribute with the original emoji and info about the emoji stickerset this custom emoji belongs to.",
    "desc_ru": "Получить стикеры кастомных эмодзи. Возвращает документы с анимированными эмодзи в формате TGS и атрибут documentAttributeCustomEmoji с исходным эмодзи и данными о наборе."
  },
  {
    "name": "installed_emoji_sets",
    "rpc": "messages.getEmojiStickers",
    "namespace": "messages",
    "signature": "await ctx.installed_emoji_sets(hash: long)",
    "params": [
      {
        "name": "hash",
        "type": "long",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Gets the list of currently installed custom emoji stickersets.",
    "desc_ru": "Получить список установленных наборов стикеров кастомных эмодзи."
  },
  {
    "name": "featured_emoji_sets",
    "rpc": "messages.getFeaturedEmojiStickers",
    "namespace": "messages",
    "signature": "await ctx.featured_emoji_sets(hash: long)",
    "params": [
      {
        "name": "hash",
        "type": "long",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Gets featured custom emoji stickersets.",
    "desc_ru": "Получить рекомендуемые наборы стикеров кастомных эмодзи."
  },
  {
    "name": "search_custom_emoji",
    "rpc": "messages.searchCustomEmoji",
    "namespace": "messages",
    "signature": "await ctx.search_custom_emoji(emoticon: string, hash: long)",
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
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Look for custom emojis associated to a UTF8 emoji",
    "desc_ru": "Найти кастомные эмодзи по символу UTF-8."
  },
  {
    "name": "search_emoji_sets",
    "rpc": "messages.searchEmojiStickerSets",
    "namespace": "messages",
    "signature": "await ctx.search_emoji_sets(q: string, hash: long)",
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
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Search for custom emoji stickersets",
    "desc_ru": "Искать наборы стикеров кастомных эмодзи."
  },
  {
    "name": "owned_sticker_sets",
    "rpc": "messages.getMyStickers",
    "namespace": "messages",
    "signature": "await ctx.owned_sticker_sets(offset_id: long, limit: int)",
    "params": [
      {
        "name": "offset_id",
        "type": "long",
        "required": false,
        "default": null
      },
      {
        "name": "limit",
        "type": "int",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Fetch all stickersets owned by the current user.",
    "desc_ru": "Получить все наборы стикеров, принадлежащие текущему пользователю."
  },
  {
    "name": "search_stickers",
    "rpc": "messages.searchStickers",
    "namespace": "messages",
    "signature": "await ctx.search_stickers(q: string, emoticon: string, lang_code: Vector<string>, offset: int, limit: int, hash: long)",
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
        "required": false,
        "default": null
      },
      {
        "name": "limit",
        "type": "int",
        "required": false,
        "default": null
      },
      {
        "name": "hash",
        "type": "long",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Search for stickers using AI-powered keyword search",
    "desc_ru": "Искать стикеры по ключевым словам с помощью ИИ."
  },
  {
    "name": "create_sticker_set",
    "rpc": "stickers.createStickerSet",
    "namespace": "stickers",
    "signature": "await ctx.create_sticker_set(user_id: InputUser, title: string, short_name: string, stickers: Vector<InputStickerSetItem>)",
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
    "desc_en": "Create a stickerset.",
    "desc_ru": "Создать набор стикеров."
  },
  {
    "name": "remove_sticker",
    "rpc": "stickers.removeStickerFromSet",
    "namespace": "stickers",
    "signature": "await ctx.remove_sticker(sticker: InputDocument)",
    "params": [
      {
        "name": "sticker",
        "type": "InputDocument",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Remove a sticker from the set where it belongs. The sticker set must have been created by the current user/bot.",
    "desc_ru": "Удалить стикер из его набора. Набор должен быть создан текущим пользователем или ботом."
  },
  {
    "name": "move_sticker",
    "rpc": "stickers.changeStickerPosition",
    "namespace": "stickers",
    "signature": "await ctx.move_sticker(sticker: InputDocument, position: int)",
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
    "desc_en": "Changes the absolute position of a sticker in the set to which it belongs. The sticker set must have been created by the current user/bot.",
    "desc_ru": "Изменить абсолютную позицию стикера в его наборе. Набор должен быть создан текущим пользователем или ботом."
  },
  {
    "name": "add_sticker",
    "rpc": "stickers.addStickerToSet",
    "namespace": "stickers",
    "signature": "await ctx.add_sticker(stickerset: InputStickerSet, sticker: InputStickerSetItem)",
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
    "desc_en": "Add a sticker to a stickerset. The sticker set must have been created by the current user/bot.",
    "desc_ru": "Добавить стикер в набор. Набор должен быть создан текущим пользователем или ботом."
  },
  {
    "name": "set_sticker_set_thumbnail",
    "rpc": "stickers.setStickerSetThumb",
    "namespace": "stickers",
    "signature": "await ctx.set_sticker_set_thumbnail(stickerset: InputStickerSet)",
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
    "desc_en": "Set stickerset thumbnail",
    "desc_ru": "Задать обложку набора стикеров."
  },
  {
    "name": "check_sticker_set_name",
    "rpc": "stickers.checkShortName",
    "namespace": "stickers",
    "signature": "await ctx.check_sticker_set_name(short_name: string)",
    "params": [
      {
        "name": "short_name",
        "type": "string",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Check whether the given short name is available",
    "desc_ru": "Проверить, доступно ли указанное короткое имя."
  },
  {
    "name": "suggest_sticker_set_name",
    "rpc": "stickers.suggestShortName",
    "namespace": "stickers",
    "signature": "await ctx.suggest_sticker_set_name(title: string)",
    "params": [
      {
        "name": "title",
        "type": "string",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Suggests a short name for a given stickerpack name",
    "desc_ru": "Предложить короткое имя для указанного набора стикеров."
  },
  {
    "name": "edit_sticker_metadata",
    "rpc": "stickers.changeSticker",
    "namespace": "stickers",
    "signature": "await ctx.edit_sticker_metadata(sticker: InputDocument)",
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
    "desc_en": "Update the keywords, emojis or mask coordinates of a sticker.",
    "desc_ru": "Обновить ключевые слова, эмодзи или координаты маски стикера."
  },
  {
    "name": "rename_sticker_set",
    "rpc": "stickers.renameStickerSet",
    "namespace": "stickers",
    "signature": "await ctx.rename_sticker_set(stickerset: InputStickerSet, title: string)",
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
    "desc_en": "Renames a stickerset.",
    "desc_ru": "Переименовать набор стикеров."
  },
  {
    "name": "remove_sticker_set",
    "rpc": "stickers.deleteStickerSet",
    "namespace": "stickers",
    "signature": "await ctx.remove_sticker_set(stickerset: InputStickerSet)",
    "params": [
      {
        "name": "stickerset",
        "type": "InputStickerSet",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Deletes a stickerset we created.",
    "desc_ru": "Удалить созданный нами набор стикеров."
  },
  {
    "name": "replace_sticker",
    "rpc": "stickers.replaceSticker",
    "namespace": "stickers",
    "signature": "await ctx.replace_sticker(sticker: InputDocument, new_sticker: InputStickerSetItem)",
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
    "desc_en": "Replace a sticker in a stickerset.",
    "desc_ru": "Заменить стикер в наборе."
  },
  {
    "name": "contact_ids",
    "rpc": "contacts.getContactIDs",
    "namespace": "contacts",
    "signature": "await ctx.contact_ids(hash: long)",
    "params": [
      {
        "name": "hash",
        "type": "long",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Get the telegram IDs of all contacts. Returns an array of Telegram user IDs for all contacts (0 if a contact does not have an associated Telegram account or have hidden their account using privacy settings).",
    "desc_ru": "Получить Telegram ID всех контактов. Возвращает массив идентификаторов; для контакта без Telegram-аккаунта или со скрытым аккаунтом возвращается 0."
  },
  {
    "name": "contact_statuses",
    "rpc": "contacts.getStatuses",
    "namespace": "contacts",
    "signature": "await ctx.contact_statuses()",
    "params": [
    ],
    "desc_en": "Use this method to obtain the online statuses of all contacts with an accessible Telegram account.",
    "desc_ru": "Получить статусы в сети всех контактов с доступным Telegram-аккаунтом."
  },
  {
    "name": "contacts_list",
    "rpc": "contacts.getContacts",
    "namespace": "contacts",
    "signature": "await ctx.contacts_list(hash: long)",
    "params": [
      {
        "name": "hash",
        "type": "long",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Returns the current user's contact list.",
    "desc_ru": "Вернуть текущий список контактов пользователя."
  },
  {
    "name": "import_contacts",
    "rpc": "contacts.importContacts",
    "namespace": "contacts",
    "signature": "await ctx.import_contacts(contacts: Vector<InputContact>)",
    "params": [
      {
        "name": "contacts",
        "type": "Vector<InputContact>",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Imports contacts: saves a full list on the server, adds already registered contacts to the contact list, returns added contacts and their info. Use contacts.addContact to add Telegram contacts without actually using their phone number.",
    "desc_ru": "Импортировать контакты: сохранить полный список на сервере, добавить зарегистрированные контакты в список и вернуть добавленные контакты с их данными. Чтобы добавить контакт Telegram без использования его номера, вызывайте contacts.addContact."
  },
  {
    "name": "remove_contacts",
    "rpc": "contacts.deleteContacts",
    "namespace": "contacts",
    "signature": "await ctx.remove_contacts(id: Vector<InputUser>)",
    "params": [
      {
        "name": "id",
        "type": "Vector<InputUser>",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Deletes several contacts from the list.",
    "desc_ru": "Удалить несколько контактов из списка."
  },
  {
    "name": "remove_contacts_by_phone",
    "rpc": "contacts.deleteByPhones",
    "namespace": "contacts",
    "signature": "await ctx.remove_contacts_by_phone(phones: Vector<string>)",
    "params": [
      {
        "name": "phones",
        "type": "Vector<string>",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Delete contacts by phone number",
    "desc_ru": "Удалить контакты по номеру телефона."
  },
  {
    "name": "block_peer",
    "rpc": "contacts.block",
    "namespace": "contacts",
    "signature": "await ctx.block_peer(id: InputPeer)",
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
    "desc_en": "Adds a peer to a blocklist, see here for more info.",
    "desc_ru": "Добавить собеседника в список заблокированных."
  },
  {
    "name": "unblock_peer",
    "rpc": "contacts.unblock",
    "namespace": "contacts",
    "signature": "await ctx.unblock_peer(id: InputPeer)",
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
    "desc_en": "Deletes a peer from a blocklist, see here for more info.",
    "desc_ru": "Удалить собеседника из списка заблокированных."
  },
  {
    "name": "blocked_peers",
    "rpc": "contacts.getBlocked",
    "namespace": "contacts",
    "signature": "await ctx.blocked_peers(offset: int, limit: int)",
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
        "required": false,
        "default": null
      },
      {
        "name": "limit",
        "type": "int",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Returns the list of blocked users.",
    "desc_ru": "Вернуть список заблокированных пользователей."
  },
  {
    "name": "search_public_peers",
    "rpc": "contacts.search",
    "namespace": "contacts",
    "signature": "await ctx.search_public_peers(q: string, limit: int)",
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
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Returns users found by username substring.",
    "desc_ru": "Вернуть пользователей, найденных по подстроке имени пользователя."
  },
  {
    "name": "frequent_peers",
    "rpc": "contacts.getTopPeers",
    "namespace": "contacts",
    "signature": "await ctx.frequent_peers(offset: int, limit: int, hash: long)",
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
        "required": false,
        "default": null
      },
      {
        "name": "limit",
        "type": "int",
        "required": false,
        "default": null
      },
      {
        "name": "hash",
        "type": "long",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Get most used peers",
    "desc_ru": "Получить чаще всего используемых собеседников."
  },
  {
    "name": "reset_peer_rating",
    "rpc": "contacts.resetTopPeerRating",
    "namespace": "contacts",
    "signature": "await ctx.reset_peer_rating(category: TopPeerCategory, peer: InputPeer)",
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
    "desc_en": "Reset rating of top peer",
    "desc_ru": "Сбросить рейтинг часто используемого собеседника."
  },
  {
    "name": "clear_imported_contacts",
    "rpc": "contacts.resetSaved",
    "namespace": "contacts",
    "signature": "await ctx.clear_imported_contacts()",
    "params": [
    ],
    "desc_en": "Removes all contacts without an associated Telegram account.",
    "desc_ru": "Удалить все контакты без связанного Telegram-аккаунта."
  },
  {
    "name": "imported_contacts",
    "rpc": "contacts.getSaved",
    "namespace": "contacts",
    "signature": "await ctx.imported_contacts()",
    "params": [
    ],
    "desc_en": "Get all contacts, requires a takeout session, see here for more info.",
    "desc_ru": "Получить все контакты. Требуется сессия выгрузки данных."
  },
  {
    "name": "set_frequent_peers_enabled",
    "rpc": "contacts.toggleTopPeers",
    "namespace": "contacts",
    "signature": "await ctx.set_frequent_peers_enabled(enabled: Bool)",
    "params": [
      {
        "name": "enabled",
        "type": "Bool",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Enable/disable top peers",
    "desc_ru": "Включить или выключить список часто используемых собеседников."
  },
  {
    "name": "add_contact",
    "rpc": "contacts.addContact",
    "namespace": "contacts",
    "signature": "await ctx.add_contact(id: InputUser, first_name: string, last_name: string, phone: string)",
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
    "desc_en": "Add an existing telegram user as contact. Use contacts.importContacts to add contacts by phone number, without knowing their Telegram ID.",
    "desc_ru": "Добавить существующего пользователя Telegram в контакты. Чтобы добавить контакт по номеру телефона, не зная его Telegram ID, используйте contacts.importContacts."
  },
  {
    "name": "accept_contact",
    "rpc": "contacts.acceptContact",
    "namespace": "contacts",
    "signature": "await ctx.accept_contact(id: InputUser)",
    "params": [
      {
        "name": "id",
        "type": "InputUser",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "If the add contact action bar is active, add that user as contact",
    "desc_ru": "Добавить пользователя в контакты, если активна панель добавления контакта."
  },
  {
    "name": "set_close_friends",
    "rpc": "contacts.editCloseFriends",
    "namespace": "contacts",
    "signature": "await ctx.set_close_friends(id: Vector<long>)",
    "params": [
      {
        "name": "id",
        "type": "Vector<long>",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Edit the close friends list, see here for more info.",
    "desc_ru": "Изменить список близких друзей."
  },
  {
    "name": "replace_blocklist",
    "rpc": "contacts.setBlocked",
    "namespace": "contacts",
    "signature": "await ctx.replace_blocklist(id: Vector<InputPeer>, limit: int)",
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
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Replace the contents of an entire blocklist, see here for more info.",
    "desc_ru": "Заменить содержимое всего списка заблокированных."
  },
  {
    "name": "contact_birthdays",
    "rpc": "contacts.getBirthdays",
    "namespace": "contacts",
    "signature": "await ctx.contact_birthdays()",
    "params": [
    ],
    "desc_en": "Fetch all users with birthdays that fall within +1/-1 days, relative to the current day: this method should be invoked by clients every 6-8 hours, and if the result is non-empty, it should be used to appropriately update locally cached birthday information in user.birthday. See here for more info.",
    "desc_ru": "Получить пользователей с днями рождения в пределах плюс или минус одного дня от текущего. Клиенту стоит вызывать метод каждые 6-8 часов и обновлять локальный кеш дня рождения."
  },
  {
    "name": "edit_contact_note",
    "rpc": "contacts.updateContactNote",
    "namespace": "contacts",
    "signature": "await ctx.edit_contact_note(id: InputUser, note: TextWithEntities)",
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
    "desc_en": "Update the private note associated to a contact; see here for more info.",
    "desc_ru": "Обновить личную заметку о контакте."
  },
  {
    "name": "dialogs",
    "rpc": "messages.getDialogs",
    "namespace": "messages",
    "signature": "await ctx.dialogs(offset_date: int, offset_id: int, offset_peer: InputPeer, limit: int, hash: long)",
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
        "required": false,
        "default": null
      },
      {
        "name": "offset_id",
        "type": "int",
        "required": false,
        "default": null
      },
      {
        "name": "offset_peer",
        "type": "InputPeer",
        "required": false,
        "default": null
      },
      {
        "name": "limit",
        "type": "int",
        "required": false,
        "default": null
      },
      {
        "name": "hash",
        "type": "long",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Returns the current user dialog list.",
    "desc_ru": "Вернуть текущий список диалогов пользователя."
  },
  {
    "name": "chat_history",
    "rpc": "messages.getHistory",
    "namespace": "messages",
    "signature": "await ctx.chat_history(peer: InputPeer, offset_id: int, offset_date: int, add_offset: int, limit: int, max_id: int, min_id: int, hash: long)",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": false,
        "default": "$peer"
      },
      {
        "name": "offset_id",
        "type": "int",
        "required": false,
        "default": null
      },
      {
        "name": "offset_date",
        "type": "int",
        "required": false,
        "default": null
      },
      {
        "name": "add_offset",
        "type": "int",
        "required": false,
        "default": null
      },
      {
        "name": "limit",
        "type": "int",
        "required": false,
        "default": null
      },
      {
        "name": "max_id",
        "type": "int",
        "required": false,
        "default": null
      },
      {
        "name": "min_id",
        "type": "int",
        "required": false,
        "default": null
      },
      {
        "name": "hash",
        "type": "long",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Returns the message history in a peer. Results are ordered by date (descending).",
    "desc_ru": "Вернуть историю сообщений в диалоге. Результат отсортирован по дате по убыванию."
  },
  {
    "name": "search_chat_messages",
    "rpc": "messages.search",
    "namespace": "messages",
    "signature": "await ctx.search_chat_messages(peer: InputPeer, q: string, filter: MessagesFilter, min_date: int, max_date: int, offset_id: int, add_offset: int, limit: int, max_id: int, min_id: int, hash: long)",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": false,
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
        "required": false,
        "default": null
      },
      {
        "name": "min_date",
        "type": "int",
        "required": false,
        "default": null
      },
      {
        "name": "max_date",
        "type": "int",
        "required": false,
        "default": null
      },
      {
        "name": "offset_id",
        "type": "int",
        "required": false,
        "default": null
      },
      {
        "name": "add_offset",
        "type": "int",
        "required": false,
        "default": null
      },
      {
        "name": "limit",
        "type": "int",
        "required": false,
        "default": null
      },
      {
        "name": "max_id",
        "type": "int",
        "required": false,
        "default": null
      },
      {
        "name": "min_id",
        "type": "int",
        "required": false,
        "default": null
      },
      {
        "name": "hash",
        "type": "long",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Search for messages.",
    "desc_ru": "Искать сообщения."
  },
  {
    "name": "mark_chat_read",
    "rpc": "messages.readHistory",
    "namespace": "messages",
    "signature": "await ctx.mark_chat_read(peer: InputPeer, max_id: int)",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": false,
        "default": "$peer"
      },
      {
        "name": "max_id",
        "type": "int",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Marks message history as read.",
    "desc_ru": "Отметить историю сообщений как прочитанную."
  },
  {
    "name": "clear_chat_history",
    "rpc": "messages.deleteHistory",
    "namespace": "messages",
    "signature": "await ctx.clear_chat_history(peer: InputPeer, max_id: int)",
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
        "required": false,
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
    "desc_en": "Deletes communication history.",
    "desc_ru": "Удалить историю переписки."
  },
  {
    "name": "peer_settings",
    "rpc": "messages.getPeerSettings",
    "namespace": "messages",
    "signature": "await ctx.peer_settings(peer: InputPeer)",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": false,
        "default": "$peer"
      }
    ],
    "desc_en": "Get peer settings",
    "desc_ru": "Получить настройки собеседника."
  },
  {
    "name": "basic_groups",
    "rpc": "messages.getChats",
    "namespace": "messages",
    "signature": "await ctx.basic_groups(id: Vector<long>)",
    "params": [
      {
        "name": "id",
        "type": "Vector<long>",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Returns chat basic info on their IDs.",
    "desc_ru": "Вернуть основные сведения о чатах по их идентификаторам."
  },
  {
    "name": "basic_group_details",
    "rpc": "messages.getFullChat",
    "namespace": "messages",
    "signature": "await ctx.basic_group_details(chat_id: long)",
    "params": [
      {
        "name": "chat_id",
        "type": "long",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Get full info about a basic group.",
    "desc_ru": "Получить полные сведения о базовой группе."
  },
  {
    "name": "search_all_messages",
    "rpc": "messages.searchGlobal",
    "namespace": "messages",
    "signature": "await ctx.search_all_messages(q: string, filter: MessagesFilter, min_date: int, max_date: int, offset_rate: int, offset_peer: InputPeer, offset_id: int, limit: int)",
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
        "required": false,
        "default": null
      },
      {
        "name": "min_date",
        "type": "int",
        "required": false,
        "default": null
      },
      {
        "name": "max_date",
        "type": "int",
        "required": false,
        "default": null
      },
      {
        "name": "offset_rate",
        "type": "int",
        "required": false,
        "default": null
      },
      {
        "name": "offset_peer",
        "type": "InputPeer",
        "required": false,
        "default": null
      },
      {
        "name": "offset_id",
        "type": "int",
        "required": false,
        "default": null
      },
      {
        "name": "limit",
        "type": "int",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Search for messages and peers globally",
    "desc_ru": "Искать сообщения и собеседников по всему Telegram."
  },
  {
    "name": "message_editability",
    "rpc": "messages.getMessageEditData",
    "namespace": "messages",
    "signature": "await ctx.message_editability(peer: InputPeer, id: int)",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": false,
        "default": "$peer"
      },
      {
        "name": "id",
        "type": "int",
        "required": false,
        "default": "$message"
      }
    ],
    "desc_en": "Find out if a media message's caption can be edited",
    "desc_ru": "Узнать, можно ли изменить подпись к медиасообщению."
  },
  {
    "name": "peer_dialogs",
    "rpc": "messages.getPeerDialogs",
    "namespace": "messages",
    "signature": "await ctx.peer_dialogs(peers: Vector<InputDialogPeer>)",
    "params": [
      {
        "name": "peers",
        "type": "Vector<InputDialogPeer>",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Get dialog info of specified peers",
    "desc_ru": "Получить сведения о диалогах с указанными собеседниками."
  },
  {
    "name": "all_drafts",
    "rpc": "messages.getAllDrafts",
    "namespace": "messages",
    "signature": "await ctx.all_drafts()",
    "params": [
    ],
    "desc_en": "Return all message drafts. Returns all the latest updateDraftMessage updates related to all chats with drafts.",
    "desc_ru": "Вернуть все черновики сообщений: последние обновления updateDraftMessage по всем чатам с черновиками."
  },
  {
    "name": "mutual_groups",
    "rpc": "messages.getCommonChats",
    "namespace": "messages",
    "signature": "await ctx.mutual_groups(user_id: InputUser, max_id: long, limit: int)",
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
        "required": false,
        "default": null
      },
      {
        "name": "limit",
        "type": "int",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Get chats in common with a user",
    "desc_ru": "Получить общие чаты с пользователем."
  },
  {
    "name": "set_dialog_pinned",
    "rpc": "messages.toggleDialogPin",
    "namespace": "messages",
    "signature": "await ctx.set_dialog_pinned(peer: InputDialogPeer)",
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
    "desc_en": "Pin/unpin a dialog",
    "desc_ru": "Закрепить или открепить диалог."
  },
  {
    "name": "reorder_dialog_pins",
    "rpc": "messages.reorderPinnedDialogs",
    "namespace": "messages",
    "signature": "await ctx.reorder_dialog_pins(folder_id: int, order: Vector<InputDialogPeer>)",
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
    "desc_en": "Reorder pinned dialogs",
    "desc_ru": "Изменить порядок закреплённых диалогов."
  },
  {
    "name": "pinned_dialogs",
    "rpc": "messages.getPinnedDialogs",
    "namespace": "messages",
    "signature": "await ctx.pinned_dialogs(folder_id: int)",
    "params": [
      {
        "name": "folder_id",
        "type": "int",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Get pinned dialogs",
    "desc_ru": "Получить закреплённые диалоги."
  },
  {
    "name": "unread_mentions",
    "rpc": "messages.getUnreadMentions",
    "namespace": "messages",
    "signature": "await ctx.unread_mentions(peer: InputPeer, offset_id: int, add_offset: int, limit: int, max_id: int, min_id: int)",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": false,
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
        "required": false,
        "default": null
      },
      {
        "name": "add_offset",
        "type": "int",
        "required": false,
        "default": null
      },
      {
        "name": "limit",
        "type": "int",
        "required": false,
        "default": null
      },
      {
        "name": "max_id",
        "type": "int",
        "required": false,
        "default": null
      },
      {
        "name": "min_id",
        "type": "int",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Get unread messages where we were mentioned",
    "desc_ru": "Получить непрочитанные сообщения, в которых нас упомянули."
  },
  {
    "name": "mark_mentions_read",
    "rpc": "messages.readMentions",
    "namespace": "messages",
    "signature": "await ctx.mark_mentions_read(peer: InputPeer)",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": false,
        "default": "$peer"
      },
      {
        "name": "top_msg_id",
        "type": "flags.0?int",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Mark mentions as read; can be used in forums but cannot be used in monoforums.",
    "desc_ru": "Отметить упоминания как прочитанные. Работает в форумах, но не в монфорумах."
  },
  {
    "name": "recent_live_locations",
    "rpc": "messages.getRecentLocations",
    "namespace": "messages",
    "signature": "await ctx.recent_live_locations(peer: InputPeer, limit: int, hash: long)",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": false,
        "default": "$peer"
      },
      {
        "name": "limit",
        "type": "int",
        "required": false,
        "default": null
      },
      {
        "name": "hash",
        "type": "long",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Get all recent live locations sent to a specific chat: returns up to 1 location message (messageMediaGeoLive) per chat participant.",
    "desc_ru": "Получить все недавние трансляции геопозиции в чате: не больше одного сообщения messageMediaGeoLive на каждого участника."
  },
  {
    "name": "set_dialog_unread",
    "rpc": "messages.markDialogUnread",
    "namespace": "messages",
    "signature": "await ctx.set_dialog_unread(peer: InputDialogPeer)",
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
    "desc_en": "Manually mark dialog as unread",
    "desc_ru": "Вручную отметить диалог непрочитанным."
  },
  {
    "name": "unread_dialog_marks",
    "rpc": "messages.getDialogUnreadMarks",
    "namespace": "messages",
    "signature": "await ctx.unread_dialog_marks()",
    "params": [
      {
        "name": "parent_peer",
        "type": "flags.0?InputPeer",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Get dialogs manually marked as unread",
    "desc_ru": "Получить диалоги, вручную отмеченные непрочитанными."
  },
  {
    "name": "clear_all_drafts",
    "rpc": "messages.clearAllDrafts",
    "namespace": "messages",
    "signature": "await ctx.clear_all_drafts()",
    "params": [
    ],
    "desc_en": "Clear all drafts.",
    "desc_ru": "Удалить все черновики."
  },
  {
    "name": "chat_online_count",
    "rpc": "messages.getOnlines",
    "namespace": "messages",
    "signature": "await ctx.chat_online_count(peer: InputPeer)",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": false,
        "default": "$peer"
      }
    ],
    "desc_en": "Get count of online users in a chat",
    "desc_ru": "Получить число пользователей в сети в чате."
  },
  {
    "name": "message_type_counts",
    "rpc": "messages.getSearchCounters",
    "namespace": "messages",
    "signature": "await ctx.message_type_counts(peer: InputPeer, filters: Vector<MessagesFilter>)",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": false,
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
    "desc_en": "Get the number of results that would be found by a messages.search call with the same parameters",
    "desc_ru": "Получить число результатов, которые нашёл бы вызов messages.search с теми же параметрами."
  },
  {
    "name": "dismiss_peer_settings_bar",
    "rpc": "messages.hidePeerSettingsBar",
    "namespace": "messages",
    "signature": "await ctx.dismiss_peer_settings_bar(peer: InputPeer)",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": false,
        "default": "$peer"
      }
    ],
    "desc_en": "Should be called after the user hides the report spam/add as contact bar of a new chat, effectively prevents the user from executing the actions specified in the action bar.",
    "desc_ru": "Вызывается после того, как пользователь скрыл панель пожаловаться на спам или добавить в контакты в новом чате, и запрещает выполнение действий этой панели."
  },
  {
    "name": "mark_discussion_read",
    "rpc": "messages.readDiscussion",
    "namespace": "messages",
    "signature": "await ctx.mark_discussion_read(peer: InputPeer, msg_id: int, read_max_id: int)",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": false,
        "default": "$peer"
      },
      {
        "name": "msg_id",
        "type": "int",
        "required": false,
        "default": "$message"
      },
      {
        "name": "read_max_id",
        "type": "int",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Mark a thread as read",
    "desc_ru": "Отметить ветку как прочитанную."
  },
  {
    "name": "unpin_all_chat_messages",
    "rpc": "messages.unpinAllMessages",
    "namespace": "messages",
    "signature": "await ctx.unpin_all_chat_messages(peer: InputPeer)",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": false,
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
    "desc_en": "Unpin all pinned messages",
    "desc_ru": "Открепить все закреплённые сообщения."
  },
  {
    "name": "message_readers",
    "rpc": "messages.getMessageReadParticipants",
    "namespace": "messages",
    "signature": "await ctx.message_readers(peer: InputPeer, msg_id: int)",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": false,
        "default": "$peer"
      },
      {
        "name": "msg_id",
        "type": "int",
        "required": false,
        "default": "$message"
      }
    ],
    "desc_en": "Get which users read a specific message: only available for groups and supergroups with less than chat_read_mark_size_threshold members, read receipts will be stored for chat_read_mark_expire_period seconds after the message was sent, see client configuration for more info.",
    "desc_ru": "Получить список пользователей, прочитавших конкретное сообщение. Доступно только для групп и супергрупп с числом участников меньше chat_read_mark_size_threshold; отметки о прочтении хранятся chat_read_mark_expire_period секунд после отправки."
  },
  {
    "name": "message_search_calendar",
    "rpc": "messages.getSearchResultsCalendar",
    "namespace": "messages",
    "signature": "await ctx.message_search_calendar(peer: InputPeer, filter: MessagesFilter, offset_id: int, offset_date: int)",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": false,
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
        "required": false,
        "default": null
      },
      {
        "name": "offset_id",
        "type": "int",
        "required": false,
        "default": null
      },
      {
        "name": "offset_date",
        "type": "int",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Returns information about the next messages of the specified type in the chat split by days. Returns the results in reverse chronological order. Can return partial results for the last returned day.",
    "desc_ru": "Вернуть сведения о следующих сообщениях указанного типа в чате с разбивкой по дням. Порядок обратный хронологический; для последнего дня результат может быть неполным."
  },
  {
    "name": "message_search_positions",
    "rpc": "messages.getSearchResultsPositions",
    "namespace": "messages",
    "signature": "await ctx.message_search_positions(peer: InputPeer, filter: MessagesFilter, offset_id: int, limit: int)",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": false,
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
        "required": false,
        "default": null
      },
      {
        "name": "offset_id",
        "type": "int",
        "required": false,
        "default": null
      },
      {
        "name": "limit",
        "type": "int",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Returns sparse positions of messages of the specified type in the chat to be used for shared media scroll implementation. Returns the results in reverse chronological order (i.e., in order of decreasing message_id).",
    "desc_ru": "Вернуть разреженные позиции сообщений указанного типа в чате для прокрутки общих медиа. Порядок обратный хронологический, по убыванию message_id."
  },
  {
    "name": "set_default_send_as",
    "rpc": "messages.saveDefaultSendAs",
    "namespace": "messages",
    "signature": "await ctx.set_default_send_as(peer: InputPeer, send_as: InputPeer)",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": false,
        "default": "$peer"
      },
      {
        "name": "send_as",
        "type": "InputPeer",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Change the default peer that should be used when sending messages, reactions, poll votes to a specific group",
    "desc_ru": "Задать собеседника по умолчанию для отправки сообщений, реакций и голосов в опросах в конкретной группе."
  },
  {
    "name": "sent_media_search",
    "rpc": "messages.searchSentMedia",
    "namespace": "messages",
    "signature": "await ctx.sent_media_search(q: string, filter: MessagesFilter, limit: int)",
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
        "required": false,
        "default": null
      },
      {
        "name": "limit",
        "type": "int",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "View and search recently sent media. This method does not support pagination.",
    "desc_ru": "Просмотреть и найти недавно отправленные медиа. Метод не поддерживает постраничность."
  },
  {
    "name": "outgoing_read_date",
    "rpc": "messages.getOutboxReadDate",
    "namespace": "messages",
    "signature": "await ctx.outgoing_read_date(peer: InputPeer, msg_id: int)",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": false,
        "default": "$peer"
      },
      {
        "name": "msg_id",
        "type": "int",
        "required": false,
        "default": "$message"
      }
    ],
    "desc_en": "Get the exact read date of one of our messages, sent to a private chat with another user. Can be only done for private outgoing messages not older than appConfig.pm_read_date_expire_period. If the peer's userFull.read_dates_private flag is set, we will not be able to fetch the exact read date of messages we send to them, and a USER_PRIVACY_RESTRICTED RPC error will be emitted. The exact read date of messages might still be unavailable for other reasons, see here for more info. To set userFull.read_dates_private for ourselves invoke account.setGlobalPrivacySettings, setting the settings.hide_read_marks flag.",
    "desc_ru": "Получить точную дату прочтения одного из исходящих сообщений в личном чате. Работает только для личных исходящих сообщений не старше appConfig.pm_read_date_expire_period. Если у собеседника установлен флаг userFull.read_dates_private, точную дату получить нельзя и вернётся ошибка USER_PRIVACY_RESTRICTED."
  },
  {
    "name": "channel_message_author",
    "rpc": "channels.getMessageAuthor",
    "namespace": "channels",
    "signature": "await ctx.channel_message_author(channel: InputChannel, id: int)",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": false,
        "default": "$peer"
      },
      {
        "name": "id",
        "type": "int",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Can only be invoked by non-bot admins of a monoforum, obtains the original sender of a message sent by other monoforum admins to the monoforum, on behalf of the channel associated to the monoforum.",
    "desc_ru": "Доступно только администраторам монфорума, кроме ботов. Возвращает исходного отправителя сообщения, отправленного другими администраторами монфорума от имени связанного с ним канала."
  },
  {
    "name": "move_dialogs_to_archive",
    "rpc": "folders.editPeerFolders",
    "namespace": "folders",
    "signature": "await ctx.move_dialogs_to_archive(folder_peers: Vector<InputFolderPeer>)",
    "params": [
      {
        "name": "folder_peers",
        "type": "Vector<InputFolderPeer>",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Edit peers in peer folder",
    "desc_ru": "Изменить папку, в которой лежат собеседники."
  },
  {
    "name": "chat_folders",
    "rpc": "messages.getDialogFilters",
    "namespace": "messages",
    "signature": "await ctx.chat_folders()",
    "params": [
    ],
    "desc_en": "Get folders",
    "desc_ru": "Получить папки."
  },
  {
    "name": "suggested_chat_folders",
    "rpc": "messages.getSuggestedDialogFilters",
    "namespace": "messages",
    "signature": "await ctx.suggested_chat_folders()",
    "params": [
    ],
    "desc_en": "Get suggested folders",
    "desc_ru": "Получить рекомендуемые папки."
  },
  {
    "name": "save_chat_folder",
    "rpc": "messages.updateDialogFilter",
    "namespace": "messages",
    "signature": "await ctx.save_chat_folder(id: int)",
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
    "desc_en": "Update folder",
    "desc_ru": "Обновить папку."
  },
  {
    "name": "reorder_chat_folders",
    "rpc": "messages.updateDialogFiltersOrder",
    "namespace": "messages",
    "signature": "await ctx.reorder_chat_folders(order: Vector<int>)",
    "params": [
      {
        "name": "order",
        "type": "Vector<int>",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Reorder folders",
    "desc_ru": "Изменить порядок папок."
  },
  {
    "name": "set_folder_tags_visible",
    "rpc": "messages.toggleDialogFilterTags",
    "namespace": "messages",
    "signature": "await ctx.set_folder_tags_visible(enabled: Bool)",
    "params": [
      {
        "name": "enabled",
        "type": "Bool",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Enable or disable folder tags.",
    "desc_ru": "Показать или скрыть теги папок."
  },
  {
    "name": "share_chat_folder",
    "rpc": "chatlists.exportChatlistInvite",
    "namespace": "chatlists",
    "signature": "await ctx.share_chat_folder(chatlist: InputChatlist, title: string, peers: Vector<InputPeer>)",
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
    "desc_en": "Export a folder, creating a chat folder deep link.",
    "desc_ru": "Экспортировать папку, создав ссылку на папку чатов."
  },
  {
    "name": "remove_folder_invite",
    "rpc": "chatlists.deleteExportedInvite",
    "namespace": "chatlists",
    "signature": "await ctx.remove_folder_invite(chatlist: InputChatlist, slug: string)",
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
    "desc_en": "Delete a previously created chat folder deep link.",
    "desc_ru": "Удалить ранее созданную ссылку на папку чатов."
  },
  {
    "name": "edit_folder_invite",
    "rpc": "chatlists.editExportedInvite",
    "namespace": "chatlists",
    "signature": "await ctx.edit_folder_invite(chatlist: InputChatlist, slug: string)",
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
    "desc_en": "Edit a chat folder deep link.",
    "desc_ru": "Изменить ссылку на папку чатов."
  },
  {
    "name": "folder_invites",
    "rpc": "chatlists.getExportedInvites",
    "namespace": "chatlists",
    "signature": "await ctx.folder_invites(chatlist: InputChatlist)",
    "params": [
      {
        "name": "chatlist",
        "type": "InputChatlist",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "List all chat folder deep links associated to a folder",
    "desc_ru": "Получить все ссылки на папку чатов, связанные с папкой."
  },
  {
    "name": "inspect_folder_invite",
    "rpc": "chatlists.checkChatlistInvite",
    "namespace": "chatlists",
    "signature": "await ctx.inspect_folder_invite(slug: string)",
    "params": [
      {
        "name": "slug",
        "type": "string",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Obtain information about a chat folder deep link.",
    "desc_ru": "Получить сведения о ссылке на папку чатов."
  },
  {
    "name": "join_folder_invite",
    "rpc": "chatlists.joinChatlistInvite",
    "namespace": "chatlists",
    "signature": "await ctx.join_folder_invite(slug: string, peers: Vector<InputPeer>)",
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
    "desc_en": "Import a chat folder deep link, joining some or all the chats in the folder.",
    "desc_ru": "Импортировать ссылку на папку чатов, присоединившись к некоторым или всем чатам в ней."
  },
  {
    "name": "folder_updates",
    "rpc": "chatlists.getChatlistUpdates",
    "namespace": "chatlists",
    "signature": "await ctx.folder_updates(chatlist: InputChatlist)",
    "params": [
      {
        "name": "chatlist",
        "type": "InputChatlist",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Fetch new chats associated with an imported chat folder deep link. Must be invoked at most every chatlist_update_period seconds (as per the related client configuration parameter ).",
    "desc_ru": "Получить новые чаты, связанные с импортированной ссылкой на папку чатов. Метод следует вызывать не чаще, чем раз в chatlist_update_period секунд."
  },
  {
    "name": "accept_folder_updates",
    "rpc": "chatlists.joinChatlistUpdates",
    "namespace": "chatlists",
    "signature": "await ctx.accept_folder_updates(chatlist: InputChatlist, peers: Vector<InputPeer>)",
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
    "desc_en": "Join channels and supergroups recently added to a chat folder deep link.",
    "desc_ru": "Присоединиться к каналам и супергруппам, недавно добавленным по ссылке на папку чатов."
  },
  {
    "name": "dismiss_folder_updates",
    "rpc": "chatlists.hideChatlistUpdates",
    "namespace": "chatlists",
    "signature": "await ctx.dismiss_folder_updates(chatlist: InputChatlist)",
    "params": [
      {
        "name": "chatlist",
        "type": "InputChatlist",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Dismiss new pending peers recently added to a chat folder deep link.",
    "desc_ru": "Отклонить новых ожидающих собеседников, добавленных по ссылке на папку чатов."
  },
  {
    "name": "folder_leave_suggestions",
    "rpc": "chatlists.getLeaveChatlistSuggestions",
    "namespace": "chatlists",
    "signature": "await ctx.folder_leave_suggestions(chatlist: InputChatlist)",
    "params": [
      {
        "name": "chatlist",
        "type": "InputChatlist",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Returns identifiers of pinned or always included chats from a chat folder imported using a chat folder deep link, which are suggested to be left when the chat folder is deleted.",
    "desc_ru": "Вернуть идентификаторы закреплённых или всегда включаемых чатов из импортированной папки, которые предлагается покинуть при её удалении."
  },
  {
    "name": "leave_shared_folder",
    "rpc": "chatlists.leaveChatlist",
    "namespace": "chatlists",
    "signature": "await ctx.leave_shared_folder(chatlist: InputChatlist, peers: Vector<InputPeer>)",
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
    "desc_en": "Delete a folder imported using a chat folder deep link",
    "desc_ru": "Удалить папку, импортированную по ссылке на папку чатов."
  },
  {
    "name": "edit_profile",
    "rpc": "account.updateProfile",
    "namespace": "account",
    "signature": "await ctx.edit_profile()",
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
    "desc_en": "Updates user profile.",
    "desc_ru": "Обновить профиль пользователя."
  },
  {
    "name": "set_online_status",
    "rpc": "account.updateStatus",
    "namespace": "account",
    "signature": "await ctx.set_online_status(offline: Bool)",
    "params": [
      {
        "name": "offline",
        "type": "Bool",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Updates online user status.",
    "desc_ru": "Обновить статус в сети."
  },
  {
    "name": "check_profile_username",
    "rpc": "account.checkUsername",
    "namespace": "account",
    "signature": "await ctx.check_profile_username(username: string)",
    "params": [
      {
        "name": "username",
        "type": "string",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Validates a username and checks availability.",
    "desc_ru": "Проверить корректность и доступность имени пользователя."
  },
  {
    "name": "set_profile_username",
    "rpc": "account.updateUsername",
    "namespace": "account",
    "signature": "await ctx.set_profile_username(username: string)",
    "params": [
      {
        "name": "username",
        "type": "string",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Changes username for the current user.",
    "desc_ru": "Изменить имя пользователя текущего аккаунта."
  },
  {
    "name": "privacy_rules",
    "rpc": "account.getPrivacy",
    "namespace": "account",
    "signature": "await ctx.privacy_rules(key: InputPrivacyKey)",
    "params": [
      {
        "name": "key",
        "type": "InputPrivacyKey",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Get privacy settings of current account",
    "desc_ru": "Получить настройки приватности текущего аккаунта."
  },
  {
    "name": "account_inactivity_ttl",
    "rpc": "account.getAccountTTL",
    "namespace": "account",
    "signature": "await ctx.account_inactivity_ttl()",
    "params": [
    ],
    "desc_en": "Get days to live of account",
    "desc_ru": "Получить срок жизни аккаунта в днях."
  },
  {
    "name": "set_emoji_status",
    "rpc": "account.updateEmojiStatus",
    "namespace": "account",
    "signature": "await ctx.set_emoji_status(emoji_status: EmojiStatus)",
    "params": [
      {
        "name": "emoji_status",
        "type": "EmojiStatus",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Set an emoji status",
    "desc_ru": "Задать эмодзи-статус."
  },
  {
    "name": "suggested_emoji_statuses",
    "rpc": "account.getDefaultEmojiStatuses",
    "namespace": "account",
    "signature": "await ctx.suggested_emoji_statuses(hash: long)",
    "params": [
      {
        "name": "hash",
        "type": "long",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Get a list of default suggested emoji statuses",
    "desc_ru": "Получить список эмодзи-статусов, рекомендуемых по умолчанию."
  },
  {
    "name": "recent_emoji_statuses",
    "rpc": "account.getRecentEmojiStatuses",
    "namespace": "account",
    "signature": "await ctx.recent_emoji_statuses(hash: long)",
    "params": [
      {
        "name": "hash",
        "type": "long",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Get recently used emoji statuses",
    "desc_ru": "Получить недавно использованные эмодзи-статусы."
  },
  {
    "name": "clear_recent_emoji_statuses",
    "rpc": "account.clearRecentEmojiStatuses",
    "namespace": "account",
    "signature": "await ctx.clear_recent_emoji_statuses()",
    "params": [
    ],
    "desc_en": "Clears list of recently used emoji statuses",
    "desc_ru": "Очистить список недавно использованных эмодзи-статусов."
  },
  {
    "name": "reorder_profile_usernames",
    "rpc": "account.reorderUsernames",
    "namespace": "account",
    "signature": "await ctx.reorder_profile_usernames(order: Vector<string>)",
    "params": [
      {
        "name": "order",
        "type": "Vector<string>",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Reorder usernames associated with the currently logged-in user.",
    "desc_ru": "Изменить порядок имён пользователей текущего аккаунта."
  },
  {
    "name": "set_profile_username_active",
    "rpc": "account.toggleUsername",
    "namespace": "account",
    "signature": "await ctx.set_profile_username_active(username: string, active: Bool)",
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
    "desc_en": "Activate or deactivate a purchased fragment.com username associated to the currently logged-in user.",
    "desc_ru": "Активировать или деактивировать купленное имя пользователя на fragment.com, привязанное к текущему аккаунту."
  },
  {
    "name": "profile_photo_emojis",
    "rpc": "account.getDefaultProfilePhotoEmojis",
    "namespace": "account",
    "signature": "await ctx.profile_photo_emojis(hash: long)",
    "params": [
      {
        "name": "hash",
        "type": "long",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Get a set of suggested custom emoji stickers that can be used as profile picture",
    "desc_ru": "Получить набор рекомендуемых стикеров кастомных эмодзи для использования как фото профиля."
  },
  {
    "name": "set_profile_color",
    "rpc": "account.updateColor",
    "namespace": "account",
    "signature": "await ctx.set_profile_color()",
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
    "desc_en": "Update the accent color and background custom emoji of the current account.",
    "desc_ru": "Обновить акцентный цвет и фоновый кастомный эмодзи текущего аккаунта."
  },
  {
    "name": "set_birthday",
    "rpc": "account.updateBirthday",
    "namespace": "account",
    "signature": "await ctx.set_birthday()",
    "params": [
      {
        "name": "birthday",
        "type": "flags.0?Birthday",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Update our birthday, see here for more info.",
    "desc_ru": "Обновить день рождения текущего аккаунта."
  },
  {
    "name": "set_personal_channel",
    "rpc": "account.updatePersonalChannel",
    "namespace": "account",
    "signature": "await ctx.set_personal_channel(channel: InputChannel)",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Associate (or remove) a personal channel, that will be listed on our personal profile page. Changing it will emit an updateUser update.",
    "desc_ru": "Привязать или отвязать личный канал, который показывается на странице профиля. Изменение вызывает обновление updateUser."
  },
  {
    "name": "set_profile_tab",
    "rpc": "account.setMainProfileTab",
    "namespace": "account",
    "signature": "await ctx.set_profile_tab(tab: ProfileTab)",
    "params": [
      {
        "name": "tab",
        "type": "ProfileTab",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Changes the main profile tab of the current user, see here for more info.",
    "desc_ru": "Изменить основную вкладку профиля текущего пользователя."
  },
  {
    "name": "set_music_saved",
    "rpc": "account.saveMusic",
    "namespace": "account",
    "signature": "await ctx.set_music_saved(id: InputDocument)",
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
    "desc_en": "Adds or removes a song from the current user's profile see here for more info on the music tab of the profile page.",
    "desc_ru": "Добавить или удалить трек из профиля текущего пользователя."
  },
  {
    "name": "saved_music_ids",
    "rpc": "account.getSavedMusicIds",
    "namespace": "account",
    "signature": "await ctx.saved_music_ids(hash: long)",
    "params": [
      {
        "name": "hash",
        "type": "long",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Fetch the full list of only the IDs of songs currently added to the profile, see here for more info.",
    "desc_ru": "Получить полный список идентификаторов треков, добавленных в профиль."
  },
  {
    "name": "user_details",
    "rpc": "users.getFullUser",
    "namespace": "users",
    "signature": "await ctx.user_details(id: InputUser)",
    "params": [
      {
        "name": "id",
        "type": "InputUser",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Returns extended user info by ID.",
    "desc_ru": "Вернуть расширенные сведения о пользователе по его ID."
  },
  {
    "name": "contact_requirements",
    "rpc": "users.getRequirementsToContact",
    "namespace": "users",
    "signature": "await ctx.contact_requirements(id: Vector<InputUser>)",
    "params": [
      {
        "name": "id",
        "type": "Vector<InputUser>",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Check whether we can write to the specified users, used to implement bulk checks for Premium-only messages and paid messages. For each input user, returns a RequirementToContact constructor (at the same offset in the vector) containing requirements to contact them.",
    "desc_ru": "Проверить, можно ли писать указанным пользователям. Нужен для массовых проверок сообщений только для Premium и платных сообщений. Для каждого пользователя возвращает конструктор RequirementToContact с требованиями к написанию."
  },
  {
    "name": "user_music",
    "rpc": "users.getSavedMusic",
    "namespace": "users",
    "signature": "await ctx.user_music(id: InputUser, offset: int, limit: int, hash: long)",
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
        "required": false,
        "default": null
      },
      {
        "name": "limit",
        "type": "int",
        "required": false,
        "default": null
      },
      {
        "name": "hash",
        "type": "long",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Get songs pinned to the user's profile, see here for more info.",
    "desc_ru": "Получить треки, закреплённые в профиле пользователя."
  },
  {
    "name": "user_music_by_documents",
    "rpc": "users.getSavedMusicByID",
    "namespace": "users",
    "signature": "await ctx.user_music_by_documents(id: InputUser, documents: Vector<InputDocument>)",
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
    "desc_en": "Check if the passed songs are still pinned to the user's profile, or refresh the file references of songs pinned on a user's profile see here for more info.",
    "desc_ru": "Проверить, закреплены ли переданные треки в профиле пользователя, либо обновить ссылки на файлы закреплённых треков."
  },
  {
    "name": "suggest_contact_birthday",
    "rpc": "users.suggestBirthday",
    "namespace": "users",
    "signature": "await ctx.suggest_contact_birthday(id: InputUser, birthday: Birthday)",
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
    "desc_en": "Suggest a birthday to another user, see here for more info on birthdays in the API.",
    "desc_ru": "Предложить другому пользователю день рождения."
  },
  {
    "name": "select_profile_photo",
    "rpc": "photos.updateProfilePhoto",
    "namespace": "photos",
    "signature": "await ctx.select_profile_photo(id: InputPhoto)",
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
    "desc_en": "Installs a previously uploaded photo as a profile photo.",
    "desc_ru": "Установить ранее загруженную фотографию как фото профиля."
  },
  {
    "name": "upload_profile_photo",
    "rpc": "photos.uploadProfilePhoto",
    "namespace": "photos",
    "signature": "await ctx.upload_profile_photo()",
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
    "desc_en": "Updates current user profile photo. The file, video and video_emoji_markup flags are mutually exclusive.",
    "desc_ru": "Обновить фото профиля текущего пользователя. Флаги file, video и video_emoji_markup взаимоисключающи."
  },
  {
    "name": "remove_profile_photos",
    "rpc": "photos.deletePhotos",
    "namespace": "photos",
    "signature": "await ctx.remove_profile_photos(id: Vector<InputPhoto>)",
    "params": [
      {
        "name": "id",
        "type": "Vector<InputPhoto>",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Deletes profile photos. The method returns a list of successfully deleted photo IDs.",
    "desc_ru": "Удалить фотографии профиля. Возвращает список идентификаторов удалённых фотографий."
  },
  {
    "name": "profile_photos",
    "rpc": "photos.getUserPhotos",
    "namespace": "photos",
    "signature": "await ctx.profile_photos(user_id: InputUser, offset: int, max_id: long, limit: int)",
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
        "required": false,
        "default": null
      },
      {
        "name": "max_id",
        "type": "long",
        "required": false,
        "default": null
      },
      {
        "name": "limit",
        "type": "int",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Returns the list of user photos.",
    "desc_ru": "Вернуть список фотографий пользователя."
  },
  {
    "name": "set_contact_photo",
    "rpc": "photos.uploadContactProfilePhoto",
    "namespace": "photos",
    "signature": "await ctx.set_contact_photo(user_id: InputUser)",
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
    "desc_en": "Upload a custom profile picture for a contact, or suggest a new profile picture to a contact. The file, video and video_emoji_markup flags are mutually exclusive.",
    "desc_ru": "Загрузить своё фото для контакта или предложить контакту новое. Флаги file, video и video_emoji_markup взаимоисключающи."
  },
  {
    "name": "notification_settings",
    "rpc": "account.getNotifySettings",
    "namespace": "account",
    "signature": "await ctx.notification_settings(peer: InputNotifyPeer)",
    "params": [
      {
        "name": "peer",
        "type": "InputNotifyPeer",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Gets current notification settings for a given user/group, from all users/all groups.",
    "desc_ru": "Получить текущие настройки уведомлений для указанного пользователя или группы, либо для всех пользователей и групп."
  },
  {
    "name": "set_notification_settings",
    "rpc": "account.updateNotifySettings",
    "namespace": "account",
    "signature": "await ctx.set_notification_settings(peer: InputNotifyPeer, settings: InputPeerNotifySettings)",
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
    "desc_en": "Edits notification settings from a given user/group, from all users/all groups.",
    "desc_ru": "Изменить настройки уведомлений для указанного пользователя или группы, либо для всех пользователей и групп."
  },
  {
    "name": "reset_notification_settings",
    "rpc": "account.resetNotifySettings",
    "namespace": "account",
    "signature": "await ctx.reset_notification_settings()",
    "params": [
    ],
    "desc_en": "Resets all notification settings from users and groups.",
    "desc_ru": "Сбросить все настройки уведомлений пользователей и групп."
  },
  {
    "name": "contact_signup_notifications",
    "rpc": "account.getContactSignUpNotification",
    "namespace": "account",
    "signature": "await ctx.contact_signup_notifications()",
    "params": [
    ],
    "desc_en": "Whether the user will receive notifications when contacts sign up",
    "desc_ru": "Будут ли приходить уведомления, когда контакты регистрируются в Telegram."
  },
  {
    "name": "set_contact_signup_notifications",
    "rpc": "account.setContactSignUpNotification",
    "namespace": "account",
    "signature": "await ctx.set_contact_signup_notifications(silent: Bool)",
    "params": [
      {
        "name": "silent",
        "type": "Bool",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Toggle contact sign up notifications",
    "desc_ru": "Включить или выключить уведомления о контактах, зарегистрировавшихся в Telegram."
  },
  {
    "name": "notification_exceptions",
    "rpc": "account.getNotifyExceptions",
    "namespace": "account",
    "signature": "await ctx.notification_exceptions()",
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
    "desc_en": "Returns list of chats with non-default notification settings",
    "desc_ru": "Вернуть список чатов с нестандартными настройками уведомлений."
  },
  {
    "name": "reaction_notification_settings",
    "rpc": "account.getReactionsNotifySettings",
    "namespace": "account",
    "signature": "await ctx.reaction_notification_settings()",
    "params": [
    ],
    "desc_en": "Get the current reaction notification settings.",
    "desc_ru": "Получить текущие настройки уведомлений о реакциях."
  },
  {
    "name": "set_reaction_notification_settings",
    "rpc": "account.setReactionsNotifySettings",
    "namespace": "account",
    "signature": "await ctx.set_reaction_notification_settings(settings: ReactionsNotifySettings)",
    "params": [
      {
        "name": "settings",
        "type": "ReactionsNotifySettings",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Change the reaction notification settings.",
    "desc_ru": "Изменить настройки уведомлений о реакциях."
  },
  {
    "name": "saved_notification_sounds",
    "rpc": "account.getSavedRingtones",
    "namespace": "account",
    "signature": "await ctx.saved_notification_sounds(hash: long)",
    "params": [
      {
        "name": "hash",
        "type": "long",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Fetch saved notification sounds",
    "desc_ru": "Получить сохранённые звуки уведомлений."
  },
  {
    "name": "set_notification_sound_saved",
    "rpc": "account.saveRingtone",
    "namespace": "account",
    "signature": "await ctx.set_notification_sound_saved(id: InputDocument, unsave: Bool)",
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
    "desc_en": "Save or remove saved notification sound. If the notification sound is already in MP3 format, account.savedRingtone will be returned. Otherwise, it will be automatically converted and a account.savedRingtoneConverted will be returned, containing a new document object that should be used to refer to the ringtone from now on (ie when deleting it using the unsave parameter, or when downloading it).",
    "desc_ru": "Сохранить или удалить звук уведомления. Если звук уже в MP3, вернётся account.savedRingtone, иначе он будет сконвертирован и вернётся account.savedRingtoneConverted с новым документом."
  },
  {
    "name": "upload_notification_sound",
    "rpc": "account.uploadRingtone",
    "namespace": "account",
    "signature": "await ctx.upload_notification_sound(file: InputFile, file_name: string, mime_type: string)",
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
    "desc_en": "Upload notification sound, use account.saveRingtone to convert it and add it to the list of saved notification sounds.",
    "desc_ru": "Загрузить звук уведомления. Чтобы добавить его в список сохранённых, используйте account.saveRingtone."
  },
  {
    "name": "rename_basic_group",
    "rpc": "messages.editChatTitle",
    "namespace": "messages",
    "signature": "await ctx.rename_basic_group(chat_id: long, title: string)",
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
    "desc_en": "Changes chat name and sends a service message on it.",
    "desc_ru": "Изменить название чата и отправить служебное сообщение."
  },
  {
    "name": "set_basic_group_photo",
    "rpc": "messages.editChatPhoto",
    "namespace": "messages",
    "signature": "await ctx.set_basic_group_photo(chat_id: long, photo: InputChatPhoto)",
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
    "desc_en": "Changes chat photo and sends a service message on it",
    "desc_ru": "Изменить фото чата и отправить служебное сообщение."
  },
  {
    "name": "add_basic_group_member",
    "rpc": "messages.addChatUser",
    "namespace": "messages",
    "signature": "await ctx.add_basic_group_member(chat_id: long, user_id: InputUser, fwd_limit: int)",
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
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Adds a user to a chat and sends a service message on it.",
    "desc_ru": "Добавить пользователя в чат и отправить служебное сообщение."
  },
  {
    "name": "remove_basic_group_member",
    "rpc": "messages.deleteChatUser",
    "namespace": "messages",
    "signature": "await ctx.remove_basic_group_member(chat_id: long, user_id: InputUser)",
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
    "desc_en": "Deletes a user from a chat and sends a service message on it.",
    "desc_ru": "Удалить пользователя из чата и отправить служебное сообщение."
  },
  {
    "name": "create_basic_group",
    "rpc": "messages.createChat",
    "namespace": "messages",
    "signature": "await ctx.create_basic_group(users: Vector<InputUser>, title: string)",
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
    "desc_en": "Creates a new chat.",
    "desc_ru": "Создать новый чат."
  },
  {
    "name": "set_basic_group_admin",
    "rpc": "messages.editChatAdmin",
    "namespace": "messages",
    "signature": "await ctx.set_basic_group_admin(chat_id: long, user_id: InputUser, is_admin: Bool)",
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
    "desc_en": "Make a user admin in a basic group.",
    "desc_ru": "Назначить пользователя администратором базовой группы."
  },
  {
    "name": "upgrade_basic_group",
    "rpc": "messages.migrateChat",
    "namespace": "messages",
    "signature": "await ctx.upgrade_basic_group(chat_id: long)",
    "params": [
      {
        "name": "chat_id",
        "type": "long",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Turn a basic group into a supergroup",
    "desc_ru": "Превратить базовую группу в супергруппу."
  },
  {
    "name": "edit_chat_description",
    "rpc": "messages.editChatAbout",
    "namespace": "messages",
    "signature": "await ctx.edit_chat_description(peer: InputPeer, about: string)",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": false,
        "default": "$peer"
      },
      {
        "name": "about",
        "type": "string",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Edit the description of a group/supergroup/channel.",
    "desc_ru": "Изменить описание группы, супергруппы или канала."
  },
  {
    "name": "set_default_member_restrictions",
    "rpc": "messages.editChatDefaultBannedRights",
    "namespace": "messages",
    "signature": "await ctx.set_default_member_restrictions(peer: InputPeer, banned_rights: ChatBannedRights)",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": false,
        "default": "$peer"
      },
      {
        "name": "banned_rights",
        "type": "ChatBannedRights",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Edit the default banned rights of a channel/supergroup/group.",
    "desc_ru": "Изменить права по умолчанию для участников канала, супергруппы или группы."
  },
  {
    "name": "remove_basic_group",
    "rpc": "messages.deleteChat",
    "namespace": "messages",
    "signature": "await ctx.remove_basic_group(chat_id: long)",
    "params": [
      {
        "name": "chat_id",
        "type": "long",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Delete a chat",
    "desc_ru": "Удалить чат."
  },
  {
    "name": "set_chat_auto_delete",
    "rpc": "messages.setHistoryTTL",
    "namespace": "messages",
    "signature": "await ctx.set_chat_auto_delete(peer: InputPeer, period: int)",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": false,
        "default": "$peer"
      },
      {
        "name": "period",
        "type": "int",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Set maximum Time-To-Live of all messages in the specified chat",
    "desc_ru": "Задать максимальный срок жизни сообщений в указанном чате."
  },
  {
    "name": "set_content_protection",
    "rpc": "messages.toggleNoForwards",
    "namespace": "messages",
    "signature": "await ctx.set_content_protection(peer: InputPeer, enabled: Bool)",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": false,
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
    "desc_en": "Enable or disable content protection on a channel, group or private chat.",
    "desc_ru": "Включить или выключить защиту содержимого в канале, группе или личном чате."
  },
  {
    "name": "mark_channel_read",
    "rpc": "channels.readHistory",
    "namespace": "channels",
    "signature": "await ctx.mark_channel_read(channel: InputChannel, max_id: int)",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": false,
        "default": "$peer"
      },
      {
        "name": "max_id",
        "type": "int",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Mark channel/supergroup history as read",
    "desc_ru": "Отметить историю канала или супергруппы как прочитанную."
  },
  {
    "name": "channel_members",
    "rpc": "channels.getParticipants",
    "namespace": "channels",
    "signature": "await ctx.channel_members(channel: InputChannel, filter: ChannelParticipantsFilter, offset: int, limit: int, hash: long)",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": false,
        "default": "$peer"
      },
      {
        "name": "filter",
        "type": "ChannelParticipantsFilter",
        "required": false,
        "default": null
      },
      {
        "name": "offset",
        "type": "int",
        "required": false,
        "default": null
      },
      {
        "name": "limit",
        "type": "int",
        "required": false,
        "default": null
      },
      {
        "name": "hash",
        "type": "long",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Get the participants of a supergroup/channel",
    "desc_ru": "Получить участников супергруппы или канала."
  },
  {
    "name": "channel_member",
    "rpc": "channels.getParticipant",
    "namespace": "channels",
    "signature": "await ctx.channel_member(channel: InputChannel, participant: InputPeer)",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": false,
        "default": "$peer"
      },
      {
        "name": "participant",
        "type": "InputPeer",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Get info about a channel/supergroup participant",
    "desc_ru": "Получить сведения об участнике канала или супергруппы."
  },
  {
    "name": "channel_details",
    "rpc": "channels.getFullChannel",
    "namespace": "channels",
    "signature": "await ctx.channel_details(channel: InputChannel)",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": false,
        "default": "$peer"
      }
    ],
    "desc_en": "Get full info about a supergroup, gigagroup or channel",
    "desc_ru": "Получить полные сведения о супергруппе, гигагруппе или канале."
  },
  {
    "name": "create_channel",
    "rpc": "channels.createChannel",
    "namespace": "channels",
    "signature": "await ctx.create_channel(title: string, about: string)",
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
    "desc_en": "Create a supergroup/channel.",
    "desc_ru": "Создать супергруппу или канал."
  },
  {
    "name": "set_channel_admin",
    "rpc": "channels.editAdmin",
    "namespace": "channels",
    "signature": "await ctx.set_channel_admin(channel: InputChannel, user_id: InputUser, admin_rights: ChatAdminRights)",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": false,
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
    "desc_en": "Modify the admin rights of a user in a supergroup/channel.",
    "desc_ru": "Изменить права администратора пользователя в супергруппе или канале."
  },
  {
    "name": "rename_channel",
    "rpc": "channels.editTitle",
    "namespace": "channels",
    "signature": "await ctx.rename_channel(channel: InputChannel, title: string)",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": false,
        "default": "$peer"
      },
      {
        "name": "title",
        "type": "string",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Edit the name of a channel/supergroup",
    "desc_ru": "Изменить название канала или супергруппы."
  },
  {
    "name": "set_channel_photo",
    "rpc": "channels.editPhoto",
    "namespace": "channels",
    "signature": "await ctx.set_channel_photo(channel: InputChannel, photo: InputChatPhoto)",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": false,
        "default": "$peer"
      },
      {
        "name": "photo",
        "type": "InputChatPhoto",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Change the photo of a channel/supergroup",
    "desc_ru": "Изменить фото канала или супергруппы."
  },
  {
    "name": "check_channel_username",
    "rpc": "channels.checkUsername",
    "namespace": "channels",
    "signature": "await ctx.check_channel_username(channel: InputChannel, username: string)",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": false,
        "default": "$peer"
      },
      {
        "name": "username",
        "type": "string",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Check if a username is free and can be assigned to a channel/supergroup",
    "desc_ru": "Проверить, свободно ли имя пользователя и можно ли назначить его каналу или супергруппе."
  },
  {
    "name": "set_channel_username",
    "rpc": "channels.updateUsername",
    "namespace": "channels",
    "signature": "await ctx.set_channel_username(channel: InputChannel, username: string)",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": false,
        "default": "$peer"
      },
      {
        "name": "username",
        "type": "string",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Change or remove the username of a supergroup/channel",
    "desc_ru": "Изменить или снять имя пользователя супергруппы или канала."
  },
  {
    "name": "join_channel",
    "rpc": "channels.joinChannel",
    "namespace": "channels",
    "signature": "await ctx.join_channel(channel: InputChannel)",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": false,
        "default": "$peer"
      }
    ],
    "desc_en": "Join a channel/supergroup",
    "desc_ru": "Вступить в канал или супергруппу."
  },
  {
    "name": "leave_channel",
    "rpc": "channels.leaveChannel",
    "namespace": "channels",
    "signature": "await ctx.leave_channel(channel: InputChannel)",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": false,
        "default": "$peer"
      }
    ],
    "desc_en": "Leave a channel/supergroup",
    "desc_ru": "Покинуть канал или супергруппу."
  },
  {
    "name": "invite_channel_members",
    "rpc": "channels.inviteToChannel",
    "namespace": "channels",
    "signature": "await ctx.invite_channel_members(channel: InputChannel, users: Vector<InputUser>)",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": false,
        "default": "$peer"
      },
      {
        "name": "users",
        "type": "Vector<InputUser>",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Invite users to a channel/supergroup",
    "desc_ru": "Пригласить пользователей в канал или супергруппу."
  },
  {
    "name": "remove_channel",
    "rpc": "channels.deleteChannel",
    "namespace": "channels",
    "signature": "await ctx.remove_channel(channel: InputChannel)",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": false,
        "default": "$peer"
      }
    ],
    "desc_en": "Delete a channel/supergroup",
    "desc_ru": "Удалить канал или супергруппу."
  },
  {
    "name": "set_channel_signatures",
    "rpc": "channels.toggleSignatures",
    "namespace": "channels",
    "signature": "await ctx.set_channel_signatures(channel: InputChannel)",
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
        "required": false,
        "default": "$peer"
      }
    ],
    "desc_en": "Enable/disable message signatures in channels",
    "desc_ru": "Включить или выключить подписи сообщений в каналах."
  },
  {
    "name": "owned_public_channels",
    "rpc": "channels.getAdminedPublicChannels",
    "namespace": "channels",
    "signature": "await ctx.owned_public_channels()",
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
    "desc_en": "Get channels/supergroups/geogroups we're admin in. Usually called when the user exceeds the limit for owned public channels/supergroups/geogroups, and the user is given the choice to remove one of his channels/supergroups/geogroups.",
    "desc_ru": "Получить каналы, супергруппы и геогруппы, где мы администратор. Обычно вызывается, когда пользователь превысил лимит публичных каналов и должен выбрать, какой удалить."
  },
  {
    "name": "restrict_channel_member",
    "rpc": "channels.editBanned",
    "namespace": "channels",
    "signature": "await ctx.restrict_channel_member(channel: InputChannel, participant: InputPeer, banned_rights: ChatBannedRights)",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": false,
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
    "desc_en": "Ban/unban/kick a user in a supergroup/channel.",
    "desc_ru": "Забанить, разбанить или исключить пользователя в супергруппе или канале."
  },
  {
    "name": "channel_admin_log",
    "rpc": "channels.getAdminLog",
    "namespace": "channels",
    "signature": "await ctx.channel_admin_log(channel: InputChannel, q: string, max_id: long, min_id: long, limit: int)",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": false,
        "default": "$peer"
      },
      {
        "name": "q",
        "type": "string",
        "required": false,
        "default": null
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
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Get the admin log of a channel/supergroup",
    "desc_ru": "Получить журнал администраторов канала или супергруппы."
  },
  {
    "name": "set_group_sticker_set",
    "rpc": "channels.setStickers",
    "namespace": "channels",
    "signature": "await ctx.set_group_sticker_set(channel: InputChannel, stickerset: InputStickerSet)",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": false,
        "default": "$peer"
      },
      {
        "name": "stickerset",
        "type": "InputStickerSet",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Associate a stickerset to the supergroup",
    "desc_ru": "Назначить набор стикеров супергруппе."
  },
  {
    "name": "mark_channel_media_read",
    "rpc": "channels.readMessageContents",
    "namespace": "channels",
    "signature": "await ctx.mark_channel_media_read(channel: InputChannel, id: Vector<int>)",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": false,
        "default": "$peer"
      },
      {
        "name": "id",
        "type": "Vector<int>",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Mark channel/supergroup message contents as read, emitting an updateChannelReadMessagesContents.",
    "desc_ru": "Отметить содержимое сообщений канала или супергруппы как прочитанное. Вызывается обновление updateChannelReadMessagesContents."
  },
  {
    "name": "clear_channel_history",
    "rpc": "channels.deleteHistory",
    "namespace": "channels",
    "signature": "await ctx.clear_channel_history(channel: InputChannel, max_id: int)",
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
        "required": false,
        "default": "$peer"
      },
      {
        "name": "max_id",
        "type": "int",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Delete the history of a supergroup",
    "desc_ru": "Удалить историю супергруппы."
  },
  {
    "name": "set_prehistory_hidden",
    "rpc": "channels.togglePreHistoryHidden",
    "namespace": "channels",
    "signature": "await ctx.set_prehistory_hidden(channel: InputChannel, enabled: Bool)",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": false,
        "default": "$peer"
      },
      {
        "name": "enabled",
        "type": "Bool",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Hide/unhide message history for new channel/supergroup users",
    "desc_ru": "Скрыть или показать историю сообщений для новых участников канала или супергруппы."
  },
  {
    "name": "left_channels",
    "rpc": "channels.getLeftChannels",
    "namespace": "channels",
    "signature": "await ctx.left_channels(offset: int)",
    "params": [
      {
        "name": "offset",
        "type": "int",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Get a list of channels/supergroups we left, requires a takeout session, see here for more info.",
    "desc_ru": "Получить список каналов и супергрупп, из которых мы вышли. Требуется сессия выгрузки данных."
  },
  {
    "name": "eligible_discussion_groups",
    "rpc": "channels.getGroupsForDiscussion",
    "namespace": "channels",
    "signature": "await ctx.eligible_discussion_groups()",
    "params": [
    ],
    "desc_en": "Get all groups that can be used as discussion groups. Returned basic group chats must be first upgraded to supergroups before they can be set as a discussion group. To set a returned supergroup as a discussion group, access to its old messages must be enabled using channels.togglePreHistoryHidden, first.",
    "desc_ru": "Получить все группы, которые можно назначить обсуждением. Базовую группу сначала нужно повысить до супергруппы, а для супергруппы открыть доступ к старым сообщениям через channels.togglePreHistoryHidden."
  },
  {
    "name": "set_discussion_group",
    "rpc": "channels.setDiscussionGroup",
    "namespace": "channels",
    "signature": "await ctx.set_discussion_group(broadcast: InputChannel, group: InputChannel)",
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
    "desc_en": "Associate a group to a channel as discussion group for that channel",
    "desc_ru": "Назначить группу обсуждением для канала."
  },
  {
    "name": "set_group_location",
    "rpc": "channels.editLocation",
    "namespace": "channels",
    "signature": "await ctx.set_group_location(channel: InputChannel, geo_point: InputGeoPoint, address: string)",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": false,
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
    "desc_en": "Edit location of geogroup, see here for more info on geogroups.",
    "desc_ru": "Изменить местоположение геогруппы."
  },
  {
    "name": "set_slow_mode",
    "rpc": "channels.toggleSlowMode",
    "namespace": "channels",
    "signature": "await ctx.set_slow_mode(channel: InputChannel, seconds: int)",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": false,
        "default": "$peer"
      },
      {
        "name": "seconds",
        "type": "int",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Toggle supergroup slow mode: if enabled, users will only be able to send one message every seconds seconds",
    "desc_ru": "Включить или выключить медленный режим в супергруппе: пользователи смогут отправлять одно сообщение в seconds секунд."
  },
  {
    "name": "inactive_channels",
    "rpc": "channels.getInactiveChannels",
    "namespace": "channels",
    "signature": "await ctx.inactive_channels()",
    "params": [
    ],
    "desc_en": "Get inactive channels and supergroups",
    "desc_ru": "Получить неактивные каналы и супергруппы."
  },
  {
    "name": "send_as_identities",
    "rpc": "channels.getSendAs",
    "namespace": "channels",
    "signature": "await ctx.send_as_identities(peer: InputPeer)",
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
        "required": false,
        "default": "$peer"
      }
    ],
    "desc_en": "Obtains a list of peers that can be displayed as the sender in a specific context. With for_live_stories, returns peers that may author live story in-call messages.",
    "desc_ru": "Получить список собеседников, которых можно показать как отправителя в конкретном контексте. С флагом for_live_stories возвращает тех, кто может публиковать сообщения в звонках в трансляции."
  },
  {
    "name": "remove_member_history",
    "rpc": "channels.deleteParticipantHistory",
    "namespace": "channels",
    "signature": "await ctx.remove_member_history(channel: InputChannel, participant: InputPeer)",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": false,
        "default": "$peer"
      },
      {
        "name": "participant",
        "type": "InputPeer",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Delete all messages sent by a specific participant of a given supergroup",
    "desc_ru": "Удалить все сообщения, отправленные конкретным участником супергруппы."
  },
  {
    "name": "set_join_to_send",
    "rpc": "channels.toggleJoinToSend",
    "namespace": "channels",
    "signature": "await ctx.set_join_to_send(channel: InputChannel, enabled: Bool)",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": false,
        "default": "$peer"
      },
      {
        "name": "enabled",
        "type": "Bool",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Set whether all users should join a discussion group in order to comment on a post",
    "desc_ru": "Задать, должны ли все пользователи вступать в группу обсуждения, чтобы комментировать публикацию."
  },
  {
    "name": "set_join_requests",
    "rpc": "channels.toggleJoinRequest",
    "namespace": "channels",
    "signature": "await ctx.set_join_requests(channel: InputChannel, enabled: Bool)",
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
        "required": false,
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
    "desc_en": "Set whether all users should request admin approval to join the group.",
    "desc_ru": "Задать, должны ли все пользователи отправлять заявку на одобрение администратора для вступления в группу."
  },
  {
    "name": "reorder_channel_usernames",
    "rpc": "channels.reorderUsernames",
    "namespace": "channels",
    "signature": "await ctx.reorder_channel_usernames(channel: InputChannel, order: Vector<string>)",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": false,
        "default": "$peer"
      },
      {
        "name": "order",
        "type": "Vector<string>",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Reorder active usernames",
    "desc_ru": "Изменить порядок активных имён пользователей."
  },
  {
    "name": "set_channel_username_active",
    "rpc": "channels.toggleUsername",
    "namespace": "channels",
    "signature": "await ctx.set_channel_username_active(channel: InputChannel, username: string, active: Bool)",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": false,
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
    "desc_en": "Activate or deactivate a purchased fragment.com username associated to a supergroup or channel we own.",
    "desc_ru": "Активировать или деактивировать купленное имя пользователя на fragment.com, привязанное к супергруппе или каналу."
  },
  {
    "name": "deactivate_channel_usernames",
    "rpc": "channels.deactivateAllUsernames",
    "namespace": "channels",
    "signature": "await ctx.deactivate_channel_usernames(channel: InputChannel)",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": false,
        "default": "$peer"
      }
    ],
    "desc_en": "Disable all purchased usernames of a supergroup or channel",
    "desc_ru": "Отключить все купленные имена пользователей супергруппы или канала."
  },
  {
    "name": "set_antispam",
    "rpc": "channels.toggleAntiSpam",
    "namespace": "channels",
    "signature": "await ctx.set_antispam(channel: InputChannel, enabled: Bool)",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": false,
        "default": "$peer"
      },
      {
        "name": "enabled",
        "type": "Bool",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Enable or disable the native antispam system.",
    "desc_ru": "Включить или выключить встроенную систему антиспама."
  },
  {
    "name": "set_members_hidden",
    "rpc": "channels.toggleParticipantsHidden",
    "namespace": "channels",
    "signature": "await ctx.set_members_hidden(channel: InputChannel, enabled: Bool)",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": false,
        "default": "$peer"
      },
      {
        "name": "enabled",
        "type": "Bool",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Hide or display the participants list in a supergroup. The supergroup must have at least hidden_members_group_size_min participants in order to use this method, as specified by the client configuration parameters.",
    "desc_ru": "Скрыть или показать список участников супергруппы. В supergroup должно быть не меньше hidden_members_group_size_min участников."
  },
  {
    "name": "set_channel_color",
    "rpc": "channels.updateColor",
    "namespace": "channels",
    "signature": "await ctx.set_channel_color(channel: InputChannel)",
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
        "required": false,
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
    "desc_en": "Update the accent color and background custom emoji of a channel.",
    "desc_ru": "Обновить акцентный цвет и фоновый кастомный эмодзи канала."
  },
  {
    "name": "related_channels",
    "rpc": "channels.getChannelRecommendations",
    "namespace": "channels",
    "signature": "await ctx.related_channels()",
    "params": [
      {
        "name": "channel",
        "type": "flags.0?InputChannel",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Obtain a list of similarly themed public channels, selected based on similarities in their subscriber bases.",
    "desc_ru": "Получить список публичных каналов со схожей тематикой, отобранных по сходству баз подписчиков."
  },
  {
    "name": "set_channel_emoji_status",
    "rpc": "channels.updateEmojiStatus",
    "namespace": "channels",
    "signature": "await ctx.set_channel_emoji_status(channel: InputChannel, emoji_status: EmojiStatus)",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": false,
        "default": "$peer"
      },
      {
        "name": "emoji_status",
        "type": "EmojiStatus",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Set an emoji status for a channel or supergroup.",
    "desc_ru": "Задать эмодзи-статус для канала или супергруппы."
  },
  {
    "name": "set_group_emoji_set",
    "rpc": "channels.setEmojiStickers",
    "namespace": "channels",
    "signature": "await ctx.set_group_emoji_set(channel: InputChannel, stickerset: InputStickerSet)",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": false,
        "default": "$peer"
      },
      {
        "name": "stickerset",
        "type": "InputStickerSet",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Set a custom emoji stickerset for supergroups. Only usable after reaching at least the boost level specified in the group_emoji_stickers_level_min config parameter.",
    "desc_ru": "Задать набор стикеров кастомных эмодзи для супергруппы. Доступно только после достижения уровня буста, заданного параметром group_emoji_stickers_level_min."
  },
  {
    "name": "set_channel_auto_translation",
    "rpc": "channels.toggleAutotranslation",
    "namespace": "channels",
    "signature": "await ctx.set_channel_auto_translation(channel: InputChannel, enabled: Bool)",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": false,
        "default": "$peer"
      },
      {
        "name": "enabled",
        "type": "Bool",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Toggle autotranslation in a channel, for all users: see here for more info.",
    "desc_ru": "Включить или выключить автоперевод в канале для всех пользователей."
  },
  {
    "name": "set_channel_profile_tab",
    "rpc": "channels.setMainProfileTab",
    "namespace": "channels",
    "signature": "await ctx.set_channel_profile_tab(channel: InputChannel, tab: ProfileTab)",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": false,
        "default": "$peer"
      },
      {
        "name": "tab",
        "type": "ProfileTab",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Changes the main profile tab of a channel, see here for more info.",
    "desc_ru": "Изменить основную вкладку профиля канала."
  },
  {
    "name": "edit_member_rank",
    "rpc": "messages.editChatParticipantRank",
    "namespace": "messages",
    "signature": "await ctx.edit_member_rank(peer: InputPeer, participant: InputPeer, rank: string)",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": false,
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
    "desc_en": "Edit a group participant's tag.",
    "desc_ru": "Изменить тег участника группы."
  },
  {
    "name": "create_chat_invite",
    "rpc": "messages.exportChatInvite",
    "namespace": "messages",
    "signature": "await ctx.create_chat_invite(peer: InputPeer)",
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
        "required": false,
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
      }
    ],
    "desc_en": "Export an invite link for a chat",
    "desc_ru": "Экспортировать ссылку-приглашение в чат."
  },
  {
    "name": "chat_invites",
    "rpc": "messages.getExportedChatInvites",
    "namespace": "messages",
    "signature": "await ctx.chat_invites(peer: InputPeer, admin_id: InputUser, limit: int)",
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
        "required": false,
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
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Get info about the chat invites of a specific chat",
    "desc_ru": "Получить сведения о приглашениях в конкретный чат."
  },
  {
    "name": "chat_invite_details",
    "rpc": "messages.getExportedChatInvite",
    "namespace": "messages",
    "signature": "await ctx.chat_invite_details(peer: InputPeer, link: string)",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": false,
        "default": "$peer"
      },
      {
        "name": "link",
        "type": "string",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Get info about a chat invite",
    "desc_ru": "Получить сведения о приглашении в чат."
  },
  {
    "name": "edit_chat_invite",
    "rpc": "messages.editExportedChatInvite",
    "namespace": "messages",
    "signature": "await ctx.edit_chat_invite(peer: InputPeer, link: string)",
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
        "required": false,
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
    "desc_en": "Edit an exported chat invite",
    "desc_ru": "Изменить экспортированное приглашение в чат."
  },
  {
    "name": "purge_revoked_chat_invites",
    "rpc": "messages.deleteRevokedExportedChatInvites",
    "namespace": "messages",
    "signature": "await ctx.purge_revoked_chat_invites(peer: InputPeer, admin_id: InputUser)",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": false,
        "default": "$peer"
      },
      {
        "name": "admin_id",
        "type": "InputUser",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Delete all revoked chat invites",
    "desc_ru": "Удалить все отозванные приглашения в чаты."
  },
  {
    "name": "remove_chat_invite",
    "rpc": "messages.deleteExportedChatInvite",
    "namespace": "messages",
    "signature": "await ctx.remove_chat_invite(peer: InputPeer, link: string)",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": false,
        "default": "$peer"
      },
      {
        "name": "link",
        "type": "string",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Delete a chat invite",
    "desc_ru": "Удалить приглашение в чат."
  },
  {
    "name": "invite_admins",
    "rpc": "messages.getAdminsWithInvites",
    "namespace": "messages",
    "signature": "await ctx.invite_admins(peer: InputPeer)",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": false,
        "default": "$peer"
      }
    ],
    "desc_en": "Get info about chat invites generated by admins.",
    "desc_ru": "Получить сведения о приглашениях в чат, созданных администраторами."
  },
  {
    "name": "invite_joiners",
    "rpc": "messages.getChatInviteImporters",
    "namespace": "messages",
    "signature": "await ctx.invite_joiners(peer: InputPeer, offset_date: int, offset_user: InputUser, limit: int)",
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
        "required": false,
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
        "required": false,
        "default": null
      },
      {
        "name": "offset_user",
        "type": "InputUser",
        "required": false,
        "default": null
      },
      {
        "name": "limit",
        "type": "int",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Get info about the users that joined the chat using a specific chat invite",
    "desc_ru": "Получить сведения о пользователях, присоединившихся к чату по конкретному приглашению."
  },
  {
    "name": "resolve_join_request",
    "rpc": "messages.hideChatJoinRequest",
    "namespace": "messages",
    "signature": "await ctx.resolve_join_request(peer: InputPeer, user_id: InputUser)",
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
        "required": false,
        "default": "$peer"
      },
      {
        "name": "user_id",
        "type": "InputUser",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Dismiss or approve a chat join request related to a specific chat or channel.",
    "desc_ru": "Отклонить или одобрить заявку на вступление в чат или канал."
  },
  {
    "name": "resolve_all_join_requests",
    "rpc": "messages.hideAllChatJoinRequests",
    "namespace": "messages",
    "signature": "await ctx.resolve_all_join_requests(peer: InputPeer)",
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
        "required": false,
        "default": "$peer"
      },
      {
        "name": "link",
        "type": "flags.1?string",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Dismiss or approve all join requests related to a specific chat or channel.",
    "desc_ru": "Отклонить или одобрить все заявки на вступление в чат или канал."
  },
  {
    "name": "channel_statistics",
    "rpc": "stats.getBroadcastStats",
    "namespace": "stats",
    "signature": "await ctx.channel_statistics(channel: InputChannel)",
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
        "required": false,
        "default": "$peer"
      }
    ],
    "desc_en": "Get channel statistics",
    "desc_ru": "Получить статистику канала."
  },
  {
    "name": "supergroup_statistics",
    "rpc": "stats.getMegagroupStats",
    "namespace": "stats",
    "signature": "await ctx.supergroup_statistics(channel: InputChannel)",
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
        "required": false,
        "default": "$peer"
      }
    ],
    "desc_en": "Get supergroup statistics",
    "desc_ru": "Получить статистику супергруппы."
  },
  {
    "name": "message_statistics",
    "rpc": "stats.getMessageStats",
    "namespace": "stats",
    "signature": "await ctx.message_statistics(channel: InputChannel, msg_id: int)",
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
        "required": false,
        "default": "$peer"
      },
      {
        "name": "msg_id",
        "type": "int",
        "required": true,
        "default": null
      }
    ],
    "desc_en": "Get message statistics",
    "desc_ru": "Получить статистику сообщения."
  },
  {
    "name": "message_public_forwards",
    "rpc": "stats.getMessagePublicForwards",
    "namespace": "stats",
    "signature": "await ctx.message_public_forwards(channel: InputChannel, msg_id: int, offset: string, limit: int)",
    "params": [
      {
        "name": "channel",
        "type": "InputChannel",
        "required": false,
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
        "required": false,
        "default": null
      },
      {
        "name": "limit",
        "type": "int",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Obtains a list of messages, indicating to which other public channels was a channel message forwarded. Will return a list of messages with peer_id equal to the public channel to which this message was forwarded.",
    "desc_ru": "Получить список сообщений с указанием, в какие другие публичные каналы было переслано сообщение канала. В списке peer_id равен публичному каналу-получателю."
  },
  {
    "name": "story_statistics",
    "rpc": "stats.getStoryStats",
    "namespace": "stats",
    "signature": "await ctx.story_statistics(peer: InputPeer, id: int)",
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
        "required": false,
        "default": "$peer"
      },
      {
        "name": "id",
        "type": "int",
        "required": false,
        "default": "$message"
      }
    ],
    "desc_en": "Get statistics for a certain story.",
    "desc_ru": "Получить статистику конкретной истории."
  },
  {
    "name": "story_public_forwards",
    "rpc": "stats.getStoryPublicForwards",
    "namespace": "stats",
    "signature": "await ctx.story_public_forwards(peer: InputPeer, id: int, offset: string, limit: int)",
    "params": [
      {
        "name": "peer",
        "type": "InputPeer",
        "required": false,
        "default": "$peer"
      },
      {
        "name": "id",
        "type": "int",
        "required": false,
        "default": "$message"
      },
      {
        "name": "offset",
        "type": "string",
        "required": false,
        "default": null
      },
      {
        "name": "limit",
        "type": "int",
        "required": false,
        "default": null
      }
    ],
    "desc_en": "Obtain forwards of a story as a message to public chats and reposts by public channels.",
    "desc_ru": "Получить пересылки истории в публичные чаты и репосты публичными каналами."
  }
];
