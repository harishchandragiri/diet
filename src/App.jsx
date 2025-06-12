import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Loading from "./components/Loading";

const FormPage = lazy(() => import("./components/FormPage"));
const MealsPage = lazy(() => import("./components/MealsPage"));

function App() {
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<FormPage />} />
          <Route path="/meals" element={<MealsPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
