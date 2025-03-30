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
            <div>
            <Link to='/room'> Insert/Update/Delete Rooms</Link>

            </div>
            <div>
            <Link to='/hotel'> Insert/Update/Delete Hotel</Link>
            </div>
        </div>
        
    )
}

export default Admin;