import express from "express";
import * as clientController from "../controllers/clientController.js"; // Import your controller

const router = express.Router();

// Ensure these routes are correctly defined
router.get('/clients', clientController.getClients);  // This should be responding to GET requests at /api/clients
router.post('/clients', clientController.createClient);  // POST request to create a client
router.put('/clients/:id', clientController.updateClient);  // PUT request to update a client
router.delete('/clients/:id', clientController.deleteClient);  // DELETE request to remove a client
router.get('/clients/search', clientController.searchClients);  // Search endpoint

export default router;
