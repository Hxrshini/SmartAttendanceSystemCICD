

export default function StatCard({ title, value, color }) {
  return (
    <div className="stat-card" style={{borderLeft: `6px solid ${color}`}}>
      <h4>{title}</h4>
      <p>{value}</p>
    </div>
  );
}
