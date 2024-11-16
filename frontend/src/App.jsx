import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'

import Navbar from './components/Navbar'
import Guests from './pages/Guests'
import Login from './components/Login'
import AddGuests from './pages/AddGuests'
import GuestList from './pages/GuestList.jsx'

const App = () => {
  return (
    <div className='' >
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/guestslist' element={<GuestList/>}/>
        <Route path='/login' element={<Login/>} />
        <Route path='/addguests' element={<AddGuests/>}/>
        
        <Route path='/guests' element={<Guests/>} />
      </Routes>

    </div>
  )
}

export default App