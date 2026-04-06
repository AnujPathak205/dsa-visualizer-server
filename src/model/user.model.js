const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema(
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
    isEmailVerified:{
        type:Boolean
    }
  },
  {
    timestamps: true,
  }
)

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return

  this.password = await bcrypt.hash(this.password, 11)
})

userSchema.methods.comparePass = async function (password) {
  let pass = await bcrypt.compare(password, this.password)
  return pass
}

userSchema.methods.generateToken = function () {
  let token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "2d",
  })
  return token
}

const UserModel = new mongoose.model("user", userSchema)

module.exports = UserModel
