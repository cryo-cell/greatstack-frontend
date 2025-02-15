import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

function Login() {
  const [currentState, setCurrentState]= useState('Login')
  const {token, setToken, navigate, backendUrl } = useContext(ShopContext)

  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')

  const onSubmitHandler = async (event)=>{
    event.preventDefault()
    try {
      if (currentState === 'Sign Up') {
        //call the sign up api

        const response = await axios.post(backendUrl + '/api/user/register', {name, email, password})
        if (response.data.success) {
          setToken(response.data.token)
          localStorage.setItem('token', response.data.token)
          navigate('/')

        }   else {
          toast.error(response.data.message)
  //login api
        }     
      } else {
        const response = await axios.post(backendUrl + '/api/user/login', {email, password})
        if (response.data.success) {
          setToken(token)
          localStorage.setItem('token', response.data.token)
          navigate('/')

        } else{
          toast.error(response.data.message)

        }
          //login api
      }
    } catch (error) {
      console.log(error)
      toast.error(error)
    }
  }

  useEffect(()=>{
    if(!token && localStorage.getItem('token')){
    navigate('/')
    }
  },[token])
  return (
    <div>
      <form onSubmit={onSubmitHandler} className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800">
        <div className="inline-flex items-center gap-2 mb-2 mt-10">
          <p className="text-3xl">{currentState}</p>
          <hr className="border-none h-[1.5px] w-6 bg-gray-800" />
        </div>
        {currentState === "Login" ? '': <input onChange={(e)=>setName(e.target.value)} value={name} type="text" className='w-full px-3 py-2 border border-gray-800' placeholder='Name' />}
        <input onChange={(e)=>setEmail(e.target.value)} value={email} type="email" className='w-full px-3 py-2 border border-gray-800' placeholder='Email' required/>
        <input onChange={(e)=>setPassword(e.target.value)} value={password} type="password" className='w-full px-3 py-2 border border-gray-800' placeholder='Password' />
<div className="w-full flex justify-between text-sm mt-[-8px]">
        <p className="cursor-pointer">Forgot your password?</p>
        {
          currentState==="Login"?
          <p className='cursor-pointer' onClick={()=>setCurrentState('Sign Up')}>Create Account</p>
          :<p className='cursor-pointer' onClick={()=>setCurrentState('Login')}>Login Here</p>
        }
      </div>
      <button className='bg-black text-white font-light px-8 py-2 mt-4'>{currentState ==='Login' ? 'Sign in' : 'Sign up'}</button>
      </form>
      
      
    </div>
  )
}

export default Login
