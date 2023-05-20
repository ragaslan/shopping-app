import React from 'react'

function AuthLayout({children}) {
  return (
    <div className='authContainer'>
        {children}
    </div>
  )
}

export default AuthLayout