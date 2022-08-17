import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 30
    },
    text: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 255
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Like'
    }
}, { 
    timestamps: true 
});

export { postSchema };

