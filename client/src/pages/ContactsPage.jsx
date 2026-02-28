import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../api/client';
import Table from '../components/Table';

const ContactsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [query, setQuery] = useState('');
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);

  const load = async () => {
    const { data } = await api.get('/contacts', { params: { q: query } });
    setContacts(data);
  };

  useEffect(() => {
    load();
  }, [query]);

  const upload = async () => {
    if (!file) return toast.error('Choose a CSV/XLSX file');
    const formData = new FormData();
    formData.append('file', file);

    try {
      await api.post('/contacts/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          const pct = Math.round((e.loaded * 100) / (e.total || 1));
          setProgress(pct);
        },
      });
      toast.success('Contacts uploaded');
      setProgress(0);
      setFile(null);
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    }
  };

  const remove = async (id) => {
    await api.delete(`/contacts/${id}`);
    toast.success('Contact deleted');
    load();
  };

  const rows = useMemo(() => contacts.map((c) => ({ ...c, id: c._id })), [contacts]);

  return (
    <div className="space-y-5">
      <div className="glass-panel p-5 space-y-3">
        <h2 className="text-lg font-semibold">Upload Contacts</h2>
        <input type="file" accept=".csv,.xlsx,.xls" onChange={(e) => setFile(e.target.files?.[0])} />
        {!!progress && <div className="h-2 rounded bg-white/20"><div className="h-2 rounded bg-emerald-400" style={{ width: `${progress}%` }} /></div>}
        <button className="rounded-xl bg-emerald-500 px-4 py-2" onClick={upload}>Upload</button>
      </div>

      <div className="glass-panel p-5">
        <input className="w-full rounded-xl border border-white/20 bg-white/10 p-2" placeholder="Search contacts" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      <Table
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'phone', label: 'Phone' },
          {
            key: 'actions',
            label: 'Actions',
            render: (row) => (
              <button className="rounded-lg bg-rose-500 px-3 py-1" onClick={() => remove(row._id)}>Delete</button>
            ),
          },
        ]}
        rows={rows}
      />
    </div>
  );
};

export default ContactsPage;
