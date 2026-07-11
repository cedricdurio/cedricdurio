import { Route, Routes } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { Home } from './pages/Home'
import { RestaurantDetail } from './pages/RestaurantDetail'
import { SignIn } from './pages/SignIn'
import { Account } from './pages/Account'

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/restaurant/:id" element={<RestaurantDetail />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/account" element={<Account />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
