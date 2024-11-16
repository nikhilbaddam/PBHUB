// components/EnlargedImageModal.js
import React from 'react';

const EnlargedImageModal = ({ imageSrc, closeEnlargedView }) => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={closeEnlargedView}>
        <img src={imageSrc} alt="Enlarged profile" className="max-w-full max-h-full rounded-lg shadow-lg" />
    </div>
);

export default EnlargedImageModal;
