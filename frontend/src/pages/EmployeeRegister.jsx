import React from 'react'
import { Link } from 'react-router'
import { useState } from 'react'
import axios from "axios"

const EmployeeRegister = () => {
    const [inputs,setInputs] =useState({
      full_name:"",
      address:"",
    password:"",
    ssn_sin:"",
    hotel_id:""
      
     
    })
  
    const [err,setError] = useState(null)
  
    const handleChange = e =>{
      setInputs(prev=>({...prev,[e.target.name]:e.target.value}))
    }
  
    //const navigate = useNavigate() 
  
    const handleSubmit = async e=>{
      e.preventDefault()
      try{
        console.log(inputs);
        
       await axios.post("http://localhost:3000/api/employee",inputs)
       
        
       
      
      }
      catch(err){
        setError(err.response.data)
        
      }
  
    }
  
    return (
      <div className='auth'>
        <h1>Employee Account Creation</h1>
        <form >
        
          <input required type="text" placeholder='Full name'name='full_name' onChange={handleChange}/>
          <input required type="text" placeholder='address'name='address' onChange={handleChange}/>
          <input required type="text" placeholder='SSN/SIN'name='ssn_sin' onChange={handleChange}/>
          <input required type="password" placeholder='password' name="password" onChange={handleChange}/>
          <input required type="number" placeholder='Hotel ID' name="hotel_id" onChange={handleChange}/>
          { err && <p>{err}</p>}
          <button onClick={handleSubmit}>Register</button>
          <span>Already have an account? <Link to="/login">Login</Link></span>
        </form>
      </div>
    )
  }
  
  export default EmployeeRegister