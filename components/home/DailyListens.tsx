"use client";

import { useState, useRef, useEffect } from "react";
import { triggerHaptic } from "@/lib/haptics";

export interface DailyListenTrack {
  id: "spark" | "prayer" | "wisdom";
  durationLabel: string;
  durationSeconds: number;
  category: string;
  title: string;
  tagline: string;
  theme: string;
  icon: string;
  scriptureRef: string;
  scriptureText: string;
  takeaway: string;
  conversationalTalk: string;
}

export const DAILY_LISTEN_TRACKS: DailyListenTrack[] = [
  {
    id: "spark",
    durationLabel: "1 MIN",
    durationSeconds: 60,
    category: "1 MIN SPARK",
    title: "The Morning Ember",
    tagline: "The 60-second pivot from early morning dread to unshakeable peace.",
    theme: "Surrendering Morning Rush",
    icon: "🌅",
    scriptureRef: "Lamentations 3:22–23",
    scriptureText:
      "Because of the Lord's great love we are not consumed, for his compassions never fail. They are new every morning; great is your faithfulness.",
    takeaway:
      "Before opening email, social media, or news, take 60 seconds to anchor your nervous system in God's fresh morning mercy.",
    conversationalTalk:
      "You know that feeling at 6:45 AM when the alarm rings, and before your feet even touch the hardwood floor, your mind is already twenty steps ahead in emails, family stress, and deadlines? Take a quiet breath with me right here. God isn't asking you to conquer today all in the next sixty seconds. Lamentations reminds us that His mercies aren’t yesterday's leftovers reheated—they are fresh out of the oven for you this morning. Before you open your first work app or check the news, whisper this simple prayer: 'Lord, I give You the first minute of my peace.' You don't have to carry the whole mountain today, friend. Just walk the next step with Jesus.",
  },
  {
    id: "prayer",
    durationLabel: "2 MIN",
    durationSeconds: 120,
    category: "2 MIN PRAYER",
    title: "Unclenched Hands",
    tagline: "An honest living-room prayer when life feels heavy and over-scheduled.",
    theme: "Releasing Control & Tension",
    icon: "🤲",
    scriptureRef: "Matthew 11:28",
    scriptureText:
      "Come to me, all you who are weary and burdened, and I will give you rest. Take my yoke upon you and learn from me, for I am gentle and humble in heart.",
    takeaway:
      "Physically open your hands right now. Release the people, outcomes, and timelines you've been white-knuckling all day.",
    conversationalTalk:
      "Hey friend. Wherever you are right now—in the car, at your kitchen table, or between meetings—check in on your body. Are your shoulders up near your ears? Is your jaw clenched? When we feel overwhelmed, our hands unconsciously ball into fists trying to control things we were never meant to carry. Right now, let's physically open our palms flat on our lap. Let's pray together: Father, here is my mess today. You see the message I've been dreading, the bank balance I keep checking, the relationship where I feel misunderstood, and the quiet ache nobody else notices. Jesus, You promised that when we come to You weary, You don't hand us more rules—You give us rest. Take this mental spreadsheet out of my hands. Settle my racing heartbeat with Your Holy Spirit. Give me gentle patience for the very next person who speaks to me, and deep trust that You are working in places I cannot see. In Christ’s name, Amen.",
  },
  {
    id: "wisdom",
    durationLabel: "4 MIN",
    durationSeconds: 240,
    category: "4 MIN WISDOM",
    title: "Street-Level Grace",
    tagline: "Front-porch counsel for when people are difficult and patience runs thin.",
    theme: "Practical Everyday Discipleship",
    icon: "☕",
    scriptureRef: "Colossians 3:12–13",
    scriptureText:
      "Therefore, as God's chosen people, holy and dearly loved, clothe yourselves with compassion, kindness, humility, gentleness and patience. Bear with each other and forgive one another.",
    takeaway:
      "You cannot control how anyone speaks to or treats you today, but through Christ, you possess total authority over the spirit in which you respond.",
    conversationalTalk:
      "Let’s be honest with each other: it’s easy to feel holy and peaceful when reading Scripture in a quiet room with a cup of coffee. But what about at 2:30 on a Tuesday afternoon when someone takes credit for your work? Or when you've picked up after everyone all day and not a single soul says thank you? That's what I call street-level grace—faith where the rubber actually meets the road. Notice how the apostle Paul says to 'clothe yourselves with compassion, kindness, humility, and patience.' Notice that word: clothe. It means you don't wake up with patience naturally attached to your skin like your fingers. You have to put it on intentionally each morning, just like you put on socks and shoes before stepping out the front door. When somebody cuts you off in traffic today, or snaps at you over the phone, ask yourself: 'Am I going to react out of my bruised ego, or am I going to respond out of Christ's infinite reserve in me?' Remember: nobody can rob you of your peace unless you hand them the keys. Walk in that freedom today.",
  },
];

