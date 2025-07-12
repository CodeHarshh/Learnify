import React from 'react';

const HighlightText3 = ({ text }) => {
  return (
    <span className="bg-gradient-to-r from-[#6A11CB] via-[#2575FC] to-[#3A8DFF] 
    text-transparent bg-clip-text font-bold">
      {text}
    </span>
  );
};

export default HighlightText3;
