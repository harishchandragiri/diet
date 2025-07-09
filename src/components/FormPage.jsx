import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { userContext } from '../App';
import { useContext } from 'react';

function FormPage() {
  const { activity, setActivity } = useContext(userContext);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    age: "",
    gender: "male",
    height: "",
    weight: "",
    activity_level: activity,
    goal: "maintain",
    food_allergies: ["none"], // Default allergy is "none"
  });
  const [selectedAllergy, setSelectedAllergy] = useState("");
  const [error, setError] = useState("");

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
      const current = prev.food_allergies.filter((a) => a !== "none");
      if (!current.includes(value)) {
        return {
          ...prev,
          food_allergies: [...current, value],
        };
      }
      return prev;
    });

    setSelectedAllergy("none");
  };

  const removeAllergy = (allergyToRemove) => {
    setFormData((prev) => {
      const updated = prev.food_allergies.filter((a) => a !== allergyToRemove);
      return {
        ...prev,
        food_allergies: updated.length > 0 ? updated : ["none"],
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const ageNum = Number(formData.age);
    if (isNaN(ageNum) || ageNum < 0 || ageNum > 100) {
      setError("Age must be between 0 and 100.");
      return;
    }

    axios.post(`${import.meta.env.VITE_API_URL}/create`, {formData}, { withCredentials: true })
      .then(res => {
        if (res.status === 200) {
         // add user email as context
        }
      })
      .catch(err => console.log(err));
    // console.log("Submitted data:", formData);

    navigate("/meals");
  };

  return (
    <div className="max-w-xl mx-auto mt-5 p-6 bg-green-200 shadow rounded">
      <h1 className="text-2xl font-bold mb-4 text-center">User Profile</h1>
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
            name="goal"
            value={formData.goal}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          >
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
              .filter((a) => !formData.food_allergies.includes(a))
              .map((allergy) => (
                <option key={allergy} value={allergy}>
                  {allergy}
                </option>
              ))}
          </select>

          {/* Display Selected Allergies (hide 'none') */}
          <div className="mt-3 flex flex-wrap gap-2">
            {formData.food_allergies
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
