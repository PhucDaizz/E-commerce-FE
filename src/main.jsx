import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './Context/AuthContext.jsx';
import { CategoryProvider } from './Context/CategoryContext.jsx';
import { SearchProvider } from './Context/SearchContext.jsx';
import { AdminProvider } from './Context/AdminContext.jsx';
import { ProductProvider } from './Context/ProductContext.jsx';
import { ShippingProvider } from './Context/ShippingContext.jsx';
import { DashboardProvider } from './Context/DashboardContext.jsx';
import { ChatProvider } from './Context/ChatContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CategoryProvider>
          <SearchProvider>
              <AdminProvider>
                <ProductProvider>
                  <ShippingProvider>
                    <DashboardProvider>
                      <ChatProvider>
                        <App />
                      </ChatProvider>
                    </DashboardProvider>
                  </ShippingProvider>
                </ProductProvider>
              </AdminProvider>
          </SearchProvider>
      </CategoryProvider>
    </AuthProvider>
  </StrictMode>,
)
