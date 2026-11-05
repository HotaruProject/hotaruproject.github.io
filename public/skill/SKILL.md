---
name: hotaru-module-developer
description: Exhaustive engineering specification and agent reference for authoring secure .hmod modules for the Hotaru Telegram userbot with Linux namespace sandboxing, capability enforcement, lifecycle hooks, template fields, watchers, tasks, and complete reference for all 292 ModuleContext MTProto methods.
license: GNU AGPLv3
---

# Hotaru Module Developer Reference & Agent Skill

Hotaru is a security-first Telegram userbot operating from a primary user account. Unlike legacy userbot platforms that load third-party scripts directly into the interpreter alongside Telegram authentication sessions, Hotaru enforces process isolation and hardware-assisted capability sandboxing.

### Core Architectural Invariants

1. First-Statement Rule:
The assignment `HOTARU = { ... }` must be the very first statement in the .hmod file. Preceding imports or code trigger ModuleValidationError.

2. Process Isolation & Linux Namespaces:
Modules execute in dedicated worker processes isolated via `CLONE_NEWNS`, `CLONE_NEWIPC`, `CLONE_NEWUTS`, and `CLONE_NEWNET`. Unprivileged worker UID/GID is set to `nobody:nogroup` (65534). `prctl(PR_SET_NO_NEW_PRIVS, 1)` prevents privilege escalation.

3. Optional Type Annotations:
Type annotations are completely optional in Hotaru modules. Python 3.13 dynamically executes handlers whether typed or untyped.

4. Zero Comments Invariant:
Production Hotaru code and .hmod files contain zero comments.

5. License:
Hotaru is open-source software licensed under the GNU Affero General Public License v3.0 (AGPLv3).

## 1. Complete Manifest Schema (HOTARU Dictionary)

```python
HOTARU = {
    "id": "qr_tool",
    "version": "1.0.0",
    "commands": {
        "qr": "qr_command",
    },
    "capabilities": ["mt", "net"],
    "watchers": ["message_watcher"],
    "tasks": {
        "sync_loop": "sync_worker",
    },
    "aliases": {
        "qrcode": "qr",
    },
    "config_schema": {
        "api_key": {
            "type": "string",
            "default": "",
            "description": "Optional API key",
        },
    },
    "lexicon": {
        "en": {
            "missing": "Please provide text after .qr",
            "done": "QR code generated.",
        },
        "ru": {
            "missing": "Укажите текст после .qr",
            "done": "QR-код сгенерирован.",
        },
    },
    "requires": ["common_lib"],
    "after": ["accounts", "shield"],
    "inline_commands": ["qr_inline"],
    "rise": "on_startup",
    "fade": "on_shutdown",
    "template_fields": {
        "qr_counter": {
            "scope": "global",
            "provider": "qr_counter",
        },
    },
    "banner": "https://example.com/banner.png",
    "bot_commands": ["qr"],
}
```

## 2. Module Lifecycle Hooks: rise and fade

Declare asynchronous lifecycle hooks directly in HOTARU:
- `rise`: Coroutine executed immediately after module load and sandbox initialization.
- `fade`: Coroutine executed during module unload or userbot shutdown.

```python
HOTARU = {
    "id": "vault_sync",
    "version": "1.0.0",
    "capabilities": ["mt", "state"],
    "commands": {
        "status": "status_cmd",
    },
    "rise": "on_startup",
    "fade": "on_shutdown",
}

async def on_startup(ctx):
    initialized = await ctx.state.get("init", False)
    if not initialized:
        await ctx.state.set("init", True)

async def on_shutdown(ctx):
    await ctx.state.set("last_shutdown", int(ctx.uptime))

async def status_cmd(ctx):
    await ctx.respond("Vault synced.")
```

## 3. Event Watchers & Message Interceptors

Declare background message listeners in the `watchers` array of HOTARU:

```python
HOTARU = {
    "id": "anti_phish",
    "version": "1.0.0",
    "capabilities": ["mt", "state"],
    "commands": {},
    "watchers": ["inspect_incoming"],
}

async def inspect_incoming(ctx):
    if ctx.out:
        return
    text = ctx.message.text or ""
    if "t.me/claim" in text:
        await ctx.save()
```

## 4. Background Tasks & Supervisor Watchdog

Declare background worker loops in `tasks`:

```python
HOTARU = {
    "id": "cleaner",
    "version": "1.0.0",
    "capabilities": ["mt", "state"],
    "commands": {},
    "tasks": {
        "sweep": "sweep_worker",
    },
}

import asyncio

async def sweep_worker(ctx):
    while not ctx.is_stopping:
        try:
            count = await ctx.state.get("sweeps", 0)
            await ctx.state.set("sweeps", count + 1)
        except Exception:
            pass
        for _ in range(60):
            if ctx.is_stopping:
                break
            await asyncio.sleep(1)
```

## 5. Dynamic Template Fields & Scopes

Publish dynamic placeholders using `template_fields`:
- Scopes: `private`, `shared`, `global`
- Provider function signature: `async def template_<provider_name>(ctx)`

```python
HOTARU = {
    "id": "stats_provider",
    "version": "1.0.0",
    "capabilities": ["mt", "state"],
    "commands": {},
    "template_fields": {
        "stat_val": {
            "scope": "global",
            "provider": "stat_val",
        },
    },
}

async def template_stat_val(ctx):
    return "Operational"
```

## 6. Complete ModuleContext API Reference

The ModuleContext object exposes both high-level helpers and the complete catalog of 292 extended MTProto operations.

### Core Properties
- `ctx.module_id` -> str
- `ctx.chat_id` -> int
- `ctx.user_id` / `ctx.sender_id` -> int | None
- `ctx.topic_id` -> int | None
- `ctx.is_me` / `ctx.out` -> bool
- `ctx.message` -> ModuleMessage
- `ctx.has_media` -> bool
- `ctx.media` / `ctx.attachment` -> Attachment | None
- `ctx.reply_message` -> ModuleMessage | None
- `ctx.reply_attachment` -> Attachment | None
- `ctx.args` -> list[str]
- `ctx.raw_args` -> str
- `ctx.prefix` -> str
- `ctx.uptime` -> float
- `ctx.memory` / `ctx.ram` -> int
- `ctx.version` -> str
- `ctx.is_stopping` -> bool

### Primary Messaging & Editing
- `await ctx.reply(text, parse_mode="html", link_preview=False, silent=False, schedule_date=None)`
- `await ctx.respond(text, parse_mode="html", link_preview=False)`
- `await ctx.edit(text, parse_mode="html", link_preview=False)`
- `await ctx.delete(revoke=True)`
- `await ctx.pin(silent=False, unpin_both=False)`
- `await ctx.unpin()`
- `await ctx.react(emoji, big=False)`
- `await ctx.unreact()`
- `await ctx.forward_to(target_chat_id, silent=False)`
- `await ctx.copy_to(target_chat_id, caption=None)`
- `await ctx.save()`
- `await ctx.schedule(schedule_date, text=None)`
- `await ctx.typing(action="typing")`
- `await ctx.read()`
- `await ctx.mark_read()`

### Peer & Message Inspection
- `await ctx.get_sender()` -> User dict
- `await ctx.get_chat()` -> Chat/Channel dict
- `await ctx.get_input_chat()` -> InputPeer dict
- `await ctx.get_input_sender()` -> InputPeer dict
- `await ctx.get_input_channel()` -> InputChannel dict
- `await ctx.get_reply_message()` -> ModuleMessage | None
- `await ctx.get_reactions()` -> list[dict]
- `await ctx.get_reactors(limit=50)` -> list[dict]
- `await ctx.get_views()` -> int
- `await ctx.get_replies()` -> int
- `await ctx.get_discussion()` -> dict
- `await ctx.get_link()` -> str
- `await ctx.check_restrictions()` -> dict

### Media & Files
- `await ctx.reply_file(file, caption=None, force_document=False, filename=None)`
- `await ctx.reply_photo(photo, caption=None, parse_mode="html")`
- `await ctx.reply_video(video, caption=None, duration=None, width=None, height=None)`
- `await ctx.reply_audio(audio, caption=None, duration=None, performer=None, title=None)`
- `await ctx.reply_voice(voice, caption=None, duration=None)`
- `await ctx.reply_animation(animation, caption=None)`
- `await ctx.reply_dice(emoji="🎲")`
- `await ctx.edit_media(media, caption=None)`
- `await ctx.edit_caption(caption, parse_mode="html")`
- `await ctx.download(attachment=None, destination=None)`

### State & TCP Stream
- `await ctx.state.get(key, default=None)`
- `await ctx.state.set(key, value)`
- `await ctx.state.delete(key)`
- `await ctx.state.clear()`
- `await ctx.state.all()`
- `await ctx.net(url, method="GET", headers=None, data=None, timeout=10.0)`
- `stream = await ctx.stream(host, port, ssl=True)`

### Interactive Screens
- `await ctx.screens.show(title, body, buttons=None, pager=None)`
- `ctx.screens.button(text, callback)`
- `ctx.screens.primary(text, callback)`
- `ctx.screens.danger(text, callback)`
- `ctx.screens.success(text, callback)`
- `ctx.screens.pager(current_page, total_pages, on_page_change)`
- `ctx.screens.table(headers, rows, page=1, page_size=5)`
- `ctx.screens.details(items)`
- `ctx.screens.back(on_back)`
- `ctx.screens.close()`

## 7. Complete Catalog: All 292 Extended MTProto Methods

Every method is directly callable on `ctx` when the 'mt' capability is declared. Defaults such as current chat (`$peer`) and current message ID (`$message`) are automatically resolved by the relay.

### ctx.set_checklist_completed
- Signature: `await ctx.set_checklist_completed(peer: InputPeer, msg_id: int, completed: Vector<int>, incompleted: Vector<int>)`
- MTProto RPC: `messages.toggleTodoCompleted`
- Returns: `bool`

### ctx.add_poll_answer
- Signature: `await ctx.add_poll_answer(peer: InputPeer, msg_id: int, answer: PollAnswer)`
- MTProto RPC: `messages.addPollAnswer`
- Returns: `dict[str, Any]`

