"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const FRAME_SIZE = 600;
const STARTING_CREDITS = 1000;

type GameView = "menu" | "slots" | "coinflip" | "dice" | "blackjack" | "roulette" | "result";

type MenuItem = { readonly key: Exclude<GameView, "menu" | "result">; readonly label: string; readonly icon: string };

const MENU_ITEMS: readonly MenuItem[] = [
  { key: "slots", label: "SLOTS", icon: "🎰" },
  { key: "coinflip", label: "COIN FLIP", icon: "🪙" },
  { key: "dice", label: "DICE", icon: "🎲" },
  { key: "blackjack", label: "BLACKJACK", icon: "🃏" },
  { key: "roulette", label: "ROULETTE", icon: "🎡" },
] as const;

const SLOT_SYMBOLS = ["7", "BAR", "♦", "♣", "♥", "★"] as const;
const REEL_COUNT = 3;

function randomSymbol() {
  return SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)];
}

// ── Root page ────────────────────────────────────────────────────────────────

export default function CasinoApp() {
  const [view, setView] = useState<GameView>("menu");
  const [menuIndex, setMenuIndex] = useState(0);
  const [credits, setCredits] = useState(STARTING_CREDITS);

  const [lastWin, setLastWin] = useState(0);
  const [lastBet, setLastBet] = useState(0);

  // payout > 0 and won=true → win; won=false and bet=0 → push (no change); won=false → loss
  const handleResult = useCallback((won: boolean, bet: number, payout: number) => {
    setLastBet(bet);
    setLastWin(won ? payout : 0);
    if (bet > 0) setCredits((c) => c + (won ? payout : -bet));
    setView("result");
  }, []);

  useEffect(() => {
    if (view !== "menu") return;
    const onKey = (e: KeyboardEvent) => {
      const navKeys = ["ArrowUp", "ArrowDown", "Enter"];
      if (!navKeys.includes(e.key)) return;
      e.preventDefault();
      if (e.key === "ArrowUp") setMenuIndex((i) => (i - 1 + MENU_ITEMS.length) % MENU_ITEMS.length);
      else if (e.key === "ArrowDown") setMenuIndex((i) => (i + 1) % MENU_ITEMS.length);
      else if (e.key === "Enter") setView(MENU_ITEMS[menuIndex].key);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [view, menuIndex]);

  return (
    <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center gap-4 p-4 font-mono text-white">
      <DisplayFrame>
        {view === "menu" && (
          <MenuView credits={credits} selectedIndex={menuIndex} onSelect={setMenuIndex} onEnter={(key) => setView(key)} />
        )}
        {view === "slots" && (
          <SlotsGame credits={credits} onResult={handleResult} onBack={() => setView("menu")} />
        )}
        {view === "coinflip" && (
          <CoinFlipGame credits={credits} onResult={handleResult} onBack={() => setView("menu")} />
        )}
        {view === "dice" && (
          <DiceGame credits={credits} onResult={handleResult} onBack={() => setView("menu")} />
        )}
        {view === "blackjack" && (
          <BlackjackGame credits={credits} onResult={handleResult} onBack={() => setView("menu")} />
        )}
        {view === "roulette" && (
          <RouletteGame credits={credits} onResult={handleResult} onBack={() => setView("menu")} />
        )}
        {view === "result" && (
          <ResultView
            credits={credits}
            won={lastWin > 0}
            amount={lastWin > 0 ? lastWin : lastBet}
            onContinue={() => setView("menu")}
          />
        )}
      </DisplayFrame>
      <p className="text-[11px] uppercase tracking-[0.3em] text-gray-500 max-w-[600px] text-center">
        Secret HUD Casino · Use ↑ ↓ ← → and Enter to play · No real money
      </p>
    </div>
  );
}

// ── Shell components ─────────────────────────────────────────────────────────

function DisplayFrame({ children }: { readonly children: React.ReactNode }) {
  return (
    <div
      className="relative bg-black border border-yellow-500/40 shadow-[0_0_60px_rgba(234,179,8,0.15)] overflow-hidden"
      style={{ width: FRAME_SIZE, height: FRAME_SIZE, cursor: "crosshair" }}
    >
      <FrameCorners />
      <div className="absolute inset-0 flex flex-col">{children}</div>
    </div>
  );
}

function FrameCorners() {
  const base = "absolute w-10 h-10 border-yellow-500/60 pointer-events-none";
  return (
    <>
      <div className={`${base} top-0 left-0 border-t-2 border-l-2`} />
      <div className={`${base} top-0 right-0 border-t-2 border-r-2`} />
      <div className={`${base} bottom-0 left-0 border-b-2 border-l-2`} />
      <div className={`${base} bottom-0 right-0 border-b-2 border-r-2`} />
    </>
  );
}

function PanelHeader({ label, credits }: { readonly label: string; readonly credits?: number }) {
  return (
    <div className="flex items-center gap-3 px-6 pt-5 pb-3">
      <div className="w-2 h-2 bg-yellow-400 shadow-[0_0_10px_#facc15]" />
      <span className="text-[13px] tracking-[0.35em] text-yellow-400 uppercase flex-1">{label}</span>
      {credits !== undefined && (
        <span className="text-[13px] tracking-[0.2em] text-yellow-300 font-bold">{credits} CR</span>
      )}
      <div className="h-px w-4 bg-yellow-500/40" />
    </div>
  );
}

function PanelFooter({ children }: { readonly children: React.ReactNode }) {
  return (
    <div className="mt-auto px-6 py-4 border-t border-yellow-500/20">
      <p className="text-[13px] tracking-[0.2em] uppercase text-gray-400">{children}</p>
    </div>
  );
}

function BetSelector({
  bet,
  min,
  max,
  onChange,
}: {
  readonly bet: number;
  readonly min: number;
  readonly max: number;
  readonly onChange: (val: number) => void;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border border-yellow-500/30 bg-yellow-500/5">
      <span className="text-[13px] tracking-[0.25em] text-yellow-400 uppercase">Bet</span>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, bet - 50))}
          className="text-[20px] text-yellow-400 px-2"
        >
          ◂
        </button>
        <span className="text-[22px] font-bold text-white w-20 text-center">{bet} CR</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, bet + 50))}
          className="text-[20px] text-yellow-400 px-2"
        >
          ▸
        </button>
      </div>
    </div>
  );
}

