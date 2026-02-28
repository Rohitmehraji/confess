import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../api/client';
import Table from '../components/Table';

const DevicesPage = () => {
  const [devices, setDevices] = useState([]);
  const [form, setForm] = useState({ phone: '', label: '' });

  const load = async () => {
    const { data } = await api.get('/devices');
    setDevices(data);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/devices', form);
      toast.success('Device added');
      setForm({ phone: '', label: '' });
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add device');
    }
  };

  return (
    <div className="space-y-5">
      <form onSubmit={submit} className="glass-panel p-5 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
        <input className="rounded-xl border border-white/20 bg-white/10 p-2" placeholder="+15555555555" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
        <input className="rounded-xl border border-white/20 bg-white/10 p-2" placeholder="Label (optional)" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
        <button className="rounded-xl bg-indigo-500 px-4 py-2">Add Device</button>
      </form>

      <Table
        columns={[
          { key: 'phone', label: 'Phone Number' },
          { key: 'label', label: 'Label' },
        ]}
        rows={devices}
      />
    </div>
  );
};

export default DevicesPage;