### ctx.remove_poll_answer
- Signature: `await ctx.remove_poll_answer(peer: InputPeer, msg_id: int, option: bytes)`
- MTProto RPC: `messages.deletePollAnswer`
- Returns: `bool`

### ctx.unread_poll_votes
- Signature: `await ctx.unread_poll_votes(peer: InputPeer, top_msg_id: flags.0?int = None, offset_id: int, add_offset: int, limit: int, max_id: int, min_id: int)`
- MTProto RPC: `messages.getUnreadPollVotes`
- Returns: `bool`

### ctx.mark_poll_votes_read
- Signature: `await ctx.mark_poll_votes_read(peer: InputPeer, top_msg_id: flags.0?int = None)`
- MTProto RPC: `messages.readPollVotes`
- Returns: `bool`

### ctx.poll_statistics
- Signature: `await ctx.poll_statistics(dark: flags.0?true = None, peer: InputPeer, msg_id: int)`
- MTProto RPC: `stats.getPollStats`
- Returns: `dict[str, Any]`

### ctx.scheduled_messages
- Signature: `await ctx.scheduled_messages(peer: InputPeer, hash: long)`
- MTProto RPC: `messages.getScheduledHistory`
- Returns: `list[dict[str, Any]]`

### ctx.scheduled_by_ids
- Signature: `await ctx.scheduled_by_ids(peer: InputPeer, id: Vector<int>)`
- MTProto RPC: `messages.getScheduledMessages`
- Returns: `dict[str, Any]`

### ctx.publish_scheduled
- Signature: `await ctx.publish_scheduled(peer: InputPeer, id: Vector<int>)`
- MTProto RPC: `messages.sendScheduledMessages`
- Returns: `dict[str, Any]`

### ctx.cancel_scheduled
- Signature: `await ctx.cancel_scheduled(peer: InputPeer, id: Vector<int>)`
- MTProto RPC: `messages.deleteScheduledMessages`
- Returns: `dict[str, Any]`

### ctx.configure_chat_reactions
- Signature: `await ctx.configure_chat_reactions(peer: InputPeer, available_reactions: ChatReactions, reactions_limit: flags.0?int = None, paid_enabled: flags.1?Bool = None)`
- MTProto RPC: `messages.setChatAvailableReactions`
- Returns: `dict[str, Any]`

### ctx.available_reactions
- Signature: `await ctx.available_reactions(hash: int)`
- MTProto RPC: `messages.getAvailableReactions`
- Returns: `dict[str, Any]`

### ctx.set_default_reaction
- Signature: `await ctx.set_default_reaction(reaction: Reaction)`
- MTProto RPC: `messages.setDefaultReaction`
- Returns: `dict[str, Any]`

### ctx.unread_reactions
- Signature: `await ctx.unread_reactions(peer: InputPeer, top_msg_id: flags.0?int = None, saved_peer_id: flags.1?InputPeer = None, offset_id: int, add_offset: int, limit: int, max_id: int, min_id: int)`
- MTProto RPC: `messages.getUnreadReactions`
- Returns: `bool`

### ctx.mark_reactions_read
- Signature: `await ctx.mark_reactions_read(peer: InputPeer, top_msg_id: flags.0?int = None, saved_peer_id: flags.1?InputPeer = None)`
- MTProto RPC: `messages.readReactions`
- Returns: `bool`

### ctx.popular_reactions
- Signature: `await ctx.popular_reactions(limit: int, hash: long)`
- MTProto RPC: `messages.getTopReactions`
- Returns: `dict[str, Any]`

### ctx.recent_reactions
- Signature: `await ctx.recent_reactions(limit: int, hash: long)`
- MTProto RPC: `messages.getRecentReactions`
- Returns: `dict[str, Any]`

### ctx.clear_recent_reactions
- Signature: `await ctx.clear_recent_reactions()`
- MTProto RPC: `messages.clearRecentReactions`
- Returns: `bool`

### ctx.remove_member_reactions
- Signature: `await ctx.remove_member_reactions(peer: InputPeer, participant: InputPeer)`
- MTProto RPC: `messages.deleteParticipantReactions`
- Returns: `bool`

### ctx.remove_member_message_reaction
- Signature: `await ctx.remove_member_message_reaction(peer: InputPeer, msg_id: int, participant: InputPeer)`
- MTProto RPC: `messages.deleteParticipantReaction`
- Returns: `bool`

### ctx.saved_dialogs
- Signature: `await ctx.saved_dialogs(exclude_pinned: flags.0?true = None, parent_peer: flags.1?InputPeer = None, offset_date: int, offset_id: int, offset_peer: InputPeer, limit: int, hash: long)`
- MTProto RPC: `messages.getSavedDialogs`
- Returns: `dict[str, Any]`

### ctx.saved_history
- Signature: `await ctx.saved_history(parent_peer: flags.0?InputPeer = None, peer: InputPeer, offset_id: int, offset_date: int, add_offset: int, limit: int, max_id: int, min_id: int, hash: long)`
- MTProto RPC: `messages.getSavedHistory`
- Returns: `dict[str, Any]`

### ctx.clear_saved_history
- Signature: `await ctx.clear_saved_history(parent_peer: flags.0?InputPeer = None, peer: InputPeer, max_id: int, min_date: flags.2?int = None, max_date: flags.3?int = None)`
- MTProto RPC: `messages.deleteSavedHistory`
- Returns: `bool`

### ctx.pinned_saved_dialogs
- Signature: `await ctx.pinned_saved_dialogs()`
- MTProto RPC: `messages.getPinnedSavedDialogs`
- Returns: `dict[str, Any]`

### ctx.set_saved_dialog_pinned
- Signature: `await ctx.set_saved_dialog_pinned(pinned: flags.0?true = None, peer: InputDialogPeer)`
- MTProto RPC: `messages.toggleSavedDialogPin`
- Returns: `bool`

### ctx.reorder_saved_pins
- Signature: `await ctx.reorder_saved_pins(force: flags.0?true = None, order: Vector<InputDialogPeer>)`
- MTProto RPC: `messages.reorderPinnedSavedDialogs`
- Returns: `dict[str, Any]`

### ctx.saved_reaction_tags
- Signature: `await ctx.saved_reaction_tags(peer: flags.0?InputPeer = None, hash: long)`
- MTProto RPC: `messages.getSavedReactionTags`
- Returns: `dict[str, Any]`

### ctx.rename_saved_tag
- Signature: `await ctx.rename_saved_tag(reaction: Reaction, title: flags.0?string = None)`
- MTProto RPC: `messages.updateSavedReactionTag`
- Returns: `dict[str, Any]`

### ctx.suggested_saved_tags
- Signature: `await ctx.suggested_saved_tags(hash: long)`
- MTProto RPC: `messages.getDefaultTagReactions`
- Returns: `dict[str, Any]`

### ctx.saved_dialogs_by_peers
- Signature: `await ctx.saved_dialogs_by_peers(parent_peer: flags.1?InputPeer = None, ids: Vector<InputPeer>)`
- MTProto RPC: `messages.getSavedDialogsByID`
- Returns: `dict[str, Any]`

### ctx.mark_saved_history_read
- Signature: `await ctx.mark_saved_history_read(parent_peer: InputPeer, peer: InputPeer, max_id: int)`
- MTProto RPC: `messages.readSavedHistory`
- Returns: `bool`

### ctx.forum_topics
- Signature: `await ctx.forum_topics(peer: InputPeer, q: flags.0?string = None, offset_date: int, offset_id: int, offset_topic: int, limit: int)`
- MTProto RPC: `messages.getForumTopics`
- Returns: `list[dict[str, Any]]`

### ctx.forum_topics_by_ids
- Signature: `await ctx.forum_topics_by_ids(peer: InputPeer, topics: Vector<int>)`
- MTProto RPC: `messages.getForumTopicsByID`
- Returns: `list[dict[str, Any]]`

### ctx.edit_forum_topic
- Signature: `await ctx.edit_forum_topic(peer: InputPeer, topic_id: int, title: flags.0?string = None, icon_emoji_id: flags.1?long = None, closed: flags.2?Bool = None, hidden: flags.3?Bool = None)`
- MTProto RPC: `messages.editForumTopic`
- Returns: `dict[str, Any]`

### ctx.set_forum_topic_pinned
- Signature: `await ctx.set_forum_topic_pinned(peer: InputPeer, topic_id: int, pinned: Bool)`
- MTProto RPC: `messages.updatePinnedForumTopic`
- Returns: `dict[str, Any]`

### ctx.reorder_forum_pins
- Signature: `await ctx.reorder_forum_pins(force: flags.0?true = None, peer: InputPeer, order: Vector<int>)`
- MTProto RPC: `messages.reorderPinnedForumTopics`
- Returns: `dict[str, Any]`

### ctx.create_forum_topic
- Signature: `await ctx.create_forum_topic(title_missing: flags.4?true = None, peer: InputPeer, title: string, icon_color: flags.0?int = None, icon_emoji_id: flags.3?long = None, random_id: long, send_as: flags.2?InputPeer = None)`
- MTProto RPC: `messages.createForumTopic`
- Returns: `dict[str, Any]`

### ctx.remove_forum_topic
- Signature: `await ctx.remove_forum_topic(peer: InputPeer, top_msg_id: int)`
- MTProto RPC: `messages.deleteTopicHistory`
- Returns: `bool`

### ctx.set_forum_enabled
- Signature: `await ctx.set_forum_enabled(channel: InputChannel, enabled: Bool, tabs: Bool)`
- MTProto RPC: `channels.toggleForum`
- Returns: `bool`

### ctx.set_forum_message_view
- Signature: `await ctx.set_forum_message_view(channel: InputChannel, enabled: Bool)`
- MTProto RPC: `channels.toggleViewForumAsMessages`
- Returns: `bool`

### ctx.story_posting_quota
- Signature: `await ctx.story_posting_quota(peer: InputPeer)`
- MTProto RPC: `stories.canSendStory`
- Returns: `int`

