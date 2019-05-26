import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const saltRounds = 10;

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true }
});

UserSchema.methods.isCorrectPassword = (password, callback) => bcrypt.compare(password, this.password);

UserSchema.pre('save', function(next) {
    if (this.isNew || this.isModified('password')) {
        bcrypt.hash(this, saltRounds).then( hashedPassword  => {
            this.password = hashedPassword;
            next();
        }, err => {
            next(err);
        })
    } else {
        next();
    }
});

export default mongoose.model('User', UserSchema);