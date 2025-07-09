// Updated FormPage.jsx with Activity Assessment Questionnaire
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from 'react';
import { userContext } from '../App';

function FormPage() {
      const { activity, setActivity } = useContext(userContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    age: "",
    gender: "male",
    height: "",
    weight: "",
    activity_level: "",
    goal: "maintain",
    food_allergies: ["none"],
  });

  const [selectedAllergy, setSelectedAllergy] = useState("");
  const [error, setError] = useState("");
  const [activityResponses, setActivityResponses] = useState({});
  const [calculatedLevel, setCalculatedLevel] = useState(null);

  const goals = [
    { value: "loss", label: "Weight loss" },
    { value: "gain", label: "Weight gain" },
    { value: "maintain", label: "Maintain weight" },
  ];


  const questions = [
    {
      id: 1,
      text: "How many days per week do you engage in planned exercise or sports?",
      options: {
        a: "0 days (None)",
        b: "1-2 days (Light)",
        c: "3-4 days (Moderate)",
        d: "5+ days (High)",
      },
      weight: 3,
    },
    {
      id: 2,
      text: "How would you describe your typical work day?",
      options: {
        a: "Mostly sitting (desk job, driving)",
        b: "Some walking, mostly sitting",
        c: "Regular walking, some physical tasks",
        d: "Mostly standing, walking, or physical labor",
      },
      weight: 2,
    },
    {
      id: 3,
      text: "On average, how many hours of moderate to vigorous exercise do you do per week?",
      options: {
        a: "Less than 1 hour",
        b: "1-3 hours",
        c: "4-6 hours",
        d: "More than 6 hours",
      },
      weight: 3,
    },
    {
      id: 4,
      text: "How many flights of stairs do you climb per day on average?",
      options: {
        a: "0-2 flights",
        b: "3-5 flights",
        c: "6-10 flights",
        d: "More than 10 flights",
      },
      weight: 1,
    },
    {
      id: 5,
      text: "How do you usually commute or travel for daily activities?",
      options: {
        a: "Car, bus, or other transport (mostly sitting)",
        b: "Mix of transport and walking",
        c: "Walking or cycling for short distances",
        d: "Mostly walking or cycling",
      },
      weight: 1,
    },
    {
      id: 6,
      text: "During leisure time, you typically prefer:",
      options: {
        a: "Sedentary activities (TV, reading, computer)",
        b: "Light activities (shopping, cooking, casual walks)",
        c: "Active hobbies (gardening, dancing, recreational sports)",
        d: "Intense activities (competitive sports, hiking, gym)",
      },
      weight: 2,
    },
    {
      id: 7,
      text: "How often do you feel physically tired at the end of the day due to physical activity?",
      options: {
        a: "Rarely (mostly sedentary)",
        b: "Sometimes (light activity)",
        c: "Often (moderate activity)",
        d: "Very often (high activity level)",
      },
      weight: 1,
    },
  ];

  const scoreMap = { a: 1, b: 2, c: 3, d: 4 };

  const calculateActivityLevel = () => {
    let totalScore = 0;
    let totalWeight = 0;

    questions.forEach((q) => {
      const response = activityResponses[q.id];
      if (response) {
        totalScore += scoreMap[response] * q.weight;
        totalWeight += q.weight;
      }
    });

    const average = totalWeight ? totalScore / totalWeight : 1;

    if (average <= 1.5) return "sedentary";
    if (average <= 2.5) return "lightly_active";
    if (average <= 3.2) return "moderately_active";
    return "very_active";
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const unanswered = questions.some((q) => !activityResponses[q.id]);
    if (unanswered) {
      setError("Please answer all activity questions.");
      return;
    }

    const ageNum = Number(formData.age);
    if (isNaN(ageNum) || ageNum < 0 || ageNum > 100) {
      setError("Age must be between 0 and 100.");
      return;
    }

    const activityLevel = calculateActivityLevel();
    setFormData((prev) => ({ ...prev, activity_level: activityLevel }));
    setActivity(activityLevel);


        navigate("/userdetails");
  };

  return (
    <div className="max-w-xl mx-auto mt-5 p-6 bg-green-200 shadow rounded">
      <h1 className="text-2xl font-bold mb-4 text-center">User Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Inputs (Age, Gender, Height, Weight, Goal) */}
        {/* ... keep previous form fields here (age, gender, height, etc.) ... */}

        {/* Activity Assessment Questions */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Activity Assessment</h2>
          {questions.map((q) => (
            <div key={q.id} className="mb-4">
              <p className="font-medium mb-1">{q.text}</p>
              {Object.entries(q.options).map(([key, label]) => (
                <label key={key} className="block ml-2">
                  <input
                    type="radio"
                    name={`q${q.id}`}
                    value={key}
                    checked={activityResponses[q.id] === key}
                    onChange={() =>
                      setActivityResponses((prev) => ({ ...prev, [q.id]: key }))
                    }
                    className="mr-2"
                  />
                  {label}
                </label>
              ))}
            </div>
          ))}

          {calculatedLevel && (
            <div className="text-green-800 font-semibold">
              Calculated Activity Level: {calculatedLevel.replace(/_/g, ' ')}
            </div>
          )}
        </div>

         {error && <div className="text-red-500">{error}</div>}

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
