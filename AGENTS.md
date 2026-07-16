# AGENTS.md — Zustand Docs RAG Chatbot (Frontend)

Rules for any AI agent (Claude, Copilot, etc.) working on the **frontend** codebase.
This complements the backend `AGENTS.md` — shared principles (phase discipline, surgical
changes, security-first) apply here too, adapted for React Native/Expo.

## Project Snapshot
- **Goal**: Mobile chat UI for the RAG chatbot, consuming the backend's REST API.
- **Stack**: React Native + Expo, **React Navigation** (not Expo Router), **Zustand** for
  state management, Axios for networking.
- **Language**: JavaScript only — no TypeScript, no Python, ever.
- **Module system**: ES Modules (`import`/`export`) throughout.
- **Auth**: JWT access/refresh tokens. Access token in memory/store, refresh token in
  Expo SecureStore (React Native does not persist httpOnly cookies across cold starts).

## Phase Discipline
- Frontend work should track the backend's active phase — don't build UI for retrieval
  features (hybrid search filters, agent routing indicators, MCP tool pickers) before the
  backend phase that powers them is actually done.
- If a UI request implies backend functionality that doesn't exist yet, flag it and ask
  whether to stub it, mock it, or wait.

## Code Conventions
- **Components**: functional components + hooks only. No class components.
- **File structure**: one component per file, colocate small helper components only if
  they're not reused elsewhere.
- **State management**:
  - Zustand for global/shared state (auth state, chat session, UI-wide flags).
  - Local `useState`/`useReducer` for component-local state — don't push everything into
    a Zustand store by default.
  - Keep Zustand stores **sliced by domain** (e.g. `useAuthStore`, `useChatStore`), not one
    giant store.
  - Selectors over full-store destructuring where re-render cost matters (chat message
    lists, streaming responses).
- **Navigation**: React Navigation only. Don't introduce Expo Router or mix navigation
  paradigms.
- **Networking**: all HTTP calls go through the shared Axios instance (with the existing
  request/response interceptors for silent token refresh) — no ad-hoc `fetch()` calls that
  bypass the interceptor and auth handling.
- **Styling**: keep styles colocated with components (`StyleSheet.create`) unless a shared
  theme/tokens file already exists — don't introduce a new styling library without asking.
- **Surgical changes**: prefer minimal, targeted diffs over rewriting working screens or
  navigation structure.
- Explain new RN/Expo/Zustand/navigation concepts inline when first introduced.

## Security Rules (non-negotiable)
1. **Never read, print, log, or embed the contents of `.env`, `app.config.js` secrets, or
   any key/credential file** in output, chat, or committed code.
2. **Never hardcode API keys, backend URLs with embedded secrets, or tokens** — always
   reference `process.env` / Expo config (`app.config.js` → `extra`), never inline.
3. **Never `console.log` tokens, refresh tokens, passwords, or full auth payloads** — not
   even temporarily for debugging. Redact or log booleans/status only.
4. **Refresh tokens live only in Expo SecureStore** — never in AsyncStorage, never in plain
   component state that could leak into logs or crash reports, never in Zustand state that
   gets persisted unencrypted.
5. **Access tokens**: keep in memory (Zustand) only — don't persist them to disk.
6. **Ask before any native-level or config change**, including:
   - Editing `app.json` / `app.config.js`, `eas.json`, or native `ios/`/`android/` folders
   - Adding native modules or anything requiring a new Expo prebuild
   - Changing permissions (camera, mic, notifications, etc.)
7. **Ask before installing/removing npm packages**, especially anything with native code.
8. **Ask before destructive or irreversible actions**: deleting screens/components in use,
   clearing SecureStore/AsyncStorage programmatically, force-pushing, `git reset --hard`.
9. **Never send tokens or sensitive payloads to third-party logging/analytics tools**
   without explicit confirmation.
10. No silent scope creep — if a fix requires touching navigation structure, global state
    shape, or files outside what was asked, confirm first.

## Directory Scanning
- When asked to "scan the whole directory/project," **skip** these paths — do not read,
  list deeply, or index them:
  - `node_modules/`
  - `.git/`
  - `.expo/`, `.expo-shared/`
  - `ios/`, `android/` build artifacts (`ios/build`, `android/app/build`, `Pods/`)
  - `dist/`, `web-build/`, `coverage/`
  - `*.log`, `.DS_Store`
  - Any large local doc dumps or mock data folders not part of the app source
- If a full scan seems to require entering one of these (e.g. debugging a native build
  issue), ask first instead of doing it silently.

## UX & Quality Bar
- Loading and error states are not optional — every screen that fetches data needs both,
  even in early phases (can be minimal, just not absent).
- Keep chat/streaming UI responsive: avoid blocking re-renders on every token; batch
  updates where reasonable.
- Accessibility basics (readable font sizes, sufficient tap targets, `accessibilityLabel`
  on icon-only buttons) — don't skip these for "just a prototype."

## When Unsure
- Prefer asking a clarifying question over guessing on anything security-, native-config-,
  or navigation-structure-related.
- Default to the smallest safe change that satisfies the request.
