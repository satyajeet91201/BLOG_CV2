import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContent } from '../context/AppContext';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';

const SingleBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { backendUrl, userData } = useContext(AppContent);

  const [blog, setBlog] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");

  const [hasLiked, setHasLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioInstance, setAudioInstance] = useState(null);

  const getYouTubeVideoId = (url) => {
    const regExp = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^\s&]+)/;
    const match = url?.match(regExp);
    return match && match[1] ? match[1] : null;
  };

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backendUrl}/api/blogs/${id}`, {
        withCredentials: true,
      });
      const fetchedBlog = res.data.blog;
      setBlog(fetchedBlog);

      if (userData && userData._id && fetchedBlog.likes.includes(userData._id)) {
        setHasLiked(true);
      } else {
        setHasLiked(false);
      }
      setLikesCount(fetchedBlog.likes.length);

    } catch (err) {
      console.error("Failed to load blog:", err);
      toast.error("Failed to load blog. It might not exist or be inaccessible.", { autoClose: 1000, position: "top-right", theme: "colored" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [id, userData, backendUrl]);

  const handleLike = async () => {
    if (!userData || !userData._id) {
      toast.warn("Please log in to like this post.", { autoClose: 1000, position: "top-right", theme: "colored" });
      return;
    }

    const newHasLiked = !hasLiked;
    const newLikesCount = newHasLiked ? likesCount + 1 : likesCount - 1;

    setHasLiked(newHasLiked);
    setLikesCount(newLikesCount);

    try {
      await axios.put(`${backendUrl}/api/blogs/like/${id}`, {}, { withCredentials: true });
    } catch (err) {
      console.error("Failed to update like status on backend:", err);
      toast.error("Failed to update like status. Please try again.", { autoClose: 1000, position: "top-right", theme: "colored" });
      setHasLiked(!newHasLiked);
      setLikesCount(newHasLiked ? likesCount - 1 : likesCount + 1);
    }
  };

  const handleComment = async () => {
    if (!newComment.trim()) {
      toast.info("Comment cannot be empty.");
      return;
    }
    if (!userData || !userData._id) {
      toast.warn("Please log in to comment.", { autoClose: 1000, position: "top-right", theme: "colored" });
      return;
    }

    try {
      await axios.post(
        `${backendUrl}/api/blogs/comment/${id}`,
        { content: newComment },
        { withCredentials: true }
      );
      toast.success("Successfully added the comment!", { autoClose: 1000, position: "top-right", theme: "colored" });
      setNewComment("");
      fetchBlog();
    } catch (err) {
      console.error("Failed to add comment:", err);
      toast.error("Failed to add comment.", { autoClose: 1000, position: "top-right", theme: "colored" });
    }
  };

  const startEditing = () => {
    if (blog) {
      setEditedTitle(blog.title);
      setEditedDescription(blog.description);
      setIsEditing(true);
    }
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditedTitle("");
    setEditedDescription("");
  };

  const saveChanges = async () => {
    if (!editedTitle.trim() || !editedDescription.trim()) {
      toast.warn("Title and description cannot be empty.");
      return;
    }
    try {
      const res = await axios.put(
        `${backendUrl}/api/blogs/edit/${id}`,
        {
          title: editedTitle,
          description: editedDescription,
        },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success("Blog updated successfully!", { autoClose: 1000, position: "top-right", theme: "colored" });
        setIsEditing(false);
        fetchBlog();
      }
    } catch (err) {
      console.error("Failed to update blog:", err);
      toast.error("Failed to update blog.", { autoClose: 1000, position: "top-right", theme: "colored" });
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this blog post? This action cannot be undone.")) {
      try {
        const res = await axios.delete(`${backendUrl}/api/blogs/${id}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          toast.success("Blog deleted successfully!", { autoClose: 1000, position: "top-right", theme: "colored" });
          navigate('/');
        }
      } catch (err) {
        console.error("Failed to delete blog:", err);
        toast.error("Failed to delete blog.", { autoClose: 1000, position: "top-right", theme: "colored" });
      }
    }
  };

 const generateSpeech = async () => {
  if (!blog || !blog.description || isGeneratingAudio) return;

  setIsGeneratingAudio(true);
  try {
    const response = await fetch(`${backendUrl}/api/tts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: blog.description })
    });

    if (!response.ok) {
      throw new Error('Failed to generate audio');
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'blog-audio.mp3';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("Audio generated and downloaded!", {
      autoClose: 1000,
      position: "top-right",
      theme: "colored",
    });
  } catch (err) {
    console.error("Failed to generate audio:", err);
    toast.error("Failed to generate audio");
  } finally {
    setIsGeneratingAudio(false);
  }
};



  if (loading) {
    return (
      <div className="mt-32 text-center text-lg text-gray-700 dark:text-gray-300">
        Loading blog post...
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="mt-32 text-center text-lg text-red-500">
        Blog post not found.
      </div>
    );
  }

  return (
    <>
  <Navbar />
  <div className="max-w-3xl mx-auto mt-28 px-4 text-gray-800 dark:text-white transition-colors duration-300">

    {/* Admin Controls */}
    {(userData?.role === "admin" || userData?.role === "main-admin") && !isEditing && (
      <div className="mb-6 flex gap-4 justify-end">
        <button
          onClick={startEditing}
          className="px-5 py-2.5 rounded-md text-white bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 shadow-sm transition-all"
        >
          ✏️ Edit
        </button>
        <button
          onClick={handleDelete}
          className="px-5 py-2.5 rounded-md text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-sm transition-all"
        >
          🗑️ Delete
        </button>
      </div>
    )}

    {/* Thumbnail */}
    {blog.thumbnail && (
      <img
        src={blog.thumbnail.startsWith("http") ? blog.thumbnail : `${backendUrl}/uploads/${blog.thumbnail}`}
        alt="Blog Thumbnail"
        className="w-full max-h-[350px] object-cover rounded-xl shadow-lg mb-8 border border-gray-200 dark:border-gray-700"
      />
    )}

    {/* Editing Mode */}
    {isEditing ? (
      <>
        <input
          type="text"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          className="text-3xl font-bold mb-4 w-full p-3 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="Blog Title"
        />
        <textarea
          value={editedDescription}
          onChange={(e) => setEditedDescription(e.target.value)}
          className="w-full h-40 p-3 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 mb-4 resize-y focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="Blog Description"
        />
        <div className="flex gap-4 mb-10">
          <button
            onClick={saveChanges}
            className="px-6 py-2.5 text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 font-semibold rounded-md shadow-md"
          >
            💾 Save Changes
          </button>
          <button
            onClick={cancelEditing}
            className="px-6 py-2.5 text-white bg-gray-600 hover:bg-gray-700 font-semibold rounded-md shadow-sm"
          >
            ❌ Cancel
          </button>
        </div>
      </>
    ) : (
      <>
        <h1 className="text-4xl font-extrabold mb-3 leading-tight">{blog.title}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          By <span className="font-medium">{blog.author?.name || "Unknown"}</span> on{" "}
          {new Date(blog.createdAt).toLocaleDateString()}
        </p>
        <p className="mb-10 leading-relaxed text-[1.05rem] tracking-wide whitespace-pre-wrap">{blog.description}</p>

        <button
          onClick={generateSpeech}
          disabled={isGeneratingAudio}
          className={`mb-10 px-6 py-3 font-medium rounded-md shadow-md transition-all ${
            isGeneratingAudio
              ? "bg-indigo-300 cursor-not-allowed text-white"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
        >
          {isGeneratingAudio ? "🔄 Generating Audio..." : "⬇️ Generate & Download Audio"}
        </button>
      </>
    )}

    {/* Like Button */}
    <div className="mb-10">
      <button
        onClick={handleLike}
        className={`px-6 py-3 rounded-full flex items-center gap-2 font-semibold shadow transition-all ${
          hasLiked
            ? "bg-red-600 hover:bg-red-700 text-white"
            : "bg-gray-600 hover:bg-gray-700 text-white"
        }`}
      >
        ❤️ {likesCount} Like{likesCount !== 1 ? "s" : ""}
      </button>
    </div>

    {/* YouTube Embed */}
    {blog.youtubeUrl && getYouTubeVideoId(blog.youtubeUrl) && (
      <div className="mb-10">
        <iframe
          className="w-full h-[320px] object-contain rounded-xl shadow-lg"
          src={`https://www.youtube.com/embed/${getYouTubeVideoId(blog.youtubeUrl)}`}
          title="YouTube video"
          allowFullScreen
        ></iframe>
      </div>
    )}

    {/* Comments */}
    <div className="mt-12">
      <h2 className="text-2xl font-semibold mb-5 border-b pb-2 border-gray-200 dark:border-gray-700">
        💬 Comments ({blog.comments.length})
      </h2>

      {/* Add New Comment */}
      <div className="mb-6">
        <textarea
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 mb-3 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Add your comment..."
          rows="4"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        ></textarea>
        <button
          onClick={handleComment}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition font-medium shadow"
        >
          Submit Comment
        </button>
      </div>

      {/* Render Comments */}
      <div className="space-y-5">
        {blog.comments.length > 0 ? (
          blog.comments.map((c, i) => (
            <div
              key={c._id || i}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm transition-all hover:shadow-md"
            >
              <p className="font-semibold text-base mb-1">{c.userId?.name || "Anonymous User"}:</p>
              <p className="text-gray-700 dark:text-gray-300 mb-2 whitespace-pre-wrap">{c.content}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(c.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  </div>
</>
  );
};

export default SingleBlog;
