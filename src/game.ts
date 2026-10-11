import type {
  Game,
  InitApi,
  RenderApi,
  UpdateApi,
} from "@clockwyrks/simple-2d";
import type { DeepReadonly } from "ts-essentials";
import {
  STAGE_W,
  STAGE_H,
  CARD_W,
  CARD_H,
  COLUMN_X,
  TOP_ROW_Y,
  STOCK_X,
  WASTE_X,
  FOUNDATION_X,
  TABLEAU_Y,
  FACE_DOWN_OFFSET,
  FACE_UP_OFFSET,
  FACE_UP_OFFSET_MIN,
  COLUMN_BOTTOM_LIMIT,
  HUD_Y,
  HUD_H,
  MENU_UP,
  MENU_DOWN,
  MENU_CONFIRM,
  MENU_BACK,
  MENU_BINDINGS,
  DRAG_THRESHOLD,
  DOUBLE_CLICK_WINDOW,
  DOUBLE_CLICK_SLOP,
  SUITS,
  RANK_MIN,
  RANK_MAX,
  DECK_SIZE,
  TABLEAU_COLUMNS,
  FOUNDATION_COUNT,
  TURN_COUNT,
  DEAL_MODE,
  DEAL_MODE_LABEL,
  WASTE_FAN,
  LAUNCH_INTERVAL,
  LAUNCH_VY,
  LAUNCH_VX_MIN,
  LAUNCH_VX_MAX,
  GRAVITY,
  BOUNCE_DAMP,
  FLOOR_Y,
  TITLE_TEXT,
  TAGLINE_TEXT,
  TITLE_ITEMS,
  HOWTO_BACK_LABEL,
  HUD_ITEMS,
  WIN_TEXT,
  CUES,
  CASCADE_DEBUG_VERSION,
  type CueName,
} from "./constants";

export type Screen = "title" | "howto" | "playing" | "won";
export type Suit = "spades" | "hearts" | "diamonds" | "clubs";
export type PileKind = "stock" | "waste" | "foundation" | "tableau";
export interface CardState {
  readonly id: number;
  readonly suit: Suit;
  readonly rank: number;
  readonly faceUp: boolean;
}
export interface DragState {
  readonly cards: readonly CardState[];
  readonly fromPile: "waste" | "foundation" | "tableau";
  readonly fromIndex: number;
  readonly x: number;
  readonly y: number;
}
export interface DropTargetState {
  readonly pile: "foundation" | "tableau";
  readonly index: number;
}
export interface PointerState {
  readonly x: number;
  readonly y: number;
  readonly down: boolean;
}
export interface PressState {
  readonly x: number;
  readonly y: number;
  readonly at: number;
}
export interface FlyerState {
  readonly id: number;
  readonly suit: Suit;
  readonly rank: number;
  readonly x: number;
  readonly y: number;
  readonly vx: number;
  readonly vy: number;
}
export interface CascadeState {
  readonly screen: Screen;
  readonly menuIndex: number;
  readonly titleIndex: number;
  readonly stock: readonly CardState[];
  readonly waste: readonly CardState[];
  readonly wasteSets: readonly number[];
  readonly foundations: readonly (readonly CardState[])[];
  readonly tableau: readonly (readonly CardState[])[];
  readonly drag: DragState | null;
  readonly dropTarget: DropTargetState | null;
  readonly pointer: PointerState;
  readonly lastPress: PressState | null;
  readonly autoFlip: boolean;
  readonly winDetect: boolean;
  readonly launching: boolean;
  readonly trailPainting: boolean;
  readonly launchClock: number;
  readonly launched: number;
  readonly flyers: readonly FlyerState[];
  readonly cascadeDone: boolean;
  readonly trailStamps: number;
  readonly nextId: number;
  readonly simTime: number;
  readonly muted: boolean;
}
type ReadState = DeepReadonly<CascadeState>;
type ColorCard = CardState & { color: "red" | "black" };
type Snapshot = Omit<
  CascadeState,
  "stock" | "waste" | "foundations" | "tableau" | "drag" | "nextId"
> & {
  version: number;
  dealMode: string;
  turnCount: number;
  dealModeLabel: string;
  stock: ColorCard[];
  waste: ColorCard[];
  foundations: ColorCard[][];
  tableau: ColorCard[][];
  wasteVisibleCount: number;
  drag: (Omit<DragState, "cards"> & { cards: ColorCard[] }) | null;
};
type Rect = { x: number; y: number; w: number; h: number };
export interface CascadeDebugApi {
  readonly version: number;
  reset(s: ReadState): CascadeState;
  snapshot(s: ReadState): Snapshot;
  reconcile(s: ReadState): CascadeState;
  menuItemRect(s: ReadState, index: number): Rect | null;
  setScreen(s: ReadState, screen: Screen): CascadeState;
  setMenuIndex(s: ReadState, index: number): CascadeState;
  setTitleIndex(s: ReadState, index: number): CascadeState;
  addCard(
    s: ReadState,
    pile: PileKind,
    index: number,
    suit: Suit,
    rank: number,
    faceUp: boolean,
  ): CascadeState;
  removeCard(s: ReadState, id: number): CascadeState;
  setCardFaceUp(s: ReadState, id: number, faceUp: boolean): CascadeState;
  clearPile(s: ReadState, pile: PileKind, index: number): CascadeState;
  clearTable(s: ReadState): CascadeState;
  addWasteSet(s: ReadState, count: number): CascadeState;
  clearWasteSets(s: ReadState): CascadeState;
  deal(s: ReadState): CascadeState;
  turnStock(s: ReadState): CascadeState;
  move(
    s: ReadState,
    fromPile: PileKind,
    fromIndex: number,
    fromRow: number,
    toPile: PileKind,
    toIndex: number,
  ): [CascadeState, boolean];
  autoMove(
    s: ReadState,
    pile: PileKind,
    index: number,
  ): [CascadeState, boolean];
  pointerDown(s: ReadState, x: number, y: number): CascadeState;
  pointerMove(s: ReadState, x: number, y: number): CascadeState;
  pointerUp(s: ReadState, x: number, y: number): CascadeState;
  setAutoFlip(s: ReadState, enabled: boolean): CascadeState;
  setWinDetect(s: ReadState, enabled: boolean): CascadeState;
  setLaunching(s: ReadState, enabled: boolean): CascadeState;
  setTrailPainting(s: ReadState, enabled: boolean): CascadeState;
  addFlyer(
    s: ReadState,
    suit: Suit,
    rank: number,
    x: number,
    y: number,
    vx: number,
    vy: number,
  ): CascadeState;
  setFlyerPosition(
    s: ReadState,
    id: number,
    x: number,
    y: number,
  ): CascadeState;
  setFlyerVelocity(
    s: ReadState,
    id: number,
    vx: number,
    vy: number,
  ): CascadeState;
  removeFlyer(s: ReadState, id: number): CascadeState;
  clearFlyers(s: ReadState): CascadeState;
  setLaunchClock(s: ReadState, seconds: number): CascadeState;
  clearTrail(s: ReadState): CascadeState;
  drawLaunchVx(s: ReadState): number;
}
export const BACKGROUND = "#123b38";
const red = (suit: Suit): boolean => suit === "hearts" || suit === "diamonds";
const colored = (c: CardState): ColorCard => ({
  ...c,
  color: red(c.suit) ? "red" : "black",
});
const top = (p: readonly CardState[]): CardState | undefined => p[p.length - 1];
const inside = (x: number, y: number, r: Rect): boolean =>
  x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h;
