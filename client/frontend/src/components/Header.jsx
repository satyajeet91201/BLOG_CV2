import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { AppContent } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { userData } = useContext(AppContent);
  const navigate = useNavigate();
  const [showFullText, setShowFullText] = useState(false);

  const introText = `Welcome to my little corner of the internet! In a world buzzing with fleeting posts and endless scrolls, I wanted to create something a bit more… old school.`;
  
  const fullText = `This isn't about likes or algorithms; it's a space deeply personal, where I share thoughts, feelings, and the stories that truly matter to me. Consider this an open book for those who know me best, and for anyone curious to understand the person behind the screens. I pour my heart into these words, and I hope you find a piece of yourself, or a new perspective, within them. Thanks for stopping by.`;

  return (
    <div className="flex flex-col items-center mt-20 px-4 text-center text-gray-800 dark:text-white pt-5">
      <img
        src={assets.header_img}
        alt="Profile"
        className="w-36 h-36 rounded-full mb-6 border-4 border-gray-200 dark:border-gray-700"
      />

      <h1 className="flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2">
        Hey {userData ? userData.Name : 'Developer'}!
        <img className="w-8 aspect-square" src={assets.hand_wave} alt="Wave" />
      </h1>

      <h2 className="text-3xl sm:text-5xl font-semibold mb-4">
        Welcome to my space.
      </h2>

      <p className="mb-4 max-w-md">
        {introText}
        {!showFullText && <span className="text-blue-600 cursor-pointer ml-1" onClick={() => setShowFullText(true)}>Read more</span>}
        {showFullText && (
          <>
            {" "}{fullText}
            <span className="text-blue-600 cursor-pointer ml-1" onClick={() => setShowFullText(false)}>Show less</span>
          </>
        )}
      </p>

      <div className="flex flex-col gap-4">
        <button
          onClick={() => navigate('/blogs')}
          className="border border-gray-500 dark:border-white rounded-full px-8 py-2.5 hover:bg-gray-300 dark:hover:bg-gray-700 transition-all"
        >
          Blogs
        </button>

        <button
          onClick={() => navigate('/resume')}
          className="border border-gray-500 dark:border-white rounded-full px-8 py-2.5 hover:bg-gray-300 dark:hover:bg-gray-700 transition-all"
        >
          My Resume
        </button>
      </div>
    </div>
  );
};

export default Header;
