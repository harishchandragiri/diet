import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MealsPage() {
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/getmeals`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.length > 0 && res.data[0].mealsByDay) {
          setMeals(res.data[0].mealsByDay);
          console.log(res.data[0].mealsByDay);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="max-w-6xl mx-auto mt-3 p-4 bg-green-200 shadow rounded">
      <h2 className="text-2xl font-bold mb-4 w-full text-center">
        Daily Meal Plan
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border p-3 bg-blue-400">Day</th>
              <th className="border p-3">Breakfast</th>
              <th className="border p-3 bg-yellow-400">Lunch</th>
              <th className="border p-3">Snack</th>
              <th className="border p-3 bg-yellow-400">Dinner</th>
            </tr>
          </thead>
          <tbody>
            {meals.length > 0 ? (
              meals.map((meal, index) => {
                const breakfast = JSON.parse(meal.meals.breakfast || '{}');
                const lunch = JSON.parse(meal.meals.lunch || '{}');
                const snacks = JSON.parse(meal.meals.snacks || '{}');
                const dinner = JSON.parse(meal.meals.dinner || '{}');

                return (
                  <tr key={index} className="text-center">
                    <td className="border text-[18px] p-3 bg-blue-300 font-semibold">{meal.day}</td>
                    <td className="border text-[18px] p-3">{breakfast.name || 'N/A'}</td>
                    <td className="border text-[18px] p-3 bg-yellow-200">{lunch.name || 'N/A'}</td>
                    <td className="border text-[18px] p-3">{snacks.name || 'N/A'}</td>
                    <td className="border text-[18px] p-3 bg-yellow-200">{dinner.name || 'N/A'}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center">
                  Loading or No Meals Found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MealsPage;
