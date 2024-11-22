import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { FaTimes } from "react-icons/fa";
import { StoreContext } from "../context/StoreContext";

const BedsModel = ({ onClose, onSelectBed }) => {
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const { url } = useContext(StoreContext);

  useEffect(() => {
    const fetchBeds = async () => {
      try {
        const response = await axios.get(`${url}/bed/allbeds`);
        setBeds(response.data);
      } catch (error) {
        console.error("Error fetching beds:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchBeds();
  }, [url]);

  const handleBedClick = (bed) => {
    if (!bed.isOccupied) {
      onSelectBed(bed);
      onClose();
    }
  };

  // Group by floors, then sections, then rooms
  const groupedBeds = Object.entries(
    beds.reduce((acc, bed) => {
      const floorKey = `Floor ${bed.floor}`;
      const sectionKey = bed.section || "Section A"; // Default section
  
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
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="bg-white rounded-lg w-[90%] max-w-2xl h-auto max-h-[80vh] md:w-[70%] md:h-[85%] flex flex-col overflow-hidden">
        {/* Fixed header */}
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-semibold">Select a Bed</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="loader border-4 border-blue-400 border-t-transparent rounded-full w-10 h-10 animate-spin"></div>
            </div>
          ) : groupedBeds.length > 0 ? (
            groupedBeds.map(([floor, sections]) => (
              <div key={floor}>
                <h3 className="font-bold text-lg mb-2">{floor}</h3>
                {Object.entries(sections).map(([section, rooms]) => (
                  <div key={section} className="mb-4 pl-4">
                    <h4 className="font-semibold text-blue-600">{section}</h4>
                    {Object.entries(rooms).map(([room, beds]) => (
                      <div key={room} className="mb-2 pl-6">
                        <h5 className="font-semibold">{room}</h5>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                          {beds.map((bed) => (
                            <button
                              key={bed._id}
                              onClick={() => handleBedClick(bed)}
                              disabled={bed.isOccupied}
                              className={`p-2 rounded font-medium  text-sm ${
                                bed.isOccupied
                                  ? "bg-gray-400 cursor-not-allowed"
                                  : "bg-green-400 hover:bg-green-600"
                              }`}
                            >
                              Bed {bed.bed}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))
          ) : (
            <p>No beds available</p>
          )}
        </div>

        {/* Footer */}
        <div className="p-4">
          <button
            onClick={onClose}
            className="w-full bg-red-500 text-white py-2 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BedsModel;
