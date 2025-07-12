import { toast } from "react-hot-toast";

import { setUser } from "../../slices/profileSlice";

import { apiConnector } from "../apiconnector";
import { settingsEndpoints } from "../apis";
import { logout } from "./authApi";
import { setToken } from "../../slices/authSlice";
import axios from "axios";

const {
  UPDATE_DISPLAY_PICTURE_API,
  UPDATE_PROFILE_API,
  CHANGE_PASSWORD_API,
  DELETE_PROFILE_API,
} = settingsEndpoints;

// export function updateDisplayPicture(token, formData) {
//   return async (dispatch) => {
//     const toastId = toast.loading("Loading...")
//     try {
//       console.log("------>>",token);
//       console.log("formdata",formData);
//         const requestBody = {
//       formData: formData,
//       token: token
//     };
//    const response = await apiConnector(
//   "PUT",
//   UPDATE_DISPLAY_PICTURE_API,
//   requestBody, // Send token in body
//   {
//     Authorization: `Bearer ${token}`, // Send token in header
//   },
//   { withCredentials: true } // Send token in cookies (if applicable)
// );
//       console.log(
//         "UPDATE_DISPLAY_PICTURE_API API RESPONSE............",
//         response
//       )

//       if (!response.data.success) {
//         throw new Error(response.data.message)
//       }
//       toast.success("Display Picture Updated Successfully")
//       dispatch(setUser(response.data.data))
//     } catch (error) {
//       console.log("UPDATE_DISPLAY_PICTURE_API API ERROR............", error)
//       toast.error("Could Not Update Display Picture")
//     }
//     toast.dismiss(toastId)
//   }
// }

export function updateDisplayPicture(token, formData) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    try {
      console.log(formData);

      const res = await fetch(UPDATE_DISPLAY_PICTURE_API, {
        method: "PUT",
        body: formData,
      });

      const response = await apiConnector(
        "PUT",
        UPDATE_DISPLAY_PICTURE_API,
        formData,
        { token: token },
        {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        }
      );
      console.log(
        "UPDATE_DISPLAY_PICTURE_API API RESPONSE............",
        response
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Display Picture Updated Successfully");
      dispatch(setUser(response.data.data));
    } catch (error) {
      console.log("UPDATE_DISPLAY_PICTURE_API API ERROR............", error);
      toast.error("Could Not Update Display Picture");
    }
    toast.dismiss(toastId);
  };
}


export function updateProfile({token, formData}) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    try {
      // const response = await apiConnector("PUT", UPDATE_PROFILE_API, formData, {
      //   Authorization: `Bearer ${token}`,
      // })
      console.log("Token being sent:", token);
console.log("FormData being sent:", formData);
  
       const response = await axios.put(
      process.env.REACT_APP_BASE_URL+"/profile/updateProfile",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

      console.log("UPDATE_PROFILE_API API RESPONSE............", response)

     console.log("Response data------>:", response.data.userDetail);
      // const userImage = response.updatedUserDetails.image
      //   ? response.updatedUserDetails.image
      //   : `https://api.dicebear.com/5.x/initials/svg?seed=${response.updatedUserDetails.firstName} ${response.updatedUserDetails.lastName}`
    
    
 dispatch(setUser(response.data.userDetail));

      toast.success("Profile Updated Successfully")
    } catch (error) {
      console.log("UPDATE_PROFILE_API API ERROR............", error)
      toast.error("Could Not Update Profile")
    }
    toast.dismiss(toastId)
  }
}







export async function changePassword(token, formData) {
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST", CHANGE_PASSWORD_API, formData, {
      Authorization: `Bearer ${token}`,
    });
    console.log("CHANGE_PASSWORD_API API RESPONSE............", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    toast.success("Password Changed Successfully");
  } catch (error) {
    console.log("CHANGE_PASSWORD_API API ERROR............", error);
    toast.error(error.response.data.message);
  }
  toast.dismiss(toastId);
}










export function deleteProfile(token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    try {
      const response = await apiConnector("DELETE", DELETE_PROFILE_API, null, {
        Authorization: `Bearer ${token}`,
      });
      console.log("DELETE_PROFILE_API API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Profile Deleted Successfully");
      dispatch(logout(navigate));
    } catch (error) {
      console.log("DELETE_PROFILE_API API ERROR............", error);
      toast.error("Could Not Delete Profile");
    }
    toast.dismiss(toastId);
  };
}
