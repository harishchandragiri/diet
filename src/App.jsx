import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Loading from "./components/Loading";

const FormPage = lazy(() => import("./components/FormPage"));
const MealsPage = lazy(() => import("./components/MealsPage"));
const AdaptiveFeedbackForm = lazy(() => import("./components/AdaptiveFeedbackForm"));

function App() {
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* route define */}
          <Route path="/" element={<FormPage />} />
          <Route path="/meals" element={<MealsPage />} />
          <Route path="/feedback" element={<AdaptiveFeedbackForm />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
