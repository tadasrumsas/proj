import { useNavigate } from "react-router-dom";

export default function NavBar({ onOpen, onSearch, onSortChange, isAuthenticated, onLogout }) {
  const navigate = useNavigate();

  return (
    <div className="navbar bg-base-100 p-4 flex flex-col items-center">
      <a className="text-5xl font-bold mb-4">Pets Clinic</a>

      <div className="w-full max-w-md mb-4 flex items-center space-x-2">
        <input
          type="text"
          placeholder="Search"
          onChange={(e) => onSearch(e.target.value)}
          className="input input-bordered w-full"
        />
        <select className="select select-bordered" onChange={(e) => onSortChange(e.target.value)}>
          {/* Sorting options here */}
        </select>
      </div>

      {isAuthenticated ? (
        <>
          <button className="btn btn-success btn-md w-full lg:w-112" onClick={onOpen}>
            + Add Appointment
          </button>
          <button className="mt-4 btn btn-error btn-md w-full lg:w-112" onClick={onLogout}>
            Log Out
          </button>
        </>
      ) : (
        <button className="btn btn-primary btn-md w-full lg:w-112" onClick={() => navigate("/auth/login")}>
          Log In
        </button>
      )}
    </div>
  );
}