// ── Menu ─────────────────────────────────────────────────────────────────────

function MenuView({
  credits,
  selectedIndex,
  onSelect,
  onEnter,
}: {
  readonly credits: number;
  readonly selectedIndex: number;
  readonly onSelect: (i: number) => void;
  readonly onEnter: (key: Exclude<GameView, "menu" | "result">) => void;
}) {
  const broke = credits <= 0;
  return (
    <>
      <PanelHeader label="HUD CASINO" />
      <div className="px-6 pt-1 pb-4">
        <div className="flex items-baseline gap-3">
          <span className="text-[13px] tracking-[0.3em] text-yellow-400 uppercase">Credits</span>
          <span className={`text-[32px] font-bold ${broke ? "text-red-400" : "text-white"}`}>{credits}</span>
        </div>
        {broke && (
          <p className="text-[14px] text-red-400 tracking-wider mt-1">BUST — reload page to reset</p>
        )}
      </div>
      <ul className="flex-1 flex flex-col px-6 gap-3">
        {MENU_ITEMS.map((item, i) => {
          const active = i === selectedIndex;
          return (
            <li key={item.key}>
              <button
                type="button"
                disabled={broke}
                onMouseEnter={() => onSelect(i)}
                onClick={() => !broke && onEnter(item.key)}
                className={`w-full flex items-center gap-5 px-5 text-left border transition-colors disabled:opacity-40 ${
                  active
                    ? "border-yellow-400 bg-yellow-400/10 text-white shadow-[0_0_18px_rgba(234,179,8,0.3)]"
                    : "border-yellow-500/20 text-gray-400 hover:border-yellow-500/50"
                }`}
                style={{ minHeight: 88 }}
              >
                <span className="text-[26px]">{item.icon}</span>
                <span className="text-[22px] tracking-[0.25em]">{item.label}</span>
                {active && <span className="ml-auto text-yellow-400 text-[18px]">▸</span>}
              </button>
            </li>
          );
        })}
      </ul>
      <PanelFooter>[↑↓] SELECT &nbsp; [⏎] PLAY</PanelFooter>
    </>
  );
}

// ── Slots ─────────────────────────────────────────────────────────────────────

type SlotsState = "idle" | "spinning" | "done";

