import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subtitle: String,
  description: String,
  category: String,
  isPublished: {
    type: Boolean,
    default: false,
  },
  thumbnail: {
  type: String,
  required: false, // or true if thumbnail is mandatory
},
youtubeUrl:{
      type: String,
  required: false, 
},
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
}, { timestamps: true });

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;