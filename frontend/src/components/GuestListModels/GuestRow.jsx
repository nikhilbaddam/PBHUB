import React from "react";
import moment from "moment";

const GuestRow = ({
  guest,
  handleImageClick,
  handleUpdatePaymentClick,
  togglePaymentHistory,
  handleDeleteClick,
  expandedGuestId,
}) => {
  const paymentText =
    guest.paymentStatus.overdueDays < 0
      ? `${guest.paymentStatus.overdueDays} overdue`
      : `${guest.paymentStatus.leftoverDays} left `;

  

  return (
    <tr key={guest._id}>
      <td className="py-2 md:py-3 px-3 md:px-5 border">
        <img
          src={guest.profileImage}
          alt="profile"
          className="w-12 h-12 rounded-full object-cover cursor-pointer"
          onClick={() => handleImageClick(guest.profileImage)}
        />
      </td>
      <td className="py-1 md:py-3 px-3 md:px-5 border">{guest.name}</td>
      <td className="py-1 md:py-3 px-3 md:px-5 border">
        {moment(guest.regDate).format("DD-MMM-YYYY")}
      </td>
      <td className="py-1 md:py-3 px-3 md:px-5 border">{guest.email}</td>
      <td className="py-1 md:py-3 px-3 md:px-5 border">{guest.phoneNumber}</td>
      <td className="py-1 md:py-3 px-3 md:px-5 border">{guest.roomNumber}</td>
      <td className="py-1 md:py-3 px-3 md:px-5 border">
        {moment(guest.lastPaymentDate).format("DD-MMM-YYYY")}
      </td>
      <td
        className={`py-1 md:py-3 px-3 md:px-5 border ${
          guest.paymentStatus.overdueDays > 0
            ? "text-red-500"
            : "text-green-500"
        }`}
      >
        {paymentText}
      </td>
      <td className="h-fit  md:py-5 px-1 md:px-5 mt-4  border flex justify-center items-center gap-2">
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          onClick={() => handleUpdatePaymentClick(guest._id)}
        >
          Update
        </button>
        <button
          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
          onClick={togglePaymentHistory}
        >
          {expandedGuestId === guest._id ? "Hide" : "History"}
        </button>
        <button
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          onClick={handleDeleteClick}
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default GuestRow;
