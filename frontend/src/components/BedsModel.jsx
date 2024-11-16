import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BedsModel = ({ url, onClose, onSelectBed }) => {
    const [beds, setBeds] = useState([]);
    
    useEffect(() => {
        // Fetch beds data on load
        const fetchBeds = async () => {
            try {
                const response = await axios.get(`${url}/bed/allbeds`);
                setBeds(response.data);
            } catch (error) {
                console.error("Error fetching beds:", error);
            }
        };

        fetchBeds();
    }, [url]);

    const handleBedClick = (bed) => {
        if (!bed.isOccupied) {
            onSelectBed(bed); // Pass selected bed back to AddGuests
            onClose(); // Close the modal after selection
        }
    };

    // Group by floors, then sections (A, B), then rooms
    const groupedBeds = Object.entries(
        beds.reduce((acc, bed) => {
            const floorKey = `Floor ${bed.floor}`;
            const sectionKey = bed.section || 'Section A'; // Default section if none provided

            if (!acc[floorKey]) acc[floorKey] = {};
            if (!acc[floorKey][sectionKey]) acc[floorKey][sectionKey] = {};

            const roomKey = `Room ${bed.room}`;
            if (!acc[floorKey][sectionKey][roomKey]) acc[floorKey][sectionKey][roomKey] = [];

            acc[floorKey][sectionKey][roomKey].push(bed);
            return acc;
        }, {})
    );
    
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
            <div className="bg-white p-6 rounded-lg max-w-2xl w-full h-3/4 overflow-y-auto">
                <h2 className="text-2xl font-semibold mb-4">Select a Bed</h2>
                <div className="space-y-4">
                    {groupedBeds.length > 0 ? (
                        groupedBeds.map(([floor, sections]) => (
                            <div key={floor}>
                                <h3 className="font-bold text-lg mb-2">{floor}</h3>
                                {Object.entries(sections).map(([section, rooms]) => (
                                    <div key={section} className="mb-4 pl-4">
                                        <h4 className="font-semibold text-blue-600">{section}</h4>
                                        {Object.entries(rooms).map(([room, beds]) => (
                                            <div key={room} className="mb-2 pl-6">
                                                <h5 className="font-semibold">{room}</h5>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {beds.map((bed) => (
                                                        <button
                                                            key={bed._id}
                                                            onClick={() => handleBedClick(bed)}
                                                            disabled={bed.isOccupied}
                                                            className={`p-2 rounded ${
                                                                bed.isOccupied
                                                                    ? 'bg-gray-400 cursor-not-allowed'
                                                                    : 'bg-green-400 hover:bg-green-600'
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
                <button
                    onClick={onClose}
                    className="mt-4 w-full bg-red-500 text-white py-2 rounded-md"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default BedsModel;
