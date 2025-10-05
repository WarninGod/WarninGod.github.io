const express = require('express');
const router = express.Router();
const Workout = require('../models/workout.model');

// POST route to add a new workout
router.post('/add', async (req, res) => {
    try {
        const { exerciseName, reps, weight } = req.body;

        // Validate required fields
        if (!exerciseName || !reps || !weight) {
            return res.status(400).json({
                success: false,
                message: 'Please provide exerciseName, reps, and weight'
            });
        }

        // Create new workout
        const newWorkout = new Workout({
            exerciseName,
            reps: parseInt(reps),
            weight: parseFloat(weight)
        });

        // Save to database
        const savedWorkout = await newWorkout.save();

        res.status(201).json({
            success: true,
            message: 'Workout logged successfully!',
            workout: savedWorkout
        });

    } catch (error) {
        console.error('Error saving workout:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to log workout',
            error: error.message
        });
    }
});

// GET route to retrieve all workouts
router.get('/', async (req, res) => {
    try {
        const workouts = await Workout.find().sort({ date: -1 });
        res.json({
            success: true,
            workouts
        });
    } catch (error) {
        console.error('Error fetching workouts:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch workouts',
            error: error.message
        });
    }
});

// GET route to retrieve workouts by exercise name
router.get('/exercise/:exerciseName', async (req, res) => {
    try {
        const { exerciseName } = req.params;
        const workouts = await Workout.find({ 
            exerciseName: new RegExp(exerciseName, 'i') 
        }).sort({ date: -1 });
        
        res.json({
            success: true,
            workouts
        });
    } catch (error) {
        console.error('Error fetching workouts by exercise:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch workouts for this exercise',
            error: error.message
        });
    }
});

module.exports = router;
