"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const FRAME_SIZE = 600;
const STARTING_CREDITS = 1000;

type GameView = "menu" | "slots" | "coinflip" | "dice" | "result";

type MenuItem = { readonly key: Exclude<GameView, "menu" | "result">; readonly label: string; readonly icon: string };

const MENU_ITEMS: readonly MenuItem[] = [
  { key: "slots", label: "SLOTS", icon: "🎰" },
  { key: "coinflip", label: "COIN FLIP", icon: "🪙" },
  { key: "dice", label: "DICE", icon: "🎲" },
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

  const handleResult = useCallback((won: boolean, bet: number, payout: number) => {
    setLastBet(bet);
    setLastWin(won ? payout : 0);
    setCredits((c) => c + (won ? payout : -bet));
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
