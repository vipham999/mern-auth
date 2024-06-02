import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const PrivateRoute = () => {
  const { currentUser } = useSelector((state) => state.user)
  // Outlet: if currentUser is not null, show children inside route
  return currentUser ? <Outlet /> : <Navigate to='/sign-in' />
}

export default PrivateRoute
