import { Router } from 'express';
import multer from 'multer';
import { deleteContact, getContacts, updateContact, uploadContacts } from '../controllers/contactsController.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('file'), uploadContacts);
router.get('/', getContacts);
router.put('/:id', updateContact);
router.delete('/:id', deleteContact);

export default router;