export function DailyListens() {
  const [activeTrack, setActiveTrack] = useState<DailyListenTrack | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [showDrawer, setShowDrawer] = useState(false);

  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  // Preload audio files on mount for zero-latency instant play
  useEffect(() => {
    const preloaded: HTMLAudioElement[] = [];
    if (typeof window !== "undefined") {
      DAILY_LISTEN_TRACKS.forEach((track) => {
        const audio = new Audio(`/audio/daily-listens/${track.id}.mp3`);
        audio.preload = "auto";
        preloaded.push(audio);
      });
    }

    return () => {
      stopAudio();
      preloaded.forEach((a) => {
        a.src = "";
      });
    };
  }, []);

  // Unconditionally silence any browser speech synthesis or playing audio
  function stopAudio() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.currentTime = 0;
      audioElementRef.current.src = "";
      audioElementRef.current = null;
    }
    setPlayingId(null);
    setLoadingId(null);
  }

  function handlePlayTrack(track: DailyListenTrack) {
    triggerHaptic("selection");
    setActiveTrack(track);

    // If currently playing this track, pause it
    if (playingId === track.id) {
      stopAudio();
      return;
    }

    // Stop whatever was playing first
    stopAudio();

    // Kill any lingering speech synthesis
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setPlayingId(track.id);
    setLoadingId(track.id);
    setSecondsElapsed(0);

    // Direct pre-rendered high-quality audio file
    const audioUrl = `/audio/daily-listens/${track.id}.mp3`;
    const audio = new Audio(audioUrl);
    audioElementRef.current = audio;

    audio.oncanplay = () => {
      setLoadingId(null);
    };

    audio.onplaying = () => {
      setLoadingId(null);
    };

    audio.ontimeupdate = () => {
      setSecondsElapsed(Math.floor(audio.currentTime));
    };

    audio.onended = () => {
      stopAudio();
    };

    audio.onerror = () => {
      // If static file fails, try dynamic stream route
      const streamUrl = `/api/audio/tts?trackId=${track.id}`;
      audio.src = streamUrl;
      audio.play().catch((err) => {
        console.warn("Audio playback issue:", err);
        stopAudio();
      });
    };

    audio.play().catch((err) => {
      console.warn("Audio play prevented:", err);
      setLoadingId(null);
    });
  }

  function openDetailModal(track: DailyListenTrack) {
    triggerHaptic("selection");
    setActiveTrack(track);
    setShowDrawer(true);
  }

  function formatTime(secs: number) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  }

  return (
    <section className="rounded-3xl border border-[var(--line)] bg-[var(--canvas-2)] p-6 sm:p-8 shadow-xl">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[var(--line)] pb-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--gold)]/15 px-3 py-1 text-xs font-bold text-[var(--gold)] uppercase tracking-wider mb-2">
            <span>🎧</span>
            <span>Daily Audio Companions</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[var(--ink)]">
            Daily Listens
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[var(--muted)] max-w-xl leading-relaxed">
            Real-life conversational talks, quiet prayers, and street-level wisdom rooted in Scripture. Short enough for any busy schedule.
          </p>
        </div>

        <div className="text-xs font-semibold text-[var(--gold)] flex items-center gap-1.5 shrink-0">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Fresh for Today</span>
        </div>
      </div>

      {/* 3 Listen Cards Grid: 1 min Spark, 2 min Prayer, 4 min Wisdom */}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {DAILY_LISTEN_TRACKS.map((track) => {
          const isCurrentPlaying = playingId === track.id;
          const currentElapsed = isCurrentPlaying ? secondsElapsed : 0;
          const progressPercent = (currentElapsed / track.durationSeconds) * 100;

          return (
            <div
              key={track.id}
              className={`group flex flex-col justify-between rounded-2xl border p-5 transition-all relative overflow-hidden ${
                isCurrentPlaying
                  ? "border-[var(--gold)] bg-[var(--canvas)] shadow-lg ring-1 ring-[var(--gold)]/40"
                  : "border-[var(--line)] bg-[var(--canvas)] hover:border-[var(--gold)]/40 hover:shadow-md"
              }`}
            >
              {/* Progress bar line if playing */}
              {isCurrentPlaying && (
                <div
                  className="absolute top-0 left-0 h-1 bg-[var(--gold)] transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              )}

              <div>
                {/* Badge & Duration */}
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-bold text-[var(--gold)] border border-[var(--gold)]/20 uppercase tracking-wider">
                    {track.category}
                  </span>
                  <span className="text-xs font-mono font-medium text-[var(--muted)]">
                    {isCurrentPlaying
                      ? `${formatTime(currentElapsed)} / ${formatTime(track.durationSeconds)}`
                      : track.durationLabel}
                  </span>
                </div>

                {/* Title & Tagline */}
                <div className="mt-3 flex items-start gap-3">
                  <span className="text-3xl shrink-0 mt-0.5">{track.icon}</span>
                  <div>
                    <h3 className="font-display text-lg font-bold text-[var(--ink)] group-hover:text-[var(--gold)] transition-colors leading-snug">
                      {track.title}
                    </h3>
                    <p className="mt-1 text-xs text-[var(--muted)] leading-relaxed line-clamp-2">
                      {track.tagline}
                    </p>
                  </div>
                </div>

                {/* Biblical Anchor Quote snippet */}
                <div className="mt-4 rounded-xl bg-[var(--canvas-2)] p-3 border border-[var(--line)]/60 text-xs">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--gold)]">
                    Scripture Anchor · {track.scriptureRef}
                  </div>
                  <p className="mt-1 text-[var(--muted)] italic line-clamp-2">
                    &ldquo;{track.scriptureText}&rdquo;
                  </p>
                </div>
              </div>

              {/* Bottom Actions: Play Button & Read Full Transcript / Steps */}
              <div className="mt-5 pt-3 border-t border-[var(--line)] flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => openDetailModal(track)}
                  className="text-xs font-semibold text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
                >
                  Read &amp; Reflect →
                </button>

                <button
                  type="button"
                  onClick={() => handlePlayTrack(track)}
                  disabled={loadingId === track.id}
                  className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all shadow-sm ${
                    loadingId === track.id
                      ? "bg-[var(--gold)]/70 text-black cursor-wait"
                      : isCurrentPlaying
                      ? "bg-amber-500 text-black animate-pulse"
                      : "bg-[var(--gold)] text-black hover:brightness-110"
                  }`}
                >
                  {loadingId === track.id ? (
                    <span className="flex items-center gap-1.5">
                      <span className="inline-block animate-spin">⏳</span>
                      <span>Buffering...</span>
                    </span>
                  ) : (
                    <>
                      <span>{isCurrentPlaying ? "⏸ Pause" : "▶ Listen"}</span>
                      <span className="font-mono text-[10px] opacity-80">({track.durationLabel})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail / Transcript / Reflection Modal */}
      {showDrawer && activeTrack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-[var(--line)] bg-[var(--canvas-2)] p-6 sm:p-8 shadow-2xl">
            {/* Close button */}
            <button
              type="button"
              onClick={() => setShowDrawer(false)}
              className="absolute right-5 top-5 rounded-full bg-white/10 p-2 text-xs text-[var(--muted)] hover:bg-white/20 hover:text-white transition-all"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3">
              <span className="text-4xl">{activeTrack.icon}</span>
              <div>
                <span className="rounded bg-[var(--gold)]/15 px-2 py-0.5 text-[10px] font-bold text-[var(--gold)] border border-[var(--gold)]/20 uppercase tracking-wider">
                  {activeTrack.category}
                </span>
                <h3 className="font-display text-2xl font-bold text-[var(--ink)] mt-1">
                  {activeTrack.title}
                </h3>
              </div>
            </div>

            {/* Scripture Anchor Card */}
            <div className="mt-5 rounded-2xl border border-[var(--gold)]/30 bg-[var(--canvas)] p-4 text-xs">
              <div className="font-bold text-[var(--gold)] uppercase tracking-wider">
                📖 Biblical Grounding · {activeTrack.scriptureRef}
              </div>
              <p className="mt-2 text-sm italic text-[var(--ink)] leading-relaxed">
                &ldquo;{activeTrack.scriptureText}&rdquo;
              </p>
            </div>

            {/* Conversational Talk Audio Player */}
            <div className="mt-5 rounded-2xl border border-[var(--line)] bg-[var(--canvas)] p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[var(--muted)]">
                  Audio Companion
                </span>
                <span className="font-mono text-xs text-[var(--gold)] font-bold">
                  {activeTrack.durationLabel}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handlePlayTrack(activeTrack)}
                  className="flex-1 rounded-xl bg-[var(--gold)] py-2.5 px-4 text-xs font-bold text-black hover:brightness-110 flex items-center justify-center gap-2 shadow"
                >
                  <span>{playingId === activeTrack.id ? "⏸ Pause Audio" : "▶ Play Audio"}</span>
                </button>
              </div>
            </div>

            {/* Full Conversational Talk Transcript */}
            <div className="mt-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--gold)] mb-2">
                Talk Transcript &amp; Reflection
              </h4>
              <div className="rounded-2xl border border-[var(--line)] bg-[var(--canvas)] p-5 text-sm text-[var(--ink)] leading-relaxed space-y-3 font-serif">
                <p>{activeTrack.conversationalTalk}</p>
              </div>
            </div>

            {/* Today's Practical Takeaway */}
            <div className="mt-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-xs">
              <div className="font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>🌱</span>
                <span>Today&apos;s Practical Anchor</span>
              </div>
              <p className="mt-1 text-neutral-300 leading-relaxed text-xs sm:text-sm">
                {activeTrack.takeaway}
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowDrawer(false)}
                className="rounded-xl bg-[var(--canvas)] border border-[var(--line)] px-5 py-2 text-xs font-semibold text-[var(--ink)] hover:border-[var(--gold)]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
