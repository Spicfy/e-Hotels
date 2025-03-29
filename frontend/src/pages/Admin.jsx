import React from "react";
import { Link } from "react-router-dom";
const Admin = ()=>{

    return (
        <div className="navbar-content">
            <Link to='/customer' className="navbar-logo"> Insert/Update/Delete Customer
            </Link> 
        </div>
    )
}

export default Admin;