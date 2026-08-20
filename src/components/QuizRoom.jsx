import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import emailjs from '@emailjs/browser';
import heartSunset from '../assets/heart_sunset.png';
import { EMAILJS_CONFIG } from '../config';

// ─── Quiz Questions ────────────────────────────────────────────
const QUESTIONS = [
  {
    q: "Jab Ashu sad hoti hai, usse sabse zyada kya chahiye hota hai? 🥺",
    options: ["Thoda time alone 🌙", "Ek tight hug 🤗", "Kisi ka samajhna 🫂", "Bas kisi apne ka saath ❤️"],
    answer: "Bas kisi apne ka saath ❤️",
  },
  {
    q: "Ashu ke liye pyaar ka sabse beautiful meaning kya hai? ❤️",
    options: ["Trust 🤝", "Care 🫶", "Understanding 🥹", "Har situation mein saath rehna ♾️"],
    answer: "Har situation mein saath rehna ♾️",
  },
  {
    q: "Agar Ashu ki aankhon mein aansu ho, toh woh kya chahegi? 🥺❤️",
    options: ["Koi usse chup karaaye 🤗", "Koi usse samjhe 🫂", "Koi bas paas baithe 🥹", "Koi kahe 'main hoon na' ❤️"],
    answer: "Koi kahe 'main hoon na' ❤️",
  },
  {
    q: "Ashu ke liye relationship mein sabse important kya hai? 💕",
    options: ["Love ❤️", "Loyalty 🤝", "Understanding 🫂", "Ek dusre ko kabhi na chhodna 🥹"],
    answer: "Ek dusre ko kabhi na chhodna 🥹",
  },
  {
    q: "Agar Ashu apni life ki ek wish choose kare, toh kya hogi? 🌙",
    options: ["Khush rehna 😊", "Apno ko khush dekhna ❤️", "Bahut saari beautiful memories banana 📸", "Jise pyaar kare, uske saath forever rehna ♾️❤️"],
    answer: "Jise pyaar kare, uske saath forever rehna ♾️❤️",
  },
];

function getScoreMsg(score) {
  if (score === 5) return { emoji: "🏆", msg: "Perfect! Tu mujhe bahut acchi tarah jaanta hai Baby! 💕" };
  if (score >= 3) return { emoji: "💗", msg: "Bohot achha! Thoda aur dhyan dena meri baaton par! 😄" };
  return { emoji: "😂", msg: "Arre Baby, mujhe thoda aur samjho! Par love you phir bhi! 💖" };
}

// ─── Gallery Memories ──────────────────────────────────────────
const MEMORIES = [
  { 
    id: 1, 
    label: "Our First Adventure Together", 
    img: heartSunset, 
    caption: "Our first trip together... Holding hands, watching the sunset, and realizing that you are my favorite adventure. 🌅",
    rotateClass: "polaroid-rotate-L1"
  },
  { 
    id: 2, 
    label: "That Special Day", 
    emoji: "💑", 
    caption: "The day we started this beautiful journey. A moment locked in time, filled with giggles, nervous smiles, and so much love. 💕",
    rotateClass: "polaroid-rotate-R1"
  },
  { 
    id: 3, 
    label: "Sunset Moments", 
    emoji: "🌅", 
    caption: "Watching the sun paint the sky in shades of gold and pink. With you, every sunset feels like a promise of a beautiful tomorrow. 🧡",
    rotateClass: "polaroid-rotate-L2"
  },
  { 
    id: 4, 
    label: "Celebration Time", 
    emoji: "🎂", 
    caption: "Every milestone, big or small, is worth celebrating when you are by my side. Here's to making every moment special! 🎉",
    rotateClass: "polaroid-rotate-R2"
  },
  { 
    id: 5, 
    label: "Just Us", 
    emoji: "❤️", 
    caption: "In a world full of noise, you are my peace. Just you and me, laughing, caring, and loving each other every single day. 💖",
    rotateClass: "polaroid-rotate-L3"
  },
  { 
    id: 6, 
    label: "Making Memories", 
    emoji: "⭐", 
    caption: "Collect moments, not things. From late-night talks to silly jokes, every little memory with you is a star in my sky. ✨",
    rotateClass: "polaroid-rotate-R3"
  },
  { 
    id: 7, 
    label: "Forever Moments", 
    emoji: "💝", 
    caption: "A bond that grows stronger with every passing second. You hold the key to my heart, forever and always. 💞",
    rotateClass: "polaroid-rotate-L4"
  },
  { 
    id: 8, 
    label: "More to Come...", 
    emoji: "✨", 
    caption: "This is just the beginning. I can't wait to write the rest of our story together. So many more chapters of love, laughter, and adventures await! 🌸",
    rotateClass: "polaroid-rotate-R4"
  },
];

