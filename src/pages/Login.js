import React,{useEffect, useState} from 'react'
import Logo from '../logo.jpeg'
import { auth } from "../Firebase";
import {  sendPasswordResetEmail} from 'firebase/auth';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/Auth';
import { loginSchema, resetSchema } from '../forms/LoginSchema';
import { toast } from 'react-toastify';
function Login() {
    const {login} = useAuth(); 
    const navigate = useNavigate();
    const [popupVisibility,setPopupVisibility] = useState(false);
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [resetEmail,setResetEmail] = useState("");
    let location = useLocation();
    useEffect(() => {
        if(location.search){
          let key = location.search.split("?")[1].split("=")[0];
          let val = location.search.split("?")[1].split("=")[1];
          if(key == "register-success" && val == "true"){
            toast.success("Registration Successful !");
          }
        }
      },[location]);

    const handleLogin = async(e) => {
        e.preventDefault();
        loginSchema.validate({
            email,
            password
        }).then(async() => {
            try{
                await login(email,password);
                navigate("/");
            }catch(err){
                if(err.code == "auth/user-not-found"){
                    err.message = "User is not found";
                }else if(err.code == "auth/wrong-password"){
                    err.message = "Password is not correct!"
                }
                toast.error(err.message);
            }
        }).catch(err => toast.error(err.message));
        
    }

    let handleForgot = (e) => {
        e.preventDefault();
        resetSchema.validate({resetEmail}).then(() => {
            sendPasswordResetEmail(auth,resetEmail).then(() => {
                toast.success("Please check your mailbox to reset your password");
                setPopupVisibility(false);
            }).catch(err => {
                if(err.code == "auth/user-not-found"){
                    toast.error("Reset email is invalid. User not found !");
                }else{
                    toast.error(err.message);
                }
            })
        }).catch(err => toast.error(err.message));
    }
  return (

    <div className='auth-box'>
        <div className={popupVisibility ? "evaluate-outer" :"evaluate-outer d-none" }>
        <div className="reset-pop">
          <div className="close-btn" onClick={() => setPopupVisibility(false)}>X</div>
            <form className="reset-form" onSubmit={handleForgot}>
                <input className='reset-pass' type='email' name='reset-email' value={resetEmail} id='reset-email' placeholder='Your Mail' onChange={(e) => setResetEmail(e.target.value) }/>
                <button className='reset-btn'>Reset Password</button>
            </form>
        </div>
        </div>
        
        <div className='auth-logo'>
            <img className='auth-image' src={Logo} />
        </div>
        <form className='auth-form'>
            <div className='input-group'>
                <label htmlFor='email'>Email:</label>
                <input className='text-field' type='text' id='email' value={email} onChange={(e) => setEmail(e.target.value)}></input>
            </div>
            <div className='input-group'>
                <label htmlFor='password'>Password:</label>
                <input className='text-field' type='password' id='password' value={password} onChange={(e) => setPassword(e.target.value)}></input>
            </div>
            <div className='input-group'>
                <input className='btn btn-orange mt-1' type='submit' value={"Login"} onClick={handleLogin}></input>
            </div>
        </form>
        <span className='or-line'></span>
        <a className='auth-link' href='/auth/register'>register</a>
        <a className='auth-link' onClick={() => setPopupVisibility(true)}>I forgot my password</a>
    </div>
  )
}

export default Login