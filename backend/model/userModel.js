import mongoose from "mongoose";
import bcrypt from "bcryptjs"


const userSchema = new mongoose.Schema({
   name: {
     type: String,
     required: true,
   },
   email: {
     type: String,
     required: true,
     unique: true,
   },
   password: {
     type: String,
     required: true
   },
   isAdmin: {
     type: Boolean,
     required: true,
     default: false
   }
}, {
    timestamps: true
})

// this.password is the pwd which is store in the database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

// pre mean sthing we want to do before saving (ex: hashing the pwd before saving)
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {

        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model("User", userSchema);

export default User;

