import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FormPage from "./pages/FormPage.jsx";
import VideoPage from "./pages/VideoPage.jsx";
import ReviewPage from "./pages/ReviewPage.jsx";
import SuccessPage from "./pages/SuccessPage.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FormPage />} />
        <Route path="/video" element={<VideoPage />} />
        <Route path="/review" element={<ReviewPage />} />
        <Route path="/success" element={<SuccessPage />} />
      </Routes>
    </Router>
  );
}

export default App;
