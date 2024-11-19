import React, { useState } from 'react';
import axios from 'axios';

const AddBedModel = ({ onBedAdded }) => {
  const [formData, setFormData] = useState({
    floor: '',
    section: '',
    room: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/beds', formData);
      alert('Bed added successfully');
      setFormData({ floor: '', section: '', room: '' });
      onBedAdded(response.data.newBed); // Notify parent about the new bed
    } catch (error) {
      alert(`Error adding bed: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="p-4 border w-1/4 rounded-md bg-white shadow-md">
      <h2 className="text-lg font-bold mb-4">Add Bed</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Floor</label>
          <input
            type="text"
            name="floor"
            value={formData.floor}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Section</label>
          <input
            type="text"
            name="section"
            value={formData.section}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Room</label>
          <input
            type="text"
            name="room"
            value={formData.room}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          Add Bed
        </button>
      </form>
    </div>
  );
};

export default AddBedModel;
