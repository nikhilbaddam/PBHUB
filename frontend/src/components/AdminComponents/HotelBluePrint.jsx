import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { FaTimes } from "react-icons/fa";
import { StoreContext } from "../../context/StoreContext";

const HotelBluePrint = () => {
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOccupant, setSelectedOccupant] = useState(null); // Selected occupant details
  const [selectedBed, setSelectedBed] = useState(null); // Bed selected for deletion
  const { url } = useContext(StoreContext);

  useEffect(() => {
    const fetchBeds = async () => {
      try {
        const response = await axios.get(`${url}/bed/allbeds`);
        setBeds(response.data);
      } catch (error) {
        console.error("Error fetching beds:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBeds();
  }, [url]);

  const fetchOccupantDetails = async (guestId) => {
    try {
      const response = await axios.get(`${url}/guests/getguest/${guestId}`);
      setSelectedOccupant(response.data); // Set occupant details
    } catch (error) {
      console.error("Error fetching occupant details:", error);
    }
  };

  const handleDeleteBed = async () => {
    if (!selectedBed) return;
    try {
      await axios.delete(`${url}/bed/deletebed/${selectedBed._id}`);
      // Update state to remove the deleted bed
      setBeds((prevBeds) => prevBeds.filter((bed) => bed._id !== selectedBed._id));
      setSelectedBed(null); // Close the modal
    } catch (error) {
      console.error("Error deleting bed:", error);
    }
  };

  const groupedBeds = Object.entries(
    beds.reduce((acc, bed) => {
      const floorKey = `Floor ${bed.floor}`;
      const sectionKey = bed.section || "Section A";

      if (!acc[floorKey]) acc[floorKey] = {};
      if (!acc[floorKey][sectionKey]) acc[floorKey][sectionKey] = {};

      const roomKey = `Room ${bed.room}`;
      if (!acc[floorKey][sectionKey][roomKey]) acc[floorKey][sectionKey][roomKey] = [];

      acc[floorKey][sectionKey][roomKey].push(bed);
      return acc;
    }, {})
  ).sort(([a], [b]) => {
    const floorA = parseInt(a.replace("Floor ", ""), 10);
    const floorB = parseInt(b.replace("Floor ", ""), 10);
    return floorA - floorB;
  });

  return (
    <div className="p-4 border shadow-lg bg-gray-50 rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Hotel Blueprint</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loader border-4 border-blue-400 border-t-transparent rounded-full w-10 h-10 animate-spin"></div>
        </div>
      ) : groupedBeds.length > 0 ? (
        <div className="h-[80vh] overflow-y-scroll">
          {groupedBeds.map(([floor, sections]) => (
            <div key={floor} className="mb-6">
              <h2 className="font-bold text-xl mb-2">{floor}</h2>
              {Object.entries(sections).map(([section, rooms]) => (
                <div key={section} className="mb-4 pl-4">
                  <h3 className="font-semibold text-blue-600">{section}</h3>
                  {Object.entries(rooms).map(([room, beds]) => (
                    <div key={room} className="mb-4 pl-6">
                      <h4 className="font-semibold">{room}</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                        {beds.map((bed) => (
                          <button
                            key={bed._id}
                            onClick={() =>
                              bed.isOccupied
                                ? fetchOccupantDetails(bed.guestId)
                                : setSelectedBed(bed)
                            }
                            className={`p-2 rounded font-medium text-sm ${
                              bed.isOccupied
                                ? "bg-blue-400 hover:bg-blue-600"
                                : "bg-gray-200 hover:bg-red-600"
                            }`}
                          >
                            {bed.isOccupied? `Bed${bed.bed}/Occupied`:`Bed ${bed.bed}`}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <p>No beds available</p>
      )}

      {/* Modal for occupant details */}
      {selectedOccupant && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white rounded-lg w-[90%] max-w-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Occupant Details</h2>
              
            </div>
            <div className="space-y-4 h-80 overflow-y-scroll">
              <p>
                <strong>Name:</strong> {selectedOccupant.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedOccupant.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedOccupant.phoneNumber}
              </p>
              <p>
                <strong>Registration Date:</strong> {selectedOccupant.regDate}
              </p>
              <p>
                <strong>Payment History:</strong>{" "}
                {selectedOccupant.paymentHistory.join(", ")}
              </p>
              <div>
                <strong>Profile Photo:</strong>
                <img
                  src={selectedOccupant.profileImage}
                  alt="Profile"
                  className="w-20 h-20 mt-2 rounded-full"
                />
              </div>
              <div>
                <strong>Aadhaar Photo:</strong>
                <img
                  src={selectedOccupant.adhaarImage}
                  alt="Aadhaar"
                  className="w-20 h-20 mt-2 rounded"
                />
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={() => setSelectedOccupant(null)}
                className="w-full bg-red-500 text-white py-2 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for bed deletion */}
      {selectedBed && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white rounded-lg w-[90%] max-w-sm p-6">
            <h2 className="text-xl font-bold mb-4">Confirm Bed Deletion</h2>
            <p className="mb-4">
              Are you sure you want to delete <strong>Bed {selectedBed.bed}</strong>?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setSelectedBed(null)}
                className="bg-gray-300 text-black py-2 px-4 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteBed}
                className="bg-red-500 text-white py-2 px-4 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};




export default HotelBluePrint;
