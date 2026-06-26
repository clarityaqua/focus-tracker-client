import React from 'react';

function Timer() {
  const [timeLeft, setTimeLeft] = React.useState(() => {
    return parseInt(localStorage.getItem('timeLeft')) || 1500;
  });
  const [isRunning, setIsRunning] = React.useState(false);
  const [isBreak, setIsBreak] = React.useState(false);
  const [subjects, setSubjects] = React.useState([]);
  const [selectedSubject, setSelectedSubject] = React.useState('');
  const [newSubject, setNewSubject] = React.useState('');
  const [flash, setFlash] = React.useState(false);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const totalTime = isBreak ? 300 : 1500;

  React.useEffect(() => {
    localStorage.setItem('timeLeft', timeLeft);
  }, [timeLeft]);

  React.useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  React.useEffect(() => {
    if (timeLeft === 0) {
      setIsRunning(false);
      setFlash(true);
      setTimeout(() => setFlash(false), 2000);

      if (!isBreak) {
        fetch('https://focus-tracker-api-production.up.railway.app/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subject_id: selectedSubject, duration: 25 })
        });
        setTimeout(() => {
          setIsBreak(true);
          setTimeLeft(300);
          setIsRunning(true);
        }, 2000);
      } else {
        setIsBreak(false);
        setTimeLeft(1500);
      }
    }
  }, [timeLeft]);

  React.useEffect(() => {
    fetch('https://focus-tracker-api-production.up.railway.app/subjects')
      .then(res => res.json())
      .then(data => setSubjects(data));
  }, []);

  function addSubject() {
    if (!newSubject) return;
    fetch('https://focus-tracker-api-production.up.railway.app/subjects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newSubject })
    })
      .then(res => res.json())
      .then(data => {
        setSubjects([...subjects, data]);
        setNewSubject('');
      });
  }

  function deleteSubject(id) {
    fetch(`https://focus-tracker-api-production.up.railway.app/subjects/${id}`, { method: 'DELETE' })
      .then(() => setSubjects(subjects.filter(s => s.id !== id)));
  }

  function saveSession() {
    setIsRunning(false);
    if (timeLeft < 1500 && !isBreak) {
      const elapsed = Math.round((1500 - timeLeft) / 60);
      fetch('https://focus-tracker-api-production.up.railway.app/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject_id: selectedSubject, duration: elapsed })
      });
    }
  }

  return (
    <div className="page" style={{background: flash ? '#EEEDFE' : undefined, transition: 'background 0.3s'}}>
      <div className="timer-card">
        <div className="subject-row">
          <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
            <option value="">과목 선택</option>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <input value={newSubject} onChange={(e) => setNewSubject(e.target.value)} placeholder="새 과목 추가" />
          <button onClick={addSubject}>추가</button>
        </div>
        {subjects.length > 0 && (
          <div className="subject-list">
            {subjects.map(s => (
              <div key={s.id} className="subject-item">
                <span>{s.name}</span>
                <button onClick={() => deleteSubject(s.id)}>삭제</button>
              </div>
            ))}
          </div>
        )}
        <div className="circle-wrap">
          <svg viewBox="0 0 160 160" width="160" height="160">
            <circle cx="80" cy="80" r="70" fill="none" stroke="#EEEDFE" strokeWidth="8"/>
            <circle cx="80" cy="80" r="70" fill="none"
              stroke={isBreak ? '#82ca9d' : '#534AB7'} strokeWidth="8"
              strokeDasharray={2 * Math.PI * 70}
              strokeDashoffset={2 * Math.PI * 70 * (1 - timeLeft / totalTime)}
              strokeLinecap="round" transform="rotate(-90 80 80)"/>
          </svg>
          <div className="circle-time">{minutes}:{seconds < 10 ? '0' + seconds : seconds}</div>
          <div className="circle-sub">{isBreak ? '휴식 중' : isRunning ? '집중 중' : '준비'}</div>
        </div>
        <div className="btns">
          <button className="btn-p" onClick={() => setIsRunning(!isRunning)}>
            {isRunning ? '일시정지' : '시작'}
          </button>
          <button className="btn-s" onClick={saveSession}>정지</button>
          <button className="btn-s" onClick={() => { setIsRunning(false); setIsBreak(false); setTimeLeft(1500); localStorage.removeItem('timeLeft'); }}>초기화</button>
        </div>
      </div>
    </div>
  );
}

export default Timer;