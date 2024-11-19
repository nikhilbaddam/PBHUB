import React, { useState } from "react";
import axios from "axios";
import AddBedModel from "../components/AdminComponents/AddBedModel";

const Admin = () => {
  const [beds, setBeds] = useState([]);

  const handleBedAdded = (newBed) => {
    setBeds((prevBeds) => [...prevBeds, newBed]);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <AddBedModel onBedAdded={handleBedAdded} />
    </div>
  );
};

export default Admin;
