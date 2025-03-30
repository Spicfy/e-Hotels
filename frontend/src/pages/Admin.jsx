import React from "react";
import { Link } from "react-router-dom";
const Admin = ()=>{

    return (
        <div>
            <div >
                <Link to='/customer' > Insert/Update/Delete Customer
                </Link>
            </div>
            <div>
            <Link to='/employee'> Insert/Update/Delete Employee</Link>

            </div>
        </div>
        
    )
}

export default Admin;