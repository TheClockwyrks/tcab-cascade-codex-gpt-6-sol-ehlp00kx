import { describe, expect, it } from "vitest";
import { game, type CascadeDebugApi, type CascadeState } from "./game";
import {
  DECK_SIZE,
  FOUNDATION_COUNT,
  TABLEAU_COLUMNS,
  TURN_COUNT,
} from "./constants";

function setup(): [CascadeState, CascadeDebugApi] {
  const input = { register: () => undefined };
  const audio = { define: () => undefined };
  const diagnostics = { register: () => undefined };
  return game.initialize({ input, audio, diagnostics } as never) as [
    CascadeState,
    CascadeDebugApi,
  ];
}

describe("Cascade rules", () => {
  it("deals a complete unique deck with seven exposed columns", () => {
    const [initial, debug] = setup();
    const state = debug.deal(initial);
    expect(state.tableau.map((p) => p.length)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(
      state.tableau.every(
        (p) => p.filter((c) => c.faceUp).length === 1 && p[p.length - 1].faceUp,
      ),
    ).toBe(true);
    expect(state.stock).toHaveLength(DECK_SIZE - 28);
    expect(
      new Set(
        [...state.stock, ...state.tableau.flat()].map(
          (c) => `${c.suit}-${c.rank}`,
        ),
      ).size,
    ).toBe(DECK_SIZE);
  });

  it("turns three, remembers sets, and recycles in the same order", () => {
    const [initial, debug] = setup();
    let s = debug.deal(initial);
    const first = s.stock[s.stock.length - 1].id;
    s = debug.turnStock(s);
    expect(s.waste).toHaveLength(TURN_COUNT);
    expect(s.waste[0].id).toBe(first);
    expect(s.wasteSets).toEqual([TURN_COUNT]);
    while (s.stock.length) s = debug.turnStock(s);
    expect(s.wasteSets).toHaveLength(8);
    s = debug.turnStock(s);
    expect(s.stock[s.stock.length - 1].id).toBe(first);
    expect(s.wasteSets).toEqual([]);
  });

  it("moves alternating runs and flips only after accepted moves", () => {
    const [initial, debug] = setup();
    let s = debug.addCard(initial, "tableau", 0, "spades", 6, false);
    s = debug.addCard(s, "tableau", 0, "hearts", 5, true);
    s = debug.addCard(s, "tableau", 1, "clubs", 6, true);
    const rejected = debug.move(s, "tableau", 0, 1, "tableau", 2);
    expect(rejected[1]).toBe(false);
    expect(rejected[0].tableau[0][0].faceUp).toBe(false);
    s = debug.move(s, "tableau", 0, 1, "tableau", 1)[0];
    expect(s.tableau[0][0].faceUp).toBe(true);
    expect(s.tableau[1].map((c) => c.rank)).toEqual([6, 5]);
  });

  it("builds foundations and refuses a multi-card run", () => {
    const [initial, debug] = setup();
    let s = debug.addCard(initial, "tableau", 0, "hearts", 1, true);
    s = debug.addCard(s, "tableau", 0, "clubs", 2, true);
    expect(debug.move(s, "tableau", 0, 0, "foundation", 0)[1]).toBe(false);
    s = debug.addCard(s, "waste", 0, "hearts", 1, true);
    s = debug.addWasteSet(s, 1);
    const [moved, accepted] = debug.move(s, "waste", 0, 0, "foundation", 0);
    expect(accepted).toBe(true);
    expect(moved.foundations[0][0].rank).toBe(1);
    expect(moved.wasteSets).toEqual([]);
  });

  it("uses the same pointer path for a stock click and a drag", () => {
    const [initial, debug] = setup();
    let s = debug.deal({ ...initial, screen: "playing" });
    s = debug.pointerDown(s, 260, 60);
    s = debug.pointerUp(s, 260, 60);
    expect(s.waste).toHaveLength(TURN_COUNT);
    expect(s.pointer.down).toBe(false);
    s = debug.clearTable(s);
    s = debug.addCard(s, "tableau", 0, "hearts", 5, true);
    s = debug.addCard(s, "tableau", 1, "clubs", 6, true);
    s = debug.pointerDown(s, 250, 210);
    expect(s.drag?.cards[0].rank).toBe(5);
    s = debug.pointerMove(s, 372, 210);
    expect(s.dropTarget).toEqual({ pile: "tableau", index: 1 });
    s = debug.pointerUp(s, 372, 210);
    expect(s.tableau[1].map((c) => c.rank)).toEqual([6, 5]);
  });

  it("snapshots the declared surface without exposing nextId", () => {
    const [initial, debug] = setup();
    const snap = debug.snapshot(initial);
    expect(snap.foundations).toHaveLength(FOUNDATION_COUNT);
    expect(snap.tableau).toHaveLength(TABLEAU_COLUMNS);
    expect(snap).not.toHaveProperty("nextId");
    expect(debug.menuItemRect(initial, 0)).not.toBeNull();
    expect(debug.menuItemRect({ ...initial, screen: "won" }, 0)).toBeNull();
  });
});

describe("victory cascade", () => {
  const api = {
    audio: {
      muted: () => false,
      play: () => undefined,
      setMuted: () => undefined,
    },
    input: { pointerSamples: () => [], pressed: () => false },
  };

  it("detects the final foundation move and launches one card on the next update", () => {
    const [initial, debug] = setup();
    let s: CascadeState = { ...initial, screen: "playing" };
    const suits = ["spades", "hearts", "diamonds", "clubs"] as const;
    for (let i = 0; i < 4; i++)
      for (let rank = 1; rank <= (i === 3 ? 12 : 13); rank++)
        s = debug.addCard(s, "foundation", i, suits[i], rank, true);
    s = debug.addCard(s, "tableau", 0, "clubs", 13, true);
    const [won, accepted] = debug.move(s, "tableau", 0, 0, "foundation", 3);
    expect(accepted).toBe(true);
    expect(won.screen).toBe("won");
    expect(won.launchClock).toBe(0.18);
    const next = game.update(won, api as never, 0.016);
    expect(next.launched).toBe(1);
    expect(next.flyers).toHaveLength(1);
    expect(next.flyers[0].x).toBe(590);
    expect(next.flyers[0].y).toBe(24);
    expect(won.foundations[0]).toHaveLength(13);
  });

  it("moves posed flyers from elapsed time and respects painting and launch gates", () => {
    const [initial, debug] = setup();
    let s = debug.setScreen(initial, "won");
    s = debug.addFlyer(s, "spades", 1, 100, 100, 200, 0);
    s = debug.setLaunching(s, false);
    s = debug.setTrailPainting(s, false);
    const next = game.update(s, api as never, 0.5);
    expect(next.flyers[0].x).toBe(200);
    expect(next.flyers[0].y).toBe(550);
    expect(next.trailStamps).toBe(0);
    expect(next.launched).toBe(0);
    expect(next.simTime).toBe(0.5);
  });
});
