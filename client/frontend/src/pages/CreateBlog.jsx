import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { AppContent } from '../context/AppContext';

const CreateBlog = () => {
  const { backendUrl } = useContext(AppContent);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [thumbnail, setThumbnail] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
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
      data.append('thumbnail', thumbnail);
    } else if (imageUrl) {
      data.append('imageUrl', imageUrl);
    }

    if (youtubeUrl.trim()) {
      data.append('youtubeUrl', youtubeUrl.trim());
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

  // Optional helper: extract video ID
  const getYouTubeVideoId = (url) => {
    const regExp = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^\s&]+)/;
    const match = url.match(regExp);
    return match && match[1] ? match[1] : null;
  };

  const videoId = getYouTubeVideoId(youtubeUrl);

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
              setImageUrl('');
            }}
            className="border px-4 py-2 rounded bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />

          {/* OR Image Link */}
          <input
            type="text"
            placeholder="Or paste image URL here"
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value);
              setThumbnail(null);
            }}
            className="border px-4 py-2 rounded bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />

          {/* YouTube Video URL */}
          <input
            type="text"
            placeholder="Paste YouTube video URL here"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
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

          {/* YouTube Video Preview */}
          {videoId && (
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube Video Preview"
                className="w-full h-64 rounded border border-gray-300 dark:border-gray-600"
                allowFullScreen
              ></iframe>
            </div>
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
