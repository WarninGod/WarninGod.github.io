const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
    exerciseName: {
        type: String,
        required: true,
        trim: true
    },
    reps: {
        type: Number,
        required: true,
        min: 1
    },
    weight: {
        type: Number,
        required: true,
        min: 0
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Workout = mongoose.model('Workout', workoutSchema);

module.exports = Workout;
