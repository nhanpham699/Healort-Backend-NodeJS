const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const  JWT_KEY  = process.env.JWT_KEY

const doctorSchema = new mongoose.Schema({   
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    experience: Number,
    avatar: String,
    birthyear: String,
    fullname: String,
    hometown: String,
    phone: String,
    gender: String,
    description: String,
    review: [{
        rating: Number,
        comment: String,
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        scheduleId: { type: Schema.Types.ObjectId, ref: 'schedule' },
        state: Number
    }],
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

doctorSchema.methods.generateAuthToken = async function(tokenDevices) {
    const doctor = this
    const token = jwt.sign({_id: doctor._id}, JWT_KEY)
    doctor.tokens = doctor.tokens.concat({token,tokenDevices})
    await doctor.save()
    return token
}

doctorSchema.methods.removeAuthToken = async function(getToken) {
    console.log(getToken);
    this.tokens = this.tokens.filter((token) => {
        return token.token != getToken
    })   

    await this.save()
    return getToken
}


doctorSchema.pre('save', async function (next) {
    const doctor = this
    if (doctor.isModified('password')) {
        doctor.password = await bcrypt.hash(doctor.password, 8)
    }
    next()
})

doctorSchema.statics.findByCredentials = async function (email, password) {
    const doctor = await Doctor.findOne({ email } )
    console.log(doctor);
    if (!doctor) {
        throw new Error({ error: 'Invalid login credentials' })
    }
    const isPasswordMatch = await bcrypt.compare(password, doctor.password)
    console.log(isPasswordMatch);
    if (!isPasswordMatch) {
        throw new Error({ error: 'Invalid login credentials' })
    }
    return doctor
}

const Doctor = mongoose.model('doctor', doctorSchema);
module.exports = Doctor;