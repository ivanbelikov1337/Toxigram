import ReactDOM from 'react-dom/client'
import {BrowserRouter} from "react-router-dom"
import AuthProvider from "./context/authContext/AuthContext.tsx";
import QueryProvider from "./lib/reactQuery/QueryProvider.tsx";

import App from './App.tsx'

import './index.css'
import ChatProvider from "./context/chatContext/ChatProvider.tsx";


ReactDOM.createRoot(document.getElementById('root')!).render(
      <BrowserRouter>
          <ChatProvider>
              <QueryProvider>
                  <AuthProvider>
                      <App />
                  </AuthProvider>
              </QueryProvider>
          </ChatProvider>
      </BrowserRouter>
)
