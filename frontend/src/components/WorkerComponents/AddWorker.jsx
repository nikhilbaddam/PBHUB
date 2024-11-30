import React, { useContext, useState } from "react";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import Loader from '../Loader'
const AddWorker = () => {
  const [workerData, setWorkerData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "worker", // Default role as 'worker'
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { url } = useContext(StoreContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWorkerData({ ...workerData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    
    // Check if passwords match
    if (workerData.password !== workerData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true); // Start loading

    try {
      const response = await axios.post(`${url}/users/register`, {
        name: workerData.name,
        email: workerData.email,
        phone: workerData.phone,
        role: workerData.role,
        password: workerData.password,
      });

      setSuccessMessage(response.data.message || "Worker registered successfully!");
      setWorkerData({
        name: "",
        email: "",
        phone: "",
        role: "worker",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      setError(
        error.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="w-full  p-6 bg-white shadow-lg rounded-md">
      <h2 className="text-2xl font-semibold text-center mb-4">Add Worker</h2>

      {error && (
        <div className="text-red-600 text-lg text-center mb-3">{error}</div>
      )}
      {successMessage && (
        <div className="text-green-600 text-lg text-center mb-3">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={workerData.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-md mt-1"
              required
              placeholder="name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={workerData.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-md mt-1"
              required
              placeholder="email "
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={workerData.phone}
              onChange={handleChange}
              className="w-full p-3 border rounded-md mt-1"
              required
              placeholder="phone number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              name="role"
              value={workerData.role}
              onChange={handleChange}
              className="w-full p-3 border rounded-md mt-1"
              required
              placeholder='role'
            >
              <option value="worker">Worker</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={workerData.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-md mt-1"
              required
              placeholder="password "
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={workerData.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 border rounded-md mt-1"
              required
              placeholder="confirm password"
            />
          </div>
        </div>
        <button
          type="submit"
          className={`w-full p-3 text-white rounded-md mt-4 ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500"
          }`}
          disabled={loading}
        >
          {loading ? <Loader/> : "Add Worker"}
        </button>
      </form>
    </div>
  );
};

export default AddWorker;
