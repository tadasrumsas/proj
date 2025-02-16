import { query } from "../db.js";

export const getClients = async () => {
  const { rows } = await query("SELECT * FROM clients_tb");
  return rows;
};

export const createClient = async (clientData) => {
  const { name, owner, description, date } = clientData;
  const { rows } = await query(
    `INSERT INTO clients_tb (name, owner, description, date) VALUES ($1, $2, $3, $4) RETURNING *`,
    [name, owner, description, date]
  );
  return rows[0];
};

export const updateClient = async (clientData, clientId) => {
  const { name, owner, description, date } = clientData;
  const { rows } = await query(
    `UPDATE clients_tb SET name = $1, owner = $2, description = $3, date = $4
    WHERE id = $5 RETURNING *`,
    [name, owner, description, date, clientId]
  );
  return rows[0];
};

export const deleteClient = async (clientId) => {
  const { rowCount } = await query(
    `DELETE FROM clients_tb WHERE id = $1`,
    [clientId]
  );
  return rowCount > 0;
};

export const searchClients = async (searchTerm) => {
  const { rows } = await query(
    `SELECT * FROM clients_tb WHERE name ILIKE $1 OR owner ILIKE $1 OR description ILIKE $1 OR date ILIKE $1`,
    [`%${searchTerm}%`]
  );
  return rows;
};
