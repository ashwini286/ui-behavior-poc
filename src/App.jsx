import React, { useState, useEffect, useRef } from 'react';
import './index.css';
import WelcomeScreen from './components/WelcomeScreen';
import CakeRoom from './components/CakeRoom';
import QuizRoom from './components/QuizRoom';

// ──────────────────────────────────────────────────────────────
// Custom neon cursor (desktop only — hidden on touch/mobile)
// ──────────────────────────────────────────────────────────────
function CustomCursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const pos     = useRef({ x: -100, y: -100 });
  const ring    = useRef({ x: -100, y: -100 });
  const raf     = useRef(null);

  useEffect(() => {
    // Only activate on pointer devices (not touch-only)
    if (!window.matchMedia('(hover: hover)').matches) return;

    const move = (e) => { pos.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', move);

    const animate = () => {
      // dot follows instantly
      if (dotRef.current) {
        dotRef.current.style.left = pos.current.x + 'px';
        dotRef.current.style.top  = pos.current.y + 'px';
      }
      // ring follows with lag (lerp)
      ring.current.x += (pos.current.x - ring.current.x) * 0.14;
      ring.current.y += (pos.current.y - ring.current.y) * 0.14;
      if (ringRef.current) {
        ringRef.current.style.left = ring.current.x + 'px';
        ringRef.current.style.top  = ring.current.y + 'px';
      }
      raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', move);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}

// ──────────────────────────────────────────────────────────────
// Happy Birthday melody — Web Audio API
// ──────────────────────────────────────────────────────────────
const MELODY = [
  [261.63,0.45,0],[261.63,0.15,0.45],[293.66,0.6,0.6],[261.63,0.6,1.2],
  [349.23,0.6,1.8],[329.63,1.2,2.4],[261.63,0.45,3.9],[261.63,0.15,4.35],
  [293.66,0.6,4.5],[261.63,0.6,5.1],[392.00,0.6,5.7],[349.23,1.2,6.3],
  [261.63,0.45,7.8],[261.63,0.15,8.25],[523.25,0.6,8.4],[440.00,0.6,9.0],
  [349.23,0.6,9.6],[329.63,0.6,10.2],[293.66,1.2,10.8],[466.16,0.45,12.3],
  [466.16,0.15,12.75],[440.00,0.6,12.9],[349.23,0.6,13.5],[392.00,0.6,14.1],
  [349.23,1.5,14.7],
];
const LOOP_S = 16.5;

function playMelody(ctx) {
  const now = ctx.currentTime;
  MELODY.forEach(([freq, dur, delay]) => {
    const osc = ctx.createOscillator(), gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, now + delay);
    gain.gain.linearRampToValueAtTime(0.13, now + delay + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + delay + dur - 0.04);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(now + delay); osc.stop(now + delay + dur);
  });
}

// ──────────────────────────────────────────────────────────────
// Star + Mouse Sparkle Canvas
// ──────────────────────────────────────────────────────────────
const SPARKLE_COLORS = ['#ff4081','#ff80ab','#ffd700','#cc40ff','#ffffff','#ff9800','#40e0ff'];

function SparkleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let raf;
    let sparkles = [];
    let mouseX = -999, mouseY = -999;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // ── Static twinkling stars ──────────────────────────
    const stars = Array.from({ length: 130 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.3 + 0.3,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.006 + 0.003,
    }));

    // ── Sparkle particle class ──────────────────────────
    class Sparkle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3.5 + 1;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed - 1.5;
        this.alpha = 1;
        this.decay = Math.random() * 0.025 + 0.018;
        this.size  = Math.random() * 5 + 2;
        this.color = SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)];
        this.rot   = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.18;
      }
      update() {
        this.x  += this.vx;
        this.y  += this.vy;
        this.vy += 0.06; // gravity
        this.alpha -= this.decay;
        this.rot   += this.rotSpeed;
      }
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot);
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle   = this.color;
        // 4-point star shape
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
          ctx.lineTo(0, -this.size);
          ctx.rotate(Math.PI / 2);
          ctx.lineTo(0, -this.size * 0.35);
          ctx.rotate(Math.PI / 2);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    }

    // ── Spawn sparkles at pointer ───────────────────────
    let spawnTimer = 0;
    const spawnAtPointer = (x, y, count = 4) => {
      for (let i = 0; i < count; i++) sparkles.push(new Sparkle(x, y));
    };

    // ── Mouse events ────────────────────────────────────
    const onMouseMove = (e) => { mouseX = e.clientX; mouseY = e.clientY; };
    // ── Touch events (phone support) ────────────────────
    const onTouchMove = (e) => {
      const t = e.touches[0];
      spawnAtPointer(t.clientX, t.clientY, 6);
    };
    const onTouchStart = (e) => {
      const t = e.touches[0];
      spawnAtPointer(t.clientX, t.clientY, 10);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove',  onTouchMove,  { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });

    // ── Draw loop ───────────────────────────────────────
    const draw = (t) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // draw twinkling stars
      stars.forEach(s => {
        const alpha = 0.25 + 0.75 * Math.abs(Math.sin(t * s.speed + s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
      });

      // spawn sparkles along mouse trail every few frames
      spawnTimer++;
      if (spawnTimer % 2 === 0 && mouseX > 0) {
        spawnAtPointer(mouseX + (Math.random()-0.5)*6, mouseY + (Math.random()-0.5)*6, 3);
      }

      // update & draw sparkles
      sparkles = sparkles.filter(s => s.alpha > 0);
      sparkles.forEach(s => { s.update(); s.draw(); });

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove',  onTouchMove);
      window.removeEventListener('touchstart', onTouchStart);
    };
  }, []);

  return <canvas ref={canvasRef} className="stars-canvas" />;
}