### ctx.post_story
- Signature: `await ctx.post_story(pinned: flags.2?true = None, noforwards: flags.4?true = None, fwd_modified: flags.7?true = None, peer: InputPeer, media: InputMedia, media_areas: flags.5?Vector<MediaArea> = None, caption: flags.0?string = None, entities: flags.1?Vector<MessageEntity> = None, privacy_rules: Vector<InputPrivacyRule>, random_id: long, period: flags.3?int = None, fwd_from_id: flags.6?InputPeer = None, fwd_from_story: flags.6?int = None, albums: flags.8?Vector<int> = None, music: flags.9?InputDocument = None)`
- MTProto RPC: `stories.sendStory`
- Returns: `dict[str, Any]`

### ctx.edit_story
- Signature: `await ctx.edit_story(peer: InputPeer, id: int, media: flags.0?InputMedia = None, media_areas: flags.3?Vector<MediaArea> = None, caption: flags.1?string = None, entities: flags.1?Vector<MessageEntity> = None, privacy_rules: flags.2?Vector<InputPrivacyRule> = None, music: flags.4?InputDocument = None)`
- MTProto RPC: `stories.editStory`
- Returns: `dict[str, Any]`

### ctx.delete_stories
- Signature: `await ctx.delete_stories(peer: InputPeer, id: Vector<int>)`
- MTProto RPC: `stories.deleteStories`
- Returns: `bool`

### ctx.set_stories_on_profile
- Signature: `await ctx.set_stories_on_profile(peer: InputPeer, id: Vector<int>, pinned: Bool)`
- MTProto RPC: `stories.togglePinned`
- Returns: `bool`

### ctx.story_feed
- Signature: `await ctx.story_feed(next: flags.1?true = None, hidden: flags.2?true = None, state: flags.0?string = None)`
- MTProto RPC: `stories.getAllStories`
- Returns: `dict[str, Any]`

### ctx.profile_stories
- Signature: `await ctx.profile_stories(peer: InputPeer, offset_id: int, limit: int)`
- MTProto RPC: `stories.getPinnedStories`
- Returns: `list[dict[str, Any]]`

### ctx.archived_stories
- Signature: `await ctx.archived_stories(peer: InputPeer, offset_id: int, limit: int)`
- MTProto RPC: `stories.getStoriesArchive`
- Returns: `list[dict[str, Any]]`

### ctx.stories_by_ids
- Signature: `await ctx.stories_by_ids(peer: InputPeer, id: Vector<int>)`
- MTProto RPC: `stories.getStoriesByID`
- Returns: `list[dict[str, Any]]`

### ctx.mark_stories_read
- Signature: `await ctx.mark_stories_read(peer: InputPeer, max_id: int)`
- MTProto RPC: `stories.readStories`
- Returns: `bool`

### ctx.story_viewers
- Signature: `await ctx.story_viewers(just_contacts: flags.0?true = None, reactions_first: flags.2?true = None, forwards_first: flags.3?true = None, peer: InputPeer, q: flags.1?string = None, id: int, offset: string, limit: int)`
- MTProto RPC: `stories.getStoryViewsList`
- Returns: `dict[str, Any]`

### ctx.story_view_counts
- Signature: `await ctx.story_view_counts(peer: InputPeer, id: Vector<int>)`
- MTProto RPC: `stories.getStoriesViews`
- Returns: `int`

### ctx.story_link
- Signature: `await ctx.story_link(peer: InputPeer, id: int)`
- MTProto RPC: `stories.exportStoryLink`
- Returns: `dict[str, Any]`

### ctx.activate_story_stealth
- Signature: `await ctx.activate_story_stealth(past: flags.0?true = None, future: flags.1?true = None)`
- MTProto RPC: `stories.activateStealthMode`
- Returns: `dict[str, Any]`

### ctx.react_to_story
- Signature: `await ctx.react_to_story(add_to_recent: flags.0?true = None, peer: InputPeer, story_id: int, reaction: Reaction)`
- MTProto RPC: `stories.sendReaction`
- Returns: `dict[str, Any]`

### ctx.peer_stories
- Signature: `await ctx.peer_stories(peer: InputPeer)`
- MTProto RPC: `stories.getPeerStories`
- Returns: `list[dict[str, Any]]`

### ctx.story_read_markers
- Signature: `await ctx.story_read_markers()`
- MTProto RPC: `stories.getAllReadPeerStories`
- Returns: `bool`

### ctx.peer_latest_story_ids
- Signature: `await ctx.peer_latest_story_ids(id: Vector<InputPeer>)`
- MTProto RPC: `stories.getPeerMaxIDs`
- Returns: `dict[str, Any]`

### ctx.story_posting_chats
- Signature: `await ctx.story_posting_chats()`
- MTProto RPC: `stories.getChatsToSend`
- Returns: `dict[str, Any]`

### ctx.set_peer_stories_hidden
- Signature: `await ctx.set_peer_stories_hidden(peer: InputPeer, hidden: Bool)`
- MTProto RPC: `stories.togglePeerStoriesHidden`
- Returns: `bool`

### ctx.story_reaction_senders
- Signature: `await ctx.story_reaction_senders(forwards_first: flags.2?true = None, peer: InputPeer, id: int, reaction: flags.0?Reaction = None, offset: flags.1?string = None, limit: int)`
- MTProto RPC: `stories.getStoryReactionsList`
- Returns: `dict[str, Any]`

### ctx.reorder_profile_story_pins
- Signature: `await ctx.reorder_profile_story_pins(peer: InputPeer, id: Vector<int>)`
- MTProto RPC: `stories.togglePinnedToTop`
- Returns: `bool`

### ctx.search_stories
- Signature: `await ctx.search_stories(hashtag: flags.0?string = None, area: flags.1?MediaArea = None, peer: flags.2?InputPeer = None, offset: string, limit: int)`
- MTProto RPC: `stories.searchPosts`
- Returns: `list[dict[str, Any]]`

### ctx.create_story_album
- Signature: `await ctx.create_story_album(peer: InputPeer, title: string, stories: Vector<int>)`
- MTProto RPC: `stories.createAlbum`
- Returns: `dict[str, Any]`

### ctx.edit_story_album
- Signature: `await ctx.edit_story_album(peer: InputPeer, album_id: int, title: flags.0?string = None, delete_stories: flags.1?Vector<int> = None, add_stories: flags.2?Vector<int> = None, order: flags.3?Vector<int> = None)`
- MTProto RPC: `stories.updateAlbum`
- Returns: `dict[str, Any]`

### ctx.reorder_story_albums
- Signature: `await ctx.reorder_story_albums(peer: InputPeer, order: Vector<int>)`
- MTProto RPC: `stories.reorderAlbums`
- Returns: `dict[str, Any]`

### ctx.remove_story_album
- Signature: `await ctx.remove_story_album(peer: InputPeer, album_id: int)`
- MTProto RPC: `stories.deleteAlbum`
- Returns: `bool`

### ctx.story_albums
- Signature: `await ctx.story_albums(peer: InputPeer, hash: long)`
- MTProto RPC: `stories.getAlbums`
- Returns: `dict[str, Any]`

### ctx.story_album_items
- Signature: `await ctx.story_album_items(peer: InputPeer, album_id: int, offset: int, limit: int)`
- MTProto RPC: `stories.getAlbumStories`
- Returns: `list[dict[str, Any]]`

### ctx.stickers_for_emoji
- Signature: `await ctx.stickers_for_emoji(emoticon: string, hash: long)`
- MTProto RPC: `messages.getStickers`
- Returns: `dict[str, Any]`

### ctx.installed_sticker_sets
- Signature: `await ctx.installed_sticker_sets(hash: long)`
- MTProto RPC: `messages.getAllStickers`
- Returns: `dict[str, Any]`

### ctx.sticker_set
- Signature: `await ctx.sticker_set(stickerset: InputStickerSet, hash: int)`
- MTProto RPC: `messages.getStickerSet`
- Returns: `dict[str, Any]`

### ctx.install_sticker_set
- Signature: `await ctx.install_sticker_set(stickerset: InputStickerSet, archived: Bool)`
- MTProto RPC: `messages.installStickerSet`
- Returns: `dict[str, Any]`

### ctx.uninstall_sticker_set
- Signature: `await ctx.uninstall_sticker_set(stickerset: InputStickerSet)`
- MTProto RPC: `messages.uninstallStickerSet`
- Returns: `dict[str, Any]`

### ctx.reorder_sticker_sets
- Signature: `await ctx.reorder_sticker_sets(masks: flags.0?true = None, emojis: flags.1?true = None, order: Vector<long>)`
- MTProto RPC: `messages.reorderStickerSets`
- Returns: `dict[str, Any]`

### ctx.saved_gifs
- Signature: `await ctx.saved_gifs(hash: long)`
- MTProto RPC: `messages.getSavedGifs`
- Returns: `dict[str, Any]`

### ctx.set_gif_saved
- Signature: `await ctx.set_gif_saved(id: InputDocument, unsave: Bool)`
- MTProto RPC: `messages.saveGif`
- Returns: `dict[str, Any]`

### ctx.featured_sticker_sets
- Signature: `await ctx.featured_sticker_sets(hash: long)`
- MTProto RPC: `messages.getFeaturedStickers`
- Returns: `dict[str, Any]`

### ctx.mark_featured_stickers_seen
- Signature: `await ctx.mark_featured_stickers_seen(id: Vector<long>)`
- MTProto RPC: `messages.readFeaturedStickers`
- Returns: `dict[str, Any]`

### ctx.recent_stickers
- Signature: `await ctx.recent_stickers(attached: flags.0?true = None, hash: long)`
- MTProto RPC: `messages.getRecentStickers`
- Returns: `dict[str, Any]`

### ctx.set_sticker_recent
- Signature: `await ctx.set_sticker_recent(attached: flags.0?true = None, id: InputDocument, unsave: Bool)`
- MTProto RPC: `messages.saveRecentSticker`
- Returns: `dict[str, Any]`

