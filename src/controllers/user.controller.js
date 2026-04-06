const TempUserModel = require("../model/tempUser.model")
const UserModel = require("../model/user.model")
const { emailQueue } = require("../queues/emailQueue")

const registerController = async (req, res) => {
  try {
    let { fullName, userName, email, password } = req.body

    if (!fullName || !email || !userName || !password) {
      return res.status(404).json({
        message: "All fields are required",
      })
    }

    const existingUser = await UserModel.findOne({ email })

    if (existingUser) {
      return res.status(422).json({
        message: "user already exists",
      })
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000)

    const tempUser = await TempUserModel.create({
      fullName,
      userName,
      email,
      password,
      otp,
      otpExpiry,
    })

    await emailQueue.add("verify-email", {
      email,
      username,
      otp,
      otpExpiry,
    })

    // const newUser = await UserModel.create({
    //     fullName,
    //     userName,
    //     email,
    //     password
    // })

    // if (!newUser) {
    //     return res.status(400).json({
    //         message:"something went wrong!"
    //     })
    // }

    return res.status(200).json({
      message: "OTP sent to your email. please verify!",
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Internal server error ",
      error: error,
    })
  }
}
const loginController = async (req, res) => {
  try {
    let { email, password } = req.body

    if (!email || !password) {
      return res.status(404).json({
        message: "All fields are required",
      })
    }

    const user = await UserModel.findOne({ email })

    if (!user) {
      return res.status(404).json({
        message: "user not found",
      })
    }

    let token = user.generateToken()
    const isProduction = process.env.NODE_ENV == "production"
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 2 * 24 * 60 * 60 * 1000,
    })

    return res.status(201).json({
      message: "user login successfully!",
      user: user,
      token: token,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Internal server error ",
      error: error,
    })
  }
}

const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body

    const tempUser = await TempUserModel.findOne({ email })

    if (!tempUser) {
      return res.status(400).json({ message: "OTP expired" })
    }

    if (tempUser.otpExpiry < Date.now()) {
      await TempUserModel.deleteOne({ email })
      return res.status(400).json({ message: "OTP expired" })
    }

    if (tempUser.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" })
    }

    let newUser = await UserModel.create({
      fullName: tempUser.fullName,
      userName: tempUser.userName,
      email: tempUser.email,
      password: tempUser.password,
      isEmailVerified: true,
    })

    let token = newUser.generateToken()
    const isProduction = process.env.NODE_ENV == "production"
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 2 * 24 * 60 * 60 * 1000,
    })

    await TempUserModel.deleteOne({ email })

    await emailQueue.add("welcome-email", {
      email: newUser.email,
      name: newUser.fullName,
    })

    return res.status(200).json({
      message: "OTP verified successfully",
      token,
      user: newUser,
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Internal server error ",
      error: error,
    })
  }
}

module.exports = { registerController, loginController }