function SlotsGame({
  credits,
  onResult,
  onBack,
}: {
  readonly credits: number;
  readonly onResult: (won: boolean, bet: number, payout: number) => void;
  readonly onBack: () => void;
}) {
  const [bet, setBet] = useState(Math.min(100, credits));
  const [reels, setReels] = useState<string[]>(["7", "7", "7"]);
  const [state, setState] = useState<SlotsState>("idle");
  const spinInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const spinCount = useRef(0);

  const spin = useCallback(() => {
    if (state !== "idle" || bet > credits) return;
    setState("spinning");
    spinCount.current = 0;
    spinInterval.current = setInterval(() => {
      setReels([randomSymbol(), randomSymbol(), randomSymbol()]);
      spinCount.current++;
      if (spinCount.current >= 12) {
        clearInterval(spinInterval.current!);
        const final = [randomSymbol(), randomSymbol(), randomSymbol()];
        setReels(final);
        setState("done");
        const allMatch = final[0] === final[1] && final[1] === final[2];
        const twoMatch = final[0] === final[1] || final[1] === final[2] || final[0] === final[2];
        const jackpot = final.every((s) => s === "7");
        const payout = jackpot ? bet * 10 : allMatch ? bet * 3 : twoMatch ? bet * 1 : 0;
        const won = payout > 0;
        setTimeout(() => onResult(won, bet, payout), 600);
      }
    }, 80);
  }, [state, bet, credits, onResult]);

  useEffect(() => {
    return () => { if (spinInterval.current) clearInterval(spinInterval.current); };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") { onBack(); return; }
      if (e.key === "ArrowUp" && state === "idle") setBet((b) => Math.min(credits, b + 50));
      if (e.key === "ArrowDown" && state === "idle") setBet((b) => Math.max(50, b - 50));
      if (e.key === "Enter") spin();
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state, credits, spin, onBack]);

  return (
    <>
      <PanelHeader label="SLOTS" credits={credits} />
      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6">
        <div className="flex gap-4 items-center justify-center">
          {reels.map((sym, i) => (
            <div
              key={i}
              className={`flex items-center justify-center border-2 font-bold text-[28px] transition-all ${
                state === "spinning"
                  ? "border-yellow-400/60 text-yellow-300 shadow-[0_0_20px_rgba(234,179,8,0.4)] animate-pulse"
                  : "border-yellow-500/40 text-white"
              }`}
              style={{ width: 120, height: 120 }}
            >
              {sym}
            </div>
          ))}
        </div>
        <div className="w-full">
          <BetSelector bet={bet} min={50} max={Math.min(500, credits)} onChange={setBet} />
        </div>
        <div className="text-[12px] tracking-[0.25em] text-gray-500 uppercase text-center">
          <p>2 match → 1× &nbsp;|&nbsp; 3 match → 3× &nbsp;|&nbsp; 777 → 10×</p>
        </div>
      </div>
      <PanelFooter>
        {state === "spinning" ? "SPINNING..." : "[⏎] SPIN · [↑↓] BET · [←] BACK"}
      </PanelFooter>
    </>
  );
}

// ── Coin Flip ─────────────────────────────────────────────────────────────────

type CoinSide = "HEADS" | "TAILS";
type CoinState = "pick" | "flipping" | "done";

function CoinFlipGame({
  credits,
  onResult,
  onBack,
}: {
  readonly credits: number;
  readonly onResult: (won: boolean, bet: number, payout: number) => void;
  readonly onBack: () => void;
}) {
  const [pick, setPick] = useState<CoinSide>("HEADS");
  const [bet, setBet] = useState(Math.min(100, credits));
  const [phase, setPhase] = useState<CoinState>("pick");
  const [displaySide, setDisplaySide] = useState<CoinSide>("HEADS");
  const flipRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const flip = useCallback(() => {
    if (phase !== "pick" || bet > credits) return;
    setPhase("flipping");
    let count = 0;
    flipRef.current = setInterval(() => {
      setDisplaySide((s) => (s === "HEADS" ? "TAILS" : "HEADS"));
      count++;
      if (count >= 10) {
        clearInterval(flipRef.current!);
        const result: CoinSide = Math.random() < 0.5 ? "HEADS" : "TAILS";
        setDisplaySide(result);
        setPhase("done");
        const won = result === pick;
        setTimeout(() => onResult(won, bet, bet), 700);
      }
    }, 100);
  }, [phase, bet, credits, pick, onResult]);

  useEffect(() => {
    return () => { if (flipRef.current) clearInterval(flipRef.current); };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") { onBack(); return; }
      if (phase === "pick") {
        if (e.key === "ArrowUp" || e.key === "ArrowDown")
          setPick((p) => (p === "HEADS" ? "TAILS" : "HEADS"));
        if (e.key === "ArrowRight") setBet((b) => Math.min(Math.min(500, credits), b + 50));
        if (e.key === "Enter") flip();
      }
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, credits, flip, onBack]);

  const sides: CoinSide[] = ["HEADS", "TAILS"];

  return (
    <>
      <PanelHeader label="COIN FLIP" credits={credits} />
      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6">
        <div
          className={`flex items-center justify-center rounded-full border-4 font-bold text-[22px] tracking-widest transition-all ${
            phase === "flipping"
              ? "border-yellow-300 text-yellow-200 shadow-[0_0_30px_rgba(234,179,8,0.6)] animate-spin"
              : displaySide === "HEADS"
              ? "border-yellow-400 text-yellow-300 shadow-[0_0_20px_rgba(234,179,8,0.3)]"
              : "border-gray-400 text-gray-300 shadow-[0_0_20px_rgba(156,163,175,0.3)]"
          }`}
          style={{ width: 160, height: 160 }}
        >
          {phase === "flipping" ? "?" : displaySide === "HEADS" ? "H" : "T"}
        </div>

        <div className="flex gap-4 w-full">
          {sides.map((side) => {
            const active = pick === side;
            return (
              <button
                key={side}
                type="button"
                onClick={() => { if (phase === "pick") setPick(side); }}
                className={`flex-1 flex items-center justify-center border font-bold text-[18px] tracking-widest transition-colors ${
                  active
                    ? "border-yellow-400 bg-yellow-400/15 text-yellow-300 shadow-[0_0_15px_rgba(234,179,8,0.3)]"
                    : "border-yellow-500/20 text-gray-500"
                }`}
                style={{ minHeight: 88 }}
              >
                {side}
              </button>
            );
          })}
        </div>

        <div className="w-full">
          <BetSelector bet={bet} min={50} max={Math.min(500, credits)} onChange={setBet} />
        </div>
        <p className="text-[12px] tracking-[0.25em] text-gray-500 uppercase">Win → 1× payout</p>
      </div>
      <PanelFooter>
        {phase === "flipping" ? "FLIPPING..." : "[↑↓] PICK · [→] BET · [⏎] FLIP · [←] BACK"}
      </PanelFooter>
    </>
  );
}