### ctx.clear_recent_stickers
- Signature: `await ctx.clear_recent_stickers(attached: flags.0?true = None)`
- MTProto RPC: `messages.clearRecentStickers`
- Returns: `bool`

### ctx.archived_sticker_sets
- Signature: `await ctx.archived_sticker_sets(masks: flags.0?true = None, emojis: flags.1?true = None, offset_id: long, limit: int)`
- MTProto RPC: `messages.getArchivedStickers`
- Returns: `dict[str, Any]`

### ctx.installed_masks
- Signature: `await ctx.installed_masks(hash: long)`
- MTProto RPC: `messages.getMaskStickers`
- Returns: `dict[str, Any]`

### ctx.media_sticker_sets
- Signature: `await ctx.media_sticker_sets(media: InputStickeredMedia)`
- MTProto RPC: `messages.getAttachedStickers`
- Returns: `dict[str, Any]`

### ctx.favorite_stickers
- Signature: `await ctx.favorite_stickers(hash: long)`
- MTProto RPC: `messages.getFavedStickers`
- Returns: `dict[str, Any]`

### ctx.set_sticker_favorite
- Signature: `await ctx.set_sticker_favorite(id: InputDocument, unfave: Bool)`
- MTProto RPC: `messages.faveSticker`
- Returns: `dict[str, Any]`

### ctx.search_sticker_sets
- Signature: `await ctx.search_sticker_sets(exclude_featured: flags.0?true = None, q: string, hash: long)`
- MTProto RPC: `messages.searchStickerSets`
- Returns: `dict[str, Any]`

### ctx.bulk_sticker_set_action
- Signature: `await ctx.bulk_sticker_set_action(uninstall: flags.0?true = None, archive: flags.1?true = None, unarchive: flags.2?true = None, stickersets: Vector<InputStickerSet>)`
- MTProto RPC: `messages.toggleStickerSets`
- Returns: `bool`

### ctx.older_featured_sticker_sets
- Signature: `await ctx.older_featured_sticker_sets(offset: int, limit: int, hash: long)`
- MTProto RPC: `messages.getOldFeaturedStickers`
- Returns: `dict[str, Any]`

### ctx.custom_emoji_documents
- Signature: `await ctx.custom_emoji_documents(document_id: Vector<long>)`
- MTProto RPC: `messages.getCustomEmojiDocuments`
- Returns: `dict[str, Any]`

### ctx.installed_emoji_sets
- Signature: `await ctx.installed_emoji_sets(hash: long)`
- MTProto RPC: `messages.getEmojiStickers`
- Returns: `dict[str, Any]`

### ctx.featured_emoji_sets
- Signature: `await ctx.featured_emoji_sets(hash: long)`
- MTProto RPC: `messages.getFeaturedEmojiStickers`
- Returns: `dict[str, Any]`

### ctx.search_custom_emoji
- Signature: `await ctx.search_custom_emoji(emoticon: string, hash: long)`
- MTProto RPC: `messages.searchCustomEmoji`
- Returns: `dict[str, Any]`

### ctx.search_emoji_sets
- Signature: `await ctx.search_emoji_sets(exclude_featured: flags.0?true = None, q: string, hash: long)`
- MTProto RPC: `messages.searchEmojiStickerSets`
- Returns: `dict[str, Any]`

### ctx.owned_sticker_sets
- Signature: `await ctx.owned_sticker_sets(offset_id: long, limit: int)`
- MTProto RPC: `messages.getMyStickers`
- Returns: `dict[str, Any]`

### ctx.search_stickers
- Signature: `await ctx.search_stickers(emojis: flags.0?true = None, q: string, emoticon: string, lang_code: Vector<string>, offset: int, limit: int, hash: long)`
- MTProto RPC: `messages.searchStickers`
- Returns: `dict[str, Any]`

### ctx.create_sticker_set
- Signature: `await ctx.create_sticker_set(masks: flags.0?true = None, emojis: flags.5?true = None, text_color: flags.6?true = None, user_id: InputUser, title: string, short_name: string, thumb: flags.2?InputDocument = None, stickers: Vector<InputStickerSetItem>, software: flags.3?string = None)`
- MTProto RPC: `stickers.createStickerSet`
- Returns: `dict[str, Any]`

### ctx.remove_sticker
- Signature: `await ctx.remove_sticker(sticker: InputDocument)`
- MTProto RPC: `stickers.removeStickerFromSet`
- Returns: `bool`

### ctx.move_sticker
- Signature: `await ctx.move_sticker(sticker: InputDocument, position: int)`
- MTProto RPC: `stickers.changeStickerPosition`
- Returns: `dict[str, Any]`

### ctx.add_sticker
- Signature: `await ctx.add_sticker(stickerset: InputStickerSet, sticker: InputStickerSetItem)`
- MTProto RPC: `stickers.addStickerToSet`
- Returns: `dict[str, Any]`

### ctx.set_sticker_set_thumbnail
- Signature: `await ctx.set_sticker_set_thumbnail(stickerset: InputStickerSet, thumb: flags.0?InputDocument = None, thumb_document_id: flags.1?long = None)`
- MTProto RPC: `stickers.setStickerSetThumb`
- Returns: `dict[str, Any]`

### ctx.check_sticker_set_name
- Signature: `await ctx.check_sticker_set_name(short_name: string)`
- MTProto RPC: `stickers.checkShortName`
- Returns: `dict[str, Any]`

### ctx.suggest_sticker_set_name
- Signature: `await ctx.suggest_sticker_set_name(title: string)`
- MTProto RPC: `stickers.suggestShortName`
- Returns: `dict[str, Any]`

### ctx.edit_sticker_metadata
- Signature: `await ctx.edit_sticker_metadata(sticker: InputDocument, emoji: flags.0?string = None, mask_coords: flags.1?MaskCoords = None, keywords: flags.2?string = None)`
- MTProto RPC: `stickers.changeSticker`
- Returns: `dict[str, Any]`

### ctx.rename_sticker_set
- Signature: `await ctx.rename_sticker_set(stickerset: InputStickerSet, title: string)`
- MTProto RPC: `stickers.renameStickerSet`
- Returns: `dict[str, Any]`

### ctx.remove_sticker_set
- Signature: `await ctx.remove_sticker_set(stickerset: InputStickerSet)`
- MTProto RPC: `stickers.deleteStickerSet`
- Returns: `bool`

### ctx.replace_sticker
- Signature: `await ctx.replace_sticker(sticker: InputDocument, new_sticker: InputStickerSetItem)`
- MTProto RPC: `stickers.replaceSticker`
- Returns: `dict[str, Any]`

### ctx.contact_ids
- Signature: `await ctx.contact_ids(hash: long)`
- MTProto RPC: `contacts.getContactIDs`
- Returns: `dict[str, Any]`

### ctx.contact_statuses
- Signature: `await ctx.contact_statuses()`
- MTProto RPC: `contacts.getStatuses`
- Returns: `dict[str, Any]`

### ctx.contacts_list
- Signature: `await ctx.contacts_list(hash: long)`
- MTProto RPC: `contacts.getContacts`
- Returns: `list[dict[str, Any]]`

### ctx.import_contacts
- Signature: `await ctx.import_contacts(contacts: Vector<InputContact>)`
- MTProto RPC: `contacts.importContacts`
- Returns: `dict[str, Any]`

### ctx.remove_contacts
- Signature: `await ctx.remove_contacts(id: Vector<InputUser>)`
- MTProto RPC: `contacts.deleteContacts`
- Returns: `bool`

### ctx.remove_contacts_by_phone
- Signature: `await ctx.remove_contacts_by_phone(phones: Vector<string>)`
- MTProto RPC: `contacts.deleteByPhones`
- Returns: `bool`

### ctx.block_peer
- Signature: `await ctx.block_peer(my_stories_from: flags.0?true = None, id: InputPeer)`
- MTProto RPC: `contacts.block`
- Returns: `dict[str, Any]`

### ctx.unblock_peer
- Signature: `await ctx.unblock_peer(my_stories_from: flags.0?true = None, id: InputPeer)`
- MTProto RPC: `contacts.unblock`
- Returns: `dict[str, Any]`

### ctx.blocked_peers
- Signature: `await ctx.blocked_peers(my_stories_from: flags.0?true = None, offset: int, limit: int)`
- MTProto RPC: `contacts.getBlocked`
- Returns: `dict[str, Any]`

### ctx.search_public_peers
- Signature: `await ctx.search_public_peers(broadcasts: flags.0?true = None, bots: flags.1?true = None, q: string, limit: int)`
- MTProto RPC: `contacts.search`
- Returns: `dict[str, Any]`

### ctx.frequent_peers
- Signature: `await ctx.frequent_peers(correspondents: flags.0?true = None, bots_pm: flags.1?true = None, bots_inline: flags.2?true = None, phone_calls: flags.3?true = None, forward_users: flags.4?true = None, forward_chats: flags.5?true = None, groups: flags.10?true = None, channels: flags.15?true = None, bots_app: flags.16?true = None, bots_guestchat: flags.17?true = None, offset: int, limit: int, hash: long)`
- MTProto RPC: `contacts.getTopPeers`
- Returns: `dict[str, Any]`

### ctx.reset_peer_rating
- Signature: `await ctx.reset_peer_rating(category: TopPeerCategory, peer: InputPeer)`
- MTProto RPC: `contacts.resetTopPeerRating`
- Returns: `dict[str, Any]`

### ctx.clear_imported_contacts
- Signature: `await ctx.clear_imported_contacts()`
- MTProto RPC: `contacts.resetSaved`
- Returns: `bool`

### ctx.imported_contacts
- Signature: `await ctx.imported_contacts()`
- MTProto RPC: `contacts.getSaved`
- Returns: `dict[str, Any]`

### ctx.set_frequent_peers_enabled
- Signature: `await ctx.set_frequent_peers_enabled(enabled: Bool)`
- MTProto RPC: `contacts.toggleTopPeers`
- Returns: `bool`

### ctx.add_contact
- Signature: `await ctx.add_contact(add_phone_privacy_exception: flags.0?true = None, id: InputUser, first_name: string, last_name: string, phone: string, note: flags.1?TextWithEntities = None)`
- MTProto RPC: `contacts.addContact`
- Returns: `dict[str, Any]`

