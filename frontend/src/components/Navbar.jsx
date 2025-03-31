import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const [click, setClick] = useState(false);
  const [loginInfo, setLoginInfo] = useState(null);
  const navigate = useNavigate();

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setLoginInfo(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setLoginInfo(null);
    navigate(0); // refresh page
  };

  const isAdmin =
      loginInfo?.role === "Employee" &&
      loginInfo?.name?.toLowerCase() === "admin";

  return (
      <>
        <nav className="navbar">
          <div className="navbar-content" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <div>
              <Link to="/" className="navbar-logo">E-Hotels</Link>
            </div>
            <div className="menu-icon" onClick={handleClick}>
              <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
            </div>
            <ul className={click ? 'nav-menu active' : 'nav-menu'}>
              <li className='nav-item'><Link to='/' className='nav-links' onClick={closeMobileMenu}>Home</Link></li>
              <li className='nav-item'><Link to='/services' className='nav-links' onClick={closeMobileMenu}>Services</Link></li>
              <li className='nav-item'><Link to='/rooms' className='nav-links' onClick={closeMobileMenu}>View Available Rooms</Link></li>
              <li className='nav-item'><Link to='/sign-up' className='nav-links-mobile' onClick={closeMobileMenu}>Customer Sign up</Link></li>
              <li className='nav-item'><Link to='/employee-sign-up' className='nav-links-mobile' onClick={closeMobileMenu}>Employee Sign up</Link></li>
              <li className='nav-item'><Link to='/totalrooms' className='nav-links-mobile' onClick={closeMobileMenu}>Total capacity by Hotel</Link></li>
              <li className='nav-item'><Link to='/roomsbyarea' className='nav-links-mobile' onClick={closeMobileMenu}>Total capacity by Area</Link></li>

              {/* Only show admin page if isAdmin */}
              {isAdmin && (
                  <li className='nav-item'>
                    <Link to='/admin' className='nav-links-mobile' onClick={closeMobileMenu}>Admin Page</Link>
                  </li>
              )}
            </ul>

            {/* Login Area Info */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "white" }}>
              {loginInfo && (
                  <>
                    <div style={{ fontSize: "14px" }}>
                      Welcome <strong>{loginInfo.name}</strong>, you're logged in as <strong>{isAdmin ? "Admin" : loginInfo.role}</strong>
                    </div>
                    <button onClick={handleLogout} style={{
                      background: "#ff4d4d",
                      border: "none",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      color: "white",
                      cursor: "pointer"
                    }}>Logout</button>
                  </>
              )}
            </div>
          </div>
        </nav>
      </>
  );
}

export default Navbar;