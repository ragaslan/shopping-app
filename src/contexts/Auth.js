import React, { useContext, useEffect, useState } from 'react'
import { createContext } from 'react'
import {auth,db} from "../Firebase"
import { collection,doc,getDocs, query ,where} from 'firebase/firestore';
import { createUserWithEmailAndPassword, onAuthStateChanged,signInWithEmailAndPassword,signOut, updateCurrentUser, updateProfile} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
export const AuthContext = createContext();

export function AuthProvider({children}) {
  
  const navigate = useNavigate();
  let [userId,setUserId] = useState(null);
  const [user,setUser] = useState({});
  const [profile,setProfile] = useState({});
  
  const login = (email,password) => {
    return signInWithEmailAndPassword(auth,email,password);
  }

  

  const createUser = (email,password) => {
    return createUserWithEmailAndPassword(auth,email,password);
  }

  const logout = () => {
    return signOut(auth);    
  } 
  

  useEffect(() => {
    const listen = onAuthStateChanged(auth, async(currentUser) => {
      setUser(currentUser);
      if(currentUser){
        const usersRef = collection(db,"users");
        const q = query(usersRef, where("email", "==", currentUser.email));
        const snapshot = await getDocs(q);
        snapshot.forEach(item => {
          setProfile(item.data())
          setUserId(item.id);
        })
      }
      
    });

  

    return () => {
      listen();
    }
  }, []);
  
  return (
    <AuthContext.Provider value={{createUser,login,logout,user,profile,setProfile,userId}}>
        {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext);
}
