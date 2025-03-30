
import './App.css';

import Register from './pages/Register';
import Home from './pages/Home';
import React from 'react';
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EmployeeRegister from './pages/EmployeeRegister';
import AvailableRooms from './pages/CustomerView';
import Admin from './pages/Admin';
import Customer from './pages/Customer';
import Employee from './pages/Employee';
import Room from './pages/Room';
import Hotel from './pages/Hotel';
function App() {
  return (
    <Router>
    
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/sign-up" element={<Register />} />
        <Route path="/employee-sign-up" element={<EmployeeRegister />} />
        <Route path="/rooms" element={<AvailableRooms/>}/>
        <Route path ="/admin" element={<Admin/>}/>
        <Route path ="/customer" element={<Customer/>}/>
        <Route path='/employee' element={<Employee/>}/>
        <Route path='/room' element={<Room/>}/>
        <Route path='/hotel' element={<Hotel/>}/>
      </Routes>
    </Router>
  );
}

export default App;
