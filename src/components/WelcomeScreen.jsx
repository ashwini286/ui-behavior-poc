import React, { useEffect, useState, useRef } from 'react';

export default function WelcomeScreen({ onComplete, muted }) {
  const [hearts, setHearts] = useState([]);
  const audioRef = useRef(null);

  // Generate floating background hearts
  useEffect(() => {
    const list = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 16 + 14,
      delay: Math.random() * 10,
      duration: Math.random() * 8 + 12,
      dx: (Math.random() - 0.5) * 60,
    }));
    setHearts(list);
  }, []);

  // Heartbeat sound — synced with the CSS heartbeat animation (1.2s)
  useEffect(() => {
    if (muted) return;

    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    audioRef.current = ctx;

    const beat = () => {
      if (ctx.state === 'suspended') ctx.resume();
      const t = ctx.currentTime;
      // Lub
      const o1 = ctx.createOscillator(), g1 = ctx.createGain();
      o1.type = 'sine'; o1.frequency.value = 55;
      g1.gain.setValueAtTime(0, t);
      g1.gain.linearRampToValueAtTime(0.7, t + 0.02);
      g1.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
      o1.connect(g1); g1.connect(ctx.destination);
      o1.start(t); o1.stop(t + 0.2);
      // Dub
      const o2 = ctx.createOscillator(), g2 = ctx.createGain();
      o2.type = 'sine'; o2.frequency.value = 46;
      g2.gain.setValueAtTime(0, t + 0.18);
      g2.gain.linearRampToValueAtTime(0.5, t + 0.2);
      g2.gain.exponentialRampToValueAtTime(0.001, t + 0.32);
      o2.connect(g2); g2.connect(ctx.destination);
      o2.start(t + 0.18); o2.stop(t + 0.4);
    };

    beat();
    const interval = setInterval(beat, 1200);
    return () => { clearInterval(interval); ctx.close(); };
  }, [muted]);

  // Heart path (smooth, precise bezier)
  const HEART_PATH = "M50 20 C50 20, 10 0, 5 30 C0 55, 25 78, 50 95 C75 78, 100 55, 95 30 C90 0, 50 20, 50 20 Z";

  return (
    <div className="welcome-screen">

      {/* Floating tiny hearts in background */}
      <div className="hearts-layer">
        {hearts.map(h => (
          <svg
            key={h.id}
            className="float-heart"
            viewBox="0 0 100 100"
            style={{
              left: `${h.left}%`,
              width: h.size,
              height: h.size,
              animationDelay: `${h.delay}s`,
              animationDuration: `${h.duration}s`,
              '--dx': `${h.dx}px`,
              filter: 'drop-shadow(0 0 4px rgba(255,64,129,0.7))',
            }}
            fill="none"
            stroke="#ff4081"
            strokeWidth="4"
          >
            <path d={HEART_PATH} />
          </svg>
        ))}
      </div>

      {/* Big neon heart */}
      <div className="heart-wrapper">
        <svg
          className="heart-svg"
          viewBox="0 0 100 100"
          fill="none"
          stroke="#ff4081"
          strokeWidth="2.2"
          strokeLinejoin="round"
        >
          <path d={HEART_PATH} />
        </svg>

        {/* Text inside heart */}
        <div className="heart-text">
          <span className="ht-line1">Happy</span>
          <span className="ht-line2">Birthday</span>
          <span className="ht-line2" style={{ fontSize: 'clamp(1.6rem, 5.5vw, 2.4rem)' }}>Baby! 💕</span>
        </div>
      </div>

      {/* Subtitle */}
      <p className="heart-subtitle">
        Thank you for being a part of my life.<br />
        Wishing you all the love and happiness<br />
        you deserve. 🌸
      </p>

      {/* CTA */}
      <button className="btn-celebrate" onClick={onComplete}>
        🎂 Let's Celebrate!
      </button>

    </div>
  );
}