### ctx.accept_contact
- Signature: `await ctx.accept_contact(id: InputUser)`
- MTProto RPC: `contacts.acceptContact`
- Returns: `dict[str, Any]`

### ctx.set_close_friends
- Signature: `await ctx.set_close_friends(id: Vector<long>)`
- MTProto RPC: `contacts.editCloseFriends`
- Returns: `dict[str, Any]`

### ctx.replace_blocklist
- Signature: `await ctx.replace_blocklist(my_stories_from: flags.0?true = None, id: Vector<InputPeer>, limit: int)`
- MTProto RPC: `contacts.setBlocked`
- Returns: `list[dict[str, Any]]`

### ctx.contact_birthdays
- Signature: `await ctx.contact_birthdays()`
- MTProto RPC: `contacts.getBirthdays`
- Returns: `dict[str, Any]`

### ctx.edit_contact_note
- Signature: `await ctx.edit_contact_note(id: InputUser, note: TextWithEntities)`
- MTProto RPC: `contacts.updateContactNote`
- Returns: `dict[str, Any]`

### ctx.dialogs
- Signature: `await ctx.dialogs(exclude_pinned: flags.0?true = None, folder_id: flags.1?int = None, offset_date: int, offset_id: int, offset_peer: InputPeer, limit: int, hash: long)`
- MTProto RPC: `messages.getDialogs`
- Returns: `dict[str, Any]`

### ctx.chat_history
- Signature: `await ctx.chat_history(peer: InputPeer, offset_id: int, offset_date: int, add_offset: int, limit: int, max_id: int, min_id: int, hash: long)`
- MTProto RPC: `messages.getHistory`
- Returns: `dict[str, Any]`

### ctx.search_chat_messages
- Signature: `await ctx.search_chat_messages(peer: InputPeer, q: string, from_id: flags.0?InputPeer = None, saved_peer_id: flags.2?InputPeer = None, saved_reaction: flags.3?Vector<Reaction> = None, top_msg_id: flags.1?int = None, filter: MessagesFilter, min_date: int, max_date: int, offset_id: int, add_offset: int, limit: int, max_id: int, min_id: int, hash: long)`
- MTProto RPC: `messages.search`
- Returns: `list[dict[str, Any]]`

### ctx.mark_chat_read
- Signature: `await ctx.mark_chat_read(peer: InputPeer, max_id: int)`
- MTProto RPC: `messages.readHistory`
- Returns: `bool`

### ctx.clear_chat_history
- Signature: `await ctx.clear_chat_history(just_clear: flags.0?true = None, revoke: flags.1?true = None, peer: InputPeer, max_id: int, min_date: flags.2?int = None, max_date: flags.3?int = None)`
- MTProto RPC: `messages.deleteHistory`
- Returns: `bool`

### ctx.peer_settings
- Signature: `await ctx.peer_settings(peer: InputPeer)`
- MTProto RPC: `messages.getPeerSettings`
- Returns: `dict[str, Any]`

### ctx.basic_groups
- Signature: `await ctx.basic_groups(id: Vector<long>)`
- MTProto RPC: `messages.getChats`
- Returns: `dict[str, Any]`

### ctx.basic_group_details
- Signature: `await ctx.basic_group_details(chat_id: long)`
- MTProto RPC: `messages.getFullChat`
- Returns: `dict[str, Any]`

### ctx.search_all_messages
- Signature: `await ctx.search_all_messages(broadcasts_only: flags.1?true = None, groups_only: flags.2?true = None, users_only: flags.3?true = None, folder_id: flags.0?int = None, community: flags.4?InputChannel = None, q: string, filter: MessagesFilter, min_date: int, max_date: int, offset_rate: int, offset_peer: InputPeer, offset_id: int, limit: int)`
- MTProto RPC: `messages.searchGlobal`
- Returns: `list[dict[str, Any]]`

### ctx.message_editability
- Signature: `await ctx.message_editability(peer: InputPeer, id: int)`
- MTProto RPC: `messages.getMessageEditData`
- Returns: `dict[str, Any]`

### ctx.peer_dialogs
- Signature: `await ctx.peer_dialogs(peers: Vector<InputDialogPeer>)`
- MTProto RPC: `messages.getPeerDialogs`
- Returns: `dict[str, Any]`

### ctx.all_drafts
- Signature: `await ctx.all_drafts()`
- MTProto RPC: `messages.getAllDrafts`
- Returns: `dict[str, Any]`

### ctx.mutual_groups
- Signature: `await ctx.mutual_groups(user_id: InputUser, max_id: long, limit: int)`
- MTProto RPC: `messages.getCommonChats`
- Returns: `dict[str, Any]`

### ctx.set_dialog_pinned
- Signature: `await ctx.set_dialog_pinned(pinned: flags.0?true = None, peer: InputDialogPeer)`
- MTProto RPC: `messages.toggleDialogPin`
- Returns: `bool`

### ctx.reorder_dialog_pins
- Signature: `await ctx.reorder_dialog_pins(force: flags.0?true = None, folder_id: int, order: Vector<InputDialogPeer>)`
- MTProto RPC: `messages.reorderPinnedDialogs`
- Returns: `dict[str, Any]`

### ctx.pinned_dialogs
- Signature: `await ctx.pinned_dialogs(folder_id: int)`
- MTProto RPC: `messages.getPinnedDialogs`
- Returns: `dict[str, Any]`

### ctx.unread_mentions
- Signature: `await ctx.unread_mentions(peer: InputPeer, top_msg_id: flags.0?int = None, offset_id: int, add_offset: int, limit: int, max_id: int, min_id: int)`
- MTProto RPC: `messages.getUnreadMentions`
- Returns: `bool`

### ctx.mark_mentions_read
- Signature: `await ctx.mark_mentions_read(peer: InputPeer, top_msg_id: flags.0?int = None)`
- MTProto RPC: `messages.readMentions`
- Returns: `bool`

### ctx.recent_live_locations
- Signature: `await ctx.recent_live_locations(peer: InputPeer, limit: int, hash: long)`
- MTProto RPC: `messages.getRecentLocations`
- Returns: `dict[str, Any]`

### ctx.set_dialog_unread
- Signature: `await ctx.set_dialog_unread(unread: flags.0?true = None, parent_peer: flags.1?InputPeer = None, peer: InputDialogPeer)`
- MTProto RPC: `messages.markDialogUnread`
- Returns: `bool`

### ctx.unread_dialog_marks
- Signature: `await ctx.unread_dialog_marks(parent_peer: flags.0?InputPeer = None)`
- MTProto RPC: `messages.getDialogUnreadMarks`
- Returns: `bool`

### ctx.clear_all_drafts
- Signature: `await ctx.clear_all_drafts()`
- MTProto RPC: `messages.clearAllDrafts`
- Returns: `bool`

### ctx.chat_online_count
- Signature: `await ctx.chat_online_count(peer: InputPeer)`
- MTProto RPC: `messages.getOnlines`
- Returns: `int`

### ctx.message_type_counts
- Signature: `await ctx.message_type_counts(peer: InputPeer, saved_peer_id: flags.2?InputPeer = None, top_msg_id: flags.0?int = None, filters: Vector<MessagesFilter>)`
- MTProto RPC: `messages.getSearchCounters`
- Returns: `int`

### ctx.dismiss_peer_settings_bar
- Signature: `await ctx.dismiss_peer_settings_bar(peer: InputPeer)`
- MTProto RPC: `messages.hidePeerSettingsBar`
- Returns: `dict[str, Any]`

### ctx.mark_discussion_read
- Signature: `await ctx.mark_discussion_read(peer: InputPeer, msg_id: int, read_max_id: int)`
- MTProto RPC: `messages.readDiscussion`
- Returns: `bool`

### ctx.unpin_all_chat_messages
- Signature: `await ctx.unpin_all_chat_messages(peer: InputPeer, top_msg_id: flags.0?int = None, saved_peer_id: flags.1?InputPeer = None)`
- MTProto RPC: `messages.unpinAllMessages`
- Returns: `list[dict[str, Any]]`

### ctx.message_readers
- Signature: `await ctx.message_readers(peer: InputPeer, msg_id: int)`
- MTProto RPC: `messages.getMessageReadParticipants`
- Returns: `bool`

### ctx.message_search_calendar
- Signature: `await ctx.message_search_calendar(peer: InputPeer, saved_peer_id: flags.2?InputPeer = None, filter: MessagesFilter, offset_id: int, offset_date: int)`
- MTProto RPC: `messages.getSearchResultsCalendar`
- Returns: `dict[str, Any]`

### ctx.message_search_positions
- Signature: `await ctx.message_search_positions(peer: InputPeer, saved_peer_id: flags.2?InputPeer = None, filter: MessagesFilter, offset_id: int, limit: int)`
- MTProto RPC: `messages.getSearchResultsPositions`
- Returns: `dict[str, Any]`

### ctx.set_default_send_as
- Signature: `await ctx.set_default_send_as(peer: InputPeer, send_as: InputPeer)`
- MTProto RPC: `messages.saveDefaultSendAs`
- Returns: `dict[str, Any]`

### ctx.sent_media_search
- Signature: `await ctx.sent_media_search(q: string, filter: MessagesFilter, limit: int)`
- MTProto RPC: `messages.searchSentMedia`
- Returns: `dict[str, Any]`

### ctx.outgoing_read_date
- Signature: `await ctx.outgoing_read_date(peer: InputPeer, msg_id: int)`
- MTProto RPC: `messages.getOutboxReadDate`
- Returns: `bool`

### ctx.channel_message_author
- Signature: `await ctx.channel_message_author(channel: InputChannel, id: int)`
- MTProto RPC: `channels.getMessageAuthor`
- Returns: `dict[str, Any]`

### ctx.move_dialogs_to_archive
- Signature: `await ctx.move_dialogs_to_archive(folder_peers: Vector<InputFolderPeer>)`
- MTProto RPC: `folders.editPeerFolders`
- Returns: `dict[str, Any]`

