import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login({ onLogin }) {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3002/auth/login", credentials);
      const token = response.data.token;
      onLogin(token); // Call onLogin function to update state
      navigate("/api/clients"); // Redirect to dashboard
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="w-full max-w-xs">
        <input type="email" name="email" placeholder="Email" className="input input-bordered w-full mb-2" onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" className="input input-bordered w-full mb-2" onChange={handleChange} />
        <button type="submit" className="btn btn-primary w-full">Login</button>
      </form>
    </div>
  );
}
