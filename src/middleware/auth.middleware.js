const jwt = require("jsonwebtoken")
const UserModel = require("../model/user.model")

const authMiddleware = async (req, res, next) => {
  try {
    let token = req.cookies.token
    if (!token)
      return res.status(404).json({
        message: "Token not found",
      })

    // let isBlacklisted = await cacheInstance.get(token)

    // if (isBlacklisted)
    //   return res.status(400).json({
    //     message: "Token blacklisted",
    //   })

    let decode = jwt.verify(token, process.env.JWT_SECRET)

    let user = await UserModel.findById(decode.id).select("-password")

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      })
    }

    req.user = user
    next()
  } catch (error) {
    console.log("Error in middleware", error)
  }
}

module.exports = authMiddleware
