import { useEffect, useState } from 'react';
import { api } from '../api/client';
import StatCard from '../components/StatCard';
import Table from '../components/Table';
import ScheduleForm from '../components/ScheduleForm';

const DashboardPage = () => {
  const [stats, setStats] = useState({ totalContacts: 0, totalDevices: 0, totalScheduled: 0, upcoming: [], sentLogs: [] });

  const load = async () => {
    const { data } = await api.get('/dashboard');
    setStats(data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Total Contacts" value={stats.totalContacts} />
        <StatCard title="Total Devices" value={stats.totalDevices} />
        <StatCard title="Total Scheduled SMS" value={stats.totalScheduled} />
      </div>

      <ScheduleForm onScheduled={load} />

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Upcoming Scheduled SMS</h2>
        <Table
          columns={[
            { key: 'contact', label: 'Contact', render: (r) => r.contactId?.name },
            { key: 'to', label: 'To', render: (r) => r.contactId?.phone },
            { key: 'from', label: 'Device', render: (r) => r.deviceId?.phone },
            { key: 'time', label: 'Time', render: (r) => new Date(r.scheduledDateTime).toLocaleString() },
          ]}
          rows={stats.upcoming}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Sent Messages Log</h2>
        <Table
          columns={[
            { key: 'contact', label: 'Contact', render: (r) => r.contactId?.name },
            { key: 'device', label: 'Device', render: (r) => r.deviceId?.phone },
            { key: 'status', label: 'Status' },
            { key: 'sentAt', label: 'Sent At', render: (r) => (r.sentAt ? new Date(r.sentAt).toLocaleString() : '-') },
          ]}
          rows={stats.sentLogs}
        />
      </section>
    </div>
  );
};

export default DashboardPage;
