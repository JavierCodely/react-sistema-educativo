import { useState } from 'react'
import './App.css'
import Login from './pages/Login'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter,Router, Routes, Route } from 'react-router-dom';
import StudentDashboard from './pages/StudentDashboard';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/alumno/StudentDashboard' element={<StudentDashboard />} />
        </Routes>
      </BrowserRouter>
        
    </>
  )
}

export default App
