import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDb from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import emailRouter from "./routes/emailRoutes.js";
import userRouter from "./routes/userRoutes.js";
import otpRouter from "./routes/otpRoutes.js";
import blogRouter from "./routes/blogRoutes.js";
import path from "path";

const __dirname = path.resolve();

const app = express();
const port = process.env.PORT || 7000;
connectDb();

app.use(cors({
  origin: [
    'https://blog-cv2-frontt.vercel.app',
    'https://satyawrites.netlify.app',
    'https://saty-writes.vercel.app',
     'http://localhost:5173',
    'https://blog-cv2-frontt-git-main-praphullakumar-lokhandes-projects.vercel.app'
  ],
  credentials: true
}));

//here we go
// Serve uploaded images statically
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use(cookieParser());
// app.use(cors({ credentials: true })); // ✅ Works for cookies.
app.use(express.json()); // ✅ Required for parsing JSON body


app.get('/', (req, res) => {
    res.send('App Working Properly');
    console.log(req.url);
});

app.use('/api/blogs', blogRouter);
app.use('/',userRouter);
app.use('/api/auth', authRouter); // ✅ Route registration
app.use('/api/email', emailRouter);
app.use('/api/email/otp', otpRouter);

app.listen(port, () => {
    console.log(`Server started on Port: ${port}`);
});