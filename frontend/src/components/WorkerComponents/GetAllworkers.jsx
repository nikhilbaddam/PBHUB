import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import moment from "moment";

const GetAllWorkers = () => {
  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [newSalary, setNewSalary] = useState("");
  const [monthPayment, setMonthPayment] = useState("");
  const [updatedRole, setUpdatedRole] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const { url } = useContext(StoreContext);

  // Fetch workers from the backend
  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    try {
      const response = await axios.get(`${url}/users/getusers`); // Replace with your API URL
      setWorkers(response.data);
      setFilteredWorkers(response.data); // Set filtered workers to all workers initially
    } catch (error) {
      console.error("Error fetching workers:", error);
    }
  };

  const handleUpdateRole = async (workerId) => {
    try {
      await axios.put(`${url}/users/update-role/${workerId}`, {
        updatedRole,
      });
      alert("Role updated successfully!");
      setUpdatedRole("");
      fetchWorkers();
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const handleTerminateWorker = async (workerId) => {
    try {
      await axios.delete(`${url}/users/terminate/${workerId}`);
      alert("Worker terminated successfully!");
      fetchWorkers();
    } catch (error) {
      console.error("Error terminating worker:", error);
    }
  };

  // Search filter logic
  const filteredWorker = workers.filter((worker) => {
    const searchValue = searchTerm.toLowerCase(); // Correctly use searchTerm
    return (
      worker.name.toLowerCase().includes(searchValue) ||
      worker.email.toLowerCase().includes(searchValue) ||
      (worker.phone && worker.phone.toString().includes(searchValue)) // Ensure phone exists and is a string
    );
  });

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">All Workers</h1>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name, email, or phone"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded p-2 w-full"
        />
      </div>

      {/* Workers List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 h-[80vh] overflow-y-scroll">
        {filteredWorker.map((worker) => (
          <div
            key={worker._id}
            className="border rounded-lg shadow-md p-4 bg-white"
          >
            <h2 className="text-lg font-semibold mb-2">{worker.name}</h2>
            <p>
              <strong>Role:</strong> {worker.role}
            </p>
            <p>
              <strong>Email:</strong> {worker.email}
            </p>
            <p>
              <strong>Phone:</strong> {worker.phone}
            </p>
            <p>
              <strong>Date of Joining:</strong>{" "}
              {moment(worker.date).format("DD-MMM-YYYY")}
            </p>
            <div className="mt-2">
              <input
                type="text"
                placeholder="New Role"
                value={updatedRole}
                onChange={(e) => setUpdatedRole(e.target.value)}
                className="border rounded p-1 w-full mb-2"
              />
              <button
                onClick={() => handleUpdateRole(worker.id)}
                className="bg-blue-500 text-white px-2 py-1 rounded w-full mb-2"
              >
                Update Role
              </button>
            </div>
            <button
              onClick={() => handleTerminateWorker(worker.id)}
              className="bg-red-500 text-white px-2 py-1 rounded w-full"
            >
              Terminate Worker
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GetAllWorkers;
