import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdaptiveFeedbackForm() {
  const [weightChange, setWeightChange] = useState('');
  const navigate = useNavigate();
  const [data, setData] = useState(null);


   const templateData = {
    age: 30,
    gender: "male",
    height: 175,
    weight: 72,
    activity_level: "moderately_active",
    weight_goal: "loss",
    dietary_pref: "all",
    allergies: ["none"],
    target_calories: 2100,
    weight_change: -0.8,
    weeks_elapsed: 2,
    user_id: 1,
  };

  const [newData, setNewData] = useState(templateData);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/userdetails`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res.data);

        const backendData = res.data?.[0] || {}; // if array, take first item

        // merge backend values into template, preserving weight_change, weeks_elapsed, user_id
        const merged = {
          ...templateData,
          ...Object.fromEntries(
            Object.keys(templateData)
              .filter((key) => key in backendData)
              .map((key) => [key, backendData[key]])
          ),
        };

        setData(backendData);
        setNewData(merged);

        console.log("Merged newData:", merged);
      })
      .catch((err) => console.log(err));
  }, []);

 const [meals, setmeals] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

      let changedWeight = Number(weightChange) - newData.weight;
      let weight = Number(weightChange);

    const payload = {
      ...newData,
      weight_change: changedWeight
    };


 try {
    const res1 = await axios.post(`${import.meta.env.VITE_API_URL_API}/feedback`, payload);

    if (res1.status === 400) {
      console.log("No suitable plan could be generated");
      return;
    }

    const data = res1.data;
    setmeals(data);

    // ✅ compute mealresponse *here* from `data` not from `response`
const mealresponse =
  data?.updated_meal_plan
    ? Object.keys(data.updated_meal_plan).map((dayKey, index) => {
        const dayData = data.updated_meal_plan[dayKey];
        return {
          day: index + 1,
          meals: {
            breakfast: JSON.stringify(dayData.breakfast || {}),
            lunch: JSON.stringify(dayData.lunch || {}),
            snacks: JSON.stringify(dayData.snack || {}),
            dinner: JSON.stringify(dayData.dinner || {}),
          },
        };
      })
    : [];

console.log(mealresponse);


    await axios.put(
      `${import.meta.env.VITE_API_URL}/newmealplan`,
      { mealresponse },
      { withCredentials: true }
    );


    await axios.put(
      `${import.meta.env.VITE_API_URL}/updateweight`,
      { weight },
      { withCredentials: true }
    );

    navigate("/meals");

  } catch (err) {
    console.log(err);
  }

  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">
          Changed Weight
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
            Submit Weight
          </button>
        </form>
      </div>
    </div>
  );
}