// ── Dice ──────────────────────────────────────────────────────────────────────

type DicePick = "HIGH" | "LOW";
type DiceState = "pick" | "rolling" | "done";

const DICE_FACES = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"] as const;

function DiceGame({
  credits,
  onResult,
  onBack,
}: {
  readonly credits: number;
  readonly onResult: (won: boolean, bet: number, payout: number) => void;
  readonly onBack: () => void;
}) {
  const [pick, setPick] = useState<DicePick>("HIGH");
  const [bet, setBet] = useState(Math.min(100, credits));
  const [phase, setPhase] = useState<DiceState>("pick");
  const [die, setDie] = useState(0);
  const rollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const roll = useCallback(() => {
    if (phase !== "pick" || bet > credits) return;
    setPhase("rolling");
    let count = 0;
    rollRef.current = setInterval(() => {
      setDie(Math.floor(Math.random() * 6));
      count++;
      if (count >= 14) {
        clearInterval(rollRef.current!);
        const final = Math.floor(Math.random() * 6);
        setDie(final);
        setPhase("done");
        const value = final + 1;
        const won = pick === "HIGH" ? value >= 4 : value <= 3;
        setTimeout(() => onResult(won, bet, bet), 700);
      }
    }, 80);
  }, [phase, bet, credits, pick, onResult]);

  useEffect(() => {
    return () => { if (rollRef.current) clearInterval(rollRef.current); };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") { onBack(); return; }
      if (phase === "pick") {
        if (e.key === "ArrowUp" || e.key === "ArrowDown")
          setPick((p) => (p === "HIGH" ? "LOW" : "HIGH"));
        if (e.key === "ArrowRight") setBet((b) => Math.min(Math.min(500, credits), b + 50));
        if (e.key === "Enter") roll();
      }
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, credits, roll, onBack]);

  const options: DicePick[] = ["HIGH", "LOW"];

  return (
    <>
      <PanelHeader label="DICE — HIGH / LOW" credits={credits} />
      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6">
        <div
          className={`flex items-center justify-center text-[80px] transition-all ${
            phase === "rolling" ? "animate-bounce text-yellow-300" : "text-white"
          }`}
          style={{ width: 140, height: 140 }}
        >
          {DICE_FACES[die]}
        </div>

        <div className="flex gap-4 w-full">
          {options.map((opt) => {
            const active = pick === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => { if (phase === "pick") setPick(opt); }}
                className={`flex-1 flex flex-col items-center justify-center border font-bold tracking-widest transition-colors ${
                  active
                    ? "border-yellow-400 bg-yellow-400/15 text-yellow-300 shadow-[0_0_15px_rgba(234,179,8,0.3)]"
                    : "border-yellow-500/20 text-gray-500"
                }`}
                style={{ minHeight: 88 }}
              >
                <span className="text-[20px]">{opt}</span>
                <span className="text-[12px] tracking-[0.2em] text-gray-500 mt-1">
                  {opt === "HIGH" ? "4-5-6" : "1-2-3"}
                </span>
              </button>
            );
          })}
        </div>

        <div className="w-full">
          <BetSelector bet={bet} min={50} max={Math.min(500, credits)} onChange={setBet} />
        </div>
        <p className="text-[12px] tracking-[0.25em] text-gray-500 uppercase">Win → 1× payout · ~50/50 odds</p>
      </div>
      <PanelFooter>
        {phase === "rolling" ? "ROLLING..." : "[↑↓] PICK · [→] BET · [⏎] ROLL · [←] BACK"}
      </PanelFooter>
    </>
  );
}

