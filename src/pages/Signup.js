import React,{useState} from 'react'
import Logo from '../logo.jpeg'
import {createUserCollection } from "../Firebase";
import {toast} from "react-toastify"
import { useAuth } from '../contexts/Auth';
import { useNavigate } from 'react-router-dom';
import { signUpSchema } from '../forms/SignUpSchema';
function Signup() {
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [name,setName] = useState("");
    const [surname,setSurname] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");
    const {createUser} = useAuth();
    const navigate = useNavigate();
    const handleCreate = async(e) => {
            e.preventDefault();
            signUpSchema.validate({
                email,
                password,
                confirmPassword,
                name,
                surname
            }).then(async() => {
                try{
                    await createUser(email,password);
                    await createUserCollection(name,surname,email);
                    navigate("/auth/login?register-success=true");
                }catch(err){
                    if(err.code == "auth/email-already-in-use"){
                        toast.error("This email is being used");
                    }else{
                        toast.error(err.message);
                    }
                    
                }
            
            }).catch(err => toast.error(err.message));
            
    
        
    }
  return (
    <div className='auth-box'>
       
        <div className='auth-logo'>
            <img className='auth-image' src={Logo} />
        </div>
        <form className='auth-form'>
            <div className='input-group'>
                <label htmlFor='name'>Name:</label>
                <input className='text-field' type='text' id='name' value={name} onChange={(e) => setName(e.target.value)}></input>
            </div>
            <div className='input-group'>
                <label htmlFor='surname'>Surname:</label>
                <input className='text-field' type='text' id='surname' value={surname} onChange={(e) => setSurname(e.target.value)}></input>
            </div>
            <div className='input-group'>
                <label htmlFor='email'>Email:</label>
                <input className='text-field' type='text' id='email' value={email} onChange={(e) => setEmail(e.target.value)}></input>
            </div>
            <div className='input-group'>
                <label htmlFor='password'>Password:</label>
                <input className='text-field' type='password' id='password' value={password} onChange={(e) => setPassword(e.target.value)}></input>
            </div>
            <div className='input-group'>
                <label htmlFor='confirmPassword'>Confirm Password:</label>
                <input className='text-field' type='password' id='confirmPassword' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}></input>
            </div>
            <div className='input-group'>
                <input className='btn btn-orange mt-1' type='submit' value={"Register"} onClick={handleCreate}></input>
            </div>
        </form>
        <span className='or-line'></span>
        <a className='auth-link' href='/auth/login'>login</a>
    </div>
  )
}

export default Signup