# USTogether

A React + TypeScript mobile campus friendship prototype. All art is original SVG/CSS bundled with the app. No external image, font, messaging, or AI service is used.

## Run

```sh
npm install
npm run dev
```
```powershell
npm.cmd install
npm.cmd run dev
```

Open the localhost URL printed by Vite. For a production build, run `npm run build`; serve the generated `dist` folder over HTTP. Run deterministic data and movement checks with `npm test` (Node 22.6 or newer).

## Presentation walkthrough

1. Choose **Use demo profile**, or enter a name and introduction.
2. Customize any of the four avatar types, choose your interests, and select exact course sections.
3. Enter campus, switch between Classroom, Library, and Dorm. The sliders button switches exact sections.
4. Click an avatar or recommendation. Choose **Throw a hello**, wait for acceptance, and open chat.
5. Send a starter or your own message to see a simulated reply. Return through Chats to reopen it.
6. Edit your profile, avatar, interests, and classes in Profile. **Reset demo** clears this browser's saved progress.

Fictional student presence, invitation acceptance (about 3 seconds), and topic-based replies are simulated locally. Profile, appearance, selected sections, pending invitations, and conversations persist in browser localStorage. No real authentication, GPS, networking, or messaging backend is involved. Sound is off by default.


## Updated interactions

- Pixelify Sans is bundled locally under its OFL license (`public/licenses/Pixelify-Sans.txt`).
- Cats and dogs are four-legged animal sprites. Clothing colors customize their harnesses.
- Tap the floor to walk along a furniture-aware path. Walking uses continuous interpolation and animated steps; reduced-motion mode moves immediately.
- Student names stay **Unknown** in the lobby, nearby students list, introductions, and pending chats until a hello is accepted. Opening an introduction does not reveal a name. Accepted friends have a **Chat** button above them; accepted connections persist across refreshes.
- Throwing a hello shows pending status in the scene. Acceptance automatically opens a chat bubble above that student. The Chats tab also keeps the full conversation history.
- Each lobby has a quest board. Post an activity, venue, time, and 1–4 requested participants. The host is not counted among requested spots.
- Accepting someone else’s quest raises your level by one, once per quest. Hosting does not award a level. Full parties lock automatically.
- Hosts can invite nearby fictional students, who accept after a short simulated delay. This lets a presentation demonstrate filling a posted quest.
- Quests, participants, and levels persist in the same browser; **Reset demo** clears them along with the profile and chats.


## Lobby-first update

The lobby now has one location/lecture dropdown. Quests, students, and alerts are optional icon-triggered popups, with a close button, backdrop dismissal, and Escape support. Levels appear in the header profile chip and above characters. All profile headings use the bundled pixel font.

Course selection searches nine fictional sample courses by title or code and supports exact lecture sections. Existing classroom, library, and dorm student IDs are preserved.

New quests require at least one interest tag. In Profile → Quest alert interests, select independent notification interests or copy your profile interests. Matching, open quests in campus-wide locations and selected exact sections appear as in-app alerts; your own and full quests are excluded. Preferences and read state persist. Notifications run only while the prototype is open. **Preview a quest alert** creates a fictional matching quest for presentation testing.

Open Profile → Demo walkthrough for looping playback through the actual app. Demo mode shares the real onboarding forms, avatar editor, searchable class picker, campus navigation, introductions, chat, and quest popup. It drives their normal state and action handlers with sample data; there is no separate demo screen implementation.

Controls include Previous, Next, a direct slide dropdown, Play/Pause, Replay, and Exit. Each slide resets and repeats until you choose another. Pausing freezes the scripted actions, invitation acceptance, and replies. Interacting with the app pauses playback so you can demonstrate the same live controls manually. Reduced-motion preferences start the demo paused.

Entering presentation mode snapshots the current session. Demo progress never writes to localStorage. Exit restores the previous session, and refreshing mid-demo loads the saved real profile and progress. Demo reset clears only the current sample slide. The extra playback toolbar is the only presentation-specific interface.


The classroom contains six long desks, twelve seats, a lecture screen, and sea-facing windows. The library has full-height bookcases and study tables. The dorm is a kitchen/lounge with a sink, hob, fridge, dining table, sofa, TV, and noticeboard. Three icons in the app header open quests, students, and alerts. The Firebird is a round pixel mascot with a cream belly, large eyes, wings, and a flame tuft, inspired by the supplied reference.

Character chat renders as a bounded overlay outside the scene layout. Opening, sending, receiving, and closing messages do not resize or scroll the lobby; only message history scrolls internally. The scene fits the available lobby height, and the overlay follows viewport and keyboard size changes.


## Quest layout, zoom, and presentation identity

