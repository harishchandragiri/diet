// MealsPage.jsx
function MealsPage() {
  const meals = [
    { breakfast: "tea", lunch: "rice", dinner: "bread" },
    { breakfast: "tea", lunch: "rice", dinner: "bread" },
    { breakfast: "tea", lunch: "rice", dinner: "bread" },
    { breakfast: "tea", lunch: "rice", dinner: "bread" },
    { breakfast: "tea", lunch: "rice", dinner: "bread" },
    { breakfast: "tea", lunch: "rice", dinner: "bread" },
    { breakfast: "tea", lunch: "rice", dinner: "bread" },
  ];

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4 bg-green-200  shadow rounded">
      <h2 className="text-2xl font-bold mb-4 w-full text-center">Daily Meal Plan</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[400px] border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border p-2">Day</th>
              <th className="border p-2">Breakfast</th>
              <th className="border p-2">Lunch</th>
              <th className="border p-2">Dinner</th>
            </tr>
          </thead>
          <tbody>
            {meals.map((meal, index) => (
              <tr key={index} className="text-center">
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{meal.breakfast}</td>
                <td className="border p-2">{meal.lunch}</td>
                <td className="border p-2">{meal.dinner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MealsPage;