### ctx.chat_folders
- Signature: `await ctx.chat_folders()`
- MTProto RPC: `messages.getDialogFilters`
- Returns: `dict[str, Any]`

### ctx.suggested_chat_folders
- Signature: `await ctx.suggested_chat_folders()`
- MTProto RPC: `messages.getSuggestedDialogFilters`
- Returns: `dict[str, Any]`

### ctx.save_chat_folder
- Signature: `await ctx.save_chat_folder(id: int, filter: flags.0?DialogFilter = None)`
- MTProto RPC: `messages.updateDialogFilter`
- Returns: `dict[str, Any]`

### ctx.reorder_chat_folders
- Signature: `await ctx.reorder_chat_folders(order: Vector<int>)`
- MTProto RPC: `messages.updateDialogFiltersOrder`
- Returns: `dict[str, Any]`

### ctx.set_folder_tags_visible
- Signature: `await ctx.set_folder_tags_visible(enabled: Bool)`
- MTProto RPC: `messages.toggleDialogFilterTags`
- Returns: `bool`

### ctx.share_chat_folder
- Signature: `await ctx.share_chat_folder(chatlist: InputChatlist, title: string, peers: Vector<InputPeer>)`
- MTProto RPC: `chatlists.exportChatlistInvite`
- Returns: `dict[str, Any]`

### ctx.remove_folder_invite
- Signature: `await ctx.remove_folder_invite(chatlist: InputChatlist, slug: string)`
- MTProto RPC: `chatlists.deleteExportedInvite`
- Returns: `bool`

### ctx.edit_folder_invite
- Signature: `await ctx.edit_folder_invite(chatlist: InputChatlist, slug: string, title: flags.1?string = None, peers: flags.2?Vector<InputPeer> = None)`
- MTProto RPC: `chatlists.editExportedInvite`
- Returns: `dict[str, Any]`

### ctx.folder_invites
- Signature: `await ctx.folder_invites(chatlist: InputChatlist)`
- MTProto RPC: `chatlists.getExportedInvites`
- Returns: `dict[str, Any]`

### ctx.inspect_folder_invite
- Signature: `await ctx.inspect_folder_invite(slug: string)`
- MTProto RPC: `chatlists.checkChatlistInvite`
- Returns: `dict[str, Any]`

### ctx.join_folder_invite
- Signature: `await ctx.join_folder_invite(slug: string, peers: Vector<InputPeer>)`
- MTProto RPC: `chatlists.joinChatlistInvite`
- Returns: `dict[str, Any]`

### ctx.folder_updates
- Signature: `await ctx.folder_updates(chatlist: InputChatlist)`
- MTProto RPC: `chatlists.getChatlistUpdates`
- Returns: `dict[str, Any]`

### ctx.accept_folder_updates
- Signature: `await ctx.accept_folder_updates(chatlist: InputChatlist, peers: Vector<InputPeer>)`
- MTProto RPC: `chatlists.joinChatlistUpdates`
- Returns: `dict[str, Any]`

### ctx.dismiss_folder_updates
- Signature: `await ctx.dismiss_folder_updates(chatlist: InputChatlist)`
- MTProto RPC: `chatlists.hideChatlistUpdates`
- Returns: `dict[str, Any]`

### ctx.folder_leave_suggestions
- Signature: `await ctx.folder_leave_suggestions(chatlist: InputChatlist)`
- MTProto RPC: `chatlists.getLeaveChatlistSuggestions`
- Returns: `dict[str, Any]`

### ctx.leave_shared_folder
- Signature: `await ctx.leave_shared_folder(chatlist: InputChatlist, peers: Vector<InputPeer>)`
- MTProto RPC: `chatlists.leaveChatlist`
- Returns: `dict[str, Any]`

### ctx.edit_profile
- Signature: `await ctx.edit_profile(first_name: flags.0?string = None, last_name: flags.1?string = None, about: flags.2?string = None)`
- MTProto RPC: `account.updateProfile`
- Returns: `dict[str, Any]`

### ctx.set_online_status
- Signature: `await ctx.set_online_status(offline: Bool)`
- MTProto RPC: `account.updateStatus`
- Returns: `dict[str, Any]`

### ctx.check_profile_username
- Signature: `await ctx.check_profile_username(username: string)`
- MTProto RPC: `account.checkUsername`
- Returns: `dict[str, Any]`

### ctx.set_profile_username
- Signature: `await ctx.set_profile_username(username: string)`
- MTProto RPC: `account.updateUsername`
- Returns: `dict[str, Any]`

### ctx.privacy_rules
- Signature: `await ctx.privacy_rules(key: InputPrivacyKey)`
- MTProto RPC: `account.getPrivacy`
- Returns: `dict[str, Any]`

### ctx.account_inactivity_ttl
- Signature: `await ctx.account_inactivity_ttl()`
- MTProto RPC: `account.getAccountTTL`
- Returns: `int`

### ctx.set_emoji_status
- Signature: `await ctx.set_emoji_status(emoji_status: EmojiStatus)`
- MTProto RPC: `account.updateEmojiStatus`
- Returns: `dict[str, Any]`

### ctx.suggested_emoji_statuses
- Signature: `await ctx.suggested_emoji_statuses(hash: long)`
- MTProto RPC: `account.getDefaultEmojiStatuses`
- Returns: `dict[str, Any]`

### ctx.recent_emoji_statuses
- Signature: `await ctx.recent_emoji_statuses(hash: long)`
- MTProto RPC: `account.getRecentEmojiStatuses`
- Returns: `dict[str, Any]`

### ctx.clear_recent_emoji_statuses
- Signature: `await ctx.clear_recent_emoji_statuses()`
- MTProto RPC: `account.clearRecentEmojiStatuses`
- Returns: `bool`

### ctx.reorder_profile_usernames
- Signature: `await ctx.reorder_profile_usernames(order: Vector<string>)`
- MTProto RPC: `account.reorderUsernames`
- Returns: `dict[str, Any]`

### ctx.set_profile_username_active
- Signature: `await ctx.set_profile_username_active(username: string, active: Bool)`
- MTProto RPC: `account.toggleUsername`
- Returns: `bool`

### ctx.profile_photo_emojis
- Signature: `await ctx.profile_photo_emojis(hash: long)`
- MTProto RPC: `account.getDefaultProfilePhotoEmojis`
- Returns: `dict[str, Any]`

### ctx.set_profile_color
- Signature: `await ctx.set_profile_color(for_profile: flags.1?true = None, color: flags.2?PeerColor = None)`
- MTProto RPC: `account.updateColor`
- Returns: `dict[str, Any]`

### ctx.set_birthday
- Signature: `await ctx.set_birthday(birthday: flags.0?Birthday = None)`
- MTProto RPC: `account.updateBirthday`
- Returns: `dict[str, Any]`

### ctx.set_personal_channel
- Signature: `await ctx.set_personal_channel(channel: InputChannel)`
- MTProto RPC: `account.updatePersonalChannel`
- Returns: `dict[str, Any]`

### ctx.set_profile_tab
- Signature: `await ctx.set_profile_tab(tab: ProfileTab)`
- MTProto RPC: `account.setMainProfileTab`
- Returns: `dict[str, Any]`

### ctx.set_music_saved
- Signature: `await ctx.set_music_saved(unsave: flags.0?true = None, id: InputDocument, after_id: flags.1?InputDocument = None)`
- MTProto RPC: `account.saveMusic`
- Returns: `dict[str, Any]`

### ctx.saved_music_ids
- Signature: `await ctx.saved_music_ids(hash: long)`
- MTProto RPC: `account.getSavedMusicIds`
- Returns: `dict[str, Any]`

### ctx.user_details
- Signature: `await ctx.user_details(id: InputUser)`
- MTProto RPC: `users.getFullUser`
- Returns: `dict[str, Any]`

### ctx.contact_requirements
- Signature: `await ctx.contact_requirements(id: Vector<InputUser>)`
- MTProto RPC: `users.getRequirementsToContact`
- Returns: `dict[str, Any]`

### ctx.user_music
- Signature: `await ctx.user_music(id: InputUser, offset: int, limit: int, hash: long)`
- MTProto RPC: `users.getSavedMusic`
- Returns: `dict[str, Any]`

### ctx.user_music_by_documents
- Signature: `await ctx.user_music_by_documents(id: InputUser, documents: Vector<InputDocument>)`
- MTProto RPC: `users.getSavedMusicByID`
- Returns: `dict[str, Any]`

### ctx.suggest_contact_birthday
- Signature: `await ctx.suggest_contact_birthday(id: InputUser, birthday: Birthday)`
- MTProto RPC: `users.suggestBirthday`
- Returns: `dict[str, Any]`

### ctx.select_profile_photo
- Signature: `await ctx.select_profile_photo(fallback: flags.0?true = None, bot: flags.1?InputUser = None, id: InputPhoto)`
- MTProto RPC: `photos.updateProfilePhoto`
- Returns: `dict[str, Any]`

### ctx.upload_profile_photo
- Signature: `await ctx.upload_profile_photo(fallback: flags.3?true = None, bot: flags.5?InputUser = None, file: flags.0?InputFile = None, video: flags.1?InputFile = None, video_start_ts: flags.2?double = None, video_emoji_markup: flags.4?VideoSize = None)`
- MTProto RPC: `photos.uploadProfilePhoto`
- Returns: `dict[str, Any]`

### ctx.remove_profile_photos
- Signature: `await ctx.remove_profile_photos(id: Vector<InputPhoto>)`
- MTProto RPC: `photos.deletePhotos`
- Returns: `bool`

### ctx.profile_photos
- Signature: `await ctx.profile_photos(user_id: InputUser, offset: int, max_id: long, limit: int)`
- MTProto RPC: `photos.getUserPhotos`
- Returns: `dict[str, Any]`

