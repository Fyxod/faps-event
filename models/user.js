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
    roles: {
        type: String,
        enum: [
            "admin",
            "user"
        ],
    },
    task: {
        type: Number,
        required: true,
        
    }
});

const User = mongoose.model('User', userSchema);

export default User;
