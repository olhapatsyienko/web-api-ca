import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

UserSchema.methods.comparePassword = async function (passw) { 
    return await bcrypt.compare(passw, this.password); 
};
UserSchema.statics.findByUserName = function (username) {
    return this.findOne({ username: username });
};


UserSchema.pre('save', async function() {
    const saltRounds = 10; // You can adjust the number of salt rounds
    // Only hash the password if it has been modified or is new
    if (this.isModified('password') || this.isNew) {
      try {
        const hash = await bcrypt.hash(this.password, saltRounds);
        this.password = hash;
      } catch (error) {
        // If hashing fails, throw the error - Mongoose will handle it
        throw error;
      }
    }
  });
  

export default mongoose.model('User', UserSchema);
