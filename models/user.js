const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const {Schema} = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: [true, 'Enter First Name'],
    },
    lastName: {
        type: String,
        required: [true, 'Enter Last Name'],
    },
    email: {
        type: String,
        required: [true, 'Enter email address.'],
        unique: [true, 'Already exist account in this email.'],
    },
    password: {
        type: String,
        required: [true, 'Enter password'],
        minLength: [8, 'Password must be 8 characters long.'],
    },
})


userSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        const salt = bcrypt.genSaltSync(10);
        this.password = bcrypt.hashSync(this.password, salt);
    }
    next(); 
});

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);