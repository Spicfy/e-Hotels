
import './App.css';

import Register from './pages/Register';
import Home from './pages/Home';
import React from 'react';
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EmployeeRegister from './pages/EmployeeRegister';
function App() {
  return (
    <Router>
    
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/sign-up" element={<Register />} />
        <Route path="/employee-sign-up" element={<EmployeeRegister />} />

      </Routes>
    </Router>
  );
}

export default App;
