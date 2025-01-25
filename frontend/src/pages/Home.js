import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess  } from '../utils';
import {ToastContainer} from 'react-toastify'

function Home() {
  const [loggedInUser, setLoggedInUser]=useState('');
  const [products, setProducts]=useState('');
  
   const navigate=useNavigate();
 
   
  useEffect(()=>{
    setLoggedInUser(localStorage.getItem('loggedInUser'))
  },[])
  const handleLogout = async () => {
    try {
      const url = "http://localhost:8000/auth/logout";
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': token, // Send the token directly, without the 'Bearer' prefix
        'Content-Type': 'application/json'
      };
  
      const response = await fetch(url, { method: 'POST', headers });
  
      if (response.ok) {
        handleSuccess("Successfully logged out from the server");
      } else {
        handleError("Error logging out from the server");
      }
  
      // Clear local storage after logout
      localStorage.removeItem('token');
      localStorage.removeItem('loggedInUser');
  
      // Redirect to login page after successful logout
      setTimeout(() => {
        navigate('/login');
      }, 1000); // Optional delay before redirect
  
    } catch (err) {
      handleError("Error logging out: " + err);
    }
  };
  
  
  
  const fetchProducts=async()=>{
    try{
      const url="http://localhost:8000/products";
      const token=localStorage.getItem('token');
      console.log('token');
      const headers={
       'Authorization':token, // Add 'Bearer' if the API expects it
       'Content-Type': 'application/json'
        
      }
      const response=await fetch(url,{headers});
      const result=await response.json();
      console.log(result);
      setProducts(result);
      



    }catch(err){
      handleError(err);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);


  return (
    <div>
      <h1>{loggedInUser}</h1>
    <button className='button-css' onClick={handleLogout}>
      LogOut
    </button>
    <div>
        {products && products.length > 0 ? (
          <ul>
            {products.map((item, index) => (
              <li key={index}>
                <span>{item.name}: {item.price}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No products available</p>
        )}
    </div>
    

    <ToastContainer />
    </div>
  )
}

export default Home