const length = (x: number, y: number): number => Math.hypot(x, y);
function base(muted = false): CascadeState {
  return {
    screen: "title",
    menuIndex: 0,
    titleIndex: 0,
    stock: [],
    waste: [],
    wasteSets: [],
    foundations: Array.from({ length: FOUNDATION_COUNT }, () => []),
    tableau: Array.from({ length: TABLEAU_COLUMNS }, () => []),
    drag: null,
    dropTarget: null,
    pointer: { x: 0, y: 0, down: false },
    lastPress: null,
    autoFlip: true,
    winDetect: true,
    launching: true,
    trailPainting: true,
    launchClock: 0,
    launched: 0,
    flyers: [],
    cascadeDone: false,
    trailStamps: 0,
    nextId: 1,
    simTime: 0,
    muted,
  };
}
function pile(
  s: ReadState,
  kind: PileKind,
  index: number,
): readonly CardState[] {
  if (kind === "stock" || kind === "waste") {
    if (index !== 0) throw new Error(`Invalid ${kind} index ${index}`);
    return kind === "stock" ? s.stock : s.waste;
  }
  const p = kind === "foundation" ? s.foundations[index] : s.tableau[index];
  if (!p || !Number.isInteger(index))
    throw new Error(`Invalid ${kind} index ${index}`);
  return p;
}
function replacePile(
  s: ReadState,
  kind: PileKind,
  index: number,
  cards: readonly CardState[],
): CascadeState {
  pile(s, kind, index);
  if (kind === "stock") return { ...s, stock: cards };
  if (kind === "waste") return { ...s, waste: cards };
  if (kind === "foundation")
    return {
      ...s,
      foundations: s.foundations.map((p, i) => (i === index ? cards : p)),
    };
  return { ...s, tableau: s.tableau.map((p, i) => (i === index ? cards : p)) };
}
function wasteSetsAfterPlay(sets: readonly number[]): number[] {
  const result = [...sets];
  if (result.length) {
    result[result.length - 1]--;
    if (result[result.length - 1] <= 0) result.pop();
  }
  return result;
}
function runValid(cards: readonly CardState[]): boolean {
  return (
    cards.length > 0 &&
    cards.every(
      (c, i) =>
        c.faceUp &&
        (i === 0 ||
          (cards[i - 1].rank === c.rank + 1 &&
            red(cards[i - 1].suit) !== red(c.suit))),
    )
  );
}
function accepts(
  s: ReadState,
  kind: PileKind,
  index: number,
  cards: readonly CardState[],
): boolean {
  const p = pile(s, kind, index);
  if (!runValid(cards)) return false;
  if (kind === "foundation")
    return (
      cards.length === 1 &&
      (!top(p)
        ? cards[0].rank === RANK_MIN
        : top(p)!.suit === cards[0].suit && cards[0].rank === top(p)!.rank + 1)
    );
  if (kind === "tableau")
    return !top(p)
      ? cards[0].rank === RANK_MAX
      : top(p)!.faceUp &&
          top(p)!.rank === cards[0].rank + 1 &&
          red(top(p)!.suit) !== red(cards[0].suit);
  return false;
}
function checkWin(s: ReadState): CascadeState {
  if (
    s.winDetect &&
    s.foundations.reduce((n, p) => n + p.length, 0) === DECK_SIZE &&
    s.foundations.every((p) => p.length === RANK_MAX)
  )
    return {
      ...s,
      screen: "won",
      launchClock: LAUNCH_INTERVAL,
      launched: 0,
      cascadeDone: false,
    };
  return { ...s };
}
function applyMove(
  s: ReadState,
  from: PileKind,
  fi: number,
  row: number,
  to: PileKind,
  ti: number,
): [CascadeState, boolean] {
  const source = pile(s, from, fi);
  pile(s, to, ti);
  if (!Number.isInteger(row) || row < 0 || row >= source.length)
    return [{ ...s }, false];
  if (
    from === "stock" ||
    to === "stock" ||
    to === "waste" ||
    (from === to && fi === ti)
  )
    return [{ ...s }, false];
  if ((from === "waste" || from === "foundation") && row !== source.length - 1)
    return [{ ...s }, false];
  if (from === "waste" && !s.wasteSets.length) return [{ ...s }, false];
  const cards = source.slice(row);
  if (!accepts(s, to, ti, cards)) return [{ ...s }, false];
  let next = replacePile(s, from, fi, source.slice(0, row));
  next = replacePile(next, to, ti, [...pile(next, to, ti), ...cards]);
  if (from === "waste")
    next = { ...next, wasteSets: wasteSetsAfterPlay(s.wasteSets) };
  if (from === "tableau" && next.autoFlip) {
    const exposed = top(next.tableau[fi]);
    if (exposed && !exposed.faceUp)
      next = replacePile(
        next,
        "tableau",
        fi,
        next.tableau[fi].map((c, i) =>
          i === next.tableau[fi].length - 1 ? { ...c, faceUp: true } : c,
        ),
      );
  }
  return [checkWin(next), true];
}
function autoMove(
  s: ReadState,
  kind: PileKind,
  index: number,
): [CascadeState, boolean] {
  const source = pile(s, kind, index);
  if (kind !== "waste" && kind !== "tableau") return [{ ...s }, false];
  const card = top(source);
  if (!card || !card.faceUp || (kind === "waste" && !s.wasteSets.length))
    return [{ ...s }, false];
  const target = s.foundations.findIndex((_, i) =>
    accepts(s, "foundation", i, [card]),
  );
  return target < 0
    ? [{ ...s }, false]
    : applyMove(s, kind, index, source.length - 1, "foundation", target);
}
export function deal(s: ReadState): CascadeState {
  const deck: CardState[] = [];
  let id = s.nextId;
  for (const suit of SUITS)
    for (let rank = RANK_MIN; rank <= RANK_MAX; rank++)
      deck.push({ id: id++, suit, rank, faceUp: false });
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  let cursor = 0;
  const tableau = Array.from({ length: TABLEAU_COLUMNS }, (_, i) =>
    Array.from({ length: i + 1 }, (_, j) => ({
      ...deck[cursor++],
      faceUp: j === i,
    })),
  );
  clearPaint();
  return {
    ...s,
    tableau,
    stock: deck.slice(cursor),
    waste: [],
    wasteSets: [],
    foundations: Array.from({ length: FOUNDATION_COUNT }, () => []),
    launched: 0,
    trailStamps: 0,
    nextId: id,
  };
}
function freshGame(s: ReadState): CascadeState {
  return {
    ...deal(s),
    drag: null,
    dropTarget: null,
    launchClock: 0,
    flyers: [],
    cascadeDone: false,
  };
}
export function turnStock(s: ReadState): CascadeState {
  if (s.stock.length) {
    const n = Math.min(TURN_COUNT, s.stock.length);
    const turned = s.stock
      .slice(-n)
      .reverse()
      .map((c) => ({ ...c, faceUp: true }));
    return {
      ...s,
      stock: s.stock.slice(0, -n),
      waste: [...s.waste, ...turned],
      wasteSets: [...s.wasteSets, n],
    };
  }
  if (!s.waste.length) return { ...s };
  return {
    ...s,
    stock: [...s.waste].reverse().map((c) => ({ ...c, faceUp: false })),
    waste: [],
    wasteSets: [],
  };
}
function columnYs(cards: readonly CardState[]): number[] {
  const down = cards.slice(0, -1).filter((c) => !c.faceUp).length;
  const up = cards.length - 1 - down;
  const fit = up
    ? (COLUMN_BOTTOM_LIMIT - TABLEAU_Y - CARD_H - down * FACE_DOWN_OFFSET) / up
    : FACE_UP_OFFSET;
  const offset = Math.max(FACE_UP_OFFSET_MIN, Math.min(FACE_UP_OFFSET, fit));
  const ys = [TABLEAU_Y];
  for (let i = 1; i < cards.length; i++)
    ys.push(ys[i - 1] + (cards[i - 1].faceUp ? offset : FACE_DOWN_OFFSET));
  return ys;
}
function rect(s: ReadState, kind: PileKind, index: number): Rect {
  const p = pile(s, kind, index);
  if (kind === "stock")
    return { x: STOCK_X, y: TOP_ROW_Y, w: CARD_W, h: CARD_H };
  if (kind === "waste")
    return { x: WASTE_X, y: TOP_ROW_Y, w: CARD_W, h: CARD_H };
  if (kind === "foundation")
    return { x: FOUNDATION_X[index], y: TOP_ROW_Y, w: CARD_W, h: CARD_H };
  const ys = columnYs(p);
  return {
    x: COLUMN_X[index],
    y: TABLEAU_Y,
    w: CARD_W,
    h: p.length ? ys[ys.length - 1] + CARD_H - TABLEAU_Y : CARD_H,
  };
}
function hitPile(
  s: ReadState,
  x: number,
  y: number,
): { kind: PileKind; index: number } | null {
  for (const kind of ["stock", "waste", "foundation", "tableau"] as const)
    for (
      let i = 0;
      i <
      (kind === "foundation"
        ? FOUNDATION_COUNT
        : kind === "tableau"
          ? TABLEAU_COLUMNS
          : 1);
      i++
    )
      if (inside(x, y, rect(s, kind, i))) return { kind, index: i };
  return null;
}
function target(s: ReadState): DropTargetState | null {
  if (!s.drag) return null;
  const h = hitPile(s, s.drag.x + CARD_W / 2, s.drag.y + CARD_H / 2);
  return h &&
    (h.kind === "foundation" || h.kind === "tableau") &&
    !(h.kind === s.drag.fromPile && h.index === s.drag.fromIndex) &&
    accepts(s, h.kind, h.index, s.drag.cards)
    ? { pile: h.kind, index: h.index }
    : null;
}
const titleRects: Rect[] = [
  { x: 490, y: 400, w: 300, h: 56 },
  { x: 490, y: 470, w: 300, h: 56 },
];
const howtoRects: Rect[] = [{ x: 520, y: 585, w: 240, h: 58 }];
const hudRects: Rect[] = [
  { x: 18, y: HUD_Y + 3, w: 140, h: HUD_H - 6 },
  { x: 166, y: HUD_Y + 3, w: 110, h: HUD_H - 6 },
  { x: 284, y: HUD_Y + 3, w: 120, h: HUD_H - 6 },
];
function menuRects(screen: Screen): Rect[] {
  return screen === "title"
    ? titleRects
    : screen === "howto"
      ? howtoRects
      : screen === "playing"
        ? hudRects
        : [];
}
function activate(
  s: ReadState,
  index: number,
  toggleMute?: () => boolean,
): CascadeState {
  if (s.screen === "title")
    return index === 0
      ? { ...freshGame(s), screen: "playing", menuIndex: 0, titleIndex: 0 }
      : { ...s, screen: "howto", menuIndex: 0, titleIndex: 1 };
  if (s.screen === "howto")
    return { ...s, screen: "title", menuIndex: s.titleIndex };
  if (s.screen === "playing") {
    if (index === 0) return { ...freshGame(s), menuIndex: 0 };
    if (index === 1)
      return {
        ...s,
        screen: "title",
        menuIndex: s.titleIndex,
        drag: null,
        dropTarget: null,
      };
    if (index === 2)
      return { ...s, muted: toggleMute ? toggleMute() : !s.muted };
  }
  return { ...s };
}
function menuHit(s: ReadState, x: number, y: number): number {
  return menuRects(s.screen).findIndex((r) => inside(x, y, r));
}
function lift(s: ReadState, x: number, y: number): DragState | null {
  const wasteCount = Math.min(
    s.waste.length,
    s.wasteSets[s.wasteSets.length - 1] ?? 0,
  );
  const wasteTopX = WASTE_X + Math.max(0, wasteCount - 1) * WASTE_FAN;
  const h =
    wasteCount &&
    inside(x, y, { x: wasteTopX, y: TOP_ROW_Y, w: CARD_W, h: CARD_H })
      ? { kind: "waste" as PileKind, index: 0 }
      : hitPile(s, x, y);
  if (!h || h.kind === "stock") return null;
  const p = pile(s, h.kind, h.index);
  if (!p.length || (h.kind === "waste" && !s.wasteSets.length)) return null;
  let row = p.length - 1;
  let cardX = rect(s, h.kind, h.index).x;
  let cardY = rect(s, h.kind, h.index).y;
  if (h.kind === "tableau") {
    const ys = columnYs(p);
    row = -1;
    for (let i = 0; i < p.length; i++)
      if (inside(x, y, { x: cardX, y: ys[i], w: CARD_W, h: CARD_H })) row = i;
    if (row < 0) return null;
    cardY = ys[row];
  } else if (h.kind === "waste") {
    const count = Math.min(p.length, s.wasteSets[s.wasteSets.length - 1] ?? 0);
    cardX = WASTE_X + (count - 1) * WASTE_FAN;
    if (!inside(x, y, { x: cardX, y: TOP_ROW_Y, w: CARD_W, h: CARD_H }))
      return null;
  }
  if (!p[row].faceUp) return null;
  return {
    cards: p.slice(row),
    fromPile: h.kind,
    fromIndex: h.index,
    x: cardX,
    y: cardY,
  };
}
function pointerDown(s: ReadState, x: number, y: number): CascadeState {
  const previous = s.lastPress;
  const stamp = { x, y, at: s.simTime };
  let next: CascadeState = {
    ...s,
    pointer: { x, y, down: true },
    lastPress: stamp,
  };
  if (s.screen === "won")
    return { ...freshGame(next), screen: "playing", menuIndex: 0 };
  const menu = menuHit(s, x, y);
  if (menu >= 0) next = { ...next, menuIndex: menu };
  if (s.screen !== "playing" || menu >= 0) return next;
  const held = lift(s, x, y);
  if (!held) return next;
  const isDouble =
    previous &&
    s.simTime - previous.at <= DOUBLE_CLICK_WINDOW &&
    length(x - previous.x, y - previous.y) <= DOUBLE_CLICK_SLOP &&
    held.cards.length === 1 &&
    (held.fromPile === "waste" ||
      (held.fromPile === "tableau" &&
        held.cards[0].id === top(s.tableau[held.fromIndex])?.id));
  if (isDouble)
    return {
      ...autoMove(next, held.fromPile, held.fromIndex)[0],
      pointer: { x, y, down: true },
      lastPress: stamp,
    };
  next = replacePile(
    next,
    held.fromPile,
    held.fromIndex,
    pile(next, held.fromPile, held.fromIndex).slice(0, -held.cards.length),
  );
  return { ...next, drag: held, dropTarget: target({ ...next, drag: held }) };
}
function pointerMove(s: ReadState, x: number, y: number): CascadeState {
  let next: CascadeState = { ...s, pointer: { ...s.pointer, x, y } };
  const menu = menuHit(next, x, y);
  if (menu >= 0) next = { ...next, menuIndex: menu };
  if (s.drag && s.lastPress) {
    const drag = {
      ...s.drag,
      x: s.drag.x + x - s.pointer.x,
      y: s.drag.y + y - s.pointer.y,
    };
    next = { ...next, drag };
    next = { ...next, dropTarget: target(next) };
  }
  return next;
}
function pointerUp(
  s: ReadState,
  x: number,
  y: number,
  toggleMute?: () => boolean,
): CascadeState {
  let next = pointerMove(s, x, y);
  next = { ...next, pointer: { x, y, down: false } };
  if (!s.pointer.down) return next;
  const press = s.lastPress;
  if (!press) return next;
  const menu = menuHit(s, press.x, press.y);
  if (menu >= 0 && menu === menuHit(s, x, y))
    return activate(
      { ...next, drag: null, dropTarget: null },
      menu,
      toggleMute,
    );
  if (s.screen !== "playing") return next;
  const click = length(x - press.x, y - press.y) <= DRAG_THRESHOLD;
  if (s.drag) {
    const d = next.drag!;
    if (!click && next.dropTarget) {
      const t = next.dropTarget;
      next = replacePile(next, t.pile, t.index, [
        ...pile(next, t.pile, t.index),
        ...d.cards,
      ]);
      if (d.fromPile === "waste")
        next = { ...next, wasteSets: wasteSetsAfterPlay(next.wasteSets) };
      if (d.fromPile === "tableau" && next.autoFlip) {
        const p = next.tableau[d.fromIndex];
        if (top(p) && !top(p)!.faceUp)
          next = replacePile(
            next,
            "tableau",
            d.fromIndex,
            p.map((c, i) => (i === p.length - 1 ? { ...c, faceUp: true } : c)),
          );
      }
      next = checkWin(next);
    } else
      next = replacePile(next, d.fromPile, d.fromIndex, [
        ...pile(next, d.fromPile, d.fromIndex),
        ...d.cards,
      ]);
    next = { ...next, drag: null, dropTarget: null };
  }
  if (click && inside(press.x, press.y, rect(s, "stock", 0)))
    next = turnStock(next);
  return next;
}
const requireId = (found: boolean, id: number): void => {
  if (!found) throw new Error(`Unknown entity id ${id}`);
};
function mapCard(
  s: ReadState,
  id: number,
  fn: (c: CardState) => CardState | null,
): CascadeState {
  let found = false;
  let next: CascadeState = { ...s };
  for (const kind of ["stock", "waste", "foundation", "tableau"] as const)
    for (
      let i = 0;
      i <
      (kind === "foundation"
        ? FOUNDATION_COUNT
        : kind === "tableau"
          ? TABLEAU_COLUMNS
          : 1);
      i++
    ) {
      const p = pile(next, kind, i);
      if (p.some((c) => c.id === id)) {
        found = true;
        next = replacePile(
          next,
          kind,
          i,
          p.flatMap((c) => {
            if (c.id !== id) return [c];
            const result = fn(c);
            return result ? [result] : [];
          }),
        );
        if (kind === "waste" && next.waste.length < s.waste.length)
          next = { ...next, wasteSets: wasteSetsAfterPlay(next.wasteSets) };
      }
    }
  requireId(found, id);
  return next;
}
function drawVx(): number {
  return (
    (LAUNCH_VX_MIN + Math.random() * (LAUNCH_VX_MAX - LAUNCH_VX_MIN)) *
    (Math.random() < 0.5 ? -1 : 1)
  );
}
let paint: HTMLCanvasElement | null = null;
let paintContext: CanvasRenderingContext2D | null = null;
function clearPaint(): void {
  if (paintContext) paintContext.clearRect(0, 0, STAGE_W, STAGE_H);
}
function getPaint(): CanvasRenderingContext2D | null {
  if (!paint && typeof document !== "undefined") {
    paint = document.createElement("canvas");
    paint.width = STAGE_W;
    paint.height = STAGE_H;
    paintContext = paint.getContext("2d");
  }
  return paintContext;
}
function stepCascade(s: ReadState, dt: number): CascadeState {
  if (s.screen !== "won") return { ...s };
  let next: CascadeState = {
    ...s,
    flyers: s.flyers.map((f) => {
      let vy = f.vy + GRAVITY * dt,
        y = f.y + vy * dt;
      const x = f.x + f.vx * dt;
      if (y >= FLOOR_Y && vy > 0) {
        vy = -vy * BOUNCE_DAMP;
        y = FLOOR_Y;
      }
      return { ...f, x, y, vy };
    }),
  };
  if (next.trailPainting) {
    const ctx = getPaint();
    for (const f of next.flyers) if (ctx) card(ctx, f, f.x, f.y, true, false);
    next = { ...next, trailStamps: next.trailStamps + next.flyers.length };
  }
  next = {
    ...next,
    flyers: next.flyers.filter((f) => f.x + CARD_W >= 0 && f.x <= STAGE_W),
  };
  if (next.launching) {
    let clock = next.launchClock + dt;
    while (clock >= LAUNCH_INTERVAL && next.launched < DECK_SIZE) {
      clock -= LAUNCH_INTERVAL;
      const index = next.launched % FOUNDATION_COUNT;
      const p = next.foundations[index];
      if (p.length) {
        const c = top(p)!;
        next = replacePile(next, "foundation", index, p.slice(0, -1));
        next = {
          ...next,
          launched: next.launched + 1,
          flyers: [
            ...next.flyers,
            {
              id: c.id,
              suit: c.suit,
              rank: c.rank,
              x: FOUNDATION_X[index],
              y: TOP_ROW_Y,
              vx: drawVx(),
              vy: LAUNCH_VY,
            },
          ],
        };
      } else break;
    }
    next = { ...next, launchClock: clock };
  }
  if (next.launched === DECK_SIZE && !next.flyers.length)
    next = { ...next, cascadeDone: true };
  return next;
}
export function createDebug(): CascadeDebugApi {
  return {
    version: CASCADE_DEBUG_VERSION,
    reset: (s) => {
      clearPaint();
      return base(s.muted);
    },
    snapshot: (s) => ({
      version: CASCADE_DEBUG_VERSION,
      screen: s.screen,
      menuIndex: s.menuIndex,
      titleIndex: s.titleIndex,
      dealMode: DEAL_MODE,
      turnCount: TURN_COUNT,
      dealModeLabel: DEAL_MODE_LABEL,
      muted: s.muted,
      autoFlip: s.autoFlip,
      winDetect: s.winDetect,
      launching: s.launching,
      trailPainting: s.trailPainting,
      stock: s.stock.map(colored),
      waste: s.waste.map(colored),
      wasteSets: [...s.wasteSets],
      wasteVisibleCount: s.wasteSets[s.wasteSets.length - 1] ?? 0,
      foundations: s.foundations.map((p) => p.map(colored)),
      tableau: s.tableau.map((p) => p.map(colored)),
      drag: s.drag ? { ...s.drag, cards: s.drag.cards.map(colored) } : null,
      dropTarget: target(s),
      pointer: { ...s.pointer },
      lastPress: s.lastPress ? { ...s.lastPress } : null,
      launchClock: s.launchClock,
      launched: s.launched,
      flyers: s.flyers.map((f) => ({ ...f })),
      cascadeDone: s.cascadeDone,
      trailStamps: s.trailStamps,
      simTime: s.simTime,
    }),
    reconcile: (s) => ({ ...s, dropTarget: target(s) }),
    menuItemRect: (s, index) => menuRects(s.screen)[index] ?? null,
    setScreen: (s, screen) => ({ ...s, screen }),
    setMenuIndex: (s, menuIndex) => ({ ...s, menuIndex }),
    setTitleIndex: (s, titleIndex) => ({ ...s, titleIndex }),
    addCard: (s, kind, index, suit, rank, faceUp) => {
      if (
        !SUITS.includes(suit) ||
        !Number.isInteger(rank) ||
        rank < RANK_MIN ||
        rank > RANK_MAX
      )
        throw new Error("Invalid card");
      const next = replacePile(s, kind, index, [
        ...pile(s, kind, index),
        { id: s.nextId, suit, rank, faceUp },
      ]);
      return { ...next, nextId: s.nextId + 1 };
    },
    removeCard: (s, id) => mapCard(s, id, () => null),
    setCardFaceUp: (s, id, faceUp) => mapCard(s, id, (c) => ({ ...c, faceUp })),
    clearPile: (s, kind, index) => {
      const next = replacePile(s, kind, index, []);
      return kind === "waste" ? { ...next, wasteSets: [] } : next;
    },
    clearTable: (s) => ({
      ...s,
      stock: [],
      waste: [],
      wasteSets: [],
      foundations: s.foundations.map(() => []),
      tableau: s.tableau.map(() => []),
      drag: null,
      dropTarget: null,
    }),
    addWasteSet: (s, count) => {
      if (!Number.isInteger(count) || count < 0)
        throw new Error("Invalid set count");
      return { ...s, wasteSets: [...s.wasteSets, count] };
    },
    clearWasteSets: (s) => ({ ...s, wasteSets: [] }),
    deal,
    turnStock,
    move: applyMove,
    autoMove,
    pointerDown,
    pointerMove,
    pointerUp,
    setAutoFlip: (s, autoFlip) => ({ ...s, autoFlip }),
    setWinDetect: (s, winDetect) => ({ ...s, winDetect }),
    setLaunching: (s, launching) => ({ ...s, launching }),
    setTrailPainting: (s, trailPainting) => ({ ...s, trailPainting }),
    addFlyer: (s, suit, rank, x, y, vx, vy) => ({
      ...s,
      flyers: [...s.flyers, { id: s.nextId, suit, rank, x, y, vx, vy }],
      nextId: s.nextId + 1,
    }),
    setFlyerPosition: (s, id, x, y) => {
      requireId(
        s.flyers.some((f) => f.id === id),
        id,
      );
      return {
        ...s,
        flyers: s.flyers.map((f) => (f.id === id ? { ...f, x, y } : f)),
      };
    },
    setFlyerVelocity: (s, id, vx, vy) => {
      requireId(
        s.flyers.some((f) => f.id === id),
        id,
      );
      return {
        ...s,
        flyers: s.flyers.map((f) => (f.id === id ? { ...f, vx, vy } : f)),
      };
    },
    removeFlyer: (s, id) => {
      requireId(
        s.flyers.some((f) => f.id === id),
        id,
      );
      return { ...s, flyers: s.flyers.filter((f) => f.id !== id) };
    },
    clearFlyers: (s) => ({ ...s, flyers: [] }),
    setLaunchClock: (s, launchClock) => ({ ...s, launchClock }),
    clearTrail: (s) => {
      clearPaint();
      return { ...s, trailStamps: 0 };
    },
    drawLaunchVx: (_s) => drawVx(),
  };
}
const symbols: Record<Suit, string> = {
  spades: "♠",
  hearts: "♥",
  diamonds: "♦",
  clubs: "♣",
};
const ranks = [
  "",
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
];
function rounded(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number,
): void {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
}
function card(
  ctx: CanvasRenderingContext2D,
  c: Pick<CardState, "suit" | "rank">,
  x: number,
  y: number,
  faceUp: boolean,
  lifted: boolean,
): void {
  ctx.save();
  if (lifted) {
    ctx.shadowColor = "#061d1dcc";
    ctx.shadowBlur = 22;
    ctx.shadowOffsetY = 12;
  }
  rounded(ctx, x, y, CARD_W, CARD_H, 9);
  ctx.fillStyle = faceUp ? "#fffdf2" : "#172f50";
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.lineWidth = 2;
  ctx.strokeStyle = faceUp ? "#d3cfbd" : "#a9c8bd";
  ctx.stroke();
  if (faceUp) {
    const color = red(c.suit) ? "#bf4051" : "#173c4b";
    ctx.fillStyle = color;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.font = "bold 27px Georgia";
    ctx.fillText(ranks[c.rank], x + 10, y + 8);
    ctx.font = "24px Georgia";
    ctx.fillText(symbols[c.suit], x + 11, y + 37);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "54px Georgia";
    ctx.fillText(symbols[c.suit], x + CARD_W / 2, y + CARD_H / 2 + 5);
    ctx.translate(x + CARD_W, y + CARD_H);
    ctx.rotate(Math.PI);
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.font = "bold 22px Georgia";
    ctx.fillText(ranks[c.rank], 9, 7);
  } else {
    ctx.strokeStyle = "#80b9ad";
    ctx.lineWidth = 1.5;
    rounded(ctx, x + 7, y + 7, CARD_W - 14, CARD_H - 14, 5);
    ctx.stroke();
    ctx.fillStyle = "#285579";
    ctx.fillRect(x + 12, y + 12, CARD_W - 24, CARD_H - 24);
    ctx.save();
    ctx.beginPath();
    ctx.rect(x + 12, y + 12, CARD_W - 24, CARD_H - 24);
    ctx.clip();
    ctx.strokeStyle = "#79aaab88";
    ctx.lineWidth = 1;
    for (let j = -4; j < 10; j++) {
      ctx.beginPath();
      ctx.moveTo(x + 12, y + 12 + j * 17);
      ctx.lineTo(x + CARD_W - 12, y + 12 + (j + 5) * 17);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + CARD_W - 12, y + 12 + j * 17);
      ctx.lineTo(x + 12, y + 12 + (j + 5) * 17);
      ctx.stroke();
    }
    ctx.restore();
    ctx.fillStyle = "#e8c477";
    ctx.font = "bold 36px Georgia";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("✦", x + CARD_W / 2, y + CARD_H / 2);
  }
  ctx.restore();
}
function slot(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  label: string,
  highlighted = false,
): void {
  ctx.save();
  rounded(ctx, x, y, CARD_W, CARD_H, 9);
  ctx.fillStyle = highlighted ? "#e3be6c77" : "#071f2080";
  ctx.fill();
  ctx.setLineDash(highlighted ? [] : [6, 5]);
  ctx.lineWidth = highlighted ? 3 : 2;
  ctx.strokeStyle = highlighted ? "#f8d783" : "#acc9b977";
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = highlighted ? "#fff2c0" : "#a1c7b4";
  ctx.font = "15px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(label, x + CARD_W / 2, y + CARD_H / 2 + 5, CARD_W - 12);
  ctx.restore();
}
function textLabel(
  ctx: CanvasRenderingContext2D,
  value: string,
  x: number,
  y: number,
  size: number,
  color = "#f5eacd",
  align: CanvasTextAlign = "center",
): void {
  ctx.save();
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.font = `600 ${size}px system-ui, sans-serif`;
  ctx.fillText(value, x, y);
  ctx.restore();
}
function drawTable(ctx: CanvasRenderingContext2D, s: ReadState): void {
  ctx.fillStyle = "#123b38";
  ctx.fillRect(0, 0, STAGE_W, STAGE_H);
  ctx.fillStyle = "#ffffff08";
  for (let y = 0; y < STAGE_H; y += 4) ctx.fillRect(0, y, STAGE_W, 1);
  ctx.strokeStyle = "#a8c5a455";
  ctx.lineWidth = 2;
  ctx.strokeRect(198, 12, 882, 654);
  textLabel(ctx, "C A S C A D E", 100, 92, 20, "#d6b671");
  textLabel(ctx, "SOLITAIRE", 100, 118, 11, "#b9d4b8");
  slot(ctx, STOCK_X, TOP_ROW_Y, "STOCK");
  if (s.stock.length)
    card(ctx, top(s.stock)!, STOCK_X, TOP_ROW_Y, false, false);
  slot(ctx, WASTE_X, TOP_ROW_Y, "WASTE");
  const visible = Math.min(
    s.waste.length,
    s.wasteSets[s.wasteSets.length - 1] ?? 0,
  );
  for (let i = 0; i < visible; i++)
    card(
      ctx,
      s.waste[s.waste.length - visible + i],
      WASTE_X + i * WASTE_FAN,
      TOP_ROW_Y,
      true,
      false,
    );
  for (let i = 0; i < FOUNDATION_COUNT; i++) {
    const highlight =
      s.dropTarget?.pile === "foundation" && s.dropTarget.index === i;
    slot(ctx, FOUNDATION_X[i], TOP_ROW_Y, "FOUNDATION", highlight);
    if (top(s.foundations[i]))
      card(
        ctx,
        top(s.foundations[i])!,
        FOUNDATION_X[i],
        TOP_ROW_Y,
        true,
        false,
      );
    if (highlight) {
      ctx.strokeStyle = "#f9d67c";
      ctx.lineWidth = 4;
      rounded(
        ctx,
        FOUNDATION_X[i] - 3,
        TOP_ROW_Y - 3,
        CARD_W + 6,
        CARD_H + 6,
        11,
      );
      ctx.stroke();
    }
  }
  for (let i = 0; i < TABLEAU_COLUMNS; i++) {
    const highlight =
      s.dropTarget?.pile === "tableau" && s.dropTarget.index === i;
    slot(ctx, COLUMN_X[i], TABLEAU_Y, "K", highlight);
    const ys = columnYs(s.tableau[i]);
    for (let j = 0; j < s.tableau[i].length; j++)
      card(
        ctx,
        s.tableau[i][j],
        COLUMN_X[i],
        ys[j],
        s.tableau[i][j].faceUp,
        false,
      );
    if (highlight) {
      ctx.strokeStyle = "#f9d67c";
      ctx.lineWidth = 4;
      rounded(
        ctx,
        COLUMN_X[i] - 3,
        (ys[ys.length - 1] ?? TABLEAU_Y) - 3,
        CARD_W + 6,
        CARD_H + 6,
        11,
      );
      ctx.stroke();
    }
  }
  if (s.drag) {
    for (let i = 0; i < s.drag.cards.length; i++)
      card(
        ctx,
        s.drag.cards[i],
        s.drag.x,
        s.drag.y + i * FACE_UP_OFFSET,
        true,
        true,
      );
  }
}
function drawMenuItem(
  ctx: CanvasRenderingContext2D,
  r: Rect,
  label: string,
  selected: boolean,
): void {
  ctx.save();
  rounded(ctx, r.x, r.y, r.w, r.h, 10);
  ctx.fillStyle = selected ? "#eac880" : "#0c292baa";
  ctx.fill();
  ctx.strokeStyle = selected ? "#fff2c9" : "#a5c3af88";
  ctx.lineWidth = 2;
  ctx.stroke();
  textLabel(
    ctx,
    label,
    r.x + r.w / 2,
    r.y + r.h / 2,
    18,
    selected ? "#173936" : "#e8e8cc",
  );
  ctx.restore();
}
function drawTitle(ctx: CanvasRenderingContext2D, s: ReadState): void {
  ctx.fillStyle = BACKGROUND;
  ctx.fillRect(0, 0, STAGE_W, STAGE_H);
  ctx.strokeStyle = "#d6bc7955";
  ctx.lineWidth = 2;
  ctx.strokeRect(70, 60, 1140, 600);
  for (let i = 0; i < 4; i++) {
    ctx.save();
    ctx.globalAlpha = 0.35;
    card(
      ctx,
      { suit: SUITS[i], rank: 1 + i * 3 },
      320 + i * 150,
      155 + Math.sin(i) * 18,
      true,
      false,
    );
    ctx.restore();
  }
  textLabel(ctx, TITLE_TEXT, 640, 337, 82, "#f5e6be");
  textLabel(ctx, TAGLINE_TEXT, 640, 377, 18, "#a9d0bd");
  TITLE_ITEMS.forEach((label, i) =>
    drawMenuItem(ctx, titleRects[i], label, s.menuIndex === i),
  );
  textLabel(ctx, DEAL_MODE_LABEL, 640, 575, 15, "#d9bb78");
}
function drawHowto(ctx: CanvasRenderingContext2D, s: ReadState): void {
  ctx.fillStyle = BACKGROUND;
  ctx.fillRect(0, 0, STAGE_W, STAGE_H);
  ctx.strokeStyle = "#d7bc7955";
  ctx.lineWidth = 2;
  ctx.strokeRect(235, 65, 810, 595);
  textLabel(ctx, "HOW TO PLAY", 640, 143, 44, "#f4dfac");
  const lines = [
    "Build each foundation from ACE up to KING.",
    "On the table, build down in alternating colors.",
    "Only a KING can fill an empty column.",
    "Turn the STOCK to reveal three cards at a time.",
    "When it runs out, tap it again to recycle the waste.",
    "Drag cards to move them. DOUBLE-CLICK a card to send it home.",
  ];
  lines.forEach((line, i) => textLabel(ctx, line, 640, 225 + i * 54, 20));
  drawMenuItem(ctx, howtoRects[0], HOWTO_BACK_LABEL, s.menuIndex === 0);
}
function drawHud(ctx: CanvasRenderingContext2D, s: ReadState): void {
  ctx.fillStyle = "#082727";
  ctx.fillRect(0, HUD_Y, STAGE_W, HUD_H);
  HUD_ITEMS.forEach((label, i) =>
    drawMenuItem(ctx, hudRects[i], label, s.menuIndex === i),
  );
  textLabel(ctx, DEAL_MODE_LABEL, 1150, HUD_Y + HUD_H / 2, 15, "#d4bb80");
}
function drawWon(ctx: CanvasRenderingContext2D, s: ReadState): void {
  ctx.fillStyle = BACKGROUND;
  ctx.fillRect(0, 0, STAGE_W, STAGE_H);
  if (paint) ctx.drawImage(paint, 0, 0);
  for (let i = 0; i < FOUNDATION_COUNT; i++)
    if (top(s.foundations[i]))
      card(
        ctx,
        top(s.foundations[i])!,
        FOUNDATION_X[i],
        TOP_ROW_Y,
        true,
        false,
      );
  for (const f of s.flyers) card(ctx, f, f.x, f.y, true, false);
  if (s.cascadeDone) {
    ctx.fillStyle = "#082727dd";
    rounded(ctx, 420, 282, 440, 150, 22);
    ctx.fill();
    textLabel(ctx, WIN_TEXT, 640, 342, 58, "#f7d78f");
    textLabel(ctx, "TAP ANYWHERE TO DEAL AGAIN", 640, 393, 17);
  }
}
const cueSpecs: Record<
  CueName,
  {
    wave: "sine" | "triangle" | "square";
    freq: number;
    freqTo: number;
    durationMs: number;
    gain: number;
  }
