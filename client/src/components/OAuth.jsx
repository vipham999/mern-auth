import { useDispatch } from 'react-redux'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

import { app } from '../firebase'
import { signInSuccess } from '../redux/user/userSlice'

const OAuth = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const auth = getAuth(app)

      const result = await signInWithPopup(auth, provider)

      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL
        })
      })
      const data = await res.json()
      dispatch(signInSuccess(data))
      navigate('/')
    } catch (error) {
      console.log('Could not login with google', error)
    }
  }
  return (
    <button
      type='button'
      className='bg-red-700 text-white rounded-lg p-3 uppercase hover:opacity-95'
      onClick={handleGoogleClick}
    >
      Continue with google
    </button>
  )
}

export default OAuth
