import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { AppContent } from '../context/AppContext';

const CreateBlog = () => {
  const { backendUrl } = useContext(AppContent);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [thumbnail, setThumbnail] = useState(null); // local file
  const [imageUrl, setImageUrl] = useState(''); // URL input
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);

    if (thumbnail) {
      data.append('thumbnail', thumbnail); // priority to file
    } else if (imageUrl) {
      data.append('imageUrl', imageUrl); // for URL uploads (optional: handled in backend)
    }

    try {
      await axios.post(`${backendUrl}/api/blogs/create`, data, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/blogs');
    } catch (err) {
      console.error('Blog creation failed', err);
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
            rows="10"
            value={formData.description}
            onChange={handleChange}
          />

          {/* File Upload */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              setThumbnail(e.target.files[0]);
              setImageUrl(''); // clear image URL if file selected
            }}
            className="border px-4 py-2 rounded bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />

          {/* OR Link from URL */}
          <input
            type="text"
            placeholder="Or paste image URL here"
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value);
              setThumbnail(null); // clear file if URL entered
            }}
            className="border px-4 py-2 rounded bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />

          {/* Preview */}
          {(thumbnail || imageUrl) && (
            <img
              src={thumbnail ? URL.createObjectURL(thumbnail) : imageUrl}
              alt="Thumbnail Preview"
              className="w-full h-64 object-cover rounded border border-gray-300 dark:border-gray-600"
            />
          )}

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

export default CreateBlog;
