import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 255
    },
    username: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        minLength: 5,
        maxLength: 255
    },
    age: {
        type: Number,
        required: true,
        min: 12,
        max: 255,
        validate: {
            validator: Number.isInteger,
            message: 'Age must be integer.'
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minLength: 5,
        maxLength: 255,
        match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Enter a valid email address.']
    },
    phoneNumber: {
        type: String,
        required: true,
        minLength: 11,
        maxLength: 11,
        match: [/^09(0[1-9]|1[0-9]|2[1-9]|3[1-9])[0-9]{7}$/, `Enter a phone number in '09*********' format.`]
    },
    password: {
        type: String,
        required: true,
        minLength: [7, 'Password must be at least be 7 characters long.'],
        maxLength: 1999
    },
    posts: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Post'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

export { UserSchema };