// ──────────────────────────────────────────────────────────────
// App
// ──────────────────────────────────────────────────────────────
export default function App() {
  const [entered, setEntered] = useState(false);
  const [step,    setStep   ] = useState(1);
  const [muted,   setMuted  ] = useState(false);
  const ctxRef   = useRef(null);
  const timerRef = useRef(null);

  const startMusic = () => {
    // Prevent duplicate melody loops when unmuting or re-entering.
    if (timerRef.current) return;
    if (!ctxRef.current)
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    const c = ctxRef.current;
    if (c.state === 'suspended') c.resume();
    playMelody(c);
    timerRef.current = setInterval(() => playMelody(c), LOOP_S * 1000);
  };
  const stopMusic = () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  };

  const handleEnter = () => { setEntered(true); startMusic(); };

  useEffect(() => {
    if (muted) stopMusic();
    else if (entered) startMusic();
  }, [muted]);

  useEffect(() => () => { stopMusic(); ctxRef.current?.close(); }, []);

  const STEPS = [
    { n: 1, label: '🎂 Welcome' },
    { n: 2, label: '🕯️ Cake'    },
    { n: 3, label: '🧠 Quiz'    },
  ];

  return (
    <div className="app-shell">

      {/* ── Custom neon cursor (desktop only) ── */}
      <CustomCursor />

      {/* ── Twinkling stars + cursor sparkle trail ── */}
      <SparkleCanvas />

      {/* ── Ambient glow orbs ── */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* ── Entry curtain ── */}
      {!entered && (
        <div className="curtain-overlay" onClick={handleEnter}>
          <div className="curtain-box">
            <div className="curtain-ring" />
            <div className="curtain-ring curtain-ring-2" />
            <span className="curtain-gift-icon">🎁</span>
            <h2 className="curtain-title">A Birthday Surprise for Baby! ✉️</h2>
            <p className="curtain-sub">Tap anywhere to open from Ashu 💕</p>
            <p className="curtain-hint">(Birthday music will play automatically)</p>
          </div>
        </div>
      )}

      {/* ── Mute button ── */}
      {entered && (
        <button className="mute-btn" onClick={() => setMuted(m => !m)}
          title={muted ? 'Unmute' : 'Mute'}>
          {muted ? '🔇' : '🎵'}
        </button>
      )}

      {/* ── Main content with room-enter animation ── */}
      {entered && (
        <div className="app-content-wrapper">
          <div key={step} className="room-enter" style={{ width:'100%', display:'flex', justifyContent:'center', overflowY: step === 3 ? 'auto' : 'hidden', maxHeight: step === 3 ? '100%' : undefined }}>
            {step === 1 && <WelcomeScreen muted={muted} onComplete={() => setStep(2)} />}
            {step === 2 && <CakeRoom     onComplete={() => setStep(3)} />}
            {step === 3 && <QuizRoom onComplete={() => setStep(3)} />}
          </div>
        </div>
      )}

      {/* ── Bottom step nav ── */}
      {entered && (
        <nav className="bottom-nav">
          {STEPS.map(s => (
            <button key={s.n}
              className={`nav-step-btn ${step === s.n ? 'active' : ''}`}
              onClick={() => { if (s.n <= step) setStep(s.n); }}>
              {s.label}
            </button>
          ))}
        </nav>
      )}

    </div>
  );
}
