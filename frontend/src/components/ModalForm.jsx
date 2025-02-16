import { useState, useEffect } from "react";

export default function ModalForm({ isOpen, onClose, mode, onSubmit, clientData }) {
  const [formData, setFormData] = useState({
    name: "",
    owner: "",
    description: "",
    date: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (mode === "edit" && clientData) {
      setFormData({
        name: clientData.name || "",
        owner: clientData.owner || "",
        description: clientData.description || "",
        date: clientData.date ? formatDateTime(clientData.date) : "",
      });
    } else {
      setFormData({ name: "", owner: "", description: "", date: "" });
    }
  }, [mode, clientData]);

  useEffect(() => {
    if (!isOpen) {
      setFormData({ name: "", owner: "", description: "", date: "" });
      setError("");
    }
  }, [isOpen]);

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.owner || !formData.description || !formData.date) {
      setError("All fields are required");
      return;
    }
    setError("");
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      console.error("Error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <dialog className={`modal ${isOpen ? "block" : "hidden"} fixed inset-0 flex justify-center items-center`} open={isOpen}>
      <div className="modal-box p-6 rounded-lg shadow-lg bg-white">
        <h3 className="font-bold text-lg mb-4">{mode === "edit" ? "Edit Appointment" : "New Appointment"}</h3>
        {error && <div className="alert alert-error mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          {["name", "owner", "description"].map((field) => (
            <label key={field} className="block mb-2">
              {field.charAt(0).toUpperCase() + field.slice(1)}
              <input
                type="text"
                name={field}
                className="input input-bordered w-full mt-1"
                value={formData[field]}
                onChange={handleChange}
                required
              />
            </label>
          ))}
          <label className="block mb-4">
            Date
            <input
              type="datetime-local"
              name="date"
              className="input input-bordered w-full mt-1"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </label>
          <div className="flex justify-end space-x-2">
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-success">
              {mode === "edit" ? "Save" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
