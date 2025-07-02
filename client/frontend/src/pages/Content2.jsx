import React from 'react';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { AiFillGithub } from "react-icons/ai";
import Navbar from '../components/Navbar';
import { assets } from '../assets/assets';

const Content2 = () => {
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12 bg-gradient-to-br from-indigo-100 to-white dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white transition-colors duration-300">
        
        {/* Profile Section */}
        <div className="flex flex-col items-center text-center mb-10">
          <img
            src={assets.profile2} // ✅ Local file path
            alt="profile"
            className="w-32 h-32 rounded-full border-4 border-indigo-500 mb-4 shadow-lg object-cover"
          />
          <h1 className="text-3xl sm:text-4xl font-bold">Praphulla Lokhande</h1>
          <p className="text-md text-gray-600 dark:text-gray-300 mt-2">
            Full Stack Developer | MERN | React | Node.js
          </p>
          <div className="mt-4 flex justify-center gap-4 text-indigo-600 dark:text-indigo-400 text-xl">
  <a href="https://github.com/satyajeet91201" target="_blank" rel="noreferrer">
    <FaGithub />
  </a>
  <a href="https://in.linkedin.com/in/praphulla-lokhande-6b0806213" target="_blank" rel="noreferrer">
    <FaLinkedin />
  </a>
  <a href="mailto:praphullakumarlokhande9@gmail.com">
    <FaEnvelope />
  </a>
</div>

{/* Contact Info */}
<div className="mt-4 text-sm text-gray-600 dark:text-gray-300 text-center">
  <p>📞 Mobile: <span className="font-medium">7666980197</span>, <span className="font-medium">7977709649</span></p>
  <p>✉️ Email: <a  href="mailto:praphullakumarlokhande9@gmail.com" className="underline pr-2">praphullakumarlokhande9@gmail.com</a> <a href="mailto:praphullakumar.l@rilc.com" className="underline">praphullakumar.l@ril.com</a></p>
</div>
</div>

        {/* Education & Work Experience */}
        <div className="w-full max-w-4xl mb-10 text-center">
          <h2 className="text-2xl font-semibold mb-4">🎓 Education & 💼 Experience</h2>
          <div className="grid sm:grid-cols-2 gap-6 text-left text-sm sm:text-base">
            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
              <h3 className="font-semibold text-indigo-700 dark:text-indigo-300 mb-2">Education</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>M.E. Computer Engineering - Pune University</li>
                <li>B.E. - Sinhagad Academy of Engineering, Pune</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
              <h3 className="font-semibold text-indigo-700 dark:text-indigo-300 mb-2">Work Experience</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Assistant Manager – Jio Platforms (Jan 2024 – Present)</li>
                <li>Web Dev Intern – Twowaits Technologies Ltd (Jan 2023 – Mar 2023)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="w-full max-w-4xl text-center mb-10">
          <h2 className="text-2xl font-semibold mb-4">🧠 Skills</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-sm">
            {[
              'React.js', 'Node.js', 'Express', 'MongoDB',
              'Tailwind CSS', 'Redux', 'Git/GitHub', 'JWT',
              'API Integration', 'TypeScript',
            ].map(skill => (
              <span
                key={skill}
                className="bg-indigo-500 px-4 py-2 rounded-full shadow-md text-white"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Projects */}
<div className="w-full max-w-4xl text-center mb-10">
  <h2 className="text-2xl font-semibold mb-6">🚀 Projects</h2>
  <div className="grid gap-6 sm:grid-cols-2 text-left">
    {[
  {
  title: 'Smart Restaurant Manager',
  desc: (
    <>
      Facial recognition-based smart food suggestion system for customers with React and MongoDB.{' '}
      <a
        href="https://github.com/satyajeet91201/SRM-Final"
        target="_blank"
        rel="noopener noreferrer"
        className="text-indigo-600 dark:text-indigo-300 underline ml-1"
      >
        GitHub →
      </a>{' '}
      |{' '}
      <a
        href="https://smart-resturant-manager.netlify.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-green-600 dark:text-green-400 underline ml-1"
      >
        Demo →
      </a>
    </>
  )
},
{
  title: 'Flavaro – Food Ordering App',
  desc: (
    <>
      Modern UI/UX food order homepage using React.js, Tailwind CSS, Redux, and cart functionality.{' '}
      <a
        href="https://flavaro-gamma.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-green-600 dark:text-green-400 underline ml-1"
      >
        Demo →
      </a>
    </>
  )
},
{
  title: 'Stock Forecasting App',
  desc: (
    <>
      AI-based stock price prediction using news sentiment (TensorFlow.js, React, Node).{' '}
      <a
        href="https://github.com/satyajeet91201/BLOG_CV2"
        target="_blank"
        rel="noopener noreferrer"
        className="text-indigo-600 dark:text-indigo-300 underline ml-1"
      >
        GitHub →
      </a>{' '}
      |{' '}
      <a
        href="https://v0-finnhub-stock-predictor.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-green-600 dark:text-green-400 underline ml-1"
      >
        Demo →
      </a>
    </>
  )
},
{
  title: 'Blog & Profile Application',
  desc: (
    <>
      Full-stack MERN blog and portfolio app with authentication, role-based access, and CMS.{' '}
      <a
        href="https://github.com/satyajeet91201/BLOG_CV"
        target="_blank"
        rel="noopener noreferrer"
        className="text-indigo-600 dark:text-indigo-300 underline ml-1"
      >
        GitHub →
      </a>
    </>
  ),
},
].map((project) => (
      <div
        key={project.title}
        className="bg-white dark:bg-gray-700 rounded-xl shadow-md p-4 hover:shadow-lg transition-all"
      >
        <h3 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300">{project.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{project.desc}</p>
      </div>
    ))}
  </div>
</div>


        {/* Resume Download */}
       <a
        href="/Praphulla Resume-Updated.pdf"
        download
        className="border border-gray-500 dark:border-white rounded-full px-8 py-2.5 hover:bg-gray-300 dark:hover:bg-gray-700 transition-all"> 📄 My Resume</a>
      </div>
    </>
  );
};

export default Content2;
