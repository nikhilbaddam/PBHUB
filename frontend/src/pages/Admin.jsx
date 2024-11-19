import React from "react";
import AddBedModel from "../components/AdminComponents/AddBedModel";
import AddWorker from "../components/AdminComponents/AddWorker";

const Admin = () => {
  return (
    <div className="flex flex-wrap gap-6 p-4 bg-gray-100">
  {/* Add Bed Model Component */}
  <div className="w-full md:w-1/2 lg:w-1/4">
    <AddBedModel />
  </div>

  {/* Add Worker Component */}
  <div className="w-full md:w-1/2 lg:w-1/2">
    <AddWorker />
  </div>
</div>

  );
};

export default Admin;
