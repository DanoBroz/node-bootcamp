const crypto = require('crypto')
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [
            true,
            'Please tell us your name!',
        ],
    },
    email: {
        type: String,
        unique: true,
        required: [
            true,
            'Please provide your email address',
        ],
        lowercase: true,
        validate: [
            validator.isEmail,
            'Please provide a valid email address',
        ],
    },
    photo: {
        type: String,
        default: 'default.jpg',
    },
    role: {
        type: String,
        enum: [
            'user',
            'guide',
            'lead-guide',
            'admin',
        ],
        default: 'user',
    },
    password: {
        type: String,
        required: [
            true,
            'Please provide a password',
        ],
        minlength: 8,
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [
            true,
            'Please confirm your password',
        ],
        validate: {
            // this only works on CREATE and SAVE!!
            validator: function (el) {
                return el === this.password
            },
            message: 'Passwords are not the same',
        },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false,
    },
})

userSchema.pre('save', async function (next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password'))
        return next()

    // hast the password iwth cost of 18
    this.password = await bcrypt.hash(
        this.password,
        12
    )

    // Delete passwordConfirm field
    this.passwordConfirm = undefined
    next()
})

userSchema.pre('save', function (next) {
    // if password property isn't modified, do not manipulate passwordChangedAt
    if (
        !this.isModified('password') ||
        this.isNew
    )
        return next()

    this.passwordChangedAt = Date.now() - 1000
    next()
})

userSchema.pre(/^find/, function (next) {
    // this points to current Query
    this.find({ active: { $ne: false } })
    next()
})

userSchema.methods.correctPassword =
    async function (
        candidatePassword,
        userPassword
    ) {
        return await bcrypt.compare(
            candidatePassword,
            userPassword
        )
    }

userSchema.methods.changedPasswordAfter =
    function (JWTTimestamp) {
        if (this.passwordChangedAt) {
            const changedTimestamp = parseInt(
                this.passwordChangedAt.getTime() /
                    1000,
                10
            )
            console.log(
                changedTimestamp,
                JWTTimestamp
            )
            return JWTTimestamp < changedTimestamp
        }

        // false means not changed
        return false
    }

userSchema.methods.createPasswordResetToken =
    function () {
        const resetToken = crypto
            .randomBytes(32)
            .toString('hex')

        this.passwordResetToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex')

        console.log(
            { resetToken },
            {
                passwordResetToken:
                    this.passwordResetToken,
            }
        )

        this.passwordResetExpires =
            Date.now() + 10 * 60 * 1000

        return resetToken
    }

const User = mongoose.model('User', userSchema)

module.exports = User
