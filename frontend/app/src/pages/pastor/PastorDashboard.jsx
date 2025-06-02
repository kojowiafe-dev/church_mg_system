import React, { useState } from 'react'

const PastorDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');

  const handleAddPost = () => {
    if (newPost.trim() === '') return;
    const post = { id: Date.now(), content: newPost };
    setPosts([post, ...posts]);
    setNewPost('');
  };

  const handleDeletePost = (id) => {
    setPosts(posts.filter((p) => p.id !== id));
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Manage Posts</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Write a new post..."
          className="border p-2 flex-1 rounded"
        />
        <button
          onClick={handleAddPost}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Post
        </button>
      </div>
      <ul className="space-y-3">
        {posts.map((post) => (
          <li key={post.id} className="border p-4 rounded flex justify-between items-start">
            <p>{post.content}</p>
            <button
              onClick={() => handleDeletePost(post.id)}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PastorDashboard