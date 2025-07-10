import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { userContext } from '../App';

function FormPage() {
  const { activity } = useContext(userContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    height: "",
    weight: "",
    // activity_level: "moderately_active",
    activity_level: activity,
    weight_goal: "",
    dietary_pref: "all",
    allergies: ["none"],
  });



  const newData = {
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
  user_id: 1
};




  const [selectedAllergy, setSelectedAllergy] = useState("");
  const [response, setResponse] = useState();
  // const [calories, setCalories] = useState();
  const [error, setError] = useState("");

  const profile = {
    ...formData,
    age: Number(formData.age),
    height: Number(formData.height),
    weight: Number(formData.weight)
  };

  const activityLevels = [
    { value: "sedentary", label: "Sedentary" },
    { value: "lightly_active", label: "Lightly active" },
    { value: "moderately_active", label: "Moderately active" },
    { value: "very_active", label: "Very active" },
  ];

  const goals = [
    { value: "loss", label: "Weight loss" },
    { value: "gain", label: "Weight gain" },
    { value: "maintain", label: "Maintain weight" },
  ];

  const allergiesOptions = ["gluten", "nuts", "dairy"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleAllergySelect = (e) => {
    const value = e.target.value;
    if (!value) return;

    setFormData((prev) => {
      const current = prev.allergies.filter((a) => a !== "none");
      if (!current.includes(value)) {
        return {
          ...prev,
          allergies: [...current, value],
        };
      }
      return prev;
    });

    setSelectedAllergy("");
  };

  const removeAllergy = (allergyToRemove) => {
    setFormData((prev) => {
      const updated = prev.allergies.filter((a) => a !== allergyToRemove);
      return {
        ...prev,
        allergies: updated.length > 0 ? updated : ["none"],
      };
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const ageNum = Number(formData.age);
  if (isNaN(ageNum) || ageNum < 0 || ageNum > 100) {
    setError("Age must be between 0 and 100.");
    return;
  }

  try {
    const res1 = await axios.post(
      `${import.meta.env.VITE_API_URL_API}/recommend`,
      profile
    );

    if (res1.status === 400) {
      console.log("No suitable plan could be generated");
      return;
    }

    const data = res1.data;
    setResponse(data);

    const targetCalories =
      data?.nutrition_summary?.user_profile?.target_calories ?? 0;

    const profileData = {
      ...formData,
      target_calories: targetCalories,
      age: Number(formData.age),
      height: Number(formData.height),
      weight: Number(formData.weight),
    };

    await axios.post(
      `${import.meta.env.VITE_API_URL}/create`,
      { profileData },
      { withCredentials: true }
    );

    // ✅ compute mealresponse *here* from `data` not from `response`
    const mealresponse = data?.meal_plan
      ? Object.keys(data.meal_plan).map((dayKey, index) => {
          const dayData = data.meal_plan[dayKey];
          return {
            day: index + 1,
            meals: {
              breakfast: JSON.stringify(dayData.breakfast),
              lunch: JSON.stringify(dayData.lunch),
              snacks: JSON.stringify(dayData.snack),
              dinner: JSON.stringify(dayData.dinner),
            },
          };
        })
      : [];

    if (mealresponse.length === 0) {
      console.warn("No meal plan available, skipping meal plan submission.");
      return;
    }

    await axios.post(
      `${import.meta.env.VITE_API_URL}/mealplan`,
      { mealresponse },
      { withCredentials: true }
    );

    navigate("/meals");

  } catch (err) {
    console.log(err);
  }
};




//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const ageNum = Number(formData.age);
//     if (isNaN(ageNum) || ageNum < 0 || ageNum > 100) {
//       setError("Age must be between 0 and 100.");
//       return;
//     }


//     await axios.post(`${import.meta.env.VITE_API_URL_API}/recommend`, profile)
//   .then(async res => {
//     if (res.status === 400) {
//       console.log("No suitable plan could be generated");
//       return;
//     }

//     setResponse(res.data);

//     const targetCalories = res.data?.nutrition_summary?.user_profile?.target_calories ?? 0;

//     const profileData = {
//       ...formData,
//       target_calories: targetCalories,
//       age: Number(formData.age),
//       height: Number(formData.height),
//       weight: Number(formData.weight),
//     };

//     await axios.post(`${import.meta.env.VITE_API_URL}/create`, { profileData }, { withCredentials: true })
//       .then(res => {
//         if (res.status === 200) {
//           console.log("Profile created", res.status);
//         }
//       })
//       .catch(err => console.log(err));

//     // next steps…
//   })
//   .catch(err => console.log(err));



//     // // Test
//     //    await axios.post(`${import.meta.env.VITE_API_URL_API}/feedback`, newData)
//     //   .then(res => {
//     //     if (res.status === 400) {
//     //       console.log("No suitable plan could be generated");
//     //     }
//     //     setResponse(res.data);
//     //     console.log(res.data)
//     //   })
//     //   .catch(err => console.log(err));


// const mealresponse =
//   response?.meal_plan
//     ? Object.keys(response.meal_plan).map((dayKey, index) => {
//         const dayData = response.meal_plan[dayKey];
//         return {
//           day: index + 1,
//           meals: {
//             breakfast: JSON.stringify(dayData.breakfast),
//             lunch: JSON.stringify(dayData.lunch),
//             snacks: JSON.stringify(dayData.snack),
//             dinner: JSON.stringify(dayData.dinner),
//           },
//         };
//       })
//     : []; // empty array if no response yet


//       // Done

//     await axios.post(`${import.meta.env.VITE_API_URL}/mealplan`, { mealresponse }, { withCredentials: true })
//       .then(res => {
//         if (res.status === 201) {
//           navigate("/meals");
//         }
//       })
//       .catch(err => console.log(err));
//   };

  return (
    <div className="max-w-xl mx-auto mt-5 p-6 bg-green-200 shadow rounded">
      <h1 className="text-2xl font-bold mb-4 text-center">User Profile</h1>
      {response && response.meal_plan && (
  <div>
    Meal plan: {JSON.stringify(response.nutrition_summary.user_profile.target_calories)}
    {/* Meal plan: {JSON.stringify(response.updated_meal_plan.day_1.breakfast.name)} */}
  </div>
)}

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-red-500">{error}</div>}

        {/* Age */}
        <div>
          <label className="block mb-1">Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            min="15"
            max="100"
            required
            className="w-full border rounded p-2"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block mb-1">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="others">Others</option>
          </select>
        </div>

        {/* Height */}
        <div>
          <label className="block mb-1">Height (cm)</label>
          <input
            type="number"
            name="height"
            value={formData.height}
            onChange={handleChange}
            min="60"
            max="311"
            required
            className="w-full border rounded p-2"
          />
        </div>

        {/* Weight */}
        <div>
          <label className="block mb-1">Weight (kg)</label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            min="20"
            max="551"
            required
            className="w-full border rounded p-2"
          />
        </div>

        {/* Activity Level */}
        <div>
          <label className="block mb-1">Activity Level</label>
          <h2 className="text-pink-500">{activity}</h2>
        </div>

        {/* Goal */}
        <div>
          <label className="block mb-1">Goal</label>
          <select
            name="weight_goal"
            value={formData.weight_goal}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          >
            <option value="">Select goal</option>
            {goals.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
        </div>

        {/* Food Allergies Select */}
        <div>
          <label className="block mb-1">
            Food Allergies (keep as-is if none)
          </label>
          <select
            value={selectedAllergy}
            onChange={handleAllergySelect}
            className="w-full border rounded p-2"
          >
            <option value="">-- Select an allergy --</option>
            {allergiesOptions
              .filter((a) => !(formData.allergies || []).includes(a))
              .map((allergy) => (
                <option key={allergy} value={allergy}>
                  {allergy}
                </option>
              ))}
          </select>

          {/* Display Selected Allergies (hide 'none') */}
          <div className="mt-3 flex flex-wrap gap-2">
            {(formData.allergies || [])
              .filter((allergy) => allergy !== "none")
              .map((allergy) => (
                <div
                  key={allergy}
                  className="flex items-center bg-white border border-gray-400 px-2 py-1 rounded-full text-sm"
                >
                  {allergy}
                  <button
                    type="button"
                    onClick={() => removeAllergy(allergy)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white rounded p-2 hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default FormPage;
