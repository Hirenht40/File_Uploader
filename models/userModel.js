const mongoose = require("mongoose");
const bcrypt = require('bcrypt')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
    },
    googleId: {
        type: String,
    } 
});

// static signup method
userSchema.statics.signup = async function(email, password, googleId) {
    // validation
    if (!email) {
        throw Error('Email is required');
    }
    if (!validator.isEmail(email)) {
        throw Error('Email not valid');
    }
    if ((!googleId && !password) || (googleId && password)) {
        throw Error('Either password or googleId must be provided');
    }
    if (password && !validator.isStrongPassword(password)) {
        throw Error('Password not strong enough');
    }

    const exists = await this.findOne({ email });
    if (exists) {
        throw Error('Email already in use');
    }

    let hash;
    if (password) {
        const salt = await bcrypt.genSalt(10);
        hash = await bcrypt.hash(password, salt);
    }

    const user = await this.create({ email, password: hash || null, googleId: googleId || null });
    return user;
};

// static login method
userSchema.statics.login = async function(email, password) {
    if (!email || !password) {
        throw Error('All fields must be filled');
    }

    const user = await this.findOne({ email });
    if (!user) {
        throw Error('Incorrect email');
    }

    if (user.googleId) {
        return user;
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw Error('Incorrect password');
    }

    return user;
};

module.exports = mongoose.model("User", userSchema);
