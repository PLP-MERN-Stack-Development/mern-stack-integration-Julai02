import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import PostList from './pages/PostList'
import PostView from './pages/PostView'
import PostForm from './pages/PostForm'
import Login from './pages/Login'
import Register from './pages/Register'
import { authService } from './services/api'
import './styles/index.css'
import './styles/components.css'
import './styles/navbar.css'

export default function App() {
  const [user, setUser] = useState(authService.getCurrentUser())
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    setUser(authService.getCurrentUser())
  }, [])

  const logout = () => {
    authService.logout()
    setUser(null)
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-brand">
            Blog App
          </Link>
          
          <div className="navbar-links">
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              Home
            </Link>
            
            {user && (
              <Link 
                to="/create" 
                className={`nav-link ${isActive('/create') ? 'active' : ''}`}
              >
                Create Post
              </Link>
            )}

            {user ? (
              <div className="user-menu">
                <div className="user-avatar">
                  {user.name?.[0]?.toUpperCase() || '?'}
                </div>
                <span className="font-medium">{user.name}</span>
                <button className="logout-button" onClick={logout}>
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`nav-link ${isActive('/login') ? 'active' : ''}`}
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className={`nav-link ${isActive('/register') ? 'active' : ''}`}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/posts/:id" element={<PostView />} />
          <Route path="/create" element={<PostForm />} />
          <Route path="/edit/:id" element={<PostForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  )
}
