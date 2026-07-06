import React, { useState } from 'react';
import confetti from 'canvas-confetti';

// ─── Quiz Questions ───────────────────────────────────────────
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
    q: "Agar Ashu ek superhero hoti, to uski superpower kya hoti?",
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

// ─── Score Message ────────────────────────────────────────────
function getScoreMsg(score) {
  if (score === 5) return { emoji: "🏆", msg: "Perfect Score! Tu mujhe bahut acchi tarah jaanta hai Baby! 💕" };
  if (score >= 3) return { emoji: "💗", msg: "Bohot achha! Thoda aur dhyan dena meri baaton par! 😄" };
  return { emoji: "😂", msg: "Arre Baby, mujhe thoda aur samjho! Par love you phir bhi! 💖" };
}

// ─── Components ──────────────────────────────────────────────
export default function QuizRoom({ onComplete }) {
  const [phase, setPhase] = useState('intro');   // intro | quiz | feedback | done
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);    // [{q, chosen, correct}]
  const [score, setScore] = useState(0);

  // Feedback fields
  const [giftMsg, setGiftMsg] = useState('');
  const [togetherMsg, setTogetherMsg] = useState('');
  const [loveMsg, setLoveMsg] = useState('');
  const [sending, setSending] = useState(false);

  // ── Select an option ──────────────────────────────────────
  const handleSelect = (opt) => {
    if (selected) return; // already picked
    setSelected(opt);
  };

  // ── Move to next question ─────────────────────────────────
  const handleNext = () => {
    if (!selected) return;
    const cur = QUESTIONS[qIndex];
    const isCorrect = selected === cur.answer;
    const newAnswers = [...answers, { q: cur.q, chosen: selected, correct: isCorrect }];
    const newScore = score + (isCorrect ? 1 : 0);

    setAnswers(newAnswers);
    setScore(newScore);
    setSelected(null);

    if (qIndex + 1 < QUESTIONS.length) {
      setQIndex(qIndex + 1);
    } else {
      setPhase('result');
    }
  };

  // ── Submit feedback & send email ──────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);

    // Build email body
    const quizLines = answers.map((a, i) =>
      `Q${i + 1}: ${a.q}\n  Baby's Answer: ${a.chosen} ${a.correct ? '✅' : '❌'}`
    ).join('\n\n');

    const body = `🎂 BIRTHDAY QUIZ RESULTS 🎂\n\nScore: ${score}/${QUESTIONS.length}\n\n${quizLines}\n\n` +
      `─────────────────────────\n\n💝 BABY'S FEEDBACK:\n\n` +
      `Gift Feedback:\n${giftMsg}\n\n` +
      `How it felt being together:\n${togetherMsg}\n\n` +
      `Message for Ashu:\n${loveMsg}`;

    // mailto fallback (always works, no API key needed)
    const mailtoLink = `mailto:ashu286p@gmail.com?subject=🎂 Baby's Birthday Quiz %26 Feedback!&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink, '_blank');

    // Fireworks!
    const end = Date.now() + 4000;
    const shoot = () => {
      confetti({ particleCount: 8, angle: 60,  spread: 70, origin: { x: 0 }, colors: ['#ff4081','#ffd700','#b340ff'] });
      confetti({ particleCount: 8, angle: 120, spread: 70, origin: { x: 1 }, colors: ['#ff4081','#ffd700','#40e0ff'] });
      if (Date.now() < end) requestAnimationFrame(shoot);
    };
    confetti({ particleCount: 150, spread: 90, origin: { y: 0.55 } });
    shoot();

    setSending(false);
    setPhase('done');
  };

  // ─── PHASE: INTRO ─────────────────────────────────────────
  if (phase === 'intro') return (
    <div className="quiz-room">
      <div className="quiz-card">
        <span className="quiz-icon">🧠</span>
        <h2 className="quiz-heading">Birthday Quiz!</h2>
        <p className="quiz-desc">
          Baby, let's see how well you know Ashu! 😄<br />
          5 fun questions • Answers go to Ashu's email 💌
        </p>
        <div className="quiz-rules">
          <p className="quiz-rules-title">📋 How it works:</p>
          <ul>
            <li>5 questions about Ashu</li>
            <li>Pick the right answer</li>
            <li>At the end, write a message for Ashu</li>
            <li>Everything goes to Ashu's email 💌</li>
          </ul>
        </div>
        <button className="btn-quiz-start" onClick={() => setPhase('quiz')}>
          ⭐ Start the Quiz!
        </button>
      </div>
    </div>
  );

  // ─── PHASE: QUIZ ──────────────────────────────────────────
  if (phase === 'quiz') {
    const cur = QUESTIONS[qIndex];
    const progress = ((qIndex) / QUESTIONS.length) * 100;

    return (
      <div className="quiz-room">
        <div className="quiz-card" style={{ textAlign: 'left' }}>

          {/* Progress bar */}
          <div className="qz-progress-bar">
            <div className="qz-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <p className="qz-counter">Question {qIndex + 1} of {QUESTIONS.length}</p>

          {/* Question */}
          <h3 className="qz-question">{cur.q}</h3>

          {/* Options */}
          <div className="qz-options">
            {cur.options.map((opt) => {
              let cls = 'qz-opt';
              if (selected) {
                if (opt === cur.answer) cls += ' qz-opt-correct';
                else if (opt === selected && opt !== cur.answer) cls += ' qz-opt-wrong';
                else cls += ' qz-opt-dim';
              }
              return (
                <button key={opt} className={cls} onClick={() => handleSelect(opt)}>
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Next */}
          {selected && (
            <div className="qz-next-row">
              <p className="qz-feedback-text">
                {selected === cur.answer ? '✅ Sahi jawab!' : `❌ Sahi answer tha: ${cur.answer}`}
              </p>
              <button className="btn-quiz-start" onClick={handleNext}>
                {qIndex + 1 < QUESTIONS.length ? 'Next →' : 'See Results 🎉'}
              </button>
            </div>
          )}

        </div>
      </div>
    );
  }

  // ─── PHASE: RESULT → FEEDBACK ─────────────────────────────
  if (phase === 'result') {
    const { emoji, msg } = getScoreMsg(score);
    return (
      <div className="quiz-room">
        <div className="quiz-card" style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '12px' }}>{emoji}</span>
          <h2 className="quiz-heading" style={{ color: 'white' }}>
            {score}/{QUESTIONS.length} Correct!
          </h2>
          <p className="quiz-desc" style={{ color: '#ff90af', fontStyle: 'italic', marginBottom: '8px' }}>
            {msg}
          </p>

          {/* Score breakdown */}
          <div className="qz-breakdown">
            {answers.map((a, i) => (
              <div key={i} className="qz-breakdown-row">
                <span className="qz-breakdown-q">Q{i + 1}: {a.q.slice(0, 32)}…</span>
                <span className={`qz-breakdown-status ${a.correct ? 'correct' : 'wrong'}`}>
                  {a.correct ? '✅' : '❌'}
                </span>
              </div>
            ))}
          </div>

          <button className="btn-next" style={{ marginTop: '16px' }} onClick={() => setPhase('feedback')}>
            Write to Ashu 💌 →
          </button>
        </div>
      </div>
    );
  }

  // ─── PHASE: FEEDBACK LETTER ───────────────────────────────
  if (phase === 'feedback') return (
    <div className="quiz-room" style={{ maxWidth: '520px' }}>
      <div className="quiz-card">
        <h2 className="quiz-heading" style={{ textAlign: 'center', marginBottom: '4px' }}>
          💌 Message for Ashu
        </h2>
        <p className="quiz-desc" style={{ textAlign: 'center', marginBottom: '16px' }}>
          Yeh Ashu ke email pe jayega 🌸
        </p>

        <form onSubmit={handleSubmit}>
          <div className="fb-field">
            <label className="fb-label">🎁 Humara gift kaisa laga?</label>
            <textarea
              className="fb-textarea"
              rows={2}
              placeholder="Apna feedback likhiye..."
              value={giftMsg}
              onChange={e => setGiftMsg(e.target.value)}
              required
            />
          </div>

          <div className="fb-field">
            <label className="fb-label">💞 Ashu ke saath kaisa lagta hai?</label>
            <textarea
              className="fb-textarea"
              rows={2}
              placeholder="Apni feelings share kariye..."
              value={togetherMsg}
              onChange={e => setTogetherMsg(e.target.value)}
              required
            />
          </div>

          <div className="fb-field">
            <label className="fb-label">💖 Ashu ke liye koi special message?</label>
            <textarea
              className="fb-textarea"
              rows={3}
              placeholder="Jo dil mein ho woh likhiye... 🌸"
              value={loveMsg}
              onChange={e => setLoveMsg(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-quiz-start" style={{ width: '100%', marginTop: '8px' }} disabled={sending}>
            {sending ? '⏳ Sending...' : '💌 Send to Ashu!'}
          </button>
        </form>
      </div>
    </div>
  );

  // ─── PHASE: DONE ──────────────────────────────────────────
  if (phase === 'done') return (
    <div className="quiz-room">
      <div className="quiz-card" style={{ textAlign: 'center' }}>
        <span style={{ fontSize: '4rem', display: 'block', marginBottom: '16px', animation: 'floatBob 2s ease-in-out infinite' }}>
          💌
        </span>
        <h2 className="quiz-heading" style={{ color: '#ff90af' }}>Sent with Love!</h2>
        <p className="quiz-desc">
          Ashu ko tumhari saari baatein mil gayi hain 💕<br />
          Thank you Baby, itna pyaar dene ke liye! 🥰
        </p>
        <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', marginTop: '12px', fontStyle: 'italic' }}>
          (Agar email app nahi khula, to apne email se ashu286p@gmail.com pe bhejo 🌸)
        </p>
      </div>
    </div>
  );
}
