import { useState } from 'react'
import './App.css'
import Login from './pages/auth/Login'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter,Router, Routes, Route } from 'react-router-dom';
import StudentDashboard from './pages/alumno/StudentDashboard';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='./pages/alumno/StudentDashboard' element={<StudentDashboard />} />
        </Routes>
      </BrowserRouter>
        
    </>
  )
}

export default App
