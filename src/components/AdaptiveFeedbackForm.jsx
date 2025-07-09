import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdaptiveFeedbackForm() {
  const [weightChange, setWeightChange] = useState("");
  const navigate = useNavigate();
  const [data, setData] = useState();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/userdetails`, { withCredentials: true })
      .then(res => {
        setData(res.data);
      })
      .catch((err) => 
        console.log(err)
      );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      user_id: 1,
      user_profile: { bmr: 0 },
      feedback: {
        weight_change: Number(weightChange) || 0,
        weeks_elapsed: 0,
        satisfaction_score: 0,
      },
    };

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/feedback`, payload);
      // navigate("/meals");
    } catch (err) {
      console.error(err);
    }

     navigate("/meals");

  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">
          Adaptive Feedback
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="number"
            placeholder="Current Weight"
            min="0"
            required
            value={weightChange}
            onChange={(e) => setWeightChange(e.target.value)}
            className="p-2 border rounded w-full"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
          >
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
}
