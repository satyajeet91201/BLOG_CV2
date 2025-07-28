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
import ttsRoutes from './routes/ttsRoutes.js'; // ✅ Import TTS routes
import path from "path";
import AppError from "./utils/appError.js";
import globalErrorHandling from "./utils/globalErrorHandlinfMiddleware.js";

const __dirname = path.resolve();

const app = express();
const port = process.env.PORT || 7000;
connectDb();

app.use(cors({
  origin: [
    'https://blog-cv2-frontt.vercel.app',
    'https://satyawrites.netlify.app',
    'https://saty-writes.vercel.app',
    'http://localhost:5175',
    'http://localhost:5173',
    'http://localhost:5174',
    'https://blog-cv2-frontt-git-main-praphullakumar-lokhandes-projects.vercel.app'
  ],
  credentials: true
}));

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// ✅ Serve generated TTS audio files statically
app.use('/tts', express.static(path.join(process.cwd(), 'public/tts')));

app.use(cookieParser());
app.use(express.json()); // ✅ Required for parsing JSON body

app.get('/', (req, res) => {
  res.send('App Working Properly');
  console.log(req.url);
});

app.use('/api/blogs', blogRouter);
app.use('/', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/email', emailRouter);
app.use('/api/email/otp', otpRouter);
app.use('/api/tts', ttsRoutes); // ✅ Use TTS route

app.use((req, res , next) => {
  // const err = new Error(`Cannot find the requested URl : ${req.originalUrl} on this server !`);
  // err.status = "Fail";
  // err.statusCode = 405;
  next( new AppError(`Cannot find the requested URl : ${req.originalUrl} on this server !`,404));
   
});

app.use(globalErrorHandling);


app.listen(port, () => {
  console.log(`Server started on Port: ${port}`);
});
