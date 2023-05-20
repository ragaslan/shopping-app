import React, { useEffect, useRef, useState } from 'react'
import Navbar from '../components/Navbar'
import { useAuth } from '../contexts/Auth'
import app, {auth, db, storage} from "../Firebase"
import {collection,doc,getDoc,getDocs, limit, query ,updateDoc,where} from 'firebase/firestore';
import ProfileImage from "../profile.png"
import { updateSchema } from '../forms/UpdateProfile';
import { toast } from 'react-toastify';
import { sendPasswordResetEmail } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
function Profile() {
    let {profile,setProfile,userId} = useAuth();
    const [newBalance,setNewBalance] = useState(0);
    const [editProfile,setEditProfile] = useState(false);
    const [updateForm,setUpdateForm] = useState({});
    const [imageUpload,setImageUpload] = useState();
    const [imageUrl,setImageUrl] = useState("");
    
    useEffect(() => {
      setUpdateForm({"name":profile.name,"surname":profile.surname});
    },[profile]);
    
    let inputRef = useRef();

    let setBalance = async () => {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", profile.email));
        const querySnapshot = await getDocs(q);
    
        querySnapshot.forEach((myDoc) => {
          const userRef = doc(db, "users", myDoc.id);
          const newFields = { balance: newBalance };
          updateDoc(userRef, newFields).then((doc) => {
            setProfile(prev => ({...prev,balance:newBalance}));
          })
          
        });
      }
    let handleSubmit = (e) => {
      e.preventDefault();
      if(inputRef.current.value){
        const imageRef = ref(storage,`images/profileImages/${userId + "." + imageUpload.type.split("/")[1]}`);
        uploadBytes(imageRef,imageUpload).then((e) => {
          getDownloadURL(imageRef).then(async(url) => {
            const q = query(collection(db, "users"), where("email", "==", profile.email))
            let snapShots = await getDocs(q);
            snapShots.forEach(me => {
              setImageUrl(url);
              
              updateDoc(me.ref,{profileImageURL:url}).then(() => {
                setProfile((prev) => ({...prev,profileImageURL:url}));
                toast.success("Profile Image is uploaded !");
                
              })
            });

          })
        }).catch(err => toast.error(err.message));
        
        
      }
      
      // name surname güncelleme
      if(updateForm.name !== profile.name || updateForm.surname !== profile.surname){
        updateSchema.validate(updateForm).then(async() => {
        
          const q = query(collection(db, "users"), where("email", "==", profile.email))
          let snapShots = await getDocs(q);
          snapShots.forEach((myDoc) => {
             updateDoc(myDoc.ref,{name:updateForm.name,surname:updateForm.surname}).then(() => {
              toast.success("Your profile is updated !");
              setProfile((prev) => ({...prev,name:updateForm.name,surname:updateForm.surname}));
              
             }).catch(err => toast.error(err.message));
          });
        }).catch(err => toast.error(err.message));
      }
      inputRef.current.value = "";
      setEditProfile(false);
    }
    
    

    return (
    
    <>
        <Navbar/>
        <div className='container'>
            <h2 className='section-title'>Profile</h2>
            <div className='profile-content'>
                <div className='user-image'>
                    
                    <img src={profile.profileImageURL == "" ? ProfileImage : profile.profileImageURL}/>
                
                </div>
                {!editProfile && <div className='user-fullname'>{profile.name} {profile.surname}</div>}
                {editProfile && (
                  <>
                  <form className='edit-profile' onSubmit={handleSubmit}>
                  <div className='input-group'>
                    <input type='file' name='file' accept='image/*' id='file' ref={inputRef} style={{marginTop:"3rem"}} onChange={(e) => setImageUpload(e.target.files[0])}/>
                  </div>
                  <div className='input-group'>
                    <label htmlFor='name'>Name</label>
                    <input type='text' name='name' id='name' value={updateForm.name} onChange={(e) => setUpdateForm({...updateForm,name:e.target.value})}/>
                  </div>
                  <div className='input-group'>
                  <label htmlFor='surname'>Surname</label>
                  <input type='text' name='surname' id='surname' value={updateForm.surname} onChange={(e) => setUpdateForm({...updateForm,surname:e.target.value})}/>
                  </div>
                  <input type='submit' className='btn-submit updateBtn' value="Update Profile" />
                  
                </form>
                <a className='btn-submit changePassBtn' onClick={() => {
                  sendPasswordResetEmail(auth,profile.email).then(res => {
                    toast.success(`We send you a mail to change your password: ${profile.email}`);
                  }).catch(err => console.log(err));
                
                
                }}>Change Password</a>
                  </>
                  
                )}
                
                
                {!editProfile && <div className='user-email'>{profile.email}</div>}

                {!editProfile && <a className='user-balance'>Your Balance  <span className='text-orange'>${parseFloat(profile.balance).toFixed(2)}</span></a>}
                
                {!editProfile && (
                  <div className='user-balance-set'>
                    <input className='balance-input' value={newBalance} type='number' min={0} onChange={(e) => setNewBalance(Number(e.target.value)) }/>
                    <button onClick={() => setBalance()}>Set Your Balance</button>
                  </div>
                )}
                {!editProfile && (
                  <div className='user-balance-set'>
                    <button onClick={() => setEditProfile(true)}>Settings</button>
                  </div>
                )}
                
            </div>
        </div>
        
    </>
  )
}

export default Profile