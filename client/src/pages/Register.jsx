import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/api'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = await authService.register(form)
      if (data) {
        // after register, attempt to login
        await authService.login({ email: form.email, password: form.password })
        navigate('/')
      }
    } catch (err) {
      console.error(err)
      alert('Registration failed')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <div>
        <label>Name</label>
        <input name="name" value={form.name} onChange={handleChange} />
      </div>
      <div>
        <label>Email</label>
        <input name="email" value={form.email} onChange={handleChange} />
      </div>
      <div>
        <label>Password</label>
        <input name="password" type="password" value={form.password} onChange={handleChange} />
      </div>
      <button type="submit">Register</button>
    </form>
  )
}
