import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { FaUnlock } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const [state, setState] = useState('Sign Up');
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContent);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;

    console.log("🔁 Submit triggered");
    console.log("🔧 Mode:", state);
    console.log("📧 Email:", email);
    console.log("🔑 Password:", password);
    if (state === 'Sign Up') console.log("👤 Name:", name);
    console.log("🌐 backendUrl from context:", backendUrl);

    try {
      if (state === 'Sign Up') {
        const { data } = await axios.post(`${backendUrl}/api/auth/register`, {
          name, email, password
        });

        if (data.status === 'Success') {
          setIsLoggedIn(true);
          toast.success("Registration successful!");
          getUserData();
          navigate('/');
        } else {
          toast.error(data.message);
        }

      } else {
        const { data } = await axios.post(`${backendUrl}/api/auth/login`, {
          email, password
        });

        if (data.status === 'Success') {
          setIsLoggedIn(true);
          toast.success("Login successful!");
          getUserData();
          navigate('/');
        } else {
          toast.error(data.message);
        }
      }

    } catch (err) {
      console.error("❌ Error during API call:", err);

      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt="Logo"
        className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'
      />

      <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
        <h2 className='text-3xl font-semibold text-white text-center mb-3'>
          {state === 'Sign Up' ? 'Create Account' : 'Login'}
        </h2>
        <p className='text-center text-sm mb-6'>
          {state === 'Sign Up' ? 'Create Your Account' : 'Login to your account!'}
        </p>

        <form onSubmit={onSubmitHandler} className='space-y-4'>
          {state === 'Sign Up' && (
            <div className='flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
              <img src={assets.person_icon} alt="Person" className="w-5 h-5" />
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='bg-transparent outline-none text-white w-full'
                type='text'
                placeholder='Full Name'
                required
              />
            </div>
          )}

          <div className='flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.mail_icon} alt="Email" className="w-5 h-5" />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='bg-transparent outline-none text-white w-full'
              type='email'
              placeholder='Email Address'
              required
            />
          </div>

          <div className='flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <FaUnlock className='h-5 w-5' />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='bg-transparent outline-none text-white w-full'
              type='password'
              placeholder='Password'
              required
            />
          </div>

          {state === 'Login' && (
            <p
              onClick={() => navigate('/reset-password')}
              className='mb-4 text-indigo-500 cursor-pointer'
            >
              Forgot password?
            </p>
          )}

          <button
            type='submit'
            className='mt-4 w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2.5 rounded-full transition-all'
          >
            {state === 'Sign Up' ? 'Sign Up' : 'Login'}
          </button>

          <p className='text-center mt-4 text-indigo-300 text-xs'>
            {state === 'Sign Up' ? (
              <>
                Already have an account?{' '}
                <span
                  className='text-indigo-400 hover:underline cursor-pointer'
                  onClick={() => setState('Login')}
                >
                  Login
                </span>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <span
                  className='text-indigo-400 hover:underline cursor-pointer'
                  onClick={() => setState('Sign Up')}
                >
                  Sign Up
                </span>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
