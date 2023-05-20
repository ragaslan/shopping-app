import React,{useContext, useEffect} from 'react'
import {Outlet,Navigate} from "react-router-dom"

import { useAuth } from './contexts/Auth'

function PrivateRoute({component}) {
    const {user} = useAuth();
    
    if(!user){
        return <Navigate to={"/auth/login"}/>;
    }else{
        return <Outlet/>;
    }
    
    
  
}

export default PrivateRoute