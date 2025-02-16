import * as clientService from "../services/clientServices.js";

export const getClients = async (req, res) => {
  try {
    const clients = await clientService.getClients(); 
    if (!clients || clients.length === 0) {
      return res.status(404).json({ message: "No clients found" });
    }
    res.status(200).json(clients);
  } catch (err) {
    console.error("Error fetching clients:", err.message || err);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const createClient = async (req, res) => {
  try {
    const clientData = req.body;
    const newClient = await clientService.createClient(clientData);
    res.status(201).json(newClient); // 201 Created response with the new client data
  } catch (err) {
    console.error("Error adding client:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateClient = async (req, res) => {
  try {
    const clientId = parseInt(req.params.id, 10);
    const clientData = req.body;
    const updatedClient = await clientService.updateClient(clientData, clientId);

    if (!updatedClient) {
      return res.status(404).json({ message: "Client not found" }); // 404 Not Found if client doesn't exist
    }
    res.status(200).json(updatedClient); // 200 OK with updated client data
  } catch (err) {
    console.error("Error updating client:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteClient = async (req, res) => {
  try {
    const clientId = parseInt(req.params.id, 10);
    const deleted = await clientService.deleteClient(clientId);

    if (!deleted) {
      return res.status(404).json({ message: "Client not found" }); // 404 if the client doesn't exist
    }
    res.status(204).send(); // 204 No Content after successful deletion
  } catch (err) {
    console.error("Error deleting client:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const searchClients = async (req, res) => {
  try {
    const searchTerm = req.query.q; // Assuming 'q' is the query parameter
    const clients = await clientService.searchClients(searchTerm);
    res.status(200).json(clients); // 200 OK with search results
  } catch (err) {
    console.error("Error searching clients:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
