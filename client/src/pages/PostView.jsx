import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { postService, authService } from '../services/api'

export default function PostView() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [comment, setComment] = useState('')
  const user = authService.getCurrentUser()

  useEffect(() => {
    async function load() {
      try {
        const data = await postService.getPost(id)
        setPost(data)
      } catch (err) {
        console.error(err)
      }
    }
    if (id) load()
  }, [id])

  const submitComment = async (e) => {
    e.preventDefault()
    if (!user) return window.location.href = '/login'
    try {
      await postService.addComment(id, { userId: user.id, content: comment })
      const updated = await postService.getPost(id)
      setPost(updated)
      setComment('')
    } catch (err) {
      console.error(err)
      alert('Failed to add comment')
    }
  }

  if (!post) return <div>Loading...</div>
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>

      <section>
        <h3>Comments</h3>
        {Array.isArray(post.comments) && post.comments.length === 0 && <div>No comments yet</div>}
        <ul>
          {post.comments && post.comments.map((c, i) => (
            <li key={i}>{c.content} <small>{c.user ? c.user : 'Anonymous'}</small></li>
          ))}
        </ul>

        <div>
          {user ? (
            <form onSubmit={submitComment}>
              <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
              <button type="submit">Add Comment</button>
            </form>
          ) : (
            <div><Link to="/login">Login</Link> to add comments.</div>
          )}
        </div>
      </section>
    </article>
  )
}