Quests, Students, and Alerts are now the three top app shortcuts. The old presentation/share-looking shortcut has been removed; start the walkthrough from Profile. Quest creation replaces the popup contents with a top-aligned form. Back returns to the quest list, posting returns to the top with the new quest first, and the popup close button remains available.

The lobby starts at a larger 112% fit view. Zoom In, Zoom Out, and Fit controls change only the scene scale, keeping page layout and character movement coordinates stable. Chat repositions against the scaled character.

Both the demo profile shortcut and all presentation chapters use **Firebird Chan**, a red **Firebird** with a **Scarf**. Introduction and Chat are one chapter containing discovery, introduction, greeting, acceptance, and messages. The nine chapters are Profile, Avatar, Interests, Classes, Lobby, Introduction & Chat, Join a quest, Add a quest, and Forums.


## Quest creation demo and popup polish

The **Add a quest** demo chapter opens the real quest form, types an activity, venue, time and details, selects two requested participants and a Table tennis interest tag, and posts the quest. It repeats after 18 seconds with fresh sample data. Pausing and manual interaction work as on the other chapters, and real saved quests remain untouched.

Quest notification banners now appear directly below the location dropdown as an overlay, without moving the lobby. Quest, Student, and Alert popups share a full-app dimmed backdrop and one clipped, rounded content surface, eliminating the inset corner artifacts.


## Lobby discussions

Campus shows only the newest post below the location selector. Hide discussions collapses the preview to a small Show discussions button; this choice stays in effect while navigating the app. Classrooms show only the selected exact lecture section; Library and Dorm show your joined communities. View all or a post preview opens the shared forum over the lobby. The duplicate scene Noticeboard shortcut has been removed. Selecting a post opens only that thread and its comments; All discussions returns to the feed. Post to classroom starts a composer for that section; campus spaces let you choose a joined community. Posts, likes, and replies share the existing browser-persisted forum store with Chats > Forums.

Posts created from the lobby return you to the room with a speech bubble above your avatar. The newest accessible post from an author present in that room appears for 15 seconds, with at most one bubble visible. Selecting it opens the original forum thread and its replies. Posts retain a stable author ID and their room; classroom posts stay tied to their exact section. Interest posts created from Chats remain in their community without broadcasting into an unrelated room. Bubbles do not duplicate posts or create a separate chat history. Other students remain fictional; there is no multi-user delivery backend.


## Fictional forum activity

Normal lobby use seeds three fictional posts per room and attempts a new random student post after about two seconds, then every 30-45 seconds while the room is open. Posts use nearby student identities and joined communities, with occasional sample replies. A 25-second quiet period after a recent room post prevents immediate interruptions. Posting pauses while another screen, chat, or popup is open. History is limited to eight fictional posts per room (or fewer when its sample topics run out), preserving user posts, replies, and likes. Rooms without an accessible community do not generate posts.

The Lobby walkthrough chapter scripts student posts as it visits the classroom, Library, and Dorm. Demo chapters start with isolated fictional forum history; playback controls govern scripted posts, and exiting restores the saved real session. These posts are local sample data, not network activity.


## Face-to-face conversation starters

Open a personal conversation from Chats and select **Meet f2f** in its header (also available from the character chat's people icon). The popup suggests conversation starters from shared interests and, when both students belong to the same exact lecture section, their shared class. A class topic stays visible even with many shared interests. Campus icebreakers fill remaining space when there is less in common. Suggestions are generated locally from profile data.


## Responsive phone layout

Phone screens use the full available viewport with notch and home-indicator insets, fluid side spacing, larger touch controls, and 16px form text. Short screens keep the main actions and message composer visible while content scrolls inside the app. Landscape phones show campus controls beside the room and navigation along the right edge. Character chat avoids that navigation rail. Desktop keeps its framed layout.

Browser viewport checks cover widths from 320 to 440px, landscape sizes from 568?320 to 932?430, and the desktop frame in Chromium and WebKit. Real iOS and Android keyboard behavior should also be checked on devices.


## Demo and normal-use consistency checks

The walkthrough drives the same forms, chat, quest board, forum composer, and actions used in normal sessions. Manual interactions pause playback. Press Play to resume pending simulated hellos, replies, and quest invitations. Demo room-post bubbles also follow playback time. Introductions keep the hello/chat action visible while their details scroll, and share Escape dismissal and keyboard focus handling with other popups. Exiting restores the previous session, discussion visibility, message drafts, and pending live replies; demo invitations cannot modify saved real quests.

Run `npm test` for model checks and `npm run test:browser` for Chromium/WebKit interaction checks. The browser suite requires Google Chrome and Playwright WebKit (`npx playwright install webkit`). It uses a separate local server on port 5174 and covers all nine chapters, normal onboarding and matching, chats, quests, forums, pause/resume, session restoration, and phone/desktop dialog layout. Browser checks use isolated local sample data.
