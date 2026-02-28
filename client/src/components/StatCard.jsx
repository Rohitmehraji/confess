const StatCard = ({ title, value }) => (
  <div className="glass-panel p-5 transition-transform duration-300 hover:-translate-y-1">
    <p className="text-sm text-slate-200">{title}</p>
    <h3 className="mt-2 text-3xl font-bold text-white">{value}</h3>
  </div>
);

export default StatCard;
