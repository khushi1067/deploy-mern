import React from 'react';
import '../App.css';  // Import your CSS
import {ToastContainer} from 'react-toastify';
import {Link, useNavigate} from 'react-router-dom';
import {useState} from 'react';
import { handleError, handleSuccess } from '../utils';



function Login() {

    const [loginInfo, setLoginInfo]=useState({
        email:'',
        password:''
    })

    const navigate=useNavigate();
    const handleChange=(e)=>{
        const {name, value}=e.target;
        console.log(name,value);
        const copyLoginInfo={...loginInfo};
        copyLoginInfo[name]=value;
        setLoginInfo(copyLoginInfo);

    }
    console.log('Logininfo ->' , loginInfo)

    const handleLoginIn=async (e)=>{
        e.preventDefault();
        const {email, password}=loginInfo;

        if(!email ||!password){
            return handleError('email and password are required ')

        }
        try{
            const url="https://deploy-mern-api-rouge.vercel.app/auth/login";
            const response=await fetch(url,{
                method:"POST",
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(loginInfo)
            });
            const result=await response.json();
            const {success, message,jwtToken,name, error}=result;

            if(success){
                handleSuccess(message);
                localStorage.setItem('token',jwtToken);
                localStorage.setItem('loggedInUser',name);
                setTimeout(()=>{
                    console.log('Navigating to Home page');
                   navigate('/home')
                }, 1000)
            }
            
            else if(error){
                const details=error?.details[0].message;
                handleError(error);
            } else if (!success && !error) {
                handleError('Invalid credentials. Please check your email and password');
              }
            console.log('Login respinse',result);

        }catch(err){
            handleError('Something went wrong. Please try again later');

        }

    }
  return (
   

<div className="container">
    <h1>Login In</h1>
    <form onSubmit={handleLoginIn}>
        <div>
        <label htmlFor="email">Email</label>
        <input
            onChange={handleChange}
          type="email"
          name='email'  
                          
          placeholder="Enter email"
          value={loginInfo.email}
        />   
        </div>

        <div>
        <label htmlFor="password">password</label>
        <input
        onChange={handleChange}
          type="password"
          name='password'  
                          
          placeholder="Enter password"
          value={loginInfo.password}
        />   
        </div>
       
      <button type="submit" className='button-css' >
        Submit
      </button>
     <br/>
      <span>
        Dont have an account?
        <Link to="/signup">Signup</Link>
      </span>

    </form>
    <ToastContainer />

            
   </div>
  );
}

export default Login;
