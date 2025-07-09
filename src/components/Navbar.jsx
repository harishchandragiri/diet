import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userContext } from '../App';
import axios from 'axios';

function Navbar() {
  const { user, setUser } = useContext(userContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    axios.get(`${import.meta.env.VITE_API_URL}/logout`, { withCredentials: true })
      .then(res => {
        if (res.data === 'Success') {
          setUser(null); // Clear user context
          navigate('/'); // Navigate to home
        }
      })
      .catch(err => console.log(err));

  };

  return (
    <div className='flex justify-between items-center h-[10vh] w-full bg-[#60ed5edc]'>
      <div>
        <h1 className="text-xl md:text-3xl sm:text-2xl font-bold my-3 mx-5 md:mx-7 md:my-5 text-blue-500">Diet Plan</h1>
      </div>
     {
           (user && user.username) &&
      <div>
        <ul className='flex justify-center'>
          <li className='my-3 mx-3 md:my-5 md:mx-7 hover:bg-blue-300 text-[20px] rounded-[5px] px-1 cursor-pointer font-semibold text-black'>
            <Link to='/meals'>Meals</Link>
          </li>
            <li className='my-3 mx-3 md:my-5 md:mx-7 hover:bg-blue-300 text-[20px] rounded-[5px] px-1 cursor-pointer font-semibold text-black'>
              <Link to='/feedback'>Feedback</Link>
            </li>
        </ul>
      </div>
     }

      {
        (user && user.username) ? (
          <div className="flex items-center gap-3">
            <div className="font-semibold cursor-pointer hover:bg-blue-300 text-[20px] rounded-[5px] px-1 mx-5 my-3 md:mx-7 text-blue-600 md:my-5">
              <input type="button" onClick={handleLogout} value="Logout" />
            </div>
          </div>
        ) : (
          <div className="font-semibold cursor-pointer hover:bg-blue-300 text-[20px] rounded-[5px] px-1 mx-5 my-3 md:mx-7 text-blue-600 md:my-5">
            <Link to="/register">Register</Link>
          </div>
        )
      }
    </div>
  );
}

export default Navbar;
