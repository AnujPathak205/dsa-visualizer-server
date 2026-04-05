const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const tempUserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    otp:{
        type:Number
    },
    otpExpiry:{
        type:Date
    }
  },
  {
    timestamps: true,
  }
)

tempUserSchema.pre("save", async function () {
  if (!this.isModified("password")) return

  this.password = await bcrypt.hash(this.password, 11)
})


const TempUserModel = new mongoose.model("tempUser", tempUserSchema)

module.exports = TempUserModel
