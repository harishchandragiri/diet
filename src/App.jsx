import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createContext, useState, useEffect } from 'react'
import axios from 'axios';
import { Suspense, lazy } from "react";
import Loading from "./components/Loading";
import Navbar from "./components/Navbar";

const FormPage = lazy(() => import("./components/FormPage"));
const MealsPage = lazy(() => import("./components/MealsPage"));
const AdaptiveFeedbackForm = lazy(() => import("./components/AdaptiveFeedbackForm"));
const ActivityLevel = lazy(() => import("./components/ActivityLevel"));
const Login = lazy(() => import("./components/Login"));
const Register = lazy(() => import("./components/Register"));

export const userContext = createContext();

function App() {

  const [user, setUser] = useState(null);      //For login and changing the login/logout in navbar (used)
  const [values, setValues] = useState({})  // For values 
  const [value, setValue] = useState(null)  // For values 
  const [arr, setArr] = useState([])  // For array values
  const [activity, setActivity] = useState(null)  // For activity values inter-changing  (used)

    useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/`, { withCredentials: true })
      .then(res => {
        // since backend sends { email, username }
        setUser({
          email: res.data.email,
          username: res.data.username
        });
      })
      .catch(() => {
        setUser(null);
      });
  }, []);

  return (
   <userContext.Provider value={{user, setUser, values, setValues, value, setValue, arr, setArr, activity, setActivity}}>
    <Router>
      <Navbar/>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* route define */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/activity" element={<ActivityLevel />} />
          <Route path="/userdetails" element={<FormPage />} />
          <Route path="/meals" element={<MealsPage />} />
          <Route path="/feedback" element={<AdaptiveFeedbackForm />} />
        </Routes>
      </Suspense>
    </Router>
  </userContext.Provider>
  );

}

export default App;
