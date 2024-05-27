import { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable
} from 'firebase/storage'
import { app } from '../firebase'

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user)
  const fileRef = useRef()
  const [image, setImage] = useState(undefined)
  const [imagePercentage, setImagePercentage] = useState(0)
  const [imageError, setImageError] = useState(false)
  const [formData, setFormData] = useState({})
  useEffect(() => {
    if (image) {
      handleFileUpload(image)
    }
  }, [image])

  useEffect(() => {
    if (currentUser) {
      setFormData({ ...formData, profilePicture: currentUser?.profilePicture })
    }
  }, [currentUser])

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

  return (
    <div className='max-w-lg mx-auto p-3'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4'>
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
          src={formData?.profilePicture}
          alt='profile'
          className='h-24 w-24 self-center cursor-pointer rounded-full object-cover mt-2'
          onClick={() => fileRef.current.click()}
        />
        <p className='text-sm self-center'>{renderProgressImageUpload}</p>
        <input
          disabled
          defaultValue={currentUser.username}
          type='text'
          id='username'
          placeholder='Username'
          className='bg-slate-100 rounded-lg p-3'
        />
        <input
          disabled
          defaultValue={currentUser.email}
          type='email'
          id='email'
          placeholder='Email'
          className='bg-slate-100 rounded-lg p-3'
        />
        <input
          disabled
          type='password'
          id='password'
          placeholder='Password'
          className='bg-slate-100 rounded-lg p-3'
        />
        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-95'>
          update
        </button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>Sign out</span>
      </div>
    </div>
  )
}

export default Profile
