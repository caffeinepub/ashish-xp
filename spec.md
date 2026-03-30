# Ashish XP

## Current State
New project. Empty Motoko backend and no frontend code.

## Requested Changes (Diff)

### Add
- Full-screen password lock screen (hashed check, session stored in sessionStorage)
- Main dashboard with four category sections: Editing Videos, ZIP Files, Presets, Overlays
- Featured section at the top of the dashboard
- Search bar filtering across all content
- File cards with thumbnail, title, category badge, download button
- Download history page (stored in localStorage)
- Hidden admin panel at `/admin` route, protected by admin password
- Admin CRUD: add, edit, delete files (title, category, thumbnail URL, download URL)
- Admin can set a notice/update banner message
- Motoko backend storing all file content and notice message, with sample seed data
- Neon dark theme (black background, cyan/purple accents), glow effects, animations
- Responsive mobile + desktop layout

### Modify
- Nothing (new project)

### Remove
- Nothing

## Implementation Plan
1. Motoko backend:
   - FileItem type: id, title, category, thumbnailUrl, downloadUrl, featured (Bool)
   - Functions: getFiles, addFile, updateFile, deleteFile, getFeatured, setFeatured
   - NoticeMessage: getText, setText
   - Seed sample data on first init (4 categories, 2-3 items each)
   - Admin auth: verify password hash server-side (compare hash of submitted password)
2. Frontend:
   - React Router with routes: `/` (lock), `/dashboard`, `/history`, `/admin`
   - LockScreen component: password input, session check on mount
   - Dashboard: featured banner, search bar, category tabs/sections, file cards
   - FileCard: thumbnail, title, badge, download button (opens URL, logs to localStorage)
   - HistoryPage: reads localStorage download history
   - AdminPanel: login gate, CRUD table, notice message editor
   - Global notice banner shown when message is set
