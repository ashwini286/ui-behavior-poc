import React, { useState } from 'react';
import confetti from 'canvas-confetti';

// ─── Quiz Questions ────────────────────────────────────────────
const QUESTIONS = [
  {
    q: "Ashu ka favourite color kya hai?",
    options: ["Blue 💙", "Pink 💗", "Purple 💜", "Red ❤️"],
    answer: "Pink 💗",
  },
  {
    q: "Ashu ko kaunsa food sabse zyada pasand hai?",
    options: ["Pizza 🍕", "Biryani 🍛", "Chocolate 🍫", "Pasta 🍝"],
    answer: "Chocolate 🍫",
  },
  {
    q: "Agar Ashu ek superhero hoti, uski superpower kya hoti?",
    options: ["Time Travel ⏰", "Reading Minds 🧠", "Flying 🦋", "Invisibility 👻"],
    answer: "Reading Minds 🧠",
  },
  {
    q: "Ashu ka favourite movie genre kya hai?",
    options: ["Romance 💕", "Comedy 😂", "Thriller 😱", "Animated 🎨"],
    answer: "Romance 💕",
  },
  {
    q: "Ashu ke baare mein sabse khaas baat kya hai?",
    options: ["Uski smile 😊", "Uski care 🤗", "Uska attitude 💁", "Sab kuch 💖"],
    answer: "Sab kuch 💖",
  },
];

function getScoreMsg(score) {
  if (score === 5) return { emoji: "🏆", msg: "Perfect! Tu mujhe bahut acchi tarah jaanta hai Baby! 💕" };
  if (score >= 3) return { emoji: "💗", msg: "Bohot achha! Thoda aur dhyan dena meri baaton par! 😄" };
  return { emoji: "😂", msg: "Arre Baby, mujhe thoda aur samjho! Par love you phir bhi! 💖" };
}

// ─── Gallery Memories ──────────────────────────────────────────
const MEMORIES = [
  { id: 1, label: "Pehli Mulakat 🌟", emoji: "🌟", gradient: "linear-gradient(135deg,#ff6b6b,#ee5a24)", caption: "Woh pehla din jo main kabhi nahi bhoolunga..." },
  { id: 2, label: "Hamare Haseen Pal 💕", emoji: "💕", gradient: "linear-gradient(135deg,#a29bfe,#6c5ce7)", caption: "Tere saath har pal khaas lagta hai." },
  { id: 3, label: "Sunhara Waqt ✨", emoji: "✨", gradient: "linear-gradient(135deg,#fd79a8,#e84393)", caption: "Teri muskaan meri duniya roshaan karti hai." },
  { id: 4, label: "Chand Taare 🌙", emoji: "🌙", gradient: "linear-gradient(135deg,#0984e3,#74b9ff)", caption: "Raat ko tere saath baatein, subah bhi tujhe yaad karna." },
  { id: 5, label: "Dil ki Baat 💌", emoji: "💌", gradient: "linear-gradient(135deg,#00b894,#55efc4)", caption: "Jo dil mein hai woh alfaazon mein kaise kahein?" },
  { id: 6, label: "Humesha Saath 🤝", emoji: "🤝", gradient: "linear-gradient(135deg,#e17055,#fdcb6e)", caption: "Har mushkil mein tera haath thamna chahta hoon." },
];

