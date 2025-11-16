import React from 'react'
import {GoogleAuthProvider,getAuth, signInWithPopup} from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInsuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
const OAuth = () => {
const dispatch = useDispatch();
const navigate = useNavigate();
const handleGoogleClick = async ()=>{
 try{
     const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth,provider);
    //   console.log(result);
    const res = await fetch('/api/auth/google',{
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
        },
        body:JSON.stringify({name:result.user.displayName,email:result.user.email,photo:result.user.photoURL})
    })
    const data = await res.json();
    dispatch(signInsuccess(data));
    navigate("/");
 }
 catch (error){
    console.log("Could not signIn with google",error);
 }
}


  return (
      <div className='flex w-full  items-center justify-center rounded-sm p-2 bg-white gap-2'>
          <FcGoogle size={20} />
          <button onClick={handleGoogleClick} type='button' className=' text-black text-sm uppercase hover:opacity-95 cursor-pointer '>Continue with google</button>
      </div>
    
  )
}

export default OAuth
