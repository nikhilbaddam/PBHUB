import React, { useContext, useState } from 'react';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import Loader from '../Loader';
const AddBedModel = () => {

  const { url }= useContext(StoreContext);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    floor: '',
    section: '',
    room: '',
    amount:''

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
      setLoading(true);
      const response = await axios.post(`${url}/bed/addbed`, formData);
     
      setFormData({ floor: '', section: '', room: '',amount:'' });
      setLoading(false)
      // Notify parent about the new bed
    } catch (error) {
     
      alert(`Error adding bed: ${error.response?.data?.message || error.message}`);
      
    }
  };

  return (
    <div className="p-4  border w-full  rounded-md bg-white shadow-md">
      <h2 className="text-lg text-center font-bold mb-4">Add Bed</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Floor</label>
          <input
            type="number"
            name="floor"
            value={formData.floor}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
            placeholder='floor number '
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
            placeholder='A or B'
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
            placeholder='101 or 201 or 301 ...'
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
            placeholder='ex : 3000/-'
          />
        </div>
        <button type="submit" className={`w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? <Loader /> : "Add Bed"}
        </button>
      </form>
    </div>
  );
};

export default AddBedModel;
