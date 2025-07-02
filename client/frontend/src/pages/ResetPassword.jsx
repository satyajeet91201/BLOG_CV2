import React, { useRef, useState, useContext } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AppContent } from '../context/AppContext';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContent);

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [newPassword, setNewPassword] = useState('');
  const inputsRef = useRef([]);

  const handleChange = (element, index) => {
    const val = element.value;
    if (/[^0-9]/.test(val)) return;
    const updated = [...otp];
    updated[index] = val;
    setOtp(updated);
    if (val && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasted)) {
      const pastedArr = pasted.split('');
      setOtp(pastedArr);
      inputsRef.current[5].focus();
    } else {
      toast.error("Something went wrong!", { autoClose: 3000, position: "top-right", theme: "colored" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalOtp = otp.join('');
    if (!email || finalOtp.length !== 6 || !newPassword) {
      return toast.error("Something went wrong!", { autoClose: 3000, position: "top-right", theme: "colored" });

    }

    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/reset-password`, {
        email,
        otp: finalOtp,
        newPassword,
      });

      if (data.status) {
        toast.success("Action completed successfully!", { autoClose: 3000, position: "top-right", theme: "colored" });
        navigate('/');
      } else {
        toast.error("Something went wrong!", { autoClose: 3000, position: "top-right", theme: "colored" });
      }
    } catch (error) {
      toast.error("Something went wrong!", { autoClose: 3000, position: "top-right", theme: "colored" });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400 px-4 sm:px-0">
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt="Logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />

      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">Reset Password</h2>
        <p className="text-center mb-6 text-sm">Enter your email, OTP and new password</p>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email address"
            required
            className="w-full px-4 py-2 rounded-full bg-[#333A5C] text-white placeholder-gray-400 outline-none"
          />

          <div className="flex justify-between gap-2" onPaste={handlePaste}>
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

          <input
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            type="password"
            placeholder="New Password"
            required
            className="w-full px-4 py-2 rounded-full bg-[#333A5C] text-white placeholder-gray-400 outline-none"
          />

          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2.5 rounded-full transition-all"
          >
            Reset Password
          </button>
        </form>

        <p className="text-xs text-center mt-4">
          Remembered your password?{' '}
          <span
            onClick={() => navigate('/login')}
            className="text-indigo-400 hover:underline cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
