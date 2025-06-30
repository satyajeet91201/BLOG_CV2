export default SingleBlog;          import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const CreateBlog = () => {
  const [formData, setFormData] = useState({ title: '', description: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://blog-cv-2.vercel.app/api/blogs/create", formData, {
        withCredentials: true,
      });
      navigate('/blogs');
    } catch (err) {
      console.error("Blog creation failed", err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-xl mx-auto mt-20 p-4 pt-10 text-gray-800 dark:text-white">
        <h2 className="text-2xl font-bold mb-4">Create a New Blog</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="title"
            type="text"
            placeholder="Blog Title"
            className="border px-4 py-2 rounded bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Blog Description"
            className="border px-4 py-2 rounded bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            rows="5"
            value={formData.description}
            onChange={handleChange}
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Publish
          </button>
        </form>
      </div>
    </>
  );
};
