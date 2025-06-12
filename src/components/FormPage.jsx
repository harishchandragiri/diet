// FormPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function FormPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    age: "",
    gender: "male",
    height: "",
    weight: "",
    activity_level: "moderately_active",
    goal: "maintain",
  });
  const [error, setError] = useState("");

  const activityLevels = [
    { value: "sedentary", label: "Sedentary" },
    { value: "lightly_active", label: "Lightly active" },
    { value: "moderately_active", label: "Moderately active" },
    { value: "very_active", label: "Very active" },
    { value: "extremely_active", label: "Extremely active" },
  ];

  const goals = [
    { value: "loss", label: "Weight loss" },
    { value: "gain", label: "Weight gain" },
    { value: "maintain", label: "Maintain weight" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const ageNum = Number(formData.age);
    if (isNaN(ageNum) || ageNum < 0 || ageNum > 100) {
      setError("Age must be between 0 and 100.");
      return;
    }

    navigate("/meals");
  };

  return (
    <div className="max-w-xl mx-auto mt-5 p-6 bg-green-200 shadow rounded">
      <h1 className="text-2xl font-bold mb-4  w-full text-center">User Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-red-500">{error}</div>}

        <div>
          <label className="block mb-1">Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            min="0"
            max="100"
            required
            className="w-full border rounded p-2"
          />
        </div>

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
          </select>
        </div>

        <div>
          <label className="block mb-1">Height (cm)</label>
          <input
            type="number"
            name="height"
            value={formData.height}
            onChange={handleChange}
            min="30"
            max="311"
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-1">Weight (kg)</label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            min="1"
            max="551"
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-1">Activity Level</label>
          <select
            name="activity_level"
            value={formData.activity_level}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          >
            {activityLevels.map((lvl) => (
              <option key={lvl.value} value={lvl.value}>
                {lvl.label}
              </option>
            ))}
          </select>
        </div>

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
