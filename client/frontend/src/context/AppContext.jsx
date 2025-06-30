import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios"; // ✅ Correct import
import { useNavigate } from "react-router-dom";

export const AppContent = createContext();

export const AppContextProvider = (props) => {

  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null); // better default than false
  const [loading, setLoading] = useState(true);

  // Debug to ensure backendUrl is loading properly
  console.log("🌐 Loaded backendUrl from .env:", backendUrl);

  const getAuthState =async ()=>{
    try {
        const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`, {
      withCredentials: true,
    });
        if(data.success){
          setIsLoggedIn(true);
          await getUserData();
        }else{
          setIsLoggedIn(false);
          setUserData(null);
        }
      } catch (error) {
        toast.error("Something went wrongg: " + error.message); // ✅ Corrected error-usage
        setIsLoggedIn(false);
        setUserData(null);
      }

  }

  const resendOtp = async ()=>{
    try{
      axios.defaults.withCredentials=true;
      const {data} = await axios.post(backendUrl + "/api/auth/emailOtp");
      console.log(data);
      if(data.success)
      {
        toast.success("OTP Resent On Your Email");
      }

    }catch(error)
    {
      toast.error(error.message)
    }
  }
  
  
  const getUserData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/user/data');
      data.status === 'Success'
        ? setUserData(data.userData)
        : toast.error(data.message);
    } catch (error) {
      toast.error("Something went wrongg: " + error.message); // ✅ Corrected error usage
    }
  };

useEffect(() => {
  const fetchAuth = async () => {
    await getAuthState();
    setLoading(false);
  };
  fetchAuth();
}, []);

  const value = {
    backendUrl,
    isLoggedIn,
    loading,
    getUserData,
    userData,
    resendOtp,
    setIsLoggedIn,
    setUserData,
  };

  return (
    <AppContent.Provider value={value}>
      {props.children}
    </AppContent.Provider>
  );
};
