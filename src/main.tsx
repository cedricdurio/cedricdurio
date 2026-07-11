import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { LocationProvider } from './context/LocationContext'
import { AuthProvider } from './context/AuthContext'
import { ReviewsProvider } from './context/ReviewsContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <LocationProvider>
          <ReviewsProvider>
            <App />
          </ReviewsProvider>
        </LocationProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
