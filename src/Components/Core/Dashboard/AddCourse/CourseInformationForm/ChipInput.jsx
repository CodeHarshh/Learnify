import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { GrFormClose } from "react-icons/gr";

const ChipInput = ({
  label,
  name,
  placeholder,
  register,
  errors,
  setValue,
  getValues,
}) => {
  const { course = {}, editCourse = false } = useSelector((state) => state.course || {});
  const [chips, setChips] = useState([]);

  useEffect(() => {
    if (editCourse && course?.tags) {
      setChips(JSON.parse(course.tags)); // Parse the tags if they exist
    }

    // Register the input with validation
    register(name, {
      required: true,
      validate: (value) => value.length > 0,
    });
  }, [editCourse, course, name, register]);

  useEffect(() => {
    setValue(name, chips); // Update the value in the form state whenever chips change
  }, [chips, name, setValue]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const chipValue = e.target.value.trim();

      if (chipValue && !chips.includes(chipValue)) {
        setChips((prev) => [...prev, chipValue]);
        e.target.value = ""; // Clear the input field
      }
    }
  };

  const handleDeleteChip = (chipIndex) => {
    setChips((prev) => prev.filter((_, index) => index !== chipIndex));
  };

  return (
    <div className="flex flex-col space-y-2">
      {/* Label */}
      <label className="text-sm text-richblack-5" htmlFor={name}>
        {label} <sup className="text-pink-200">*</sup>
      </label>

      {/* Chips and Input */}
      <div className="flex w-full flex-wrap gap-y-2">
        {chips.map((chip, index) => (
          <div
            key={index}
            className="m-1 flex items-center rounded-full bg-yellow-400 px-2 py-1 text-sm text-richblack-5"
          >
            {chip}
            <button
              type="button"
              className="ml-2 focus:outline-none"
              onClick={() => handleDeleteChip(index)}
            >
              <GrFormClose className="text-sm" />
            </button>
          </div>
        ))}

        <input
          id={name}
          name={name}
          type="text"
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          className="form-style w-full"
        />
      </div>

      {/* Error Message */}
      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  );
};

export default ChipInput;
