import React from 'react';

export default function QuizRoom() {
  return (
    <div className="quiz-room">
      <div className="quiz-card">

        <span className="quiz-icon">🧠</span>

        <h2 className="quiz-heading">Birthday Quiz!</h2>

        <p className="quiz-desc">
          Baby, you've unlocked the Birthday Quiz!<br />
          Let's see how well you know Ashu. 😄
        </p>

        <div className="quiz-rules">
          <p className="quiz-rules-title">✨ Quiz Rules:</p>
          <ul>
            <li>5 questions about Ashu</li>
            <li>Your answers will be recorded</li>
            <li>Ashu gets your answers on email!</li>
          </ul>
        </div>

        <button
          className="btn-quiz-start"
          onClick={() => alert('Quiz questions coming soon from Ashu! 💕')}
        >
          ⭐ Start the Quiz!
        </button>

      </div>
    </div>
  );
}
