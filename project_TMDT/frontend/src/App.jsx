
import { Outlet } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CartValidator from './components/CartValidator'

function App() {
 

  return (
    <>
     <CartValidator />
     <Navbar/>
     <Outlet/>
     <Footer/>
    </>
  )
}

export default App