### ctx.set_contact_photo
- Signature: `await ctx.set_contact_photo(suggest: flags.3?true = None, save: flags.4?true = None, user_id: InputUser, file: flags.0?InputFile = None, video: flags.1?InputFile = None, video_start_ts: flags.2?double = None, video_emoji_markup: flags.5?VideoSize = None)`
- MTProto RPC: `photos.uploadContactProfilePhoto`
- Returns: `dict[str, Any]`

### ctx.notification_settings
- Signature: `await ctx.notification_settings(peer: InputNotifyPeer)`
- MTProto RPC: `account.getNotifySettings`
- Returns: `dict[str, Any]`

### ctx.set_notification_settings
- Signature: `await ctx.set_notification_settings(peer: InputNotifyPeer, settings: InputPeerNotifySettings)`
- MTProto RPC: `account.updateNotifySettings`
- Returns: `dict[str, Any]`

### ctx.reset_notification_settings
- Signature: `await ctx.reset_notification_settings()`
- MTProto RPC: `account.resetNotifySettings`
- Returns: `dict[str, Any]`

### ctx.contact_signup_notifications
- Signature: `await ctx.contact_signup_notifications()`
- MTProto RPC: `account.getContactSignUpNotification`
- Returns: `dict[str, Any]`

### ctx.set_contact_signup_notifications
- Signature: `await ctx.set_contact_signup_notifications(silent: Bool)`
- MTProto RPC: `account.setContactSignUpNotification`
- Returns: `dict[str, Any]`

### ctx.notification_exceptions
- Signature: `await ctx.notification_exceptions(compare_sound: flags.1?true = None, compare_stories: flags.2?true = None, peer: flags.0?InputNotifyPeer = None)`
- MTProto RPC: `account.getNotifyExceptions`
- Returns: `dict[str, Any]`

### ctx.reaction_notification_settings
- Signature: `await ctx.reaction_notification_settings()`
- MTProto RPC: `account.getReactionsNotifySettings`
- Returns: `dict[str, Any]`

### ctx.set_reaction_notification_settings
- Signature: `await ctx.set_reaction_notification_settings(settings: ReactionsNotifySettings)`
- MTProto RPC: `account.setReactionsNotifySettings`
- Returns: `dict[str, Any]`

### ctx.saved_notification_sounds
- Signature: `await ctx.saved_notification_sounds(hash: long)`
- MTProto RPC: `account.getSavedRingtones`
- Returns: `dict[str, Any]`

### ctx.set_notification_sound_saved
- Signature: `await ctx.set_notification_sound_saved(id: InputDocument, unsave: Bool)`
- MTProto RPC: `account.saveRingtone`
- Returns: `dict[str, Any]`

### ctx.upload_notification_sound
- Signature: `await ctx.upload_notification_sound(file: InputFile, file_name: string, mime_type: string)`
- MTProto RPC: `account.uploadRingtone`
- Returns: `dict[str, Any]`

### ctx.rename_basic_group
- Signature: `await ctx.rename_basic_group(chat_id: long, title: string)`
- MTProto RPC: `messages.editChatTitle`
- Returns: `dict[str, Any]`

### ctx.set_basic_group_photo
- Signature: `await ctx.set_basic_group_photo(chat_id: long, photo: InputChatPhoto)`
- MTProto RPC: `messages.editChatPhoto`
- Returns: `dict[str, Any]`

### ctx.add_basic_group_member
- Signature: `await ctx.add_basic_group_member(chat_id: long, user_id: InputUser, fwd_limit: int)`
- MTProto RPC: `messages.addChatUser`
- Returns: `dict[str, Any]`

### ctx.remove_basic_group_member
- Signature: `await ctx.remove_basic_group_member(revoke_history: flags.0?true = None, chat_id: long, user_id: InputUser)`
- MTProto RPC: `messages.deleteChatUser`
- Returns: `bool`

### ctx.create_basic_group
- Signature: `await ctx.create_basic_group(users: Vector<InputUser>, title: string, ttl_period: flags.0?int = None)`
- MTProto RPC: `messages.createChat`
- Returns: `dict[str, Any]`

### ctx.set_basic_group_admin
- Signature: `await ctx.set_basic_group_admin(chat_id: long, user_id: InputUser, is_admin: Bool)`
- MTProto RPC: `messages.editChatAdmin`
- Returns: `dict[str, Any]`

### ctx.upgrade_basic_group
- Signature: `await ctx.upgrade_basic_group(chat_id: long)`
- MTProto RPC: `messages.migrateChat`
- Returns: `dict[str, Any]`

### ctx.edit_chat_description
- Signature: `await ctx.edit_chat_description(peer: InputPeer, about: string)`
- MTProto RPC: `messages.editChatAbout`
- Returns: `dict[str, Any]`

### ctx.set_default_member_restrictions
- Signature: `await ctx.set_default_member_restrictions(peer: InputPeer, banned_rights: ChatBannedRights)`
- MTProto RPC: `messages.editChatDefaultBannedRights`
- Returns: `dict[str, Any]`

### ctx.remove_basic_group
- Signature: `await ctx.remove_basic_group(chat_id: long)`
- MTProto RPC: `messages.deleteChat`
- Returns: `bool`

### ctx.set_chat_auto_delete
- Signature: `await ctx.set_chat_auto_delete(peer: InputPeer, period: int)`
- MTProto RPC: `messages.setHistoryTTL`
- Returns: `bool`

### ctx.set_content_protection
- Signature: `await ctx.set_content_protection(peer: InputPeer, enabled: Bool, request_msg_id: flags.0?int = None)`
- MTProto RPC: `messages.toggleNoForwards`
- Returns: `bool`

### ctx.mark_channel_read
- Signature: `await ctx.mark_channel_read(channel: InputChannel, max_id: int)`
- MTProto RPC: `channels.readHistory`
- Returns: `bool`

### ctx.channel_members
- Signature: `await ctx.channel_members(channel: InputChannel, filter: ChannelParticipantsFilter, offset: int, limit: int, hash: long)`
- MTProto RPC: `channels.getParticipants`
- Returns: `list[dict[str, Any]]`

### ctx.channel_member
- Signature: `await ctx.channel_member(channel: InputChannel, participant: InputPeer)`
- MTProto RPC: `channels.getParticipant`
- Returns: `dict[str, Any]`

### ctx.channel_details
- Signature: `await ctx.channel_details(channel: InputChannel)`
- MTProto RPC: `channels.getFullChannel`
- Returns: `dict[str, Any]`

### ctx.create_channel
- Signature: `await ctx.create_channel(broadcast: flags.0?true = None, megagroup: flags.1?true = None, for_import: flags.3?true = None, forum: flags.5?true = None, title: string, about: string, geo_point: flags.2?InputGeoPoint = None, address: flags.2?string = None, ttl_period: flags.4?int = None)`
- MTProto RPC: `channels.createChannel`
- Returns: `dict[str, Any]`

### ctx.set_channel_admin
- Signature: `await ctx.set_channel_admin(channel: InputChannel, user_id: InputUser, admin_rights: ChatAdminRights, rank: flags.0?string = None)`
- MTProto RPC: `channels.editAdmin`
- Returns: `dict[str, Any]`

### ctx.rename_channel
- Signature: `await ctx.rename_channel(channel: InputChannel, title: string)`
- MTProto RPC: `channels.editTitle`
- Returns: `dict[str, Any]`

### ctx.set_channel_photo
- Signature: `await ctx.set_channel_photo(channel: InputChannel, photo: InputChatPhoto)`
- MTProto RPC: `channels.editPhoto`
- Returns: `dict[str, Any]`

### ctx.check_channel_username
- Signature: `await ctx.check_channel_username(channel: InputChannel, username: string)`
- MTProto RPC: `channels.checkUsername`
- Returns: `dict[str, Any]`

### ctx.set_channel_username
- Signature: `await ctx.set_channel_username(channel: InputChannel, username: string)`
- MTProto RPC: `channels.updateUsername`
- Returns: `dict[str, Any]`

### ctx.join_channel
- Signature: `await ctx.join_channel(channel: InputChannel)`
- MTProto RPC: `channels.joinChannel`
- Returns: `dict[str, Any]`

### ctx.leave_channel
- Signature: `await ctx.leave_channel(channel: InputChannel)`
- MTProto RPC: `channels.leaveChannel`
- Returns: `dict[str, Any]`

### ctx.invite_channel_members
- Signature: `await ctx.invite_channel_members(channel: InputChannel, users: Vector<InputUser>)`
- MTProto RPC: `channels.inviteToChannel`
- Returns: `list[dict[str, Any]]`

### ctx.remove_channel
- Signature: `await ctx.remove_channel(channel: InputChannel)`
- MTProto RPC: `channels.deleteChannel`
- Returns: `bool`

### ctx.set_channel_signatures
- Signature: `await ctx.set_channel_signatures(signatures_enabled: flags.0?true = None, profiles_enabled: flags.1?true = None, channel: InputChannel)`
- MTProto RPC: `channels.toggleSignatures`
- Returns: `bool`

### ctx.owned_public_channels
- Signature: `await ctx.owned_public_channels(by_location: flags.0?true = None, check_limit: flags.1?true = None, for_personal: flags.2?true = None, for_community_peer: flags.3?true = None)`
- MTProto RPC: `channels.getAdminedPublicChannels`
- Returns: `dict[str, Any]`

### ctx.restrict_channel_member
- Signature: `await ctx.restrict_channel_member(channel: InputChannel, participant: InputPeer, banned_rights: ChatBannedRights)`
- MTProto RPC: `channels.editBanned`
- Returns: `dict[str, Any]`

### ctx.channel_admin_log
- Signature: `await ctx.channel_admin_log(channel: InputChannel, q: string, events_filter: flags.0?ChannelAdminLogEventsFilter = None, admins: flags.1?Vector<InputUser> = None, max_id: long, min_id: long, limit: int)`
- MTProto RPC: `channels.getAdminLog`
- Returns: `dict[str, Any]`

### ctx.set_group_sticker_set
- Signature: `await ctx.set_group_sticker_set(channel: InputChannel, stickerset: InputStickerSet)`
- MTProto RPC: `channels.setStickers`
- Returns: `dict[str, Any]`

