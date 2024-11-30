// components/Guests/PaymentHistoryModal.js
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment'
import { FaBars, FaTimes } from 'react-icons/fa';
import { StoreContext } from '../../context/StoreContext';

const PaymentHistoryModal = ({ guest, onClose }) => {
    const [paymentHistory, setPaymentHistory] = useState([]);
    const {url}=useContext(StoreContext);
    
    useEffect(() => {
        const fetchPaymentHistory = async () => {
            try {
                // Make an API call to fetch payment history for this guest (this is a placeholder)
                const response = await axios.get(`${url}/guests/gethistory/${guest._id}`);
                setPaymentHistory(response.data);
            } catch (error) {
                console.error('Error fetching payment history:', error);
            }
        };

        fetchPaymentHistory();
    }, [guest._id]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-96">
                <h3 className="text-xl font-semibold mb-4">Payment History for {guest.name}</h3>
                <p className="mb-4">Phone: {guest.phoneNumber}</p>
                <div className="mt-4">
                    {paymentHistory.length > 0 ? (
                        <ul>
                            {paymentHistory.map((payment, index) => (
                                <li key={index} className="mb-2">

                                    {moment(payment.paymentDate).format('DD-MMM-YYYY')} - {payment.amount} - {payment.note}
                                   
                                </li>
                                
                            ))}
                        </ul>
                    ) : (
                        <p>No payment history available</p>
                    )}
                    <button
                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            onClick={onClose}
                        >
                            Close
                        </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentHistoryModal;
