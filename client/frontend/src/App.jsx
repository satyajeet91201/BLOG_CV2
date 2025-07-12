import React from 'react'
import { Route , Routes} from 'react-router-dom';
import Login from './pages/Login';
import EmailVerify from './pages/EmailVerify';
import Home from './pages/Home';
import ResetPassword from './pages/ResetPassword';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Content2 from './pages/Content2';
import ProtectedRoute from './components/ProtectedRoute';
import Unauthorized from './pages/Unauthorized';
import Blogs from './pages/Blogs';
import CreateBlog from './pages/CreateBlog';
import SingleBlog from './pages/SingleBlog';

const App = () => {
  return (
    <>
    <div>
      <ToastContainer/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/email-verify' element={<EmailVerify/>}/>
        <Route path='/reset-password' element={<ResetPassword/>}/>
        <Route path='/unauthorized' element={<Unauthorized/>}/>
        <Route path='/resume' element={<Content2/>}/>
    <Route path="/blog/:id" element={<SingleBlog />} />
    <Route path="/blogs" element={
    <ProtectedRoute>
      <Blogs />
    </ProtectedRoute>
  } />
  <Route path="/create-blog" element={
  <ProtectedRoute>
    <CreateBlog/>
  </ProtectedRoute>
} />
<Route path="/blog/:id" element={
  <ProtectedRoute>
    <SingleBlog/>
  </ProtectedRoute>
} />

      </Routes>
    </div>
    
    </>
  )
}

export default App