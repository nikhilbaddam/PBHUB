import React, { useContext, useState } from 'react';
import axios from 'axios';
import { StoreContext } from '../context/StoreContext';
import BedsModel from '../components/BedsModel';
import Loader from '../components/Loader'
const AddGuests = () => {

    const [loading, setLoading] = useState(false);
    const [guestData, setGuestData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        
        roomType: '',
        amount: '',
        regDate: '',
        lastPaymentDate: '',
        initialPayment: '',
        referedBy: '',
        adhaarImage: null,
        profileImage: null,
        bedId:""
    });
    const { url } = useContext(StoreContext);
    const [previews, setPreviews] = useState({ adhaarImage: null, profileImage: null });
    const [isBedModalOpen, setIsBedModalOpen] = useState(false);
    // Handle input changes for text fields
    const handleChange = (e) => {
        setGuestData({
            ...guestData,
            [e.target.name]: e.target.value
        });
    };

    // Handle file inputs for photos and generate preview
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        const file = files[0];
        if (file) {
            setGuestData({
                ...guestData,
                [name]: file
            });
            // Create preview URL
            const previewUrl = URL.createObjectURL(file);
            setPreviews((prevPreviews) => ({
                ...prevPreviews,
                [name]: previewUrl
            }));
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (const key in guestData) {
            formData.append(key, guestData[key]);
        }

        try {
            setLoading(true); // Start loading
            const response = await axios.post(`${url}/guests/addguest`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }


            });
            setGuestData({ name: '',
                email: '',
                phoneNumber: '',
                
                roomType: '',
                amount: '',
                regDate: '',
                lastPaymentDate: '',
                initialPayment: '',
                referedBy: '',
                adhaarImage: null,
                profileImage: null,
                bedId:""})

            
            
        } catch (error) {
            console.error('Error adding guest:', error);
            alert('Failed to add guest');
        }
        finally {
            setLoading(false); // Stop loading
          }
    };



    // Handle bed selection and add bedId to guestData
    const handleSelectBed = (bed) => {
        const bedDetails = `floor:${bed.floor}/section:${bed.section}/room: ${bed.room}/bed: ${bed.bed}`; // Adjust format as needed
        setGuestData((prevData) => ({
            ...prevData,
            bedId: bed._id,
            bedDetails: bedDetails
        }));
        setIsBedModalOpen(false);
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-3xl mt-3 my-6 mx-auto p-8 bg-white shadow-md rounded-lg space-y-6">
            <h2 className="text-3xl font-semibold text-center">Add Guest</h2>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={guestData.name}
                        placeholder='name'
                        onChange={handleChange}
                        required
                        className="w-full p-3 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={guestData.email}
                        placeholder='Email'
                        onChange={handleChange}
                        required
                        className="w-full p-3 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number:</label>
                    <input
                        type="number"
                        name="phoneNumber"
                        value={guestData.phoneNumber}
                        placeholder='phone number'
                        onChange={handleChange}
                        required
                        className="w-full p-3 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                



                {/* Bed selection button */}
                <div>
                    <button
                        type="button"
                        onClick={() => setIsBedModalOpen(true)}
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 mt-4"
                    >
                        {guestData.bedId ? 'Re assign Bed' : 'Assign Bed'}
                    </button>
                    {guestData.bedId && (
                        <p className='border-black'>Selected : {guestData.bedDetails}</p>
                    )}
                </div>




                <div>
                    <label className="block text-sm font-medium text-gray-700">Room Type:</label>
                    <input
                        type="number"
                        name="roomType"
                        value={guestData.roomType}
                        placeholder='3 sharing,4 sharing...'
                        onChange={handleChange}
                        required
                        className="w-full p-3 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Amount per mounth:</label>
                    <input
                        type="number"
                        name="amount"
                        value={guestData.amount}
                        placeholder='ammount'
                        onChange={handleChange}
                        required
                        className="w-full p-3 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Registration Date:</label>
                    <input
                        type="date"
                        name="regDate"
                        value={guestData.regDate}
                        onChange={handleChange}
                        required
                        className="w-full p-3 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Last Payment Date:</label>
                    <input
                        type="date"
                        name="lastPaymentDate"
                        value={guestData.lastPaymentDate}
                        onChange={handleChange}
                        required
                        className="w-full p-3 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Initial Amount:</label>
                    <input
                        type="number"
                        name="initialPayment"
                        value={guestData.initialPayment}
                        placeholder='initial amount'
                        onChange={handleChange}
                        required
                        className="w-full p-3 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">refered by :</label>
                    <input
                        type="text"
                        name="referedBy"
                        value={guestData.referedBy}
                        placeholder='Referred by'
                        onChange={handleChange}
                        required
                        className="w-full p-3 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Aadhaar Image:</label>
                    <input
                        type="file"
                        name="adhaarImage"
                        accept="image/*"
                        capture="user"
                        onChange={handleFileChange}
                        required
                        className="w-full p-3 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {previews.adhaarImage && (
                        <img src={previews.adhaarImage} alt="Aadhaar Preview" className="mt-2 h-24 w-24 object-cover rounded-md" />
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Profile Photo:</label>
                    <input
                        type="file"
                        name="profileImage"
                        accept="image/*"
                        capture="user"
                        onChange={handleFileChange}
                        required
                        className="w-full p-3 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {previews.profileImage && (
                        <img src={previews.profileImage} alt="Profile Preview" className="mt-2 h-24 w-24 object-cover rounded-md" />
                    )}
                </div>
            </div>

            <button
                type="submit"
                className={`w-full p-3 text-white rounded-md mt-4 ${
                    loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500"
                  }`}
                  disabled={loading}
                >
                  {loading ? <Loader/> : "Add Guest"}
            </button>

            {isBedModalOpen && (
                <BedsModel
                   
                    onClose={() => setIsBedModalOpen(false)}
                    onSelectBed={handleSelectBed}
                />
            )}


        </form>
    );
};

export default AddGuests;
