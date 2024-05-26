import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const Header = () => {
  const { currentUser } = useSelector((state) => state.user)

  console.log(currentUser, 'currentUser')
  return (
    <div className='bg-slate-200'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to={'/'}>
          <h1 className='font-bold'>Auth App</h1>
        </Link>
        <ul className='flex justify-between items-center gap-4'>
          <Link to={'/'}>
            <li>Home</li>
          </Link>
          <Link to={'/about'}>
            <li>About</li>
          </Link>
          {/* <Link to={'/sign-in'}>
            <li>Sign In</li>
          </Link>
          <img
            src={currentUser?.profilePicture}
            alt=''
            className='h-12 w-12 rounded-full border-2 border-white object-cover object-center hover:z-10 focus:z-10'
          />
           */}
          <Link to='/profile'>
            {currentUser ? (
              <img
                src={currentUser?.profilePicture}
                alt='profile'
                className='h-7 w-7 rounded-full object-cover'
              />
            ) : (
              <li>Sign In</li>
            )}
          </Link>
        </ul>
      </div>
    </div>
  )
}

export default Header
