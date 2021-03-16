const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose');
const  JWT_KEY  = process.env.JWT_KEY

const userSchema = new mongoose.Schema({   
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: String,
    date: Date,
    fullname: String,
    address: {
        city: String,
        district: String,
        ward: String,
        street: String
    },
    phone: String,
    gender: String,
    tokens: [{
        token: {
            type: String,
            required: true
        },
        tokenDevices:{
            type: String,
        } 
    }]
});

userSchema.methods.generateAuthToken = async function(tokenDevices) {
    const user = this
    const token = jwt.sign({_id: user._id}, JWT_KEY)
    user.tokens = user.tokens.concat({token,tokenDevices})
    await user.save()
    return token
}

userSchema.methods.removeAuthToken = async function(getToken) {
    console.log(getToken);
    this.tokens = this.tokens.filter((token) => {
        return token.token != getToken
    })   

    await this.save()
    return getToken
}


userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

userSchema.statics.findByCredentials = async function (email, password) {
    
    const user = await User.findOne({ email } )
    
    if (!user) {
        throw new Error({ error: 'Invalid login credentials' })
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    console.log(isPasswordMatch);
    if (!isPasswordMatch) {
        throw new Error({ error: 'Invalid login credentials' })
    }
    return user
}

const User = mongoose.model('User', userSchema);
module.exports = User;