// ─── Main Component ────────────────────────────────────────────
export default function QuizRoom() {
  const [tab, setTab] = useState('quiz');

  // Quiz state
  const [quizPhase, setQuizPhase] = useState('intro');
  const [qIndex, setQIndex]       = useState(0);
  const [selected, setSelected]   = useState(null);
  const [answers, setAnswers]     = useState([]);
  const [score, setScore]         = useState(0);

  // Feedback state
  const [ashuFeelings, setAshuFeelings] = useState('');
  const [giftFeelings, setGiftFeelings] = useState('');
  const [loveMsg, setLoveMsg]           = useState('');
  const [sending, setSending]           = useState(false);
  const [sent, setSent]                 = useState(false);
  const [errors, setErrors]             = useState({});

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

  // ── Validate feedback ────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!ashuFeelings.trim()) e.ashuFeelings = 'Yeh field zaroori hai! ⚠️';
    if (!giftFeelings.trim()) e.giftFeelings = 'Yeh field zaroori hai! ⚠️';
    if (!loveMsg.trim())      e.loveMsg      = 'Yeh field zaroori hai! ⚠️';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Send email ───────────────────────────────────────────────
  const handleSend = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSending(true);

    const quizLines = answers.length > 0
      ? answers.map((a, i) =>
          `Q${i+1}: ${a.q}\n  ➤ Baby ka jawab: ${a.chosen}  ${a.correct ? '✅ Sahi' : '❌ Galat'}`
        ).join('\n\n')
      : 'Quiz nahi khela gaya.';

    const templateParams = {
      to_name: "Ashu",
      to_email: EMAILJS_CONFIG.RECEIVER_EMAIL,
      from_name: "Baby (Birthday App)",
      quiz_score: `${score}/${QUESTIONS.length}`,
      quiz_details: quizLines,
      ashu_feelings: ashuFeelings,
      gift_feelings: giftFeelings,
      special_message: loveMsg,
    };

    // Replace these placeholders with your actual EmailJS IDs
    if (!EMAILJS_CONFIG.ENABLED) {
      setSending(false);
      alert('Email sending is currently disabled.');
      return;
    }

    emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams,
      EMAILJS_CONFIG.PUBLIC_KEY
    )
    .then(() => {
      // Fireworks
      const end = Date.now() + 4000;
      const shoot = () => {
        confetti({ particleCount: 8, angle: 60,  spread: 70, origin: { x: 0 }, colors: ['#ff4081','#ffd700','#b340ff'] });
        confetti({ particleCount: 8, angle: 120, spread: 70, origin: { x: 1 }, colors: ['#ff4081','#ffd700','#40e0ff'] });
        if (Date.now() < end) requestAnimationFrame(shoot);
      };
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.55 } });
      shoot();

      setSending(false);
      setSent(true);
    })
    .catch((err) => {
      console.error('FAILED...', err);
      alert('Oops! Email bhejne mein koi problem aayi. Please dobara try karein. 😔');
      setSending(false);
    });
  };

  // ============================================================
  // FEEDBACK FORM (used after result, also standalone)
  // ============================================================
  const renderFeedbackForm = () => sent ? (
    <div className="tq-section" style={{ textAlign: 'center' }}>
      <span style={{ fontSize: '4rem', display: 'block', marginBottom: '16px', animation: 'floatBob 2s ease-in-out infinite' }}>💌</span>
      <h2 className="quiz-heading" style={{ color: '#ff90af' }}>Sent with Love!</h2>
      <p className="quiz-desc">
        Ashu ko tumhara pyaar aur jawab mil gaya 💕<br />
        Thank you Baby, itna kuch likhne ke liye! 🥰
      </p>
      <div className="sent-badge">
        <span>📧</span>
        <span>ashwini.swe@gmail.com par bheja gaya</span>
      </div>
    </div>
  ) : (
    <div className="tq-section">

      {/* Header */}
      <div className="fb-form-header">
        <span className="fb-form-header-icon">💌</span>
        <div>
          <h2 className="fb-form-title">Ashu ko Likho</h2>
          <p className="fb-form-subtitle">Yeh sab Ashu ke email pe jayega — seedha dil se! 📧</p>
        </div>
      </div>

      {/* Important notice */}
      <div className="fb-important-notice">
        <span>⚠️</span>
        <p><strong>Zaroori hai!</strong> Teeno fields fill karna bahut important hai — Ashu ye padh ke bohot khush hogi! 💖</p>
      </div>

      <form onSubmit={handleSend} noValidate>

        {/* Field 1: Ashu ke baare mein feelings */}
        <div className="fb-field">
          <label className="fb-label">
            <span className="fb-label-icon">💖</span>
            Ashu ke baare mein kya feel karte ho?
            <span className="fb-required">*</span>
          </label>
          <p className="fb-field-hint">Ashu ke baare mein jo dil mein hai — woh likhiye. Wo kaise hai, kya special hai unme...</p>
          <textarea
            className={`fb-textarea ${errors.ashuFeelings ? 'fb-error' : ''}`}
            rows={3}
            placeholder="Jaise — 'Ashu mujhe bahut pyaari lagti hai, unka care karna, unki smile...' 💕"
            value={ashuFeelings}
            onChange={e => { setAshuFeelings(e.target.value); if (errors.ashuFeelings) setErrors(p => ({...p, ashuFeelings: ''})); }}
          />
          {errors.ashuFeelings && <p className="fb-error-msg">{errors.ashuFeelings}</p>}
        </div>

        {/* Field 2: Gift kaisa laga */}
        <div className="fb-field">
          <label className="fb-label">
            <span className="fb-label-icon">🎁</span>
            Gift aur yeh birthday surprise kaisa laga?
            <span className="fb-required">*</span>
          </label>
          <p className="fb-field-hint">Ashu ne yeh sab tumhare liye banaya — unhein batao kaisa laga!</p>
          <textarea
            className={`fb-textarea ${errors.giftFeelings ? 'fb-error' : ''}`}
            rows={3}
            placeholder="Jaise — 'Yeh gift bahut sundar tha, mujhe bahut achha laga jab...' 🎂"
            value={giftFeelings}
            onChange={e => { setGiftFeelings(e.target.value); if (errors.giftFeelings) setErrors(p => ({...p, giftFeelings: ''})); }}
          />
          {errors.giftFeelings && <p className="fb-error-msg">{errors.giftFeelings}</p>}
        </div>

        {/* Field 3: Special message */}
        <div className="fb-field">
          <label className="fb-label">
            <span className="fb-label-icon">✍️</span>
            Ashu ke liye koi special message?
            <span className="fb-required">*</span>
          </label>
          <p className="fb-field-hint">Jo bhi dil mein hai — seedha Ashu ko bolo! Yeh unhe padhke bohot khushi hogi 🌸</p>
          <textarea
            className={`fb-textarea ${errors.loveMsg ? 'fb-error' : ''}`}
            rows={4}
            placeholder="Jo dil mein ho woh likhiye... bilkul apne tarike se 💖"
            value={loveMsg}
            onChange={e => { setLoveMsg(e.target.value); if (errors.loveMsg) setErrors(p => ({...p, loveMsg: ''})); }}
          />
          {errors.loveMsg && <p className="fb-error-msg">{errors.loveMsg}</p>}
        </div>

        {/* Email preview */}
        <div className="fb-email-preview">
          <span>📧</span>
          <span>Quiz ke jawab + yeh teeno baatein milkar <strong>ashwini.swe@gmail.com</strong> pe jayengi</span>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="btn-send-email"
          disabled={sending}
        >
          {sending ? '⏳ Bheja ja raha hai...' : '💌 Send to Ashu with Love!'}
        </button>

      </form>
    </div>
  );

  // ============================================================
  // TAB: QUIZ
  // ============================================================
  const renderQuiz = () => {
    if (quizPhase === 'intro') return (
      <div className="tq-section" style={{ textAlign: 'center' }}>
        <span className="quiz-icon">🧠</span>
        <h2 className="quiz-heading">Birthday Quiz!</h2>
        <p className="quiz-desc">Baby, kitna jaanta hai Ashu ko? 😄<br />5 sawal • Baad mein apni feelings bhi likho 💌</p>
        <div className="quiz-rules">
          <p className="quiz-rules-title">📋 How it works:</p>
          <ul>
            <li>5 questions about Ashu</li>
            <li>Pick the right answer</li>
            <li>At the end, write your feelings for Ashu</li>
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
          <div className="qz-progress-bar">
            <div className="qz-progress-fill" style={{ width: `${(qIndex / QUESTIONS.length) * 100}%` }} />
          </div>
          <p className="qz-counter">Question {qIndex + 1} of {QUESTIONS.length}</p>
          <h3 className="qz-question">{cur.q}</h3>
          <div className="qz-options">
            {cur.options.map(opt => {
              let cls = 'qz-opt';
              if (selected) {
                if (opt === cur.answer)  cls += ' qz-opt-correct';
                else if (opt === selected) cls += ' qz-opt-wrong';
                else cls += ' qz-opt-dim';
              }
              return <button key={opt} className={cls} onClick={() => handleSelect(opt)}>{opt}</button>;
            })}
          </div>
          {selected && (
            <div className="qz-next-row">
              <p className="qz-feedback-text">
                {selected === cur.answer ? '✅ Sahi jawab!' : `❌ Sahi answer: ${cur.answer}`}
              </p>
              <button className="btn-quiz-start" onClick={handleNext}>
                {qIndex + 1 < QUESTIONS.length ? 'Next →' : 'See Results 🎉'}
              </button>
            </div>
          )}
        </div>
      );
    }

    if (quizPhase === 'result') {
      const { emoji, msg } = getScoreMsg(score);
      return (
        <div className="tq-section">
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '8px' }}>{emoji}</span>
            <h2 className="quiz-heading" style={{ color: 'white' }}>{score}/{QUESTIONS.length} Correct!</h2>
            <p className="quiz-desc" style={{ color: '#ff90af', fontStyle: 'italic' }}>{msg}</p>
          </div>

          {/* Score breakdown */}
          <div className="qz-breakdown">
            {answers.map((a, i) => (
              <div key={i} className="qz-breakdown-row">
                <span className="qz-breakdown-q">Q{i+1}: {a.q.slice(0, 32)}…</span>
                <span className={`qz-breakdown-status ${a.correct ? 'correct' : 'wrong'}`}>{a.correct ? '✅' : '❌'}</span>
              </div>
            ))}
          </div>

          {/* Prompt to write feelings */}
          <div className="result-next-prompt">
            <p className="result-next-text">
              🌸 Ab Ashu ke liye apne dil ki baatein likho — yeh bohot zaroori hai!
            </p>
            <button className="btn-next" style={{ width: '100%' }} onClick={() => setQuizPhase('feedback')}>
              ✍️ Likho Ashu ke liye →
            </button>
          </div>
        </div>
      );
    }

    if (quizPhase === 'feedback') return renderFeedbackForm();
  };

  // ============================================================
  // TAB: FEELINGS
  // ============================================================
  const renderFeelings = () => (
    <div className="tq-section feelings-section">
      <div className="feelings-header">
        <span className="feelings-big-heart">💖</span>
        <h2 className="feelings-title">Ashu ki Taraf Se</h2>
        <p className="feelings-subtitle">A little letter, written just for you 🌸</p>
      </div>

      <div className="letter-scroll" style={{ marginBottom: '24px' }}>
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

      <div style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px' }}>
        {renderFeedbackForm()}
      </div>
    </div>
  );

  // ============================================================
  // TAB: GALLERY
  // ============================================================
  const renderGallery = () => {
    // Generate some positions for background hearts
    const heartPositions = [
      { top: '10%', left: '8%' },
      { top: '25%', left: '88%' },
      { top: '45%', left: '3%' },
      { top: '70%', left: '92%' },
      { top: '85%', left: '12%' },
      { top: '60%', left: '82%' },
      { top: '35%', left: '15%' },
      { top: '15%', left: '78%' }
    ];

    return (
      <div className="tq-section gallery-section">
        {/* Floating background hearts */}
        <div className="gallery-bg-hearts">
          {heartPositions.map((pos, idx) => (
            <span 
              key={idx} 
              className="gallery-bg-heart" 
              style={{ 
                top: pos.top, 
                left: pos.left, 
                animationDelay: `${idx * 0.5}s`,
                fontSize: `${1 + Math.random() * 0.5}rem`
              }}
            >
              💜
            </span>
          ))}
        </div>

        <h2 className="gallery-title">
          Our Beautiful Memories
          <span className="gallery-title-hearts">💜💜</span>
        </h2>
        <p className="gallery-subtitle">"Every moment with you is a treasure I hold close to my heart"</p>
        
        <div className="gallery-grid">
          {MEMORIES.map(m => (
            <div 
              key={m.id} 
              className={`polaroid-card ${m.rotateClass}`} 
              onClick={() => setOpenMemory(m)}
            >
              {/* Polaroid sticky tape effect */}
              <div className="polaroid-tape" />

              {/* Polaroid image container */}
              <div className="polaroid-img-container">
                {m.img ? (
                  <img src={m.img} alt={m.label} className="polaroid-img" />
                ) : (
                  <span className="polaroid-emoji">{m.emoji}</span>
                )}
              </div>

              {/* Caption */}
              <p className="polaroid-caption">{m.label}</p>
            </div>
          ))}
        </div>

        <div className="gallery-add-hint">
          <span>📁</span>
          <p>Ashu apni photos bhi yahan add kar sakti hai! 🌸</p>
        </div>
      </div>
    );
  };

  // Polaroid Lightbox
  const renderLightbox = () => openMemory && (
    <div className="lightbox-overlay" onClick={() => setOpenMemory(null)}>
      <div className="lightbox-box-polaroid" onClick={e => e.stopPropagation()}>
        <button className="lightbox-close-btn" onClick={() => setOpenMemory(null)}>✕</button>
        <div className="lightbox-img-wrap">
          {openMemory.img ? (
            <img src={openMemory.img} alt={openMemory.label} />
          ) : (
            <span className="lightbox-emoji-wrap">{openMemory.emoji}</span>
          )}
        </div>
        <div className="lightbox-details">
          <h3 className="lightbox-title-p">{openMemory.label}</h3>
          <p className="lightbox-caption-p">"{openMemory.caption}"</p>
        </div>
      </div>
    </div>
  );

  // ============================================================
  return (
    <div className={`tab-room ${tab === 'gallery' ? 'tab-room-gallery' : ''}`}>
      {/* 3-Tab Switcher */}
      <div className="tab-switcher">
        {TABS.map(t => (
          <button key={t.id} className={`tab-btn ${tab === t.id ? 'tab-btn-active' : ''}`} onClick={() => setTab(t.id)}>
            <span className="tab-icon">{t.icon}</span>
            <span className="tab-label">{t.label}</span>
          </button>
        ))}
        <div className="tab-indicator" style={{ left: `${TABS.findIndex(t => t.id === tab) * (100/3)}%`, width: `${100/3}%` }} />
      </div>

      {/* Tab Content */}
      <div className="tab-content-card" key={tab}>
        {tab === 'quiz'     && renderQuiz()}
        {tab === 'feelings' && renderFeelings()}
        {tab === 'gallery'  && renderGallery()}
      </div>

      {renderLightbox()}
    </div>
  );
}
