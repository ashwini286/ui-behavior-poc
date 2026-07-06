import React, { useState } from 'react';
import confetti from 'canvas-confetti';

export default function CakeRoom({ onComplete }) {
  const [lit, setLit] = useState(true);
  const [blown, setBlown] = useState(false);

  const blowCandle = () => {
    if (!lit) return;
    setLit(false);
    setTimeout(() => setBlown(true), 400);

    // Side cannon bursts
    const end = Date.now() + 2800;
    const shoot = () => {
      confetti({ particleCount: 7, angle: 60,  spread: 60, origin: { x: 0 }, colors: ['#ff4081','#ffd700','#b340ff','#ff80ab'] });
      confetti({ particleCount: 7, angle: 120, spread: 60, origin: { x: 1 }, colors: ['#ff4081','#ffd700','#b340ff','#40e0ff'] });
      if (Date.now() < end) requestAnimationFrame(shoot);
    };
    shoot();
    // Centre burst
    confetti({ particleCount: 160, spread: 90, origin: { y: 0.55 }, colors: ['#ff4081','#ffd700','#b340ff','#ffffff'] });
  };

  return (
    <div className="cake-room">
      <div className="cake-card">

        <h2 className="cake-heading">🎂 Happy Birthday Baby!</h2>
        <p className="cake-hint">
          {lit
            ? 'Click the candle to make a wish! 🕯️'
            : blown ? '🎉 Your wish has been granted!' : '...'}
        </p>

        {/* ─── Beautiful Cake Visual ─── */}
        <div className="cake-scene">

          {/* Floating confetti dots around cake */}
          <div className="cake-confetti-dot" style={{ top:'8%', left:'12%', background:'#ff4081', animationDelay:'0s' }} />
          <div className="cake-confetti-dot" style={{ top:'15%', right:'14%', background:'#ffd700', animationDelay:'0.4s' }} />
          <div className="cake-confetti-dot" style={{ top:'30%', left:'6%', background:'#b340ff', animationDelay:'0.8s' }} />
          <div className="cake-confetti-dot" style={{ top:'20%', right:'8%', background:'#40e0ff', animationDelay:'1.2s' }} />
          <div className="cake-confetti-dot" style={{ top:'5%', left:'38%', background:'#ff9800', animationDelay:'0.6s' }} />
          <div className="cake-confetti-dot" style={{ top:'10%', right:'32%', background:'#ff4081', animationDelay:'1s' }} />

          {/* ── CANDLE ── */}
          <div className="cake-candle-wrapper" onClick={blowCandle}>
            {lit && (
              <>
                {/* Outer glow */}
                <div className="flame-glow" />
                {/* Inner flame */}
                <div className="flame-outer" />
                <div className="flame-inner" />
              </>
            )}
            {/* Wick */}
            <div className="cake-wick" style={{ background: lit ? '#333' : '#000' }} />
            {/* Candle wax */}
            <div className="cake-candle-body" />
          </div>

          {/* ── TIER 2 (Top) ── */}
          <div className="cake-tier cake-tier-top">
            {/* Frosting */}
            <div className="frosting frosting-top">
              <div className="drip" style={{ left:'10%', height:'22px', animationDelay:'0s' }} />
              <div className="drip" style={{ left:'28%', height:'18px', animationDelay:'0.3s' }} />
              <div className="drip" style={{ left:'50%', height:'26px', animationDelay:'0.15s' }} />
              <div className="drip" style={{ left:'70%', height:'20px', animationDelay:'0.5s' }} />
              <div className="drip" style={{ left:'86%', height:'16px', animationDelay:'0.2s' }} />
            </div>
            {/* Cherries on top tier */}
            <div className="cherry-group-top">
              <span className="cherry">🍒</span>
              <span className="cherry" style={{ animationDelay:'0.3s' }}>🍒</span>
              <span className="cherry" style={{ animationDelay:'0.6s' }}>🍒</span>
            </div>
            {/* Sprinkles */}
            <div className="sprinkle" style={{ top:'35%', left:'15%', background:'#ffd700', transform:'rotate(30deg)' }} />
            <div className="sprinkle" style={{ top:'55%', left:'40%', background:'#ff4081', transform:'rotate(-20deg)' }} />
            <div className="sprinkle" style={{ top:'40%', left:'65%', background:'#40e0ff', transform:'rotate(60deg)' }} />
            <div className="sprinkle" style={{ top:'60%', left:'80%', background:'#b340ff', transform:'rotate(-45deg)' }} />
            <div className="sprinkle" style={{ top:'30%', left:'55%', background:'#ff9800', transform:'rotate(15deg)' }} />
          </div>

          {/* ── TIER 1 (Bottom) ── */}
          <div className="cake-tier cake-tier-bottom">
            {/* Frosting with drips */}
            <div className="frosting frosting-bottom">
              <div className="drip" style={{ left:'5%',  height:'28px', animationDelay:'0.1s' }} />
              <div className="drip" style={{ left:'18%', height:'22px', animationDelay:'0.4s' }} />
              <div className="drip" style={{ left:'32%', height:'32px', animationDelay:'0s' }} />
              <div className="drip" style={{ left:'47%', height:'24px', animationDelay:'0.6s' }} />
              <div className="drip" style={{ left:'62%', height:'30px', animationDelay:'0.2s' }} />
              <div className="drip" style={{ left:'76%', height:'20px', animationDelay:'0.5s' }} />
              <div className="drip" style={{ left:'89%', height:'26px', animationDelay:'0.35s' }} />
            </div>
            {/* Decoration band */}
            <div className="deco-band" />
            {/* Sprinkles on bottom tier */}
            <div className="sprinkle" style={{ top:'25%', left:'8%',  background:'#ffd700', transform:'rotate(45deg)' }} />
            <div className="sprinkle" style={{ top:'50%', left:'20%', background:'#ff4081', transform:'rotate(-30deg)' }} />
            <div className="sprinkle" style={{ top:'70%', left:'38%', background:'#40e0ff', transform:'rotate(20deg)' }} />
            <div className="sprinkle" style={{ top:'35%', left:'55%', background:'#b340ff', transform:'rotate(-60deg)' }} />
            <div className="sprinkle" style={{ top:'60%', left:'70%', background:'#ff9800', transform:'rotate(40deg)' }} />
            <div className="sprinkle" style={{ top:'28%', left:'85%', background:'#ffd700', transform:'rotate(-10deg)' }} />
            <div className="sprinkle" style={{ top:'65%', left:'92%', background:'#ff4081', transform:'rotate(55deg)' }} />
          </div>

          {/* ── Plate ── */}
          <div className="cake-stand">
            <div className="cake-plate-top" />
            <div className="cake-plate-leg" />
          </div>

        </div>{/* end cake-scene */}

        {/* ─── Action ─── */}
        <div style={{ textAlign:'center', marginTop: '4px' }}>
          {lit ? (
            <button className="btn-blow" onClick={blowCandle}>
              🕯️ Blow Out the Candle!
            </button>
          ) : blown ? (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'10px' }}>
              <p className="wish-msg">✨ Wish granted, Baby! ✨</p>
              <button className="btn-next" onClick={onComplete}>
                Go to Birthday Quiz 🧠 →
              </button>
            </div>
          ) : null}
        </div>

      </div>
    </div>
  );
}
