import { parse } from 'csv-parse/sync';
import xlsx from 'xlsx';
import { Contact } from '../models/Contact.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { isValidPhone } from '../utils/validators.js';

const parseContacts = (file) => {
  if (!file) throw new Error('No file uploaded');

  const lower = file.originalname.toLowerCase();
  if (lower.endsWith('.csv')) {
    const records = parse(file.buffer.toString(), {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });
    return records;
  }

  if (lower.endsWith('.xlsx') || lower.endsWith('.xls')) {
    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    return xlsx.utils.sheet_to_json(sheet);
  }

  throw new Error('Unsupported file type. Use CSV or XLSX');
};

export const uploadContacts = asyncHandler(async (req, res) => {
  const rows = parseContacts(req.file);
  const normalized = rows
    .map((row) => ({
      name: String(row.name || row.Name || '').trim(),
      phone: String(row.phone || row.Phone || row.number || '').trim(),
    }))
    .filter((row) => row.name && row.phone && isValidPhone(row.phone));

  if (!normalized.length) {
    return res.status(400).json({ message: 'No valid contacts found in file.' });
  }

  const bulkOps = normalized.map((contact) => ({
    updateOne: {
      filter: { phone: contact.phone },
      update: { $set: contact },
      upsert: true,
    },
  }));

  const result = await Contact.bulkWrite(bulkOps, { ordered: false });
  res.status(201).json({
    message: 'Contacts uploaded successfully',
    inserted: result.upsertedCount,
    modified: result.modifiedCount,
    totalProcessed: normalized.length,
  });
});

export const getContacts = asyncHandler(async (req, res) => {
  const q = String(req.query.q || '').trim();
  const filter = q
    ? {
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { phone: { $regex: q, $options: 'i' } },
        ],
      }
    : {};

  const contacts = await Contact.find(filter).sort({ createdAt: -1 });
  res.json(contacts);
});

export const updateContact = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;
  if (!name || !phone || !isValidPhone(phone)) {
    return res.status(400).json({ message: 'Valid name and phone are required.' });
  }

  const updated = await Contact.findByIdAndUpdate(
    req.params.id,
    { name, phone },
    { new: true, runValidators: true }
  );

  if (!updated) return res.status(404).json({ message: 'Contact not found' });
  res.json(updated);
});

export const deleteContact = asyncHandler(async (req, res) => {
  const deleted = await Contact.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Contact not found' });
  res.json({ message: 'Contact deleted' });
});
