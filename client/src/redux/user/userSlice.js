import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentUser: null,
  loading: false,
  error: false,
  updateState: false,
  deleteState: false
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload
      state.loading = false
      state.error = false
    },
    signInFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    updateUserStart: (state) => {
      state.loading = true
    },
    updateUserSuccess: (state, action) => {
      state.loading = false
      state.updateState = true
      state.currentUser = action.payload
    },
    updateUserFailure: (state, action) => {
      state.loading = false
      state.updateState = false
      state.error = action.payload
    },
    deleteUserStart: (state) => {
      state.loading = true
    },
    deleteUserSuccess: (state) => {
      state.loading = false
      state.deleteState = true
      state.currentUser = null
    },
    deleteUserFailure: (state, action) => {
      state.loading = false
      state.deleteState = false
      state.error = action.payload
    },
    resetUpdateState: (state) => {
      state.loading = false
      state.updateState = false
      state.deleteState = false
      state.error = false
    }
  }
})

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  resetUpdateState,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure
} = userSlice.actions
export default userSlice.reducer
