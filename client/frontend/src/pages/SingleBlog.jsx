import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContent } from '../context/AppContext'; // Make sure this path is correct
import { toast } from 'react-toastify'; // Ensure react-toastify is installed and configured
import Navbar from '../components/Navbar'; // Ensure this path is correct

const SingleBlog = () => {
  const { id } = useParams(); // Gets the blog ID from the URL parameters
  const navigate = useNavigate(); // Hook for navigation
  const { backendUrl, userData } = useContext(AppContent); // Access backend URL and user data from global context

  // State variables for blog data, comments, and loading status
  const [blog, setBlog] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  // State variables for editing functionality
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");

  // --- NEW STATE FOR LIKES ---
  // hasLiked: true if the current user has liked the blog, false otherwise
  const [hasLiked, setHasLiked] = useState(false);
  // likesCount: the total number of likes for the blog
  const [likesCount, setLikesCount] = useState(0);
  // --- END NEW STATE ---

  const getYouTubeVideoId = (url) => {
    const regExp = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^\s&]+)/;
    const match = url?.match(regExp);
    return match && match[1] ? match[1] : null;
  };


  /**
   * Fetches the blog data from the backend.
   * This function is crucial for:
   * 1. Initial loading of blog content.
   * 2. Re-synchronizing the frontend state (likes, comments) with backend data
   * after actions like adding a comment or on page reload/re-navigation.
   * 3. Initializing the `hasLiked` and `likesCount` states based on the backend data.
   */
  const fetchBlog = async () => {
    try {
      setLoading(true); // Set loading to true before fetching
      const res = await axios.get(`${backendUrl}/api/blogs/${id}`, {
        withCredentials: true, // Important for sending HTTP-only cookies (session/auth tokens)
      });
      const fetchedBlog = res.data.blog;
      setBlog(fetchedBlog); // Update the main blog state

      // **Initialize like state based on fetched data from the backend**
      // This part ensures persistence across reloads.
      // Check if userData exists and has an _id, and if that _id is present in the blog's likes array
      if (userData && userData._id && fetchedBlog.likes.includes(userData._id)) {
        setHasLiked(true);
      } else {
        setHasLiked(false);
      }
      setLikesCount(fetchedBlog.likes.length); // Update the total likes count

    } catch (err) {
      console.error("Failed to load blog:", err); // Log the actual error for debugging
      toast.error("Failed to load blog. It might not exist or be inaccessible.", { autoClose: 1000, position: "top-right", theme: "colored" });
      // Optionally, redirect if the blog isn't found
      // navigate('/');
    } finally {
      setLoading(false); // Ensure loading is false always, even on error
    }
  };

  // useEffect hook to call fetchBlog on component mount and whenever 'id' or 'userData' changes.
  // 'userData' is in the dependency array to ensure `hasLiked` is correctly initialized
  // if `userData` loads asynchronously after the initial component render (e.g., from AppContext).
  useEffect(() => {
    fetchBlog();
  }, [id, userData, backendUrl]); // Include backendUrl if it can change, otherwise it's constant

  /**
   * Handles the like/unlike functionality for the blog post.
   * Implements **optimistic UI updates** for an immediate user experience.
   */
  const handleLike = async () => {
    // --- IMPORTANT LOGIN CHECK ---
    // This is where the "Please log in" toast originates if userData is not correctly provided by AppContext.
    if (!userData || !userData._id) {
      toast.warn("Please log in to like this post.", { autoClose: 1000, position: "top-right", theme: "colored" });
      return;
    }
    // --- END LOGIN CHECK ---

    // **Optimistic UI Update:** Update the local state immediately for instant feedback
    const newHasLiked = !hasLiked; // Toggle the liked status
    // Adjust the likes count based on the new status
    const newLikesCount = newHasLiked ? likesCount + 1 : likesCount - 1;

    setHasLiked(newHasLiked);
    setLikesCount(newLikesCount);

    try {
      // Send the actual request to the backend to persist the like/unlike
      await axios.put(`${backendUrl}/api/blogs/like/${id}`, {}, { withCredentials: true });
      // If the request succeeds, the optimistic update holds.
      // No need to re-fetch the entire blog here as the local state is already updated.
      // The `useEffect` on future loads/navs will ensure ultimate consistency.
    } catch (err) {
      console.error("Failed to update like status on backend:", err); // Log the actual error
      toast.error("Failed to update like status. Please try again.", { autoClose: 1000, position: "top-right", theme: "colored" });
      // **Revert UI state if the backend request fails**
      // This ensures consistency if the server operation didn't go through
      setHasLiked(!newHasLiked); // Revert `hasLiked` to its state before the click
      setLikesCount(newHasLiked ? likesCount - 1 : likesCount + 1); // Revert `likesCount`
    }
  };

  /**
   * Handles submitting a new comment.
   */
  const handleComment = async () => {
    if (!newComment.trim()) {
      toast.info("Comment cannot be empty.",);
      return;
    }
    // --- IMPORTANT LOGIN CHECK ---
    if (!userData || !userData._id) {
      toast.warn("Please log in to comment.", { autoClose: 1000, position: "top-right", theme: "colored" });
      return;
    }
    // --- END LOGIN CHECK ---

    try {
      await axios.post(
        `${backendUrl}/api/blogs/comment/${id}`,
        { content: newComment },
        { withCredentials: true }
      );
      toast.success("Successfully added the comment!", { autoClose: 1000, position: "top-right", theme: "colored" });
      setNewComment(""); // Clear the input field
      fetchBlog(); // Re-fetch the blog to display the newly added comment
    } catch (err) {
      console.error("Failed to add comment:", err);
      toast.error("Failed to add comment.", { autoClose: 1000, position: "top-right", theme: "colored" });
    }
  };

  /**
   * Enters editing mode for the blog post.
   * Initializes editing states with current blog data.
   */
  const startEditing = () => {
    if (blog) { // Ensure blog data is loaded
      setEditedTitle(blog.title);
      setEditedDescription(blog.description);
      setIsEditing(true);
    }
  };

  /**
   * Exits editing mode without saving changes.
   */
  const cancelEditing = () => {
    setIsEditing(false);
    setEditedTitle("");
    setEditedDescription("");
  };

  /**
   * Saves the edited blog post to the backend.
   */
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
        fetchBlog(); // Re-fetch to display the updated content
      }
    } catch (err) {
      console.error("Failed to update blog:", err);
      toast.error("Failed to update blog.", { autoClose: 1000, position: "top-right", theme: "colored" });
    }
  };

  /**
   * Handles deleting the blog post.
   */
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this blog post? This action cannot be undone.")) {
      try {
        const res = await axios.delete(`${backendUrl}/api/blogs/${id}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          toast.success("Blog deleted successfully!", { autoClose: 1000, position: "top-right", theme: "colored" });
          navigate('/'); // Redirect to the homepage after deletion
        }
      } catch (err) {
        console.error("Failed to delete blog:", err);
        toast.error("Failed to delete blog.", { autoClose: 1000, position: "top-right", theme: "colored" });
      }
    }
  };

  // --- Render Logic ---

  // Show loading indicator while fetching data
  if (loading) {
    return (
      <div className="mt-32 text-center text-lg text-gray-700 dark:text-gray-300">
        Loading blog post...
      </div>
    );
  }

  // Show message if blog data is not found after loading
  if (!blog) {
    return (
      <div className="mt-32 text-center text-lg text-red-500">
        Blog post not found.
      </div>
    );
  }

  return (
    <>
      <Navbar /> {/* Your Navbar component */}
      <div className="max-w-3xl mx-auto mt-28 px-4 text-gray-800 dark:text-white transition-colors duration-300">

        {/* Edit/Delete Buttons (visible only for admin and not in editing mode) */}
        {(userData?.role === "admin" || userData?.role === "main-admin")  && !isEditing && (
          <div className="mb-4 flex gap-3 justify-end">
            <button
              onClick={startEditing}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
            >
              ✏️ Edit
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              🗑️ Delete
            </button>
          </div>
        )}
        {blog.thumbnail && (
  <img
  src={
    blog.thumbnail.startsWith('http')
      ? blog.thumbnail
      : `${backendUrl}/uploads/${blog.thumbnail}`
  }
  alt="thumbnail"
  className="w-[96%] max-h-[350px] object-contain rounded-2xl bg-gray-600 shadow-md mb-7 mx-auto"
/>

)}
        {/* Blog Content Display or Edit Form */}
        {isEditing ? (
          <>
            {/* Title Input for Editing */}
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="text-3xl font-bold mb-2 w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Blog Title"
            />
            {/* Description Textarea for Editing */}
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="w-full h-40 p-2 border border-gray-300 rounded dark:bg-gray-800 dark:text-white mb-4 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Blog Description"
            />
            {/* Save/Cancel Buttons for Editing */}
            <div className="flex gap-3 mb-6">
              <button onClick={saveChanges} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">💾 Save Changes</button>
              <button onClick={cancelEditing} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition">❌ Cancel</button>
            </div>
          </>
        ) : (
          <>
            {/* Display Blog Title */}
            <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>
            {/* Display Author and Date */}
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              By {blog.author?.name || 'Unknown'} on {new Date(blog.createdAt).toLocaleDateString()}
            </p>
            {/* Display Blog Description */}
            <p className="mb-6 leading-relaxed whitespace-pre-wrap">{blog.description}</p>
          </>
        )}

        {/* Like Button Section */}
        <div className="mb-8">
          <button
            onClick={handleLike}
            // Dynamically apply Tailwind CSS classes based on `hasLiked` state
            className={`px-6 py-3 rounded-full flex items-center gap-2 font-semibold transition-colors duration-300
                       ${hasLiked ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-500 hover:bg-gray-600'}
                       text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${hasLiked ? 'focus:ring-red-500' : 'focus:ring-gray-400'}`}
          >
            <span className="text-xl">❤️</span> {likesCount} Like{likesCount !== 1 ? 's' : ''}
          </button>
        </div>
            {/* YouTube Video Embed */}
        {blog.youtubeUrl && getYouTubeVideoId(blog.youtubeUrl) && (
          <div className="mb-6">
            <iframe
              className="w-[96%] h-[300px] object-contain rounded-2xl bg-gray-100 shadow-md mb-7 mx-auto"
              src={`https://www.youtube.com/embed/${getYouTubeVideoId(blog.youtubeUrl)}`}
              title="YouTube video"
              allowFullScreen
            ></iframe>
          </div>
        )}
        {/* Comments Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">Comments ({blog.comments.length})</h2>

          {/* Add Comment Input Area */}
          <div className="mb-6">
            <textarea
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 dark:text-white mb-3 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add your comment..."
              rows="4"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            ></textarea>
            <button
              onClick={handleComment}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition font-medium"
            >
              Submit Comment
            </button>
          </div>
          {/* Comment List */}
          <div className="space-y-4">
            {blog.comments.length > 0 ? (
              blog.comments.map((c, i) => (
                <div
                  key={c._id || i} // Good: using comment _id for key
                  className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  {/* Access the comment content */}
                  {/* Changed c.user?.name to c.userId?.name */}
                  <p className="font-semibold text-base mb-1">{c.userId?.name || 'Anonymous User'}:</p>
                  <p className="text-gray-700 dark:text-gray-300 mb-2 whitespace-pre-wrap">{c.content}</p> {/* This will now contain the comment text */}
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