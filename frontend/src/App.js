import "./App.css";
import MainLayout from "./MainLayout";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Profile from "./components/Profile";
import SignUp from "./pages/Signup";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import React, { useState, useEffect } from "react";
import { url } from "./constants";

function App() {
  const [currentAccount, setCurrentAccount] = useState("");

  const redirectToHome = (name) => {
    if (name !== "") window.open(`${url}/superfan/mainpage`, "_self");
  };

  const checkIfAccountChanged = async () => {
    try {
      const { ethereum } = window;
      ethereum.on("accountsChanged", (accounts) => {
        console.log("Account changed to:", accounts[0]);
        setCurrentAccount(accounts[0]);
        redirectToHome();
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfAccountChanged();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        <Router>
          <Routes>
            <Route path="/" element={<MainLayout />} />
            <Route path="/superfan" element={<MainLayout />} />
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
