import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { StoreContext } from '../context/StoreContext';
import GuestRow from '../components/GuestListModels/GuestRow';
import UpdatePaymentModal from '../components/GuestListModels/UpdatePaymentModal';
import PaymentHistoryModal from '../components/GuestListModels/PaymentHistoryModal';
import EnlargedImageModal from '../components/GuestListModels/EnlargedImageModal';

const GuestList = () => {
    const [guests, setGuests] = useState([]);
    const [filteredGuests, setFilteredGuests] = useState([]);
    const [isUpdating, setIsUpdating] = useState(false);
    const [expandedGuestId, setExpandedGuestId] = useState(null);
    const [enlargedImage, setEnlargedImage] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const { url } = useContext(StoreContext);
    const [selectedGuestId, setSelectedGuestId] = useState('');

    useEffect(() => {
        const fetchGuests = async () => {
            try {
                const response = await axios.get(`${url}/guests/getguests`);
                const guestsData = response.data;
                const guestsWithPaymentStatus = await Promise.all(
                    guestsData.map(async (guest) => {
                        const paymentStatusResponse = await axios.get(`${url}/guests/leftoverdays/${guest._id}`);
                        return { ...guest, paymentStatus: paymentStatusResponse.data };
                    })
                );
                setGuests(guestsWithPaymentStatus);
                setFilteredGuests(guestsWithPaymentStatus); // Initialize filteredGuests
            } catch (error) {
                console.error('Error fetching guest data:', error);
            }
        };
        fetchGuests();
    }, [url]);

    const handleDeleteGuest = async (guestId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this guest?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`${url}/guests/deleteguest/${guestId}`);
            setGuests((prev) => prev.filter((guest) => guest._id !== guestId));
            setFilteredGuests((prev) => prev.filter((guest) => guest._id !== guestId));
            alert("Guest deleted successfully!");
        } catch (error) {
            console.error("Error deleting guest:", error);
            alert("Failed to delete guest. Please try again.");
        }
    };




    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        // Filter based on name, phone number, room number, or email
        const filtered = guests.filter((guest) =>
            (guest.name?.toLowerCase() || "").includes(query) ||
            (guest.email?.toLowerCase() || "").includes(query) ||
            (guest.phone?.toLowerCase() || "").includes(query) ||
            (guest.roomNumber?.toLowerCase() || "").includes(query)
        );
        
        setFilteredGuests(filtered);
    };

    const handleImageClick = (imageSrc) => setEnlargedImage(imageSrc);
    const closeEnlargedView = () => setEnlargedImage(null);

    const sortedGuests = filteredGuests.sort((a, b) => {
        const aDays = a.paymentStatus.overdueDays;
        const bDays = b.paymentStatus.overdueDays;

        // Sort by overdue days first
        if (aDays > 0 && bDays <= 0) return -1;
        if (aDays <= 0 && bDays > 0) return 1;

        // If both have overdueDays or don't, sort by leftoverDays
        if (aDays === bDays) {
            const aLeftover = a.paymentStatus.leftoverDays;
            const bLeftover = b.paymentStatus.leftoverDays;
            return aLeftover - bLeftover;
        }

        return aDays - bDays;
    });

    const handleUpdatePaymentClick = (guestId) => {
        setSelectedGuestId(guestId);
        setIsUpdating(true);
    };

    return (
        <div className="container mx-auto p-4 md:p-6">
            <h2 className="text-2xl md:text-3xl font-semibold text-center mb-4 md:mb-6">Guest Payment Details</h2>

            {/* Search Box */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by Name, Phone, Room Number, or Email"
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-full p-2 border-zinc-950 rounded shadow-md focus:outline-none focus:ring-2 focus:ring-black-500"
                />
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded border text-sm md:text-base">
                    <thead>
                        <tr>
                            <th className="py-2 md:py-3 px-3 md:px-5 border">Image</th>
                            <th className="py-2 md:py-3 px-3 md:px-5 border">Name</th>
                            <th className="py-2 md:py-3 px-3 md:px-5 border">Register Date</th>
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
                            sortedGuests.map((guest) => (
                                <GuestRow
                                    key={guest._id}
                                    guest={guest}
                                    handleImageClick={handleImageClick}
                                    handleUpdatePaymentClick={handleUpdatePaymentClick}
                                    togglePaymentHistory={() => setExpandedGuestId(expandedGuestId === guest._id ? null : guest._id)}
                                    handleDeleteClick={() => handleDeleteGuest(guest._id)}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="text-center py-4">
                                    No guests found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {enlargedImage && <EnlargedImageModal imageSrc={enlargedImage} closeEnlargedView={closeEnlargedView} />}
            {isUpdating && <UpdatePaymentModal onClose={() => setIsUpdating(false)} guestId={selectedGuestId} />}
            {expandedGuestId && <PaymentHistoryModal guest={guests.find((g) => g._id === expandedGuestId)} onClose={() => setExpandedGuestId(null)} />}
        </div>
    );
};

export default GuestList;
