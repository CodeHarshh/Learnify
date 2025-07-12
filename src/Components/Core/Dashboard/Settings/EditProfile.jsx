import { useState } from "react";
import {  useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";


import IconBtn from "../../../Common/IconBtn";

const genders = ["Male", "Female", "Non-Binary", "Prefer not to say", "Other"];

export default function EditProfile() {
  const { user } = useSelector((state) => state.profile);

  const navigate = useNavigate();


  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    dateOfBirth: user?.additionalDetails?.dateOfBirth || "",
    gender: user?.additionalDetails?.gender || "",
    contactNumber: user?.additionalDetails?.contactNumber || "",
    about: user?.additionalDetails?.about || "",
  });

  const [errors, setErrors] = useState({});

  setErrors({});

  // const validateForm = () => {
  //   const newErrors = {};

  //   if (!formData.firstName.trim()) newErrors.firstName = "Please enter your first name.";
  //   if (!formData.lastName.trim()) newErrors.lastName = "Please enter your last name.";
  //   if (!formData.dateOfBirth) newErrors.dateOfBirth = "Please enter your Date of Birth.";
  //   if (!formData.gender) newErrors.gender = "Please select your gender.";
  //   if (!formData.contactNumber.trim()) newErrors.contactNumber = "Please enter your Contact Number.";
  //   if (formData.contactNumber.trim().length < 10 || formData.contactNumber.trim().length > 12) {
  //     newErrors.contactNumber = "Invalid Contact Number.";
  //   }
  //   if (!formData.about.trim()) newErrors.about = "Please enter your bio details.";

  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (!validateForm()) return;

    // try {
    //   console.log("Token:", token);
    //   dispatch(updateProfile({ token,formData }));
    //   navigate("/dashboard/my-profile");
    // } catch (error) {
    //   console.error("Error updating profile:", error.message);
    // }
    toast.error("This account is not allowed to access this feature.");

  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="my-10 flex flex-col gap-y-6 rounded-md border border-richblack-700 bg-richblack-800 p-8 px-12">
        <h2 className="text-lg font-semibold text-richblack-5">Profile Information</h2>

        {/* Name Fields */}
        <div className="flex flex-col gap-5 lg:flex-row">
          {[
            { label: "First Name", name: "firstName", placeholder: "Enter first name" },
            { label: "Last Name", name: "lastName", placeholder: "Enter last name" },
          ].map(({ label, name, placeholder }, idx) => (
            <div key={idx} className="flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor={name} className="lable-style">{label}</label>
              <input
                type="text"
                name={name}
                id={name}
                placeholder={placeholder}
                className="form-style"
                value={formData[name]}
                onChange={handleChange}
              />
              {errors[name] && (
                <span className="-mt-1 text-[12px] text-yellow-100">{errors[name]}</span>
              )}
            </div>
          ))}
        </div>

        {/* Date of Birth and Gender */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor="dateOfBirth" className="lable-style">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              id="dateOfBirth"
              className="form-style"
              value={formData.dateOfBirth}
              onChange={handleChange}
            />
            {errors.dateOfBirth && (
              <span className="-mt-1 text-[12px] text-yellow-100">{errors.dateOfBirth}</span>
            )}
          </div>

          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor="gender" className="lable-style">Gender</label>
            <select
              name="gender"
              id="gender"
              className="form-style"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              {genders.map((gender, index) => (
                <option key={index} value={gender}>{gender}</option>
              ))}
            </select>
            {errors.gender && (
              <span className="-mt-1 text-[12px] text-yellow-100">{errors.gender}</span>
            )}
          </div>
        </div>

        {/* Contact Number and About */}
        <div className="flex flex-col gap-5 lg:flex-row">
          {[
            { label: "Contact Number", name: "contactNumber", placeholder: "Enter Contact Number" },
            { label: "About", name: "about", placeholder: "Enter Bio Details" },
          ].map(({ label, name, placeholder }, idx) => (
            <div key={idx} className="flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor={name} className="lable-style">{label}</label>
              <input
                type="text"
                name={name}
                id={name}
                placeholder={placeholder}
                className="form-style"
                value={formData[name]}
                onChange={handleChange}
              />
              {errors[name] && (
                <span className="-mt-1 text-[12px] text-yellow-100">{errors[name]}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={() => navigate("/dashboard/my-profile")}
          type="button"
          className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
        >
          Cancel
        </button>
        <IconBtn type="submit" text="Save" />
      </div>
    </form>
  );
}
