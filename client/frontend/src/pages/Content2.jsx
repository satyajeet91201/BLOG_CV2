import React from 'react';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import Navbar from '../components/Navbar'; 
import { assets } from '../assets/assets';

const Content2 = () => {
  return (
    <>
      <Navbar />
      <div className="font-sans flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 py-12 bg-gradient-to-br from-indigo-100 to-white dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white transition-colors duration-300 overflow-x-hidden">

        {/* Profile Section */}
        <div className="flex flex-col items-center text-center mb-10 mt-6">
          <img
            src={assets.profile}
            alt="profile"
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-indigo-500 shadow-lg object-cover transition-transform duration-300 hover:scale-105"
          />
          <h1 className="text-2xl sm:text-3xl font-bold mt-4 text-indigo-700 dark:text-indigo-300">
            Praphullakumar Lokhande
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-2">
            Full Stack Developer| Springboot | MERN | React | Node.js | JAVA | PostgresSQL
          </p>

          {/* Social Links */}
          <div className="mt-3 flex justify-center gap-5 text-xl text-indigo-600 dark:text-indigo-300">
            <a href="https://github.com/satyajeet91201" target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform">
              <FaGithub />
            </a>
            <a href="https://in.linkedin.com/in/praphulla-lokhande-6b0806213" target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform">
              <FaLinkedin />
            </a>
            <a href="mailto:praphullakumarlokhande9@gmail.com" className="hover:scale-110 transition-transform">
              <FaEnvelope />
            </a>
          </div>

          {/* Contact Info */}
          <div className="mt-3 text-sm text-gray-600 dark:text-gray-300 text-center">
            <p>📞 <span className="font-medium">7666980197</span>, <span className="font-medium">7977709649</span></p>
            <p>
              ✉️ <a href="mailto:praphullakumarlokhande9@gmail.com" className="underline pr-2">praphullakumarlokhande9@gmail.com</a>
              <a href="mailto:praphullakumar.l@rilc.com" className="underline">praphullakumar.l@ril.com</a>
            </p>
          </div>
        </div>

        {/* Education & Experience */}
        <div className="w-full max-w-4xl mb-12 px-2">
          <h2 className="text-2xl font-semibold text-center mb-6">EDUCATION & EXPERIENCE</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[{
              title: 'Education',
              items: [
                'M.E. Computer Engineering - Pune University - 9.02 CGPA',
                'B.E. - Sinhagad Academy of Engineering - 8.8 CGPA',
              ],
            }, {
              title: 'Work Experience',
              items: [
                'Assistant Manager – Jio Platforms (Jan 2024 – Present)',
                'Web Dev Intern – Twowaits Tech Ltd (Jan 2023 – Mar 2023)',
              ],
            }].map((section, i) => (
              <div key={i} className="bg-white dark:bg-gray-700 p-5 rounded-xl shadow-md transition-transform hover:scale-[1.02]">
                <h3 className="text-lg font-semibold text-indigo-700 dark:text-indigo-200 mb-2">{section.title}</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-200">
                  {section.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="w-full max-w-4xl text-center mb-12 px-2">
          <h2 className="text-2xl font-semibold mb-6">SKILLS</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[
              'React.js', 'Node.js',' SpringBoot','Java', 'Express', 'MongoDB',
              'Tailwind CSS', 'Redux', 'Git/GitHub', 'JWT',
              'API Integration', 'TypeScript',
            ].map((skill, index) => (
              <span
                key={index}
                className="bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded-full shadow hover:shadow-lg transition-transform duration-300 hover:scale-105"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div className="w-full max-w-4xl text-center mb-12 px-2">
          <h2 className="text-2xl font-semibold mb-6">PROJECTS</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
            {[
  {
    title: 'Filter Object Fields Utility (Open Source Contribution)',
    desc: [
      'Reusable Node.js utility to filter objects based on allowed fields.',
      'Designed for clean API request validation in Express apps.',
      'Lightweight and easy to integrate across multiple routes/controllers.',
    ],
    github: 'https://github.com/satyajeet91201/Filter-Object-Fields.',
    demo: null,
  },
  {
    title: 'Smart Restaurant Manager',
    desc: [
      'Facial recognition-based food suggestion system.',
      'Uses computer vision and AI models to recommend dishes.',
      'Built with React, Flask, and OpenCV integration.',
    ],
    github: 'https://github.com/satyajeet91201/SRM-Final',
    demo: 'https://smart-resturant-manager.netlify.app/',
  },
  {
    title: 'Flavaro – Food Ordering App',
    desc: [
      'Responsive UI for food ordering using React + Redux.',
      'Features cart functionality and product filters.',
      'Focus on state management and clean UX.',
    ],
    github: null,
    demo: 'https://flavaro-gamma.vercel.app/',
  },
  {
    title: 'Stock Forecasting App',
    desc: [
      'AI-powered stock prediction using TensorFlow.js.',
      'Visualizes trends and stock prices dynamically.',
      'React frontend with real-time chart updates.',
    ],
    github: 'https://github.com/satyajeet91201/BLOG_CV2',
    demo: 'https://v0-finnhub-stock-predictor.vercel.app/',
  },
  {
    title: 'Blog & Profile Application',
    desc: [
      'Full-stack blog CMS with MERN stack.',
      'Authentication, CRUD functionality, and image uploads.',
      'Responsive UI and secure route protection.',
    ],
    github: 'https://github.com/satyajeet91201/BLOG_CV',
    demo: 'https://saty-writes.vercel.app/',
  },
].map((project, index) => (
  <div key={index} className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg dark:shadow-white/10 hover:shadow-xl transition-all">
    <h3 className="text-lg font-bold text-indigo-700 dark:text-white mb-2">{project.title}</h3>
    <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1 mb-2">
      {project.desc.map((line, i) => (
        <li key={i}>{line}</li>
      ))}
    </ul>
    <div className="text-sm mt-2 space-x-4">
      {project.github && (
        <a href={project.github} target="_blank" rel="noreferrer" className="text-indigo-500 underline">
          GitHub →
        </a>
      )}
      {project.demo && (
        <a href={project.demo} target="_blank" rel="noreferrer" className="text-green-500 underline">
          Demo →
        </a>
      )}
    </div>
  </div>
))}

          </div>
        </div>

        {/* Resume Button */}
        <a
          href="/Praphullakumar-Lokhande-CV.docx"
          download
          className="mt-4 border border-gray-500  dark:border-white rounded-full px-8 py-2.5 font-semibold hover:bg-gray-300 dark:hover:bg-gray-700 transition-all"
        >
          📄 Download My Resume
        </a>
      </div>
    </>
  );
};

export default Content2;
