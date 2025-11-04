import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { postService } from '../services/api'

export default function PostForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', content: '', category: '' })
  const [file, setFile] = useState(null)

  useEffect(() => {
    if (id) {
      async function load() {
        const data = await postService.getPost(id)
        setForm({ title: data.title, content: data.content, category: data.category })
      }
      load()
    }
  }, [id])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      let payload = form
      let headers = {}
      if (file) {
        const fd = new FormData()
        fd.append('title', form.title)
        fd.append('content', form.content)
        fd.append('category', form.category)
        fd.append('featuredImage', file)
        payload = fd
        headers = { 'Content-Type': 'multipart/form-data' }
      }

      if (id) {
        await postService.updatePost(id, payload, headers)
      } else {
        await postService.createPost(payload, headers)
      }
      navigate('/')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Title</label>
        <input name="title" value={form.title} onChange={handleChange} />
      </div>
      <div>
        <label>Content</label>
        <textarea name="content" value={form.content} onChange={handleChange} />
      </div>
      <div>
        <label>Featured Image</label>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      </div>
      <div>
        <label>Category</label>
        <input name="category" value={form.category} onChange={handleChange} />
      </div>
      <button type="submit">Save</button>
    </form>
  )
}
