import mongoose from 'mongoose';

const PostSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        minLength: 3,
        maxLengrh: 30
    },
    text: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 255
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likesId: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Like'
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: [Date],
        default: []
    }
});

export { PostSchema };

