import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './Context/AuthContext.jsx';
import { CategoryProvider } from './Context/CategoryContext.jsx';
import { SearchProvider } from './Context/SearchContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CategoryProvider>
          <SearchProvider>
            <App />
          </SearchProvider>
      </CategoryProvider>
    </AuthProvider>
  </StrictMode>,
)