// ── Blackjack ─────────────────────────────────────────────────────────────────

type Suit = "♠" | "♥" | "♦" | "♣";
type Rank = "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K";
type Card = { rank: Rank; suit: Suit };
type BJPhase = "bet" | "play" | "dealer" | "done";
type BJAction = "hit" | "stand";

const RANKS: Rank[] = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const SUITS: Suit[] = ["♠", "♥", "♦", "♣"];

function buildDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) for (const rank of RANKS) deck.push({ rank, suit });
  return deck;
}

function shuffled(deck: Card[]): Card[] {
  const d = [...deck];
  for (let i = d.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [d[i], d[j]] = [d[j], d[i]];
  }
  return d;
}

function cardValue(rank: Rank): number {
  if (rank === "A") return 11;
  if (["J", "Q", "K"].includes(rank)) return 10;
  return parseInt(rank, 10);
}

function handTotal(cards: Card[]): number {
  let total = cards.reduce((s, c) => s + cardValue(c.rank), 0);
  let aces = cards.filter((c) => c.rank === "A").length;
  while (total > 21 && aces > 0) { total -= 10; aces--; }
  return total;
}

function CardPip({ card, hidden }: { readonly card: Card; readonly hidden?: boolean }) {
  const red = card.suit === "♥" || card.suit === "♦";
  return (
    <div
      className={`flex flex-col items-center justify-center border font-bold select-none ${
        hidden
          ? "border-yellow-500/30 bg-yellow-500/5 text-yellow-500/30"
          : red
          ? "border-red-500/60 bg-red-500/10 text-red-300"
          : "border-gray-400/50 bg-white/5 text-white"
      }`}
      style={{ width: 52, height: 72, fontSize: 13 }}
    >
      {hidden ? (
        <span className="text-[20px]">?</span>
      ) : (
        <>
          <span className="text-[11px] leading-none">{card.rank}</span>
          <span className="text-[18px] leading-none">{card.suit}</span>
        </>
      )}
    </div>
  );
}

const BJ_ACTIONS: { key: BJAction; label: string }[] = [
  { key: "hit", label: "HIT" },
  { key: "stand", label: "STAND" },
];

