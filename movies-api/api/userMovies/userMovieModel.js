import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserMovieSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    movieId: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['favorite', 'playlist', 'review'],
        required: true
    },
    review: {
        rating: {
            type: Number,
            min: 1,
            max: 10
        },
        comment: {
            type: String
        },
        date: {
            type: Date,
            default: Date.now
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

UserMovieSchema.index({ userId: 1, movieId: 1, type: 1 }, { unique: true });

UserMovieSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    if (typeof next === 'function') {
        next();
    }
});

export default mongoose.model('UserMovie', UserMovieSchema);

