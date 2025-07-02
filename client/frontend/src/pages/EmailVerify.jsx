import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets'; // ensure this has `logo`
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContent } from '../context/AppContext';

const EmailVerify = () => {
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const inputsRef = useRef([]);
  const navigate = useNavigate();

  const {resendOtp , backendUrl} = useContext(AppContent);

   
  


  // Focus next input on typing
  const handleChange = (element, index) => {
    const val = element.value;
    if (/[^0-9]/.test(val)) return;

    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    if (val && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  // Handle backspace to go to previous input
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  // Handle pasting entire OTP
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      inputsRef.current[5].focus();
    } else {
      toast.error("Something went wrong!", { autoClose: 3000, position: "top-right", theme: "colored" });
    }
  };

     const handleSubmit = async()=>{
      const finalOtp = otp.join('');
      if (finalOtp.length !== 6) {
      return toast.error("Something went wrong!", { autoClose: 3000, position: "top-right", theme: "colored" });
    }
    try{
      const {data} = await axios.post(backendUrl + '/api/auth/verifyEmail',{
        otp: finalOtp,
      });
      if(data.status)
      {
        toast.success("Action completed successfully!", { autoClose: 3000, position: "top-right", theme: "colored" });
        navigate("/")
      }
    }catch(error){
        toast.error("Something went wrong!", { autoClose: 3000, position: "top-right", theme: "colored" });
    }
  }


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400 px-4 sm:px-0">
      <img
        src={assets.logo}
        alt="Logo"
        onClick={() => navigate('/')}
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />

      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">Verify Email</h2>
        <p className="text-center mb-6 text-sm">Enter the 6-digit OTP sent to your email address</p>

        <div className="flex justify-between gap-2 mb-6" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputsRef.current[index] = el)}
              className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold border border-gray-300 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2.5 rounded-full transition-all"
        >
          Verify OTP
        </button>

        <p className="text-xs text-center mt-4">
          Didn't get the code? <span onClick={resendOtp} className="text-indigo-400 hover:underline cursor-pointer">Resend</span>
        </p>
      </div>
    </div>
  );
};

export default EmailVerify;
