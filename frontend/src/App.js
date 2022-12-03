import "./App.css";
import MainLayout from "./MainLayout";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Profile from "./components/Profile";
import SignUp from "./pages/Signup";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <Routes>
            <Route path="/superfan/mainpage" element={<MainLayout />} />
            <Route path="/superfan/profile" element={<Profile />} />
            <Route path="/superfan/signup" element={<SignUp />} />
          </Routes>
        </Router>
      </header>
    </div>
  );
}

export default App;
