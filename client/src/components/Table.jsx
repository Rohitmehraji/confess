const Table = ({ columns, rows, emptyText = 'No data' }) => {
  if (!rows.length) {
    return <div className="glass-panel p-6 text-center text-slate-200">{emptyText}</div>;
  }

  return (
    <div className="glass-panel overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="bg-white/10 text-slate-100">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="px-4 py-3 font-medium">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={row.id || idx} className="border-t border-white/10 hover:bg-white/5">
              {columns.map((c) => (
                <td key={c.key} className="px-4 py-3 text-slate-100">
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
