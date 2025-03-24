import {create} from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast, { Toaster } from "react-hot-toast";

export const useAuthStore = create((set, get) => ({
    authUser:null,
    isCheckingAuth:true,


    checkAuth: async () => {
        try{
           const res = await axiosInstance.get("auth/user/me");
           set({authUser:res.data});
        } catch (error){
           set({authUser:null})
           console.error("Error in checkAuth ", error)
        } finally {
            set({isCheckingAuth:false})
        }
    },

    

      signup: async (formData) => {
        try {
          const response = await axiosInstance.post("/auth/signup", formData);
          return response.data;
        } catch (error) {
          const errorMessage = error.response?.data?.message || "Signup failed";
          toast.error(errorMessage)
      
        }
      },

      verifyOtp: async (enteredOtp) => {
        const signupData = JSON.parse(localStorage.getItem("signupData"));
    
        if (!signupData) {
          throw new Error("No signup data found.");
        }
    
        try {
          const response = await axiosInstance.post("/auth/verify-otp", {
            ...signupData, // Includes username, studentEmail, residence, password
            enteredOtp, // Add the OTP input by the user
          });

          set({authUser:response.data});
    
          return response.data;
          
        } catch (error) {
          
          const errorMessage = error.response?.data?.message || "OTP verification failed";
          throw new Error(errorMessage);
        }
      },

      resendOtp: async () => {
        const signupData = JSON.parse(localStorage.getItem("signupData"));
    
        if (!signupData) {
          throw new Error("No signup data found.");
        }
    
        try {
          const response = await axiosInstance.post("/auth/resend-otp", {
            email : signupData.studentEmail, // Send only studentEmail
          });
    
          return response.data;
        } catch (error) {
        
          const errorMessage = error.response?.data?.message || "Resend OTP failed";
          throw new Error(errorMessage);
        }
      },

      login: async (credentials) => {
        try {
          const response = await axiosInstance.post("/auth/login", credentials);
          set({ authUser: response.data });
          localStorage.setItem("userData", JSON.stringify(response.data.user));
          return response.data;
        } catch (error) {
          const errorMessage = error.response?.data?.message;
          console.log(errorMessage);
          throw new Error(errorMessage || "Login failed");
        }
      },

      logout: async () => {
        try{
            await axiosInstance.post("/auth/logout");
            set({authUser:null});
            toast.success("Logged out successfully");
            

        } catch(error){
            toast.error(error.response.data.message);
   
        }
    },

}))