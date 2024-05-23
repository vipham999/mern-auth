import bcryptjs from 'bcryptjs'
import User from '../models/user.model.js'
import { errorHandler } from '../utils/error.js'
import jwt from 'jsonwebtoken'

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body
  const hashedPassword = bcryptjs.hashSync(password, 10)

  const newUser = new User({ username, email, password: hashedPassword })
  try {
    await newUser.save()
    res.status(201).json({ message: 'User created successfully' })
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
