import { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable
} from 'firebase/storage'
import { app } from '../firebase'
import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  resetUpdateState
} from '../redux/user/userSlice'

const Profile = () => {
  const { currentUser, loading, error, updateState } = useSelector(
    (state) => state.user
  )
  const fileRef = useRef()
  const [image, setImage] = useState(undefined)
  const [imagePercentage, setImagePercentage] = useState(0)
  const [imageError, setImageError] = useState(false)
  const [formData, setFormData] = useState({})
  const dispatch = useDispatch()

  useEffect(() => {
    return () => dispatch(resetUpdateState())
  }, [])

  useEffect(() => {
    if (image) {
      handleFileUpload(image)
    }
  }, [image])

  const handleFileUpload = async (image) => {
    const storage = getStorage(app)
    const fileName = new Date().getTime() + image.name
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, image)
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setImagePercentage(Math.round(progress))
      },
      (error) => {
        setImageError(true)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, profilePicture: downloadURL })
        })
      }
    )
  }

  const renderProgressImageUpload = useMemo(() => {
    if (imageError) {
      return (
        <span className='text-red-700 text-center'>
          Error uploading (file must be less than 2 MB)
        </span>
      )
    }
    if (imagePercentage > 0 && imagePercentage < 100) {
      return (
        <span className='text-slate-700 text-center'>
          {`Uploading: ${imagePercentage} %`}
        </span>
      )
    }
    if (imagePercentage === 100) {
      return (
        <span className='text-green-700 text-center'>
          Image uploaded successfully
        </span>
      )
    }
    return ''
  }, [imageError, imagePercentage])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      dispatch(updateUserStart())
      const res = await fetch(`/api/user/update/${currentUser?._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await res.json()
      if (data?.success === false) {
        dispatch(updateUserFailure(data?.message))
        return
      }
      dispatch(updateUserSuccess(data))
    } catch (error) {
      dispatch(updateUserFailure(error))
    }
  }

  return (
    <div className='max-w-lg mx-auto p-3'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input
          type='file'
          ref={fileRef}
          hidden
          accept='image/*'
          onChange={(e) => setImage(e.target.files[0])}
        />
        {/* 
      firebase storage rules:
      allow read;
      allow write: if
    	request.resource.size < 2 * 1024 * 1024 &&
      request.resource.contentType.matches('image/.*') */}
        <img
          src={formData?.profilePicture || currentUser?.profilePicture}
          alt='profile'
          className='h-24 w-24 self-center cursor-pointer rounded-full object-cover mt-2'
          onClick={() => fileRef.current.click()}
        />
        <p className='text-sm self-center'>{renderProgressImageUpload}</p>
        <input
          defaultValue={currentUser.username}
          type='text'
          id='username'
          placeholder='Username'
          className='bg-slate-100 rounded-lg p-3'
          onChange={handleChange}
        />
        <input
          defaultValue={currentUser.email}
          type='email'
          id='email'
          placeholder='Email'
          className='bg-slate-100 rounded-lg p-3'
          onChange={handleChange}
        />
        <input
          type='password'
          id='password'
          placeholder='Password'
          className='bg-slate-100 rounded-lg p-3'
          onChange={handleChange}
        />
        <button
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Update'}
        </button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>Sign out</span>
      </div>
      <p className='text-red-700 mt-5'>{error && 'Something went wrong'}</p>
      <p className='text-green-700'>
        {updateState && 'User is updated successfully!'}
      </p>
    </div>
  )
}

export default Profile
