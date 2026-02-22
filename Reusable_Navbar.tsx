"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const BOTTOM_GAP = 16;   // px gap between navbar bottom and screen bottom edge
const NAV_H = 53;        // px — navbar height
const NAV_W = 326;       // px — navbar width

/* ── Slide-up menu links ── */
const menuLinks = [
    { name: "JOIN US", href: "/#pricing", arrow: false },
    { name: "HOMEPAGE", href: "/", arrow: false },
    { name: "SPACES", href: "/#features", arrow: true },
    { name: "CLASSES", href: "/#classes", arrow: false },
    { name: "COMMUNITY", href: "/gallery", arrow: false },
    { name: "CAFE", href: "/#cafe", arrow: false },
    { name: "MY DASHBOARD", href: "/dashboard", arrow: false },
    { name: "TIMETABLE", href: "/#classes", arrow: false },
];

export default function ReusableNavbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [musicPlaying, setMusicPlaying] = useState(false);
    const audioContextRef = useRef<AudioContext | null>(null);
    const gainNodeRef = useRef<GainNode | null>(null);
    const oscillatorsRef = useRef<OscillatorNode[]>([]);
    const pillRef = useRef<HTMLElement>(null);
    const [pillWidth, setPillWidth] = useState(0);

    /* ── Music ── */
    const startMusic = useCallback(() => {
        if (audioContextRef.current) return;
        const ctx = new AudioContext();
        audioContextRef.current = ctx;
        const masterGain = ctx.createGain();
        masterGain.gain.value = 0.15;
        masterGain.connect(ctx.destination);
        gainNodeRef.current = masterGain;
        const notes = [130.81, 164.81, 196.00, 261.63];
        const oscs: OscillatorNode[] = [];
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            osc.type = i % 2 === 0 ? "sine" : "triangle";
            osc.frequency.value = freq;
            const lfo = ctx.createOscillator();
            lfo.type = "sine"; lfo.frequency.value = 0.3 + i * 0.1;
            const lfoGain = ctx.createGain(); lfoGain.gain.value = 2;
            lfo.connect(lfoGain); lfoGain.connect(osc.frequency); lfo.start();
            const voiceGain = ctx.createGain(); voiceGain.gain.value = 0.25;
            osc.connect(voiceGain); voiceGain.connect(masterGain); osc.start();
            oscs.push(osc);
        });
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) { data[i] = (Math.random() * 2 - 1) * 0.02; }
        const noiseSource = ctx.createBufferSource();
        noiseSource.buffer = noiseBuffer; noiseSource.loop = true;
        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = "lowpass"; noiseFilter.frequency.value = 800;
        noiseSource.connect(noiseFilter); noiseFilter.connect(masterGain); noiseSource.start();
        oscillatorsRef.current = oscs;
        setMusicPlaying(true);
    }, []);

    const stopMusic = useCallback(() => {
        if (gainNodeRef.current && audioContextRef.current) {
            gainNodeRef.current.gain.setTargetAtTime(0, audioContextRef.current.currentTime, 0.3);
            setTimeout(() => {
                audioContextRef.current?.close();
                audioContextRef.current = null; gainNodeRef.current = null; oscillatorsRef.current = [];
            }, 500);
        }
        setMusicPlaying(false);
    }, []);

    const toggleMusic = useCallback(() => {
        if (musicPlaying) { stopMusic(); } else { startMusic(); }
    }, [musicPlaying, startMusic, stopMusic]);

    /* ── Measure pill width so menu panel can match exactly ── */
    useEffect(() => {
        const measure = () => {
            if (pillRef.current) setPillWidth(pillRef.current.offsetWidth);
        };
        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, []);

    /* ── Lock body scroll when menu open ── */
    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [menuOpen]);

    return (
        <>
            {/* Dark page overlay */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        key="overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-[2px]"
                        onClick={() => setMenuOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* ── Slide-up menu panel — same width as navbar, dark bg, sharp corners ── */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        key="menu"
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "100%", opacity: 0 }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed z-[95] overflow-hidden"
                        style={{
                            bottom: BOTTOM_GAP + NAV_H,
                            left: 0,
                            right: 0,
                            marginLeft: "auto",
                            marginRight: "auto",
                            width: NAV_W,
                            borderRadius: 0,
                            backgroundColor: "rgb(22, 16, 3)",
                        }}
                    >
                        <div className="flex flex-col items-center py-4 px-4">
                            {/* Language toggle */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.1, duration: 0.3 }}
                                className="flex items-center gap-4 mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40"
                            >
                                <span className="hover:text-white/70 transition-colors cursor-pointer">Português</span>
                                <span className="text-white/70 border-b border-white/50 cursor-pointer">English</span>
                            </motion.div>

                            {/* Links */}
                            <div className="w-full">
                                {menuLinks.map((link, i) => (
                                    <motion.div
                                        key={link.name}
                                        initial={{ opacity: 0, y: 14 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 8 }}
                                        transition={{ delay: 0.05 + i * 0.04, duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                                        className="border-b border-white/10 last:border-b-0"
                                    >
                                        <Link
                                            href={link.href}
                                            onClick={() => setMenuOpen(false)}
                                            className="flex items-center justify-center py-2.5 text-white/80 text-sm font-black uppercase tracking-tight hover:text-primary transition-all duration-300 group relative"
                                            style={{ fontFamily: "var(--font-heading)" }}
                                        >
                                            <span className="relative z-10">{link.name}</span>
                                            {link.arrow && (
                                                <span className="absolute right-3 text-white/30 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 text-xs">→</span>
                                            )}
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ══════════════════════════════════════════════════ */}
            {/* ══  THE FLOATING BAR — centered, rectangle shape  ══ */}
            {/* ══════════════════════════════════════════════════ */}
            <motion.nav
                ref={pillRef}
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="fixed z-[100] flex items-center justify-between bg-primary text-dark"
                style={{
                    bottom: BOTTOM_GAP,
                    left: 0,
                    right: 0,
                    marginLeft: "auto",
                    marginRight: "auto",
                    width: NAV_W,
                    height: NAV_H,
                    borderRadius: 0,
                    paddingLeft: 24,
                    paddingRight: 24,
                }}
            >
                {/* ── Hamburger (2-line) ── */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex flex-col gap-[5px] cursor-pointer relative justify-center items-center"
                    style={{ width: 28, height: 28 }}
                    aria-label="Toggle menu"
                >
                    <motion.span
                        className="block bg-dark origin-center rounded-full"
                        style={{ width: 18, height: 1.5 }}
                        animate={menuOpen ? { rotate: 45, y: 3.25 } : { rotate: 0, y: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    />
                    <motion.span
                        className="block bg-dark origin-center rounded-full"
                        style={{ width: 18, height: 1.5 }}
                        animate={menuOpen ? { rotate: -45, y: -3.25 } : { rotate: 0, y: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    />
                </button>

                {/* Divider */}
                <div className="w-px self-stretch my-3 bg-dark/15" />

                {/* Logo Area */}
                <Link
                    href="/"
                    className="text-dark font-black text-lg tracking-tight leading-none"
                    style={{ fontFamily: "var(--font-heading)" }}
                >
                    BRAND
                </Link>

                {/* Divider */}
                <div className="w-px self-stretch my-3 bg-dark/15" />

                {/* Sound wave / Music toggle */}
                <button
                    onClick={toggleMusic}
                    className="flex items-center cursor-pointer justify-center"
                    style={{ width: 28, height: 28 }}
                    aria-label={musicPlaying ? "Pause music" : "Play music"}
                    title={musicPlaying ? "Pause ambient music" : "Play ambient music"}
                >
                    <div className="flex items-end gap-[2px] h-4">
                        {[3, 5, 8, 4, 7, 3, 6, 4, 3].map((h, i) => (
                            <motion.div
                                key={i}
                                className={`w-[1.5px] rounded-full transition-colors duration-300 ${musicPlaying ? "bg-dark" : "bg-dark/40"}`}
                                animate={musicPlaying ? { height: [h, h * 2.2, h] } : { height: h }}
                                transition={musicPlaying
                                    ? { duration: 0.7 + i * 0.1, repeat: Infinity, ease: "easeInOut" }
                                    : { duration: 0.3 }
                                }
                            />
                        ))}
                    </div>
                </button>
            </motion.nav>
        </>
    );
}
