import express from 'express';
const router = express.Router();
import { aggiornaViaggio, cancellaViaggio, chiamaAutenticata, nuovoViaggio } from '../controllers/travelController.js'; 

router.put('/viaggi/:id', aggiornaViaggio);
router.delete('/viaggi/:id', cancellaViaggio);
router.get('/viaggi', chiamaAutenticata);
router.post('/viaggi', nuovoViaggio);

export default router;