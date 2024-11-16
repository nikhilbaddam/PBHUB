import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import moment from 'moment';
import { StoreContext } from '../context/StoreContext';

const Guests = () => {
    const [guests, setGuests] = useState([]);
    const [isUpdating, setIsUpdating] = useState(false);
    const [selectedGuestId, setSelectedGuestId] = useState(null);
    const [paymentDate, setPaymentDate] = useState(moment().format('YYYY-MM-DD'));
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentNote, setPaymentNote] = useState('');
    const [expandedGuestId, setExpandedGuestId] = useState(null);
    const [selectedGuestName, setSelectedGuestName] = useState('');
    const [selectedGuestPhone, setSelectedGuestPhone] = useState('');
    const { url } = useContext(StoreContext);
    const [enlargedImage, setEnlargedImage] = useState(null);

    const handleImageClick = (imageSrc) => {
        setEnlargedImage(imageSrc);
    };

    const closeEnlargedView = () => {
        setEnlargedImage(null);
    };

    useEffect(() => {
        const fetchGuests = async () => {
            try {
                const response = await axios.get(`${url}/guests/getguests`);
                const guestsData = response.data;

                const guestsWithPaymentStatus = await Promise.all(
                    guestsData.map(async (guest) => {
                        const paymentStatusResponse = await axios.get(`${url}/guests/left&overdays/${guest._id}`);
                        return { ...guest, paymentStatus: paymentStatusResponse.data };
                    })
                );

                setGuests(guestsWithPaymentStatus);
            } catch (error) {
                console.error('Error fetching guest data:', error);
            }
        };
        fetchGuests();
    }, [url]);

    const sortedGuests = guests.sort((a, b) => {
        const aDays = a.paymentStatus.overdueDays;
        const bDays = b.paymentStatus.overdueDays;
    
        // Sort by overdue days first (those with overdueDays > 0 come first)
        if (aDays > 0 && bDays <= 0) return -1; // a comes first
        if (aDays <= 0 && bDays > 0) return 1;  // b comes first
    
        // If both have overdueDays or both don't, sort by leftoverDays
        if (aDays === bDays) {
            const aLeftover = a.paymentStatus.leftoverDays;
            const bLeftover = b.paymentStatus.leftoverDays;
            return aLeftover - bLeftover; // Sort by leftoverDays ascending
        }
    
        // Default sorting for overdueDays > 0 and <= 0 cases
        return aDays - bDays;
    });

    

    // Calculate counts
    const totalMembers = guests.length;
    const overdueCount = guests.filter(guest => guest.paymentStatus.overdueDays > 0).length;

    const handleUpdatePaymentClick = (guestId, guestName) => {
        setSelectedGuestId(guestId);
        setSelectedGuestName(guestName);
        setIsUpdating(true);
        setPaymentDate(moment().format('YYYY-MM-DD'));
    };

    

    const handleSubmitUpdate = async (e) => {
        e.preventDefault();
        try {
            // Updating payment details
            await axios.put(`${url}/guests/paymentupdate/${selectedGuestId}`, {
                amount: paymentAmount,
                paymentDate: paymentDate || moment().format('YYYY-MM-DD'),
                note: paymentNote,
            });

           

            alert('Payment status updated!');
            setIsUpdating(false);

            // Fetch updated guest data
            const response = await axios.get(`${url}/guests/getguests`);
            const guestsData = response.data;
            const guestsWithPaymentStatus = await Promise.all(
                guestsData.map(async (guest) => {
                    console.log("Image URL:", guest.profileImage);
                    const paymentStatusResponse = await axios.get(`${url}/guests/left&overdays/${guest._id}`);
                    return { ...guest, paymentStatus: paymentStatusResponse.data };
                })
            );
            setGuests(guestsWithPaymentStatus);
        } catch (error) {
            console.error('Error updating payment status:', error);
        }
    };

    const togglePaymentHistory = (guest) => {
        if (expandedGuestId === guest._id) {
            setExpandedGuestId(null);
        } else {
            setSelectedGuestName(guest.name);
            setSelectedGuestPhone(guest.phoneNumber);
            setExpandedGuestId(guest._id);
        }
    };

    return (
        <div className="container mx-auto p-4 md:p-6">
            <h2 className="text-2xl md:text-3xl font-semibold text-center mb-4 md:mb-6">Guest Payment Details</h2>
            {/* Display Counts */}
            <div className="mb-6 flex gap-x-10 ">
                <div>
                    <strong>Total Members:</strong> {totalMembers}
                </div>
                <div>
                    <strong>Overdue Payments:</strong> {overdueCount}
                </div>
            </div>
            
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded border text-sm md:text-base">
                    <thead>
                        <tr>
                        <th className="py-2 md:py-3 px-3 md:px-5 border">Image </th>
                            <th className="py-2 md:py-3 px-3 md:px-5 border">Name</th>
                            <th className="py-2 md:py-3 px-3 md:px-5 border">Register date</th>

                            <th className="py-2 md:py-3 px-3 md:px-5 border">Email</th>
                            <th className="py-2 md:py-3 px-3 md:px-5 border">Phone</th>
                            <th className="py-2 md:py-3 px-3 md:px-5 border">Room Number</th>
                            <th className="py-2 md:py-3 px-3 md:px-5 border">Last Payment</th>
                            <th className="py-2 md:py-3 px-3 md:px-5 border">Payment Status</th>
                            <th className="py-2 md:py-3 px-3 md:px-5 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedGuests.length > 0 ? (
                            sortedGuests.map((guest) => {
                                const paymentText = guest.paymentStatus.overdueDays > 0
                                    ? `${guest.paymentStatus.overdueDays} overdue`
                                    : `${guest.paymentStatus.leftoverDays} left `;

                                return (
                                    <tr key={guest._id}>
                                        
                                        <td className="py-2 md:py-3 px-3 md:px-5 border">
                                        <img
                                            src={guest.profileImage}
                                            alt="profile"
                                            className="w-12 h-12 rounded-full object-cover cursor-pointer "
                                            onClick={() => handleImageClick(guest.profileImage)}
                                        />
                                    </td>
                                        <td className="py-2 md:py-3 px-3 md:px-5 border">{guest.name}</td>
                                        <td className="py-2 md:py-3 px-3 md:px-5 border">{moment(guest.regDate).format('DD-MMM-YYYY')}</td>
                                        <td className="py-2 md:py-3 px-3 md:px-5 border">{guest.email}</td>
                                        <td className="py-2 md:py-3 px-3 md:px-5 border">{guest.phoneNumber}</td>

                                        <td className="py-2 md:py-3 px-3 md:px-5 border">{guest.roomNumber}</td>
                                        <td className="py-2 md:py-3 px-3 md:px-5 border">{moment(guest.lastPaymentDate).format('DD-MMM-YYYY')}</td>
                                        <td className={`py-2 md:py-3 px-3 md:px-5 border ${ guest.paymentStatus.overdueDays+guest.paymentStatus.leftoverDays < 0 ? 'text-red-500' : 'text-green-500'}`}>
                                            {paymentText}
                                        </td>
                                        <td className="py-2 md:py-3  px-3 md:px-5 border">
                                            <button
                                                className="bg-blue-500  text-white px-2 mx-3 md:px-3 py-1 rounded hover:bg-blue-600 mr-1 md:mr-2"
                                                onClick={() => handleUpdatePaymentClick(guest._id, guest.name)}
                                            >
                                                Update
                                            </button>
                                            <button
                                                className="bg-green-500  text-white px-2 mx-3  md:px-3 py-1 rounded hover:bg-green-600"
                                                onClick={() => togglePaymentHistory(guest)}
                                            >
                                                {expandedGuestId === guest._id ? ' hide' : ' History'}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center py-4">No guests found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {enlargedImage && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={closeEnlargedView}>
                    <img src={enlargedImage} alt="Enlarged profile" className="max-w-full max-h-full rounded-lg shadow-lg" />
                </div>
            )}

            {/* Payment History Modal */}
            {expandedGuestId && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 p-4">
                    <div className="bg-white p-4 md:p-7 rounded shadow-lg w-full max-w-md">
                        <h3 className="text-lg md:text-xl font-semibold mb-2">Payment History for {selectedGuestName}</h3>
                        <p className="mb-4">Phone: {selectedGuestPhone}</p>
                        {guests.find(g => g._id === expandedGuestId)?.paymentHistory?.length > 0 ? (
                            <ul className="list-disc pl-5 space-y-2">
                                {guests.find(g => g._id === expandedGuestId).paymentHistory.map((history, index) => (
                                    <li key={index}>
                                        {moment(history.date).format('DD-MMM-YYYY')} - {history.amount} - {history.note}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No payment history found.</p>
                        )}
                        <button
                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            onClick={() => setExpandedGuestId(null)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Update Payment Modal */}
            {isUpdating && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 p-4">
                    <div className="bg-white p-4 md:p-7 rounded shadow-lg w-full max-w-md">
                        <h3 className="text-lg md:text-xl font-semibold mb-4">Update Payment for {selectedGuestName}</h3>
                        <form onSubmit={handleSubmitUpdate}>
                            <div className="mb-4">
                                <label htmlFor="paymentAmount" className="block font-semibold mb-1">Amount</label>
                                <input
                                    id="paymentAmount"
                                    type="number"
                                    className="w-full px-4 py-2 border border-gray-300 rounded"
                                    value={paymentAmount}
                                    onChange={(e) => setPaymentAmount(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="paymentDate" className="block font-semibold mb-1">Payment Date</label>
                                <input
                                    id="paymentDate"
                                    type="date"
                                    className="w-full px-4 py-2 border border-gray-300 rounded"
                                    value={paymentDate}
                                    onChange={(e) => setPaymentDate(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="paymentNote" className="block font-semibold mb-1">Note</label>
                                <textarea
                                    id="paymentNote"
                                    className="w-full px-4 py-2 border border-gray-300 rounded"
                                    rows="4"
                                    value={paymentNote}
                                    onChange={(e) => setPaymentNote(e.target.value)}
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                            >
                                Submit
                            </button>
                            <button
                                type="button"
                                className="w-full bg-red-500 text-white py-2 rounded mt-4 hover:bg-red-600"
                                onClick={() => setIsUpdating(false)}
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Guests;
