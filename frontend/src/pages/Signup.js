import React from 'react';
import '../App.css';  // Import your CSS
import {ToastContainer} from 'react-toastify';
import {Link, useNavigate} from 'react-router-dom';
import {useState} from 'react';
import { handleError, handleSuccess } from '../utils';



function Signup() {

    const [signupInfo, setSignupInfo]=useState({
        name:'',
        email:'',
        password:''
    })

    const navigate=useNavigate();
    const handleChange=(e)=>{
        const {name, value}=e.target;
        console.log(name,value);
        const copySignupInfo={...signupInfo};
        copySignupInfo[name]=value;
        setSignupInfo(copySignupInfo);

    }
    console.log('signupInfo ->' , signupInfo)

    const handleSignup=async (e)=>{
        e.preventDefault();
        const {name, email, password}=signupInfo;
        if(!name|| !email ||!password){
            return handleError('name, email and password are required ')

        }
        try{
            const url="https://deploy-mern-api-rouge.vercel.app/auth/signup";
            const response=await fetch(url,{
                method:"POST",
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(signupInfo)
            });
            const result=await response.json();
            const {success, message, error}=result;
            if(success){
                handleSuccess(message);
                setTimeout(()=>{
                    console.log('Navigating to login page');
                   navigate('/login')
                }, 1000)
            }else if(error){
                const details=error?.details[0].message;
                handleError(details);
            }else if(!success){
                handleError(error);
            }
            console.log(result);

        }catch(err){
            handleError(err);

        }

    }
  return (
   

<div className="container">
    <h1>Sign Up</h1>
    <form onSubmit={handleSignup}>
        <div>
        <label htmlFor="name">Name</label>
        <input
        onChange={handleChange}
          type="text"
          name='name'  
          autoFocus                
          placeholder="Enter name"
          value={signupInfo.name}
        />   
        </div>

        <div>
        <label htmlFor="email">Email</label>
        <input
            onChange={handleChange}
          type="email"
          name='email'  
                          
          placeholder="Enter email"
          value={signupInfo.email}
        />   
        </div>

        <div>
        <label htmlFor="password">password</label>
        <input
        onChange={handleChange}
          type="password"
          name='password'  
                          
          placeholder="Enter password"
          value={signupInfo.password}
        />   
        </div>
       
      <button type="submit" className='button-css' >
        Submit
      </button>
     <br/>
      <span>
        Already have an account?
        <Link to="/login">Login</Link>
      </span>

    </form>
    <ToastContainer />

            
   </div>
  );
}

export default Signup;
