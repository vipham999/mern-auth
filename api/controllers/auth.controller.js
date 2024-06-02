import bcryptjs from 'bcryptjs'
import User from '../models/user.model.js'
import { errorHandler } from '../utils/error.js'
import jwt from 'jsonwebtoken'

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body
  const hashedPassword = bcryptjs.hashSync(password, 10)

  const newUser = new User({ username, email, password: hashedPassword })
  try {
    // save in database
    await newUser.save()
    res.status(201).json({
      message: 'User created successfully',
      data: newUser
    })
  } catch (err) {
    next(err)
    // custom error message
    // next(errorHandler(300, 'something went wrong'))
  }
}

export const signin = async (req, res, next) => {
  const { email, password } = req.body
  try {
    // Access DB to find user
    const validUser = await User.findOne({ email })
    // const { password, ...userResponse } = validUser
    if (!validUser) return next(errorHandler(404, 'User not found'))
    // Compare user's password from req with user's password in DB
    const validPassword = bcryptjs.compareSync(password, validUser.password)
    if (!validPassword) return next(errorHandler(401, 'wrong credentials'))
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET)

    const { password: hashedPassword, ...rest } = validUser._doc

    const expiryDate = new Date(Date.now() + 3600000) // 1 hour
    res
      .cookie('access_token', token, { httpOnly: true, expires: expiryDate })
      .status(200)
      .json(rest)
  } catch (error) {
    next(error)
  }
}

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (user) {
      // generate token
      const token = jwt.sign({ id: user?._id }, process.env.JWT_SECRET)
      const { password: hashedPassword, ...rest } = user._doc

      const expiryDate = new Date(Date.now() + 3600000) // 1 hour
      // set token to cookie
      res
        .cookie('access_token', token, { httpOnly: true, expires: expiryDate })
        .status(200)
        .json(rest)
    } else {
      // Create User Using Email to register
      // Because password and username are required, so we must random 2 values
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8)

      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10)

      const newUser = new User({
        username:
          req.body.name?.split(' ').join('').toLowerCase() +
          Math.random().toString(36).slice(-8),
        password: hashedPassword,
        email: req.body.email,
        profilePicture: req.body.photo
      })
      // save in database
      await newUser.save()
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET)
      const { password: hashedPassword2, ...rest } = newUser._doc
      const expiryDate = new Date(Date.now() + 3600000) // 1 hour
      // set token to cookie
      res
        .cookie('access_token', token, { httpOnly: true, expires: expiryDate })
        .status(200)
        .json(rest)
    }
  } catch (error) {
    next(error)
  }
}

export const signout = async (req, res) => {
  res.clearCookie('access_token').status(200).json('Signout success!')
}
