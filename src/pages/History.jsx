import React from 'react';

function History() {
  const [sessions, setSessions] = React.useState([]);
  const [subjects, setSubjects] = React.useState([]);
  const [subjectFilter, setSubjectFilter] = React.useState('');
  const [rangeFilter, setRangeFilter] = React.useState('all');

  React.useEffect(() => {
    fetch('https://focus-tracker-api-production.up.railway.app/subjects')
      .then(res => res.json())
      .then(data => setSubjects(data));
  }, []);

  React.useEffect(() => {
    let url = 'https://focus-tracker-api-production.up.railway.app/sessions?';
    if (subjectFilter) url += `subject_id=${subjectFilter}&`;
    if (rangeFilter) url += `range=${rangeFilter}`;
    fetch(url)
      .then(res => res.json())
      .then(data => setSessions(data));
  }, [subjectFilter, rangeFilter]);

  function deleteSession(id) {
    fetch(`https://focus-tracker-api-production.up.railway.app/sessions/${id}`, { method: 'DELETE' })
      .then(() => setSessions(sessions.filter(s => s.id !== id)));
  }

  return (
    <div className="page">
      <div className="filter-card">
        <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)}>
          <option value="">전체 과목</option>
          {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select value={rangeFilter} onChange={(e) => setRangeFilter(e.target.value)}>
          <option value="all">전체</option>
          <option value="week">이번 주</option>
          <option value="month">이번 달</option>
        </select>
      </div>
      <div className="history-card">
        {sessions.length === 0 ? (
          <div className="empty">아직 기록이 없어요</div>
        ) : (
          sessions.slice().reverse().map(session => (
            <div key={session.id} className="history-row">
              <div>
                <div className="history-subject">{session.subject_name || '과목 없음'}</div>
                <div className="history-meta">{session.created_at.slice(0, 10)} · {session.duration}분</div>
              </div>
              <div className="history-right">
                <span className="badge">{session.duration}분</span>
                <button className="del-btn" onClick={() => deleteSession(session.id)}>삭제</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default History;