function BlackjackGame({
  credits,
  onResult,
  onBack,
}: {
  readonly credits: number;
  readonly onResult: (won: boolean, bet: number, payout: number) => void;
  readonly onBack: () => void;
}) {
  const [bet, setBet] = useState(Math.min(100, credits));
  const [phase, setPhase] = useState<BJPhase>("bet");
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [actionIndex, setActionIndex] = useState(0);
  const dealerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const deal = useCallback(() => {
    if (bet > credits) return;
    const d = shuffled(buildDeck());
    const p = [d[0], d[2]];
    const dealer = [d[1], d[3]];
    setDeck(d.slice(4));
    setPlayerHand(p);
    setDealerHand(dealer);
    setActionIndex(0);
    // instant blackjack check happens in effect
    setPhase("play");
  }, [bet, credits]);

  // check for natural blackjack right after deal
  useEffect(() => {
    if (phase !== "play") return;
    const playerTotal = handTotal(playerHand);
    const dealerTotal = handTotal(dealerHand);
    if (playerTotal === 21 || dealerTotal === 21) {
      setPhase("dealer");
    }
  }, [phase, playerHand, dealerHand]);

  // dealer draws when phase === "dealer"
  useEffect(() => {
    if (phase !== "dealer") return;
    const playerTotal = handTotal(playerHand);
    if (playerTotal > 21) {
      setPhase("done");
      return;
    }
    const runDealer = (currentHand: Card[], currentDeck: Card[]) => {
      const total = handTotal(currentHand);
      if (total >= 17) {
        setPhase("done");
        return;
      }
      dealerRef.current = setTimeout(() => {
        const [next, ...rest] = currentDeck;
        const newHand = [...currentHand, next];
        setDealerHand(newHand);
        setDeck(rest);
        runDealer(newHand, rest);
      }, 500);
    };
    runDealer(dealerHand, deck);
    return () => { if (dealerRef.current) clearTimeout(dealerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // resolve result when done
  useEffect(() => {
    if (phase !== "done") return;
    const p = handTotal(playerHand);
    const d = handTotal(dealerHand);
    const playerBust = p > 21;
    const dealerBust = d > 21;
    const won = !playerBust && (dealerBust || p > d);
    const push = !playerBust && !dealerBust && p === d;
    const blackjack = p === 21 && playerHand.length === 2;
    const payout = push ? 0 : blackjack && won ? Math.floor(bet * 1.5) : won ? bet : 0;
    dealerRef.current = setTimeout(() => onResult(!push && won, push ? 0 : bet, payout), 900);
    return () => { if (dealerRef.current) clearTimeout(dealerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const doAction = useCallback((action: BJAction) => {
    if (phase !== "play") return;
    if (action === "hit") {
      setPlayerHand((h) => {
        const [next, ...rest] = deck;
        setDeck(rest);
        const newHand = [...h, next];
        if (handTotal(newHand) >= 21) setPhase("dealer");
        return newHand;
      });
    } else {
      setPhase("dealer");
    }
  }, [phase, deck]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && phase === "bet") { onBack(); e.preventDefault(); return; }
      e.preventDefault();
      if (phase === "bet") {
        if (e.key === "ArrowUp") setBet((b) => Math.min(Math.min(500, credits), b + 50));
        if (e.key === "ArrowDown") setBet((b) => Math.max(50, b - 50));
        if (e.key === "Enter") deal();
      } else if (phase === "play") {
        if (e.key === "ArrowLeft" || e.key === "ArrowRight")
          setActionIndex((i) => (i + 1) % BJ_ACTIONS.length);
        if (e.key === "Enter") doAction(BJ_ACTIONS[actionIndex].key);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, actionIndex, deal, doAction, onBack, credits]);

  const playerTotal = playerHand.length ? handTotal(playerHand) : null;
  const dealerTotal = dealerHand.length ? handTotal(dealerHand) : null;
  const showDealerTotal = phase === "dealer" || phase === "done";

  return (
    <>
      <PanelHeader label="BLACKJACK" credits={credits} />
      <div className="flex-1 flex flex-col px-5 py-2 gap-3">
        {/* Dealer hand */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] tracking-[0.3em] text-gray-500 uppercase">Dealer</span>
            {showDealerTotal && dealerTotal !== null && (
              <span className={`text-[13px] font-bold tracking-widest ${dealerTotal > 21 ? "text-red-400" : "text-yellow-300"}`}>
                {dealerTotal > 21 ? "BUST" : dealerTotal}
              </span>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            {dealerHand.map((card, i) => (
              <CardPip key={i} card={card} hidden={i === 1 && phase === "play"} />
            ))}
          </div>
        </div>

        <div className="h-px bg-yellow-500/15" />

        {/* Player hand */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] tracking-[0.3em] text-gray-500 uppercase">You</span>
            {playerTotal !== null && (
              <span className={`text-[13px] font-bold tracking-widest ${playerTotal > 21 ? "text-red-400" : playerTotal === 21 ? "text-yellow-300" : "text-white"}`}>
                {playerTotal > 21 ? "BUST" : playerTotal === 21 ? "21!" : playerTotal}
              </span>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            {playerHand.map((card, i) => (
              <CardPip key={i} card={card} />
            ))}
          </div>
        </div>

        {/* Bet phase */}
        {phase === "bet" && (
          <div className="mt-auto flex flex-col gap-3">
            <BetSelector bet={bet} min={50} max={Math.min(500, credits)} onChange={setBet} />
            <p className="text-[11px] tracking-[0.25em] text-gray-500 uppercase text-center">
              Blackjack pays 3:2 · Dealer stands on 17
            </p>
          </div>
        )}

        {/* Action buttons */}
        {phase === "play" && (
          <div className="mt-auto flex gap-3">
            {BJ_ACTIONS.map((action, i) => {
              const active = i === actionIndex;
              return (
                <button
                  key={action.key}
                  type="button"
                  onClick={() => doAction(action.key)}
                  onMouseEnter={() => setActionIndex(i)}
                  className={`flex-1 flex items-center justify-center border font-bold text-[18px] tracking-widest transition-colors ${
                    active
                      ? "border-yellow-400 bg-yellow-400/15 text-yellow-300 shadow-[0_0_15px_rgba(234,179,8,0.3)]"
                      : "border-yellow-500/20 text-gray-500"
                  }`}
                  style={{ minHeight: 88 }}
                >
                  {action.label}
                </button>
              );
            })}
          </div>
        )}

        {(phase === "dealer" || phase === "done") && (
          <div className="mt-auto flex items-center justify-center" style={{ minHeight: 88 }}>
            <p className="text-[15px] tracking-[0.3em] text-yellow-400 uppercase animate-pulse">
              {phase === "dealer" ? "DEALER DRAWING..." : "RESOLVING..."}
            </p>
          </div>
        )}
      </div>
      <PanelFooter>
        {phase === "bet"
          ? "[↑↓] BET · [⏎] DEAL · [←] BACK"
          : phase === "play"
          ? "[←→] ACTION · [⏎] CONFIRM"
          : "PLEASE WAIT..."}
      </PanelFooter>
    </>
  );
}

// ── Roulette ──────────────────────────────────────────────────────────────────

type RouletteBetType = "red" | "black" | "green" | "odd" | "even" | "low" | "high";
type RoulettePhase = "bet" | "spinning" | "done";

const RED_NUMBERS = new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);

const ROULETTE_BETS: { key: RouletteBetType; label: string; payout: number; color: string }[] = [
  { key: "red",   label: "RED",   payout: 1, color: "text-red-400 border-red-500/50"     },
  { key: "black", label: "BLACK", payout: 1, color: "text-gray-300 border-gray-500/50"   },
  { key: "green", label: "ZERO",  payout: 35, color: "text-green-400 border-green-500/50" },
  { key: "odd",   label: "ODD",   payout: 1, color: "text-yellow-300 border-yellow-500/40" },
  { key: "even",  label: "EVEN",  payout: 1, color: "text-yellow-300 border-yellow-500/40" },
  { key: "low",   label: "1-18",  payout: 1, color: "text-blue-300 border-blue-500/40"   },
  { key: "high",  label: "19-36", payout: 1, color: "text-blue-300 border-blue-500/40"   },
];

function numberColor(n: number): "red" | "black" | "green" {
  if (n === 0) return "green";
  return RED_NUMBERS.has(n) ? "red" : "black";
}

function betWins(bet: RouletteBetType, result: number): boolean {
  if (bet === "green") return result === 0;
  if (result === 0) return false;
  if (bet === "red") return numberColor(result) === "red";
  if (bet === "black") return numberColor(result) === "black";
  if (bet === "odd") return result % 2 !== 0;
  if (bet === "even") return result % 2 === 0;
  if (bet === "low") return result >= 1 && result <= 18;
  if (bet === "high") return result >= 19 && result <= 36;
  return false;
}

function RouletteGame({
  credits,
  onResult,
  onBack,
}: {
  readonly credits: number;
  readonly onResult: (won: boolean, bet: number, payout: number) => void;
  readonly onBack: () => void;
}) {
  const [bet, setBet] = useState(Math.min(100, credits));
  const [betIndex, setBetIndex] = useState(0);
  const [phase, setPhase] = useState<RoulettePhase>("bet");
  const [result, setResult] = useState<number | null>(null);
  const [displayNum, setDisplayNum] = useState<number>(0);
  const spinRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const spin = useCallback(() => {
    if (phase !== "bet" || bet > credits) return;
    setPhase("spinning");
    let count = 0;
    spinRef.current = setInterval(() => {
      setDisplayNum(Math.floor(Math.random() * 37));
      count++;
      if (count >= 20) {
        clearInterval(spinRef.current!);
        const final = Math.floor(Math.random() * 37);
        setDisplayNum(final);
        setResult(final);
        setPhase("done");
        const selectedBet = ROULETTE_BETS[betIndex];
        const won = betWins(selectedBet.key, final);
        const payout = won ? bet * selectedBet.payout : 0;
        setTimeout(() => onResult(won, bet, payout), 800);
      }
    }, 80);
  }, [phase, bet, credits, betIndex, onResult]);

  useEffect(() => {
    return () => { if (spinRef.current) clearInterval(spinRef.current); };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && phase === "bet") { onBack(); e.preventDefault(); return; }
      e.preventDefault();
      if (phase === "bet") {
        if (e.key === "ArrowUp") setBetIndex((i) => (i - 1 + ROULETTE_BETS.length) % ROULETTE_BETS.length);
        if (e.key === "ArrowDown") setBetIndex((i) => (i + 1) % ROULETTE_BETS.length);
        if (e.key === "ArrowRight") setBet((b) => Math.min(Math.min(500, credits), b + 50));
        if (e.key === "ArrowLeft") setBet((b) => Math.max(50, b - 50));
        if (e.key === "Enter") spin();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, credits, spin, onBack]);

  const col = result !== null ? numberColor(result) : null;
  const numColorClass = col === "red" ? "text-red-400" : col === "green" ? "text-green-400" : "text-gray-200";

  return (
    <>
      <PanelHeader label="ROULETTE" credits={credits} />
      <div className="flex-1 flex flex-col px-5 py-2 gap-3">
        {/* Ball display */}
        <div className="flex items-center justify-center gap-5">
          <div
            className={`flex items-center justify-center border-2 font-bold transition-all ${
              phase === "spinning"
                ? "border-yellow-400/80 animate-spin shadow-[0_0_24px_rgba(234,179,8,0.5)]"
                : col === "red"
                ? "border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                : col === "green"
                ? "border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                : "border-gray-500 shadow-[0_0_20px_rgba(156,163,175,0.3)]"
            } rounded-full`}
            style={{ width: 90, height: 90 }}
          >
            <span className={`text-[32px] font-bold ${phase === "spinning" ? "text-yellow-300" : numColorClass}`}>
              {phase === "spinning" ? displayNum : result ?? "?"}
            </span>
          </div>
          {phase === "done" && col && (
            <div className="flex flex-col gap-1">
              <span className={`text-[14px] font-bold tracking-widest uppercase ${numColorClass}`}>
                {col.toUpperCase()}
              </span>
              {result !== null && result !== 0 && (
                <>
                  <span className="text-[12px] tracking-widest text-gray-500 uppercase">
                    {result % 2 === 0 ? "EVEN" : "ODD"}
                  </span>
                  <span className="text-[12px] tracking-widest text-gray-500 uppercase">
                    {result <= 18 ? "LOW" : "HIGH"}
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Bet type picker */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] tracking-[0.3em] text-gray-500 uppercase">Your bet</span>
          <div className="grid grid-cols-2 gap-2">
            {ROULETTE_BETS.map((b, i) => {
              const active = i === betIndex;
              return (
                <button
                  key={b.key}
                  type="button"
                  disabled={phase !== "bet"}
                  onMouseEnter={() => setBetIndex(i)}
                  onClick={() => { if (phase === "bet") setBetIndex(i); }}
                  className={`flex items-center justify-between px-3 border text-[14px] font-bold tracking-widest transition-colors disabled:opacity-50 ${
                    active
                      ? `${b.color} bg-white/5 shadow-[0_0_10px_rgba(255,255,255,0.1)]`
                      : "border-white/10 text-gray-600"
                  }`}
                  style={{ minHeight: 44 }}
                >
                  <span>{b.label}</span>
                  <span className="text-[11px] text-gray-500">{b.payout}×</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-auto">
          <BetSelector bet={bet} min={50} max={Math.min(500, credits)} onChange={setBet} />
        </div>
      </div>
      <PanelFooter>
        {phase === "spinning"
          ? "SPINNING..."
          : phase === "done"
          ? "RESOLVING..."
          : "[↑↓] BET TYPE · [←→] AMOUNT · [⏎] SPIN · [←] BACK"}
      </PanelFooter>
    </>
  );
}

// ── Result screen ─────────────────────────────────────────────────────────────

function ResultView({
  credits,
  won,
  amount,
  onContinue,
}: {
  readonly credits: number;
  readonly won: boolean;
  readonly amount: number;
  readonly onContinue: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "ArrowLeft") { onContinue(); e.preventDefault(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onContinue]);

  return (
    <>
      <PanelHeader label={won ? "YOU WIN" : "YOU LOSE"} credits={credits} />
      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6">
        <div
          className={`text-[72px] ${won ? "animate-bounce" : ""}`}
        >
          {won ? "💰" : "💸"}
        </div>
        <div className="text-center">
          <p
            className={`text-[42px] font-bold tracking-wider ${won ? "text-yellow-300" : "text-red-400"}`}
          >
            {won ? `+${amount}` : `-${amount}`} CR
          </p>
          <p className="text-[16px] tracking-[0.3em] text-gray-400 uppercase mt-2">
            {won ? "NICE SHOT SOLDIER" : "BETTER LUCK NEXT TIME"}
          </p>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-[13px] tracking-[0.3em] text-gray-500 uppercase">Balance</span>
          <span className={`text-[26px] font-bold ${credits <= 0 ? "text-red-400" : "text-white"}`}>
            {credits} CR
          </span>
        </div>
        {credits <= 0 && (
          <p className="text-[15px] text-red-400 tracking-wider text-center">
            BUST. Reload to get 1000 credits back.
          </p>
        )}
      </div>
      <PanelFooter>[⏎] PLAY AGAIN</PanelFooter>
    </>
  );
}
