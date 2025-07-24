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
    const res = await axios.post(`${backendUrl}/api/tts`, {
      text: blog.description,
    });

    if (res.data.audioUrl) {
      const fullAudioUrl = `${backendUrl}${res.data.audioUrl}`;

      // Trigger download
      const link = document.createElement("a");
      link.href = fullAudioUrl;
      link.download = "blog-audio.mp3";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Audio generated and downloaded!", {
        autoClose: 1000,
        position: "top-right",
        theme: "colored",
      });
    } else {
      toast.error("Audio generation failed. No audio URL.");
    }
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
        {(userData?.role === "admin" || userData?.role === "main-admin")  && !isEditing && (
          <div className="mb-4 flex gap-3 justify-end">
            <button onClick={startEditing} className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition">✏️ Edit</button>
            <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">🗑️ Delete</button>
          </div>
        )}
        {blog.thumbnail && (
          <img
            src={blog.thumbnail.startsWith('http') ? blog.thumbnail : `${backendUrl}/uploads/${blog.thumbnail}`}
            alt="thumbnail"
            className="w-[96%] max-h-[350px] object-contain rounded-2xl bg-gray-600 shadow-md mb-7 mx-auto"
          />
        )}

        {isEditing ? (
          <>
            <input type="text" value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} className="text-3xl font-bold mb-2 w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Blog Title" />
            <textarea value={editedDescription} onChange={(e) => setEditedDescription(e.target.value)} className="w-full h-40 p-2 border border-gray-300 rounded dark:bg-gray-800 dark:text-white mb-4 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Blog Description" />
            <div className="flex gap-3 mb-6">
              <button onClick={saveChanges} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">💾 Save Changes</button>
              <button onClick={cancelEditing} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition">❌ Cancel</button>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">By {blog.author?.name || 'Unknown'} on {new Date(blog.createdAt).toLocaleDateString()}</p>
            <p className="mb-6 leading-relaxed whitespace-pre-wrap">{blog.description}</p>
            <button onClick={generateSpeech} disabled={isGeneratingAudio} className="mb-6 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
  {isGeneratingAudio ? '🔄 Generating Audio...' : '⬇️ Generate & Download Audio'}
</button>

          </>
        )}

        <div className="mb-8">
          <button onClick={handleLike} className={`px-6 py-3 rounded-full flex items-center gap-2 font-semibold transition-colors duration-300 ${hasLiked ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-500 hover:bg-gray-600'} text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${hasLiked ? 'focus:ring-red-500' : 'focus:ring-gray-400'}`}>
            <span className="text-xl">❤️</span> {likesCount} Like{likesCount !== 1 ? 's' : ''}
          </button>
        </div>

        {blog.youtubeUrl && getYouTubeVideoId(blog.youtubeUrl) && (
          <div className="mb-6">
            <iframe className="w-[96%] h-[300px] object-contain rounded-2xl bg-gray-100 shadow-md mb-7 mx-auto" src={`https://www.youtube.com/embed/${getYouTubeVideoId(blog.youtubeUrl)}`} title="YouTube video" allowFullScreen></iframe>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">Comments ({blog.comments.length})</h2>

          <div className="mb-6">
            <textarea className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 dark:text-white mb-3 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Add your comment..." rows="4" value={newComment} onChange={(e) => setNewComment(e.target.value)}></textarea>
            <button onClick={handleComment} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition font-medium">Submit Comment</button>
          </div>

          <div className="space-y-4">
            {blog.comments.length > 0 ? (
              blog.comments.map((c, i) => (
                <div key={c._id || i} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <p className="font-semibold text-base mb-1">{c.userId?.name || 'Anonymous User'}:</p>
                  <p className="text-gray-700 dark:text-gray-300 mb-2 whitespace-pre-wrap">{c.content}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(c.createdAt).toLocaleString()}</p>
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
