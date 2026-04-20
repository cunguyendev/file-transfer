# file-transfer

Self-contained production bundle of the LAN file-sharing app.
UI (React) is pre-built into `src/assets/public/` and served by the Express API at `/`.

![file-transfer preview](./file-transfer-preview.png)

## Features

- Drag-and-drop multi-file uploads with progress
- Inline preview modal (images + videos) + one-click download
- **Optional password protection** — set a password at upload time; viewing or downloading the file afterwards requires it
- **Share links** — each file has a Share button that copies a `?share=<name>` URL; opening that URL pins the file to the top of the list with a banner + badge so recipients can spot it immediately
- Real-time device presence + file list sync across all connected devices via Socket.IO
- In-app update banner when a newer release is tagged on GitHub
- Floating "Report bug" button that opens GitHub issues in a new tab

## Install & run

```bash
npm install --omit=dev     # or: pnpm install --prod
node main.js               # or: npm start
```

Server listens on `http://0.0.0.0:3005` by default. Share the `Network` URL
printed on startup with other devices on the same LAN.

## Environment variables

| Name             | Default     | Purpose                              |
| ---------------- | ----------- | ------------------------------------ |
| `FT_HOST`        | `0.0.0.0`   | Interface the API binds to           |
| `FT_PORT`        | `3005`      | API port                             |
| `FT_UPLOADS_DIR` | `./uploads` | Where uploaded files are stored      |

## Endpoints

- `GET  /`                             — React UI
- `GET  /files`                        — list uploaded files (each entry includes `hasPassword: boolean`)
- `POST /upload`                       — multipart upload (field: `files`, supports multiple; optional `password` text field protects the batch)
- `GET  /preview/:filename`            — inline view (used by UI thumbs & modal). Protected files require `?password=…` or `X-File-Password` header
- `GET  /download/:filename`           — download (attachment). Same password gate as `/preview`
- `POST /verify-password/:filename`    — validate a password (JSON body `{ password }`) before opening a download/preview URL
- `DELETE /files/:filename`            — delete (also removes the associated `.meta.json` sidecar)
- `GET  /version`                      — current version + latest GitHub tag (used by the in-app update banner)
- Socket.IO at `/socket.io/`           — emits `files:new`, `files:deleted`, `devices:update`, `update:available`

## About passwords

Password protection is **per-file** and optional. When set, the password is hashed with
`crypto.scrypt` + a random salt and stored in a `<filename>.meta.json` sidecar next to
the file in `FT_UPLOADS_DIR`. Plaintext is never written to disk.

Hashes are one-way — there is **no password recovery**. If you lose a password, the file
itself still exists but can only be made accessible again by deleting (or editing) its
`.meta.json` sidecar on the server.

## About share links

Share URLs look like `http://<host>:3005/?share=<encoded-filename>`. They only carry the
filename, never the password — protected files shared this way still prompt for the
password on view/download. Clear the shared state with the ✕ button on the green banner.

## Report a bug or request a feature

Found something broken or have an idea to make this better?
[Open an issue on GitHub](https://github.com/cunguyendev/file-transfer/issues) — bug reports, feature requests, and feedback are all welcome.
