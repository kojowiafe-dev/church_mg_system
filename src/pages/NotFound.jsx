import React from 'react'

const NotFound = () => {
  return (
    <div>   
        <h1 className="text-4xl font-bold text-center mt-20">404 - Page Not Found</h1>
        <p className="text-center mt-4">Sorry, the page you are looking for does not exist.</p>
        <div className="flex justify-center mt-6">
            <a href="/" className="text-blue-500 hover:underline">Go back to Home</a>
        </div>
    </div>
  )
}

export default NotFound