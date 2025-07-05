import { useState } from "react";
import axios from "axios";

export default function AdaptiveFeedbackForm() {
  const [userProfile, setUserProfile] = useState({
    weight_goal: "",
    activity_level: "",
    bmr: "",
  });

  const [feedback, setFeedback] = useState({
    weight_change: "",
    weeks_elapsed: "",
    satisfaction_score: "",
    suggestions: "",
  });

  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    const payload = {
      user_id: 1,
      user_profile: {
        ...userProfile,
        bmr: Number(userProfile.bmr) || 0,
      },
      feedback: {
        ...feedback,
        weight_change: Number(feedback.weight_change) || 0,
        weeks_elapsed: Number(feedback.weeks_elapsed) || 0,
        satisfaction_score: Number(feedback.satisfaction_score) || 0,
      },
    };

    try {
      const res = await axios.post("http://localhost:3000/feedback", payload);
      setResponse(res.data);
    } catch (err) {
      console.error(err);
      setResponse({ adjustment_message: "Error submitting feedback." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl w-full">
        <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">
          Adaptive Feedback System
        </h1>

        <div className="space-y-4">
          <section>
            <h2 className="text-lg font-semibold text-gray-700">User Profile</h2>
            <div className="grid grid-cols-1 gap-2">
              <input
                type="text"
                placeholder="Weight Goal (loss/gain/maintain)"
                value={userProfile.weight_goal}
                onChange={(e) =>
                  setUserProfile({ ...userProfile, weight_goal: e.target.value })
                }
                className="p-2 border rounded w-full"
              />
              <input
                type="text"
                placeholder="Activity Level (Sedentary, Lightly active, Moderately active)"
                value={userProfile.activity_level}
                onChange={(e) =>
                  setUserProfile({ ...userProfile, activity_level: e.target.value })
                }
                className="p-2 border rounded w-full"
              />
              <input
                type="number"
                placeholder="BMR"
                value={userProfile.bmr}
                onChange={(e) =>
                  setUserProfile({ ...userProfile, bmr: e.target.value })
                }
                className="p-2 border rounded w-full"
              />
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-700">Feedback</h2>
            <div className="grid grid-cols-1 gap-2">
              <input
                type="number"
                placeholder="Weight Change"
                value={feedback.weight_change}
                onChange={(e) =>
                  setFeedback({ ...feedback, weight_change: e.target.value })
                }
                className="p-2 border rounded w-full"
              />
              <input
                type="number"
                placeholder="Weeks Elapsed"
                value={feedback.weeks_elapsed}
                onChange={(e) =>
                  setFeedback({ ...feedback, weeks_elapsed: e.target.value })
                }
                className="p-2 border rounded w-full"
              />
              <input
                type="number"
                placeholder="Satisfaction Score (1-5)"
                value={feedback.satisfaction_score}
                onChange={(e) =>
                  setFeedback({
                    ...feedback,
                    satisfaction_score: e.target.value,
                  })
                }
                className="p-2 border rounded w-full"
              />
              <textarea
                placeholder="Suggestions"
                value={feedback.suggestions}
                onChange={(e) =>
                  setFeedback({ ...feedback, suggestions: e.target.value })
                }
                className="p-2 border rounded w-full"
              ></textarea>
            </div>
          </section>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>

          {response && (
            <div className="mt-4 bg-green-100 p-4 rounded">
              <h3 className="font-semibold text-green-700">
                Adjustment Message:
              </h3>
              <p>{response.adjustment_message}</p>

              {response.updated_meal_plan && (
                <pre className="mt-2 bg-gray-50 p-2 rounded text-sm overflow-auto">
                  {JSON.stringify(response.updated_meal_plan, null, 2)}
                </pre>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
