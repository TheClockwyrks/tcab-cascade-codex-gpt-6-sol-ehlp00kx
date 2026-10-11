# Cascade

Cascade is a browser-based Draw Three Klondike solitaire. Build each suit from Ace to King on the four foundations. The game includes a card cascade when you win.

## Run locally

```sh
npm ci
npm run dev
```

Open the address Vite prints. To make a static production site, run `npm run build`; serve the resulting `dist/` directory from any static server.

## Controls

- Click or tap the stock to turn three cards. Click the empty stock to recycle the waste.
- Drag face-up cards or valid runs between columns. Only a King can fill an empty column.
- Drag one card to a foundation, or double-click the top card of a column or waste fan to send it home.
- Click or tap the on-screen menu controls. Use Up/Down or W/S and Enter/Space to navigate menus; Escape returns from How to Play.
- The SOUND control in the bottom strip toggles audio. Backtick toggles the read-only debug overlay.

Run `npm test`, `npm run typecheck`, `npm run lint`, and `npm run format` to check the code.
