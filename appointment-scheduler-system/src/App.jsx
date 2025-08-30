import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AppointmentBooking from '../UserFrontend/User'
import Admin from '../AdminPages/Admin'
import EnhancedAdmin from '../AdminPages/EnhancedAdmin'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        {/* <AppointmentBooking /> */}
        {/* <Admin /> */}
        <EnhancedAdmin />
     
    </>
  )
}

export default App
