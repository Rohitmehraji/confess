import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { api } from '../api/client';
import StatCard from '../components/StatCard';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const AllPage = () => {
  const [stats, setStats] = useState({ totalContacts: 0, totalDevices: 0, totalScheduled: 0, totalSent: 0, sentLogs: [] });

  useEffect(() => {
    api.get('/dashboard').then(({ data }) => setStats(data));
  }, []);

  const chartData = {
    labels: ['Contacts', 'Devices', 'Scheduled', 'Sent'],
    datasets: [
      {
        label: 'Overview',
        data: [stats.totalContacts, stats.totalDevices, stats.totalScheduled, stats.totalSent],
        backgroundColor: ['#34d399', '#60a5fa', '#a78bfa', '#f472b6'],
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard title="Total Contacts" value={stats.totalContacts} />
        <StatCard title="Total Devices" value={stats.totalDevices} />
        <StatCard title="Total Scheduled" value={stats.totalScheduled} />
        <StatCard title="Total Sent" value={stats.totalSent} />
      </div>

      <div className="glass-panel p-6">
        <h2 className="mb-4 text-lg font-semibold">Analytics</h2>
        <Bar data={chartData} />
      </div>

      <div className="glass-panel p-6">
        <h2 className="text-lg font-semibold">Recent Logs</h2>
        <ul className="mt-3 space-y-2">
          {stats.sentLogs.slice(0, 8).map((log) => (
            <li key={log._id} className="rounded-lg bg-white/10 p-3 text-sm">
              {log.contactId?.name} - {log.status} via {log.deviceId?.phone}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AllPage;
