const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: String,
    passwordHash: String,
    todos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Note",
        },
    ],
});

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        console.log('here')
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
      // the passwordHash should not be revealed
      delete returnedObject.passwordHash
    }
  })

const User = mongoose.model('User', userSchema);

module.exports = User