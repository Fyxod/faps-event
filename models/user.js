import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        enum: [
            "admin",
            "scanner"
        ],
    },
    task: {
        type: Number,
        required: true,
        
    }
});

const User = mongoose.model('User', userSchema);

export default User;