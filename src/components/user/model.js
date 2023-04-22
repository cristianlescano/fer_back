import mongoose from "mongoose";
const Schema = mongoose.Schema;
const model = mongoose.model;
const SchemaUser = new Schema({
    user: {
        uid: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            unique: true
        },
        pass: String,
        address: String,
        city: String,
        state: String,
        country: String,
        bio: String,
        auth: {
            status: Boolean,
            confirm_code: Number,
            token: {type: String, default: null}
        },
        user: String,
        user_block: {type: Object, default: null}
        
    }
});

export const User = model('Users',SchemaUser);

const reviewSchema = new Schema({
    reviewId: String,
    date: Date,
    from: String,
    by: String,
    plain_text: String,
    rating: Number
})

export const Review = model('reviews', reviewSchema)