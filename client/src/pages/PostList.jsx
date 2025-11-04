import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { postService } from '../services/api'
import '../styles/components.css'

export default function PostList() {
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        if (query) {
          const data = await postService.searchPosts(query)
          setPosts(data || [])
        } else {
          const data = await postService.getAllPosts(page, 10)
          setPosts(data || [])
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [page, query])

  return (
    <div className="container">
      <h1 className="text-3xl font-bold mb-6">Blog Posts</h1>
      
      <div className="search-bar">
        <input 
          className="form-control"
          placeholder="Search posts..."
          value={query}
          onChange={(e) => { setQuery(e.target.value); setPage(1) }}
        />
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="post-grid">
          {Array.isArray(posts) && posts.map((post) => (
            <Link to={`/posts/${post._id}`} key={post._id} className="card">
              {post.image && (
                <img 
                  src={`/uploads/${post.image}`}
                  alt={post.title}
                  className="post-image"
                />
              )}
              <div className="post-header">
                <div className="avatar">
                  {post.author?.username?.[0]?.toUpperCase() || '?'}
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{post.title}</h2>
                  <div className="post-meta">
                    {post.author?.username} · {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 line-clamp-3">{post.content}</p>
            </Link>
          ))}
        </div>
      )}

      <div className="pagination">
        <button 
          className="btn btn-primary"
          onClick={() => setPage((s) => Math.max(1, s - 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="text-lg">Page {page}</span>
        <button 
          className="btn btn-primary"
          onClick={() => setPage((s) => s + 1)}
          disabled={posts.length < 10}
        >
          Next
        </button>
      </div>
    </div>
  )
}
