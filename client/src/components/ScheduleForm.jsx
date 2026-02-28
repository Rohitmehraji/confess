import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../api/client';

const ScheduleForm = ({ onScheduled }) => {
  const [contacts, setContacts] = useState([]);
  const [devices, setDevices] = useState([]);
  const [form, setForm] = useState({
    contactIds: [],
    deviceIds: [],
    message: '',
    date: '',
    hour: '12',
    minute: '00',
    second: '00',
  });

  useEffect(() => {
    Promise.all([api.get('/contacts'), api.get('/devices')])
      .then(([c, d]) => {
        setContacts(c.data);
        setDevices(d.data);
      })
      .catch(() => toast.error('Failed to load contacts/devices'));
  }, []);

  const toggleMultiSelect = (key, value) => {
    setForm((prev) => {
      const exists = prev[key].includes(value);
      return {
        ...prev,
        [key]: exists ? prev[key].filter((id) => id !== value) : [...prev[key], value],
      };
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/schedule', form);
      toast.success('Messages scheduled');
      setForm((prev) => ({ ...prev, message: '' }));
      onScheduled?.();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to schedule');
    }
  };

  return (
    <form onSubmit={onSubmit} className="glass-panel p-6 space-y-4">
      <h3 className="text-xl font-semibold">Schedule SMS</h3>
      <div>
        <p className="mb-2 text-sm text-slate-200">Select Contacts</p>
        <div className="max-h-32 overflow-auto rounded-lg border border-white/20 p-2">
          {contacts.map((c) => (
            <label key={c._id} className="block text-sm">
              <input type="checkbox" className="mr-2" checked={form.contactIds.includes(c._id)} onChange={() => toggleMultiSelect('contactIds', c._id)} />
              {c.name} ({c.phone})
            </label>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 text-sm text-slate-200">Select Devices</p>
        <div className="max-h-32 overflow-auto rounded-lg border border-white/20 p-2">
          {devices.map((d) => (
            <label key={d._id} className="block text-sm">
              <input type="checkbox" className="mr-2" checked={form.deviceIds.includes(d._id)} onChange={() => toggleMultiSelect('deviceIds', d._id)} />
              {d.phone}
            </label>
          ))}
        </div>
      </div>
      <textarea className="w-full rounded-xl border border-white/20 bg-white/10 p-3" rows="3" placeholder="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <input className="rounded-xl border border-white/20 bg-white/10 p-2" placeholder="dd/MM/yyyy" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
        <input className="rounded-xl border border-white/20 bg-white/10 p-2" type="number" min="0" max="23" value={form.hour} onChange={(e) => setForm({ ...form, hour: e.target.value })} required />
        <input className="rounded-xl border border-white/20 bg-white/10 p-2" type="number" min="0" max="59" value={form.minute} onChange={(e) => setForm({ ...form, minute: e.target.value })} required />
        <input className="rounded-xl border border-white/20 bg-white/10 p-2" type="number" min="0" max="59" value={form.second} onChange={(e) => setForm({ ...form, second: e.target.value })} required />
      </div>
      <button className="rounded-xl bg-indigo-500 px-4 py-2 font-medium text-white hover:bg-indigo-400">Schedule</button>
    </form>
  );
};

export default ScheduleForm;
