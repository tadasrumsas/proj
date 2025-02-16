import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import TableList from "./components/TableList";
import ModalForm from "./components/ModalForm";
import Login from "./components/Login";
import Register from "./components/Register";
import axios from "axios";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState(""); 
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [clientData, setClientData] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [authToken, setAuthToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    if (authToken) {
      fetchClients();
    }
  }, [authToken]);

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3002/api/clients", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTableData(response.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const handleLogin = (token) => {
    localStorage.setItem("token", token);
    setAuthToken(token); // Immediately update state
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuthToken(null); // Remove token and trigger re-render
  };

  const handleSubmit = async (data) => {
    try {
      let response;
      if (modalMode === "add") {
        response = await axios.post("http://localhost:3002/api/clients", data, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setTableData((prev) => [...prev, response.data]);
      } else if (modalMode === "edit" && clientData) {
        response = await axios.put(
          `http://localhost:3002/api/clients/${clientData.id}`,
          data,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        setTableData((prev) =>
          prev.map((client) => (client.id === clientData.id ? response.data : client))
        );
      }
      setIsOpen(false);
    } catch (err) {
      console.error("Error adding/updating client:", err);
    }
  };

  return (
    <Router>
      <NavBar
        onOpen={() => setIsOpen(true)}
        onSearch={setSearchTerm}
        onSortChange={(value) => {
          const [field, order] = value.split("_");
          setSortField(field);
          setSortOrder(order);
        }}
        isAuthenticated={!!authToken}
        onLogout={handleLogout}
      />
      <Routes>
        <Route path="/auth/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/auth/register" element={<Register />} />
        <Route
          path="/api/clients"
          element={
            authToken ? (
              <>
                <TableList
                  setTableData={setTableData}
                  tableData={tableData}
                  handleOpen={setIsOpen}
                  searchTerm={searchTerm}
                  sortField={sortField}
                  sortOrder={sortOrder}
                />
                <ModalForm
                  isOpen={isOpen}
                  onClose={() => setIsOpen(false)}
                  mode={modalMode}
                  clientData={clientData}
                  onSubmit={handleSubmit}
                />
              </>
            ) : (
              <Navigate to="/auth/login" />
            )
          }
        />
        <Route path="/" element={authToken ? <Navigate to="/api/clients" /> : <Navigate to="/auth/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
