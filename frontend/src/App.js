
import './App.css';

import Register from './pages/Register';
import Home from './pages/Home';
import React from 'react';
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EmployeeRegister from './pages/EmployeeRegister';
import AvailableRooms from './pages/CustomerView';
function App() {
  return (
    <Router>
    
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/sign-up" element={<Register />} />
        <Route path="/employee-sign-up" element={<EmployeeRegister />} />
        <Route path="/rooms" element={<AvailableRooms/>}/>
      </Routes>
    </Router>
  );
}

export default App;
