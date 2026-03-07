"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shuffle,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Repeat,
  Volume2,
  Music,
} from "lucide-react";

export default function MusicPlayer() {
  const [state, setState] = useState<"playing" | "paused" | "loading">(
    "paused",
  );
  const [volume, setVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Reference ke elemen audio
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Link musik contoh (Ganti dengan file lokal Anda di /public jika ada)
  const audioSrc =
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

  // Sinkronisasi status Play/Pause
  useEffect(() => {
    if (!audioRef.current) return;

    if (state === "playing") {
      audioRef.current.play().catch(() => setState("paused"));
    } else if (state === "paused") {
      audioRef.current.pause();
    }
  }, [state]);

  // Update Progress Bar saat musik berjalan
  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleTogglePlay = () => {
    if (state === "loading") return;

    if (state === "paused") {
      setState("loading");
      // Simulasi buffer loading sebentar agar animasi terasa smooth
      setTimeout(() => setState("playing"), 600);
    } else {
      setState("paused");
    }
  };

  // Fungsi untuk menggeser progress lagu
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Format detik ke MM:SS
  const formatTime = (time: number) => {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  return (
    <motion.div
      animate={state}
      variants={{
        playing: {
          backgroundColor: "#121212",
          boxShadow: "0px 20px 60px rgba(168, 85, 247, 0.2)",
        },
        paused: {
          backgroundColor: "#121212",
          boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.6)",
        },
        loading: { backgroundColor: "#18181B" },
      }}
      style={{ width: "500px", height: "350px" }}
      className="p-[28px] rounded-[32px] flex flex-col border border-white/10 overflow-hidden relative shadow-2xl select-none"
    >
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={audioSrc}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onTimeUpdate}
        onEnded={() => setState("paused")}
      />

      {/* 1. ATAS: Artwork & Info */}
      <div className="flex items-center gap-[20px]">
        <motion.div
          animate={{ rotate: state === "playing" ? 360 : 0 }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          style={{ width: "100px", height: "100px" }}
          className="rounded-[24px] bg-gradient-to-br from-[#A855F7] to-[#EC4899] flex-shrink-0 flex items-center justify-center"
        >
          <Music size={36} className="text-black/20" />
        </motion.div>
        <div className="flex flex-col flex-1 min-w-0">
          <h2 className="text-[24px] font-bold text-white truncate tracking-tight">
            SoundHelix Song 1
          </h2>
          <p className="text-[14px] text-zinc-500 font-medium">Demo Artist</p>
          <div className="flex items-end gap-[3px] h-[16px] mt-[10px]">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                animate={
                  state === "playing"
                    ? { height: ["20%", "100%", "20%"] }
                    : { height: "20%" }
                }
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                className="w-[5px] bg-[#A855F7] rounded-full"
              />
            ))}
          </div>
        </div>
      </div>

      {/* 2. TENGAH: Progress Bar (Fungsional) */}
      <div className="mt-[20px] relative group">
        <div className="w-full h-[4px] backdrop-brightness-400 rounded-full relative flex items-center">
          {/* Visual Ungu */}
          <motion.div
            style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
            className="h-full bg-[#A855F7] rounded-full shadow-[0_0_10px_rgba(168,85,247,0.4)]"
          />

          {/* Pointer (Hanya muncul saat hover bar) */}
          <motion.div
            style={{ left: `${(currentTime / duration) * 100 || 0}%` }}
            className="absolute w-[10px] h-[10px] bg-white rounded-full shadow-md -ml-[5px] opacity-0 group-hover:opacity-100 transition-opacity z-20"
          />

          {/* Hidden Input for interaction */}
          <input
            type="range"
            min="0"
            max={duration || 0}
            step="0.1"
            value={currentTime}
            onChange={handleProgressChange}
            className="absolute inset-0 w-full h-[20px] -top-[8px] opacity-0 cursor-pointer z-30"
          />
        </div>
        <div className="flex justify-between text-[11px] font-bold text-zinc-500 mt-[6px]">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration) || "0:00"}</span>
        </div>
      </div>

      {/* 3. BAWAH A: Controls */}
      <div className="mt-auto flex items-center justify-center gap-[24px] text-zinc-500 pb-[4px]">
        <Shuffle size={18} className="cursor-pointer hover:text-white" />
        <SkipBack
          size={22}
          fill="currentColor"
          className="cursor-pointer hover:text-white"
        />
        <button
          onClick={handleTogglePlay}
          className="w-[56px] h-[56px] rounded-full bg-[#A855F7] text-white flex items-center justify-center shadow-lg active:scale-100 transition-all"
        >
          <AnimatePresence mode="wait">
            {state === "loading" ? (
              <motion.div
                key="l"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-[20px] h-[20px] border-2 border-white/20 border-t-white rounded-full"
              />
            ) : (
              <div key={state}>
                {state === "playing" ? (
                  <Pause size={28} fill="white" />
                ) : (
                  <Play size={28} fill="white" className="ml-auto" />
                )}
              </div>
            )}
          </AnimatePresence>
        </button>
        <SkipForward
          size={22}
          fill="currentColor"
          className="cursor-pointer hover:text-white"
        />
        <Repeat size={18} className="cursor-pointer hover:text-white" />
      </div>

      {/* 4. BAWAH B: Volume Section (Fungsional) */}
      <div className="mt-[16px] flex items-center gap-[12px] px-[10px] group">
        <Volume2
          size={16}
          className="text-zinc-500 group-hover:text-white transition-colors"
        />
        <div className="flex-1 h-[4px] backdrop-brightness-400 rounded-full relative flex items-center overflow-hidden">
          {/* Visual Ungu */}
          <motion.div
            animate={{ width: `${volume * 100}%` }}
            className="h-full bg-[#A855F7] rounded-full"
          />

          {/* Input Range Transparan (Untuk interaksi klik/geser) */}
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setVolume(val);
              if (audioRef.current) audioRef.current.volume = val;
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
          />
        </div>
      </div>
    </motion.div>
  );
}