> = {
  deal: {
    wave: "triangle",
    freq: 380,
    freqTo: 640,
    durationMs: 120,
    gain: 0.12,
  },
  turn: {
    wave: "triangle",
    freq: 530,
    freqTo: 360,
    durationMs: 65,
    gain: 0.12,
  },
  recycle: {
    wave: "triangle",
    freq: 210,
    freqTo: 460,
    durationMs: 150,
    gain: 0.13,
  },
  lift: { wave: "sine", freq: 510, freqTo: 580, durationMs: 40, gain: 0.08 },
  drop: {
    wave: "triangle",
    freq: 440,
    freqTo: 310,
    durationMs: 90,
    gain: 0.13,
  },
  reject: {
    wave: "square",
    freq: 185,
    freqTo: 140,
    durationMs: 85,
    gain: 0.05,
  },
  flip: { wave: "sine", freq: 650, freqTo: 810, durationMs: 100, gain: 0.12 },
  home: {
    wave: "triangle",
    freq: 740,
    freqTo: 1020,
    durationMs: 150,
    gain: 0.13,
  },
  launch: { wave: "sine", freq: 410, freqTo: 210, durationMs: 110, gain: 0.08 },
  win: {
    wave: "triangle",
    freq: 520,
    freqTo: 1040,
    durationMs: 500,
    gain: 0.17,
  },
};
export const game: Game<CascadeState, CascadeDebugApi> = {
  initialize(api: InitApi<CascadeState>): [CascadeState, CascadeDebugApi] {
    for (const [name, keys] of Object.entries(MENU_BINDINGS))
      api.input.register(name, { keys: [...keys] });
    for (const [name, spec] of Object.entries(cueSpecs))
      api.audio.define(name, spec);
    api.diagnostics.register("screen", (s) => s.screen);
    api.diagnostics.register("deal mode", (_s) => DEAL_MODE);
    api.diagnostics.register("stock", (s) => s.stock.length);
    api.diagnostics.register("waste", (s) => s.waste.length);
    for (let i = 0; i < FOUNDATION_COUNT; i++)
      api.diagnostics.register(
        `foundation ${i}`,
        (s) => s.foundations[i].length,
      );
    for (let i = 0; i < TABLEAU_COLUMNS; i++)
      api.diagnostics.register(`column ${i}`, (s) => s.tableau[i].length);
    api.diagnostics.register("hand", (s) => s.drag?.cards.length ?? 0);
    api.diagnostics.register("launched", (s) => s.launched);
    api.diagnostics.register("in flight", (s) => s.flyers.length);
    return [base(), createDebug()];
  },
  update(state: ReadState, api: UpdateApi, dt: number): CascadeState {
    let s: CascadeState = {
      ...state,
      simTime: state.simTime + dt,
      muted: api.audio.muted(),
    };
    const cues = new Set<CueName>();
    const toggleMute = (): boolean => {
      api.audio.setMuted(!api.audio.muted());
      return api.audio.muted();
    };
    for (const sample of api.input.pointerSamples()) {
      if (!sample.primary) continue;
      const before = s;
      if (sample.type === "down") s = pointerDown(s, sample.x, sample.y);
      else if (sample.type === "move") s = pointerMove(s, sample.x, sample.y);
      else s = pointerUp(s, sample.x, sample.y, toggleMute);
      if (
        (before.screen !== "playing" && s.screen === "playing") ||
        (sample.type === "up" &&
          before.screen === "playing" &&
          before.lastPress &&
          inside(before.lastPress.x, before.lastPress.y, hudRects[0]) &&
          inside(sample.x, sample.y, hudRects[0]))
      )
        cues.add(CUES.deal);
      if (!before.drag && s.drag) cues.add(CUES.lift);
      if (
        before.stock.length > s.stock.length &&
        s.waste.length > before.waste.length
      )
        cues.add(CUES.turn);
      if (!before.stock.length && s.stock.length && before.waste.length)
        cues.add(CUES.recycle);
      if (before.drag && !s.drag && sample.type === "up") {
        const cardId = before.drag.cards[0].id;
        const moved =
          s.foundations.some((p) => p.some((c) => c.id === cardId)) ||
          s.tableau.some(
            (p, i) =>
              p.some((c) => c.id === cardId) &&
              !(
                before.drag?.fromPile === "tableau" &&
                before.drag.fromIndex === i
              ),
          );
        if (moved) cues.add(CUES.drop);
        else if (
          before.lastPress &&
          length(sample.x - before.lastPress.x, sample.y - before.lastPress.y) >
            DRAG_THRESHOLD
        )
          cues.add(CUES.reject);
      }
      if (s.foundations.some((p, i) => p.length > before.foundations[i].length))
        cues.add(CUES.home);
      if (
        s.tableau.some((p, i) =>
          p.some(
            (c, j) =>
              c.faceUp &&
              before.tableau[i][j]?.id === c.id &&
              !before.tableau[i][j].faceUp,
          ),
        )
      )
        cues.add(CUES.flip);
      if (before.screen !== "won" && s.screen === "won") cues.add(CUES.win);
    }
    const up = api.input.pressed(MENU_UP),
      down = api.input.pressed(MENU_DOWN),
      confirm = api.input.pressed(MENU_CONFIRM),
      back = api.input.pressed(MENU_BACK);
    if (s.screen !== "won") {
      const count = menuRects(s.screen).length;
      if (up) s = { ...s, menuIndex: (s.menuIndex - 1 + count) % count };
      else if (down) s = { ...s, menuIndex: (s.menuIndex + 1) % count };
      else if (confirm || (back && s.screen === "howto")) {
        const before = s;
        s = activate(s, s.menuIndex, toggleMute);
        if (
          (before.screen === "title" && s.screen === "playing") ||
          (before.screen === "playing" &&
            s.screen === "playing" &&
            before.menuIndex === 0)
        )
          cues.add(CUES.deal);
      }
    }
    const launched = s.launched;
    s = stepCascade(s, dt);
    if (s.launched > launched) cues.add(CUES.launch);
    for (const cue of cues) api.audio.play(cue);
    return { ...s, muted: api.audio.muted() };
  },
  render(state: ReadState, api: RenderApi): void {
    const ctx = api.ctx;
    if (state.screen === "title") drawTitle(ctx, state);
    else if (state.screen === "howto") drawHowto(ctx, state);
    else if (state.screen === "playing") {
      drawTable(ctx, state);
      drawHud(ctx, state);
    } else drawWon(ctx, state);
  },
};
