import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

function Dashboard() {
  const [stats, setStats] = React.useState(null);

  React.useEffect(() => {
    fetch('https://focus-tracker-api-production.up.railway.app/stats')
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);

  const dayOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weekdayData = stats ? dayOrder.map(day => ({ day, minutes: stats.by_weekday[day] || 0 })) : [];

  if (!stats) return <div className="page"><p style={{color: '#AFA9EC'}}>Loading...</p></div>;

  return (
    <div className="page">
      <div className="stats-row">
        <div className="stat-box">
          <div className="stat-lbl">전체 시간</div>
          <div className="stat-val">{stats.total_hours}h</div>
        </div>
        <div className="stat-box">
          <div className="stat-lbl">이번 주</div>
          <div className="stat-val">{stats.sessions_this_week}회</div>
        </div>
        <div className="stat-box">
          <div className="stat-lbl">연속 일수</div>
          <div className="stat-val">{stats.streak || 0}일</div>
        </div>
      </div>

      <div className="chart-card">
        <p className="chart-title">과목별 집중 시간</p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={stats.by_subject} margin={{left: -20}}>
            <CartesianGrid strokeDasharray="3 3" stroke="#EEEDFE" />
            <XAxis dataKey="name" tick={{fontSize: 12, fill: '#AFA9EC'}} />
            <YAxis tick={{fontSize: 12, fill: '#AFA9EC'}} />
            <Tooltip />
            <Bar dataKey="minutes" fill="#534AB7" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-card">
        <p className="chart-title">요일별 집중 시간</p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={weekdayData} margin={{left: -20}}>
            <CartesianGrid strokeDasharray="3 3" stroke="#EEEDFE" />
            <XAxis dataKey="day" tick={{fontSize: 12, fill: '#AFA9EC'}} />
            <YAxis tick={{fontSize: 12, fill: '#AFA9EC'}} />
            <Tooltip />
            <Bar dataKey="minutes" fill="#7F77DD" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Dashboard;