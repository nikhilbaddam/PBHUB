// components/Guests/UpdatePaymentModal.js
import React, { useContext, useState } from 'react';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';

const UpdatePaymentModal = ({ onClose, guestId }) => {
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentDate, setPaymentDate] = useState('');
    const [note, setNote] = useState('');
    const [error, setError] = useState(null);
    const {url}=useContext(StoreContext);

    const handleSubmit = async (e) => {
        e.preventDefault();

        
        if (!paymentAmount || !paymentDate) {
            setError('Please fill out all fields');
            return;
        }

        try {
            // Make API call to update payment details
            const amount=paymentAmount;
            await axios.put(`${url}/guests/paymentupdate/${guestId}`, {
                
                amount,
                paymentDate,
                note,
            });

            console.log('Payment updated', { paymentAmount, paymentDate, note });

            // Close the modal after successful submission
            onClose();
        } catch (error) {
            console.error('Error updating payment:', error);
            setError('Failed to update payment. Please try again.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-96">
                <h3 className="text-xl font-semibold mb-4">Update Payment</h3>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSubmit}>
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
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
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
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                    






                </form>
            </div>
        </div>
    );
};

export default UpdatePaymentModal;
