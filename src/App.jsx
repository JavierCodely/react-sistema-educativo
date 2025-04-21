import "./App.css";
import Login from "./pages/auth/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import { Router, Routes, Route } from "react-router-dom";


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
