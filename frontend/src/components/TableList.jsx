import axios from "axios";
import { useState, useEffect } from "react";

export default function TableList({ handleOpen, searchTerm, sortField, sortOrder }) {
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState(null);

  // Fetch clients when the component mounts
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get("http://localhost:3002/api/clients");
        setTableData(response.data); // Assuming your API returns an array of clients
      } catch (err) {
        console.error("Error fetching clients:", err);
        setError("Error fetching clients. Please try again.");
      }
    };

    fetchClients();
  }, []); // Empty dependency array to run this effect only once on mount

  // Format date function
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };

  // Handle delete function
  const handleDelete = async (id) => {
    if (!id) return;
    if (window.confirm("Are you sure you want to delete this client?")) {
      try {
        await axios.delete(`http://localhost:3002/api/clients/${id}`);
        setTableData((prevData) => prevData.filter((client) => client.id !== id));
      } catch (err) {
        console.error("Delete error:", err);
        setError("Error deleting client. Please try again.");
      }
    }
  };

  // Sort and filter data
  const sortedData = [...tableData].sort((a, b) => {
    if (!sortField) return 0;
    const aValue = a[sortField]?.toString().toLowerCase() || "";
    const bValue = b[sortField]?.toString().toLowerCase() || "";
    return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
  });

  const filteredData = sortedData.filter((client) => {
    if (!client) return false;
    const searchLower = searchTerm.toLowerCase();
    return ["name", "owner", "description", "date"].some((field) =>
      client[field]?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="container mx-auto p-4 max-w-5xl">
        {filteredData.length === 0 ? (
          <div className="text-center text-gray-500 mt-6">No clients found.</div>
        ) : (
          filteredData.map((client) => (
            <div key={client.id} className="flex flex-col md:flex-row items-start md:items-center bg-white p-4 mb-4 border border-gray-300 rounded-lg shadow">
              <div className="flex flex-col md:flex-row justify-between w-full">
                <div className="flex-grow">
                  <div className="font-bold text-lg">{client.name}</div>
                  <div className="mt-2">
                    <span className="font-semibold">Owner: </span>
                    {client.owner}
                  </div>
                  <div className="mt-2">
                    <span className="font-semibold">Description: </span>
                    {client.description}
                  </div>
                  <div className="font-semibold mt-2">{formatDate(client.date)}</div>
                </div>
                <div className="flex flex-row md:flex-col items-center mt-2 md:mt-0 space-x-2 md:space-x-0 md:space-y-2">
                  <button className="btn btn-primary btn-sm" onClick={() => handleOpen("edit", client)}>
                    Edit
                  </button>
                  <button className="btn btn-accent btn-sm" onClick={() => handleDelete(client.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
