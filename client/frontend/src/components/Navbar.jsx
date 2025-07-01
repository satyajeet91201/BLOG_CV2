import React, { useContext, useEffect, useState } from 'react';
import { MdLogin } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Navbar = () => {
  const {setIsLoggedIn, userData, backendUrl, setUserData } = useContext(AppContent);
  const navigate = useNavigate();

  // 🌗 Theme toggle logic
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + '/api/auth/logout');
      if (data.status) {
        setIsLoggedIn(false);
        setUserData(false);
        navigate('/');
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleChangePassword = async () => {
  console.log("🔄 Change Password clicked");

  try {
    const { data } = await axios.post(
      backendUrl + '/api/auth/send-reset-otp',
      {},
      { withCredentials: true }
    );

    console.log("✅ OTP response:", data);

    if (data.success) { // ✅ Make sure backend sends "success", not "status"
      toast.success(data.message);
      console.log("📍 Navigating to /reset-password");
      navigate('/reset-password');
    } else {
      toast.error(data.message || "Something went wrong");
    }
  } catch (error) {
    console.error("🔴 Change password error:", error);
    toast.error(error.response?.data?.message || error.message);
  }
};


  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "/api/auth/emailOtp");
      if (data.success) {
        toast.success(data.message);
        navigate('/email-verify');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0 z-10">
      {/* Logo */}
      <h1
        onClick={() => navigate('/')}
        className="text-2xl sm:text-3xl font-normal cursor-pointer tracking-wide text-gray-800 dark:text-white manufacturing-consent-regular fade-in hover:scale-105 transition-all duration-300"
      >
        <span className="text-purple-600 drop-shadow-md">Satya</span>
        <span className="text-pink-600 drop-shadow-md">Writes</span>
      </h1>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Login / User Dropdown */}
        {userData ? (
          <div className="w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group cursor-pointer">
            {userData.Name[0].toUpperCase()}
            <div className="absolute hidden group-hover:block w-38 top-0 right-0 z-10 text-black rounded pt-10">
              <ul className="list-none m-0 p-2 bg-gray-100 text-sm dark:bg-gray-800 dark:text-white">
                {!userData.IsVerified && (
                  <li
                    onClick={sendVerificationOtp}
                    className="px-2 py-1 hover:bg-gray-400 dark:hover:bg-gray-600 transition-all"
                  >
                    Verify Email
                  </li>
                )}
                <li
                  onClick={logout}
                  className="px-2 py-1 pr-10 hover:bg-gray-400 dark:hover:bg-gray-600 transition-all"
                >
                  Logout
                </li>
                {userData.IsVerified && (
                  <li
                    onClick={handleChangePassword}
                    className="px-2 py-1 pr-10 hover:bg-gray-400 dark:hover:bg-gray-600 transition-all"
                  >
                    Change Password
                  </li>
                )}
              </ul>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 border border-gray-500 dark:border-white rounded-full px-6 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
          >
            Login <MdLogin className="w-6 h-6" />
          </button>
        )}

        {/* 🌙 Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 text-black dark:text-white flex items-center justify-center transition-all"
          title="Toggle Dark Mode"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
