import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from "./pages/Home.jsx"

export const serverUrl= "http://localhost:5000"

const App = () => {
  return (
    <div>
        <BrowserRouter>
        <Routes>
            <Route path='/' element={<Home/>}/>
        </Routes>
        </BrowserRouter>
    </div>
  )
}

export default App