### ctx.mark_channel_media_read
- Signature: `await ctx.mark_channel_media_read(channel: InputChannel, id: Vector<int>)`
- MTProto RPC: `channels.readMessageContents`
- Returns: `bool`

### ctx.clear_channel_history
- Signature: `await ctx.clear_channel_history(for_everyone: flags.0?true = None, channel: InputChannel, max_id: int)`
- MTProto RPC: `channels.deleteHistory`
- Returns: `bool`

### ctx.set_prehistory_hidden
- Signature: `await ctx.set_prehistory_hidden(channel: InputChannel, enabled: Bool)`
- MTProto RPC: `channels.togglePreHistoryHidden`
- Returns: `bool`

### ctx.left_channels
- Signature: `await ctx.left_channels(offset: int)`
- MTProto RPC: `channels.getLeftChannels`
- Returns: `dict[str, Any]`

### ctx.eligible_discussion_groups
- Signature: `await ctx.eligible_discussion_groups()`
- MTProto RPC: `channels.getGroupsForDiscussion`
- Returns: `dict[str, Any]`

### ctx.set_discussion_group
- Signature: `await ctx.set_discussion_group(broadcast: InputChannel, group: InputChannel)`
- MTProto RPC: `channels.setDiscussionGroup`
- Returns: `dict[str, Any]`

### ctx.set_group_location
- Signature: `await ctx.set_group_location(channel: InputChannel, geo_point: InputGeoPoint, address: string)`
- MTProto RPC: `channels.editLocation`
- Returns: `dict[str, Any]`

### ctx.set_slow_mode
- Signature: `await ctx.set_slow_mode(channel: InputChannel, seconds: int)`
- MTProto RPC: `channels.toggleSlowMode`
- Returns: `bool`

### ctx.inactive_channels
- Signature: `await ctx.inactive_channels()`
- MTProto RPC: `channels.getInactiveChannels`
- Returns: `dict[str, Any]`

### ctx.send_as_identities
- Signature: `await ctx.send_as_identities(for_paid_reactions: flags.0?true = None, for_live_stories: flags.1?true = None, peer: InputPeer)`
- MTProto RPC: `channels.getSendAs`
- Returns: `dict[str, Any]`

### ctx.remove_member_history
- Signature: `await ctx.remove_member_history(channel: InputChannel, participant: InputPeer)`
- MTProto RPC: `channels.deleteParticipantHistory`
- Returns: `bool`

### ctx.set_join_to_send
- Signature: `await ctx.set_join_to_send(channel: InputChannel, enabled: Bool)`
- MTProto RPC: `channels.toggleJoinToSend`
- Returns: `bool`

### ctx.set_join_requests
- Signature: `await ctx.set_join_requests(apply_to_invites: flags.1?true = None, channel: InputChannel, enabled: Bool, guard_bot: flags.0?InputUser = None)`
- MTProto RPC: `channels.toggleJoinRequest`
- Returns: `bool`

### ctx.reorder_channel_usernames
- Signature: `await ctx.reorder_channel_usernames(channel: InputChannel, order: Vector<string>)`
- MTProto RPC: `channels.reorderUsernames`
- Returns: `dict[str, Any]`

### ctx.set_channel_username_active
- Signature: `await ctx.set_channel_username_active(channel: InputChannel, username: string, active: Bool)`
- MTProto RPC: `channels.toggleUsername`
- Returns: `bool`

### ctx.deactivate_channel_usernames
- Signature: `await ctx.deactivate_channel_usernames(channel: InputChannel)`
- MTProto RPC: `channels.deactivateAllUsernames`
- Returns: `dict[str, Any]`

### ctx.set_antispam
- Signature: `await ctx.set_antispam(channel: InputChannel, enabled: Bool)`
- MTProto RPC: `channels.toggleAntiSpam`
- Returns: `bool`

### ctx.set_members_hidden
- Signature: `await ctx.set_members_hidden(channel: InputChannel, enabled: Bool)`
- MTProto RPC: `channels.toggleParticipantsHidden`
- Returns: `bool`

### ctx.set_channel_color
- Signature: `await ctx.set_channel_color(for_profile: flags.1?true = None, channel: InputChannel, color: flags.2?int = None, background_emoji_id: flags.0?long = None)`
- MTProto RPC: `channels.updateColor`
- Returns: `dict[str, Any]`

### ctx.related_channels
- Signature: `await ctx.related_channels(channel: flags.0?InputChannel = None)`
- MTProto RPC: `channels.getChannelRecommendations`
- Returns: `dict[str, Any]`

### ctx.set_channel_emoji_status
- Signature: `await ctx.set_channel_emoji_status(channel: InputChannel, emoji_status: EmojiStatus)`
- MTProto RPC: `channels.updateEmojiStatus`
- Returns: `dict[str, Any]`

### ctx.set_group_emoji_set
- Signature: `await ctx.set_group_emoji_set(channel: InputChannel, stickerset: InputStickerSet)`
- MTProto RPC: `channels.setEmojiStickers`
- Returns: `dict[str, Any]`

### ctx.set_channel_auto_translation
- Signature: `await ctx.set_channel_auto_translation(channel: InputChannel, enabled: Bool)`
- MTProto RPC: `channels.toggleAutotranslation`
- Returns: `bool`

### ctx.set_channel_profile_tab
- Signature: `await ctx.set_channel_profile_tab(channel: InputChannel, tab: ProfileTab)`
- MTProto RPC: `channels.setMainProfileTab`
- Returns: `dict[str, Any]`

### ctx.edit_member_rank
- Signature: `await ctx.edit_member_rank(peer: InputPeer, participant: InputPeer, rank: string)`
- MTProto RPC: `messages.editChatParticipantRank`
- Returns: `dict[str, Any]`

### ctx.create_chat_invite
- Signature: `await ctx.create_chat_invite(legacy_revoke_permanent: flags.2?true = None, request_needed: flags.3?true = None, peer: InputPeer, expire_date: flags.0?int = None, usage_limit: flags.1?int = None, title: flags.4?string = None, subscription_pricing: flags.5?StarsSubscriptionPricing = None)`
- MTProto RPC: `messages.exportChatInvite`
- Returns: `dict[str, Any]`

### ctx.chat_invites
- Signature: `await ctx.chat_invites(revoked: flags.3?true = None, peer: InputPeer, admin_id: InputUser, offset_date: flags.2?int = None, offset_link: flags.2?string = None, limit: int)`
- MTProto RPC: `messages.getExportedChatInvites`
- Returns: `dict[str, Any]`

### ctx.chat_invite_details
- Signature: `await ctx.chat_invite_details(peer: InputPeer, link: string)`
- MTProto RPC: `messages.getExportedChatInvite`
- Returns: `dict[str, Any]`

### ctx.edit_chat_invite
- Signature: `await ctx.edit_chat_invite(revoked: flags.2?true = None, peer: InputPeer, link: string, expire_date: flags.0?int = None, usage_limit: flags.1?int = None, request_needed: flags.3?Bool = None, title: flags.4?string = None)`
- MTProto RPC: `messages.editExportedChatInvite`
- Returns: `dict[str, Any]`

### ctx.purge_revoked_chat_invites
- Signature: `await ctx.purge_revoked_chat_invites(peer: InputPeer, admin_id: InputUser)`
- MTProto RPC: `messages.deleteRevokedExportedChatInvites`
- Returns: `dict[str, Any]`

### ctx.remove_chat_invite
- Signature: `await ctx.remove_chat_invite(peer: InputPeer, link: string)`
- MTProto RPC: `messages.deleteExportedChatInvite`
- Returns: `bool`

### ctx.invite_admins
- Signature: `await ctx.invite_admins(peer: InputPeer)`
- MTProto RPC: `messages.getAdminsWithInvites`
- Returns: `dict[str, Any]`

### ctx.invite_joiners
- Signature: `await ctx.invite_joiners(requested: flags.0?true = None, subscription_expired: flags.3?true = None, peer: InputPeer, link: flags.1?string = None, q: flags.2?string = None, offset_date: int, offset_user: InputUser, limit: int)`
- MTProto RPC: `messages.getChatInviteImporters`
- Returns: `dict[str, Any]`

### ctx.resolve_join_request
- Signature: `await ctx.resolve_join_request(approved: flags.0?true = None, peer: InputPeer, user_id: InputUser)`
- MTProto RPC: `messages.hideChatJoinRequest`
- Returns: `dict[str, Any]`

### ctx.resolve_all_join_requests
- Signature: `await ctx.resolve_all_join_requests(approved: flags.0?true = None, peer: InputPeer, link: flags.1?string = None)`
- MTProto RPC: `messages.hideAllChatJoinRequests`
- Returns: `dict[str, Any]`

### ctx.channel_statistics
- Signature: `await ctx.channel_statistics(dark: flags.0?true = None, channel: InputChannel)`
- MTProto RPC: `stats.getBroadcastStats`
- Returns: `dict[str, Any]`

### ctx.supergroup_statistics
- Signature: `await ctx.supergroup_statistics(dark: flags.0?true = None, channel: InputChannel)`
- MTProto RPC: `stats.getMegagroupStats`
- Returns: `dict[str, Any]`

### ctx.message_statistics
- Signature: `await ctx.message_statistics(dark: flags.0?true = None, channel: InputChannel, msg_id: int)`
- MTProto RPC: `stats.getMessageStats`
- Returns: `dict[str, Any]`

### ctx.message_public_forwards
- Signature: `await ctx.message_public_forwards(channel: InputChannel, msg_id: int, offset: string, limit: int)`
- MTProto RPC: `stats.getMessagePublicForwards`
- Returns: `dict[str, Any]`

### ctx.story_statistics
- Signature: `await ctx.story_statistics(dark: flags.0?true = None, peer: InputPeer, id: int)`
- MTProto RPC: `stats.getStoryStats`
- Returns: `dict[str, Any]`

### ctx.story_public_forwards
- Signature: `await ctx.story_public_forwards(peer: InputPeer, id: int, offset: string, limit: int)`
- MTProto RPC: `stats.getStoryPublicForwards`
- Returns: `dict[str, Any]`
