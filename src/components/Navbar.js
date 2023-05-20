import React, { useEffect } from 'react'
import Logo from "../logo.jpeg"
import BagImage from "../cart.png"
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/Auth'
import { useBag } from '../contexts/Bag'

function Navbar() {
 const {bagCount,setBagCount,setBag} = useBag();
  const {logout} = useAuth();
  return (
    <div className='navbar'>
      <div className='container'>
        <Link className='logo' to={'/'}>
          <img src={Logo} />
        </Link>
        <ul className='menu'>
          
            <Link className='menu-link bag-link' to={"/bag"}>
              <img src={BagImage} />
              <span className='bag-badge'>{bagCount}</span>
            </Link>
            <Link className='menu-link' to={"/category"}>Categories</Link>
            <Link className='menu-link' to={"/profile"}>Profile</Link>
            <Link className='menu-link' onClick={() => {
              localStorage.clear("bag");
              localStorage.clear("bagcount");
              setBag([]);
              setBagCount(0);
              logout();
              }}>Logout</Link>
        </ul>
      </div>
    </div>
  )
}

export default Navbar