// ─── Main Component ────────────────────────────────────────────
export default function QuizRoom() {
  const [tab, setTab] = useState('quiz');

  // Quiz state
  const [quizPhase, setQuizPhase] = useState('intro');
  const [qIndex, setQIndex]       = useState(0);
  const [selected, setSelected]   = useState(null);
  const [answers, setAnswers]      = useState([]);
  const [score, setScore]          = useState(0);

  // Feedback state
  const [giftMsg, setGiftMsg]           = useState('');
  const [togetherMsg, setTogetherMsg]   = useState('');
  const [loveMsg, setLoveMsg]           = useState('');
  const [sending, setSending]           = useState(false);
  const [sent, setSent]                 = useState(false);

  // Gallery
  const [openMemory, setOpenMemory] = useState(null);

  const TABS = [
    { id: 'quiz',     icon: '🧠', label: 'Quiz'     },
    { id: 'feelings', icon: '💌', label: 'Feelings' },
    { id: 'gallery',  icon: '📸', label: 'Gallery'  },
  ];

  // ── Quiz handlers ────────────────────────────────────────────
  const handleSelect = (opt) => { if (!selected) setSelected(opt); };

  const handleNext = () => {
    if (!selected) return;
    const cur = QUESTIONS[qIndex];
    const ok  = selected === cur.answer;
    const na  = [...answers, { q: cur.q, chosen: selected, correct: ok }];
    const ns  = score + (ok ? 1 : 0);
    setAnswers(na); setScore(ns); setSelected(null);
    if (qIndex + 1 < QUESTIONS.length) setQIndex(qIndex + 1);
    else setQuizPhase('result');
  };

  const handleSend = (e) => {
    e.preventDefault();
    setSending(true);
    const quizLines = answers.map((a, i) =>
      `Q${i+1}: ${a.q}\n  Answer: ${a.chosen} ${a.correct ? '✅' : '❌'}`
    ).join('\n\n');
    const body = `🎂 BIRTHDAY QUIZ RESULTS\nScore: ${score}/${QUESTIONS.length}\n\n${quizLines}\n\n` +
      `────────────────────\n💝 BABY'S FEEDBACK:\n\nGift Feedback:\n${giftMsg}\n\nTogether:\n${togetherMsg}\n\nMessage:\n${loveMsg}`;
    window.open(`mailto:ashu286p@gmail.com?subject=🎂 Baby's Birthday Quiz %26 Feedback!&body=${encodeURIComponent(body)}`, '_blank');
    const end = Date.now() + 3000;
    const s = () => {
      confetti({ particleCount: 7, angle: 60,  spread: 70, origin: { x: 0 } });
      confetti({ particleCount: 7, angle: 120, spread: 70, origin: { x: 1 } });
      if (Date.now() < end) requestAnimationFrame(s);
    };
    confetti({ particleCount: 130, spread: 90, origin: { y: 0.55 } });
    s();
    setSending(false); setSent(true);
  };

  // ============================================================
  // TAB: QUIZ
  // ============================================================
  const renderQuiz = () => {
    if (quizPhase === 'intro') return (
      <div className="tq-section" style={{ textAlign: 'center' }}>
        <span className="quiz-icon">🧠</span>
        <h2 className="quiz-heading">Birthday Quiz!</h2>
        <p className="quiz-desc">Baby, kitna jaanta hai Ashu ko? 😄<br/>5 sawal • Jawab Ashu ke email pe jayenge 💌</p>
        <div className="quiz-rules">
          <p className="quiz-rules-title">📋 How it works:</p>
          <ul>
            <li>5 questions about Ashu</li>
            <li>Pick the right answer</li>
            <li>At the end, write a message for Ashu</li>
            <li>Everything goes to Ashu's email 💌</li>
          </ul>
        </div>
        <button className="btn-quiz-start" onClick={() => setQuizPhase('quiz')}>⭐ Start the Quiz!</button>
      </div>
    );

    if (quizPhase === 'quiz') {
      const cur = QUESTIONS[qIndex];
      return (
        <div className="tq-section">
          <div className="qz-progress-bar"><div className="qz-progress-fill" style={{ width: `${(qIndex / QUESTIONS.length) * 100}%` }} /></div>
          <p className="qz-counter">Question {qIndex + 1} of {QUESTIONS.length}</p>
          <h3 className="qz-question">{cur.q}</h3>
          <div className="qz-options">
            {cur.options.map(opt => {
              let cls = 'qz-opt';
              if (selected) {
                if (opt === cur.answer) cls += ' qz-opt-correct';
                else if (opt === selected) cls += ' qz-opt-wrong';
                else cls += ' qz-opt-dim';
              }
              return <button key={opt} className={cls} onClick={() => handleSelect(opt)}>{opt}</button>;
            })}
          </div>
          {selected && (
            <div className="qz-next-row">
              <p className="qz-feedback-text">{selected === cur.answer ? '✅ Sahi jawab!' : `❌ Sahi answer: ${cur.answer}`}</p>
              <button className="btn-quiz-start" onClick={handleNext}>{qIndex + 1 < QUESTIONS.length ? 'Next →' : 'See Results 🎉'}</button>
            </div>
          )}
        </div>
      );
    }

    if (quizPhase === 'result') {
      const { emoji, msg } = getScoreMsg(score);
      return (
        <div className="tq-section" style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '10px' }}>{emoji}</span>
          <h2 className="quiz-heading" style={{ color: 'white' }}>{score}/{QUESTIONS.length} Correct!</h2>
          <p className="quiz-desc" style={{ color: '#ff90af', fontStyle: 'italic' }}>{msg}</p>
          <div className="qz-breakdown">
            {answers.map((a, i) => (
              <div key={i} className="qz-breakdown-row">
                <span className="qz-breakdown-q">Q{i+1}: {a.q.slice(0, 30)}…</span>
                <span className={`qz-breakdown-status ${a.correct ? 'correct' : 'wrong'}`}>{a.correct ? '✅' : '❌'}</span>
              </div>
            ))}
          </div>
          <button className="btn-next" style={{ marginTop: '16px' }} onClick={() => setQuizPhase('feedback')}>Write to Ashu 💌 →</button>
        </div>
      );
    }

    if (quizPhase === 'feedback') return sent ? (
      <div className="tq-section" style={{ textAlign: 'center' }}>
        <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '14px', animation: 'floatBob 2s ease-in-out infinite' }}>💌</span>
        <h2 className="quiz-heading" style={{ color: '#ff90af' }}>Sent with Love!</h2>
        <p className="quiz-desc">Ashu ko tumhari saari baatein mil gayi 💕<br/>Thank you Baby! 🥰</p>
      </div>
    ) : (
      <div className="tq-section">
        <h2 className="quiz-heading" style={{ textAlign: 'center', marginBottom: '4px', color: 'white' }}>💌 Message for Ashu</h2>
        <p className="quiz-desc" style={{ textAlign: 'center', marginBottom: '14px' }}>Yeh Ashu ke email pe jayega 🌸</p>
        <form onSubmit={handleSend}>
          <div className="fb-field"><label className="fb-label">🎁 Humara gift kaisa laga?</label>
            <textarea className="fb-textarea" rows={2} placeholder="Apna feedback likhiye..." value={giftMsg} onChange={e => setGiftMsg(e.target.value)} required />
          </div>
          <div className="fb-field"><label className="fb-label">💞 Ashu ke saath kaisa lagta hai?</label>
            <textarea className="fb-textarea" rows={2} placeholder="Apni feelings share kariye..." value={togetherMsg} onChange={e => setTogetherMsg(e.target.value)} required />
          </div>
          <div className="fb-field"><label className="fb-label">💖 Ashu ke liye special message?</label>
            <textarea className="fb-textarea" rows={3} placeholder="Jo dil mein ho woh likhiye... 🌸" value={loveMsg} onChange={e => setLoveMsg(e.target.value)} required />
          </div>
          <button type="submit" className="btn-quiz-start" style={{ width: '100%', marginTop: '6px' }} disabled={sending}>
            {sending ? '⏳ Sending...' : '💌 Send to Ashu!'}
          </button>
        </form>
      </div>
    );
  };

  // ============================================================
  // TAB: FEELINGS (Ashu's letter to Baby)
  // ============================================================
  const renderFeelings = () => (
    <div className="tq-section feelings-section">
      <div className="feelings-header">
        <span className="feelings-big-heart">💖</span>
        <h2 className="feelings-title">Ashu ki Taraf Se</h2>
        <p className="feelings-subtitle">A little letter, written just for you 🌸</p>
      </div>

      <div className="letter-scroll">
        <div className="letter-inner">
          <p className="letter-date">Tumhare Birthday par,</p>
          <p className="letter-salutation">Mere Pyaare Baby,</p>

          <p className="letter-para">
            Aaj ka din bohot khaas hai — kyunki aaj tum iss duniya mein aaye the. 
            Aur main khud ko bohot lucky maanti hoon ki tum meri zindagi mein ho. 🌟
          </p>

          <p className="letter-para">
            Tumhare saath har pal ek naya ehsaas hota hai. Tumhari hansi sunna, 
            tumhare saath waqt bitaana — yeh sab mere liye duniya ki sabse khoobsurat cheez hai. 💕
          </p>

          <p className="letter-para">
            Main chahti hoon ki tum hamesha khush raho, hamesha muskurao. 
            Har mushkil mein main tumhare saath hoon — yeh mera vaada hai. 🤝
          </p>

          <p className="letter-para">
            Tumhe bahut saari duaayein deti hoon — sehat, khushi, kamyabi, 
            aur jitna pyaar main de sakti hoon, usse bhi zyada. ❤️
          </p>

          <p className="letter-closing">Tumhari hamesha,</p>
          <p className="letter-signature">Ashu 💗</p>
        </div>
      </div>

      {/* Baby can also write back */}
      <div className="reply-section">
        <p className="reply-label">💬 Kuch kehna hai Ashu ko?</p>
        <p className="reply-hint">Tab 1 → Quiz complete karo aur feedback bhejo! 💌</p>
      </div>
    </div>
  );

  // ============================================================
  // TAB: GALLERY
  // ============================================================
  const renderGallery = () => (
    <div className="tq-section gallery-section">
      <h2 className="gallery-title">📸 Hamare Pal</h2>
      <p className="gallery-subtitle">Kuch khaas yaadein tumhare liye 💕</p>

      <div className="gallery-grid">
        {MEMORIES.map(m => (
          <div key={m.id} className="gallery-card" onClick={() => setOpenMemory(m)}
            style={{ background: m.gradient }}>
            <div className="gallery-card-inner">
              <span className="gallery-emoji">{m.emoji}</span>
              <p className="gallery-card-label">{m.label}</p>
            </div>
            <div className="gallery-card-overlay">
              <p className="gallery-card-caption">"{m.caption}"</p>
              <span className="gallery-view-btn">View ✨</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add photos hint */}
      <div className="gallery-add-hint">
        <span>📁</span>
        <p>Ashu apni photos bhi yahan add kar sakti hai! 🌸</p>
      </div>
    </div>
  );

  // Memory lightbox
  const renderLightbox = () => openMemory && (
    <div className="lightbox-overlay" onClick={() => setOpenMemory(null)}>
      <div className="lightbox-box" onClick={e => e.stopPropagation()}>
        <button className="lightbox-close" onClick={() => setOpenMemory(null)}>✕</button>
        <div className="lightbox-emoji-bg" style={{ background: openMemory.gradient }}>
          <span style={{ fontSize: '5rem' }}>{openMemory.emoji}</span>
        </div>
        <div className="lightbox-content">
          <h3 className="lightbox-title">{openMemory.label}</h3>
          <p className="lightbox-caption">"{openMemory.caption}"</p>
        </div>
      </div>
    </div>
  );

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="tab-room">

      {/* ── 3-Tab Switcher ── */}
      <div className="tab-switcher">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`tab-btn ${tab === t.id ? 'tab-btn-active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            <span className="tab-icon">{t.icon}</span>
            <span className="tab-label">{t.label}</span>
          </button>
        ))}
        {/* Sliding indicator */}
        <div
          className="tab-indicator"
          style={{ left: `${TABS.findIndex(t => t.id === tab) * (100/3)}%`, width: `${100/3}%` }}
        />
      </div>

      {/* ── Tab Content ── */}
      <div className="tab-content-card" key={tab}>
        {tab === 'quiz'     && renderQuiz()}
        {tab === 'feelings' && renderFeelings()}
        {tab === 'gallery'  && renderGallery()}
      </div>

      {/* ── Lightbox ── */}
      {renderLightbox()}

    </div>
  );
}
