import React, {useState} from 'react'
import { Link} from 'react-router-dom'


function Navbar() {

  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);

  const closeMobileMenu = () => setClick(false);

  return (
    <>
        <nav className="navbar">
          <div className="navbar-content">
            <Link to="/" className="navbar-logo">
             E-Hotels 
            </Link>
            <div className="menu-icon" onClick={handleClick}>
              <i className={click ? 'fas fa-times' : 'fas fa-bars'} /> 
            </div>
            <ul className={click ? 'nav-menu active' : 'nav-menu'}>
              <li className='nav-item'>
                <Link to='/' className='nav-links' onClick={closeMobileMenu} >
                Home
                </Link>
              </li>
              <li className='nav-item'>
                <Link to='/services' className='nav-links' onClick={closeMobileMenu} >
                Services
                </Link>
              </li>
              <li className='nav-item'>
                <Link to='/rooms' className='nav-links' onClick={closeMobileMenu} >
                View Available Rooms
                </Link>
              </li>
              <li className='nav-item'>
                <Link to='/sign-up' className='nav-links-mobile' onClick={closeMobileMenu} >
                Customer Sign up
                </Link>
              </li>
              <li className='nav-item'>
                <Link to='/employee-sign-up' className='nav-links-mobile' onClick={closeMobileMenu} >
                Employee Sign up
                </Link>
              </li>
            </ul>
          </div>
        </nav>
    </>
  )
}

export default Navbar
