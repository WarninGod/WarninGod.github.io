// FitTrack Exercise Database Integration
// Now uses backend cached database with 1500+ exercises

// Global exercise data - will be loaded from backend
window.exerciseDatabase = [];
window.mockExercises = []; // Fallback compatibility

// Fetch exercises from backend database
async function loadExerciseDatabase() {
    try {
        console.log('🔄 Loading exercise database from backend...');
        const response = await fetch('http://localhost:5000/exercises-cached');
        
        if (response.ok) {
            const exercises = await response.json();
            console.log(`✅ Loaded ${exercises.length} exercises from backend database`);
            
            // Store in global variables
            window.exerciseDatabase = exercises;
            window.mockExercises = exercises; // For compatibility
            
            // Update stats on homepage
            updateExerciseStats(exercises.length);
            
            return exercises;
        } else {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.warn('⚠️ Backend database unavailable, using fallback data:', error.message);
        
        // Fallback to local mock data
        window.exerciseDatabase = fallbackExercises;
        window.mockExercises = fallbackExercises;
        
        updateExerciseStats(fallbackExercises.length);
        return fallbackExercises;
    }
}

// Update exercise statistics on page
function updateExerciseStats(count) {
    // Update homepage stats
    const exerciseCountElements = [
        document.getElementById('exercises-count'),
        document.getElementById('total-exercises'),
        document.querySelector('[data-stat="exercises"]')
    ];
    
    exerciseCountElements.forEach(element => {
        if (element) {
            element.textContent = count + '+';
        }
    });
    
    // Update any text that mentions exercise count
    const exerciseTexts = document.querySelectorAll('.exercise-count-text');
    exerciseTexts.forEach(element => {
        if (element) {
            element.textContent = element.textContent.replace(/\d+\+?/, count + '+');
        }
    });
}

// Fallback exercise data (reduced set for offline mode)
const fallbackExercises = [
    {
        id: "fallback-1",
        name: "Push-ups",
        target: "chest",
        bodyPart: "upper body",
        equipment: "body weight",
        gifUrl: null,
        instructions: [
            "Start in a plank position with arms extended",
            "Lower your body until chest nearly touches floor",
            "Push back up to starting position",
            "Keep core engaged throughout movement"
        ],
        targetMuscles: ["chest"],
        secondaryMuscles: ["triceps", "shoulders"]
    },
    {
        id: "fallback-2", 
        name: "Squats",
        target: "quadriceps",
        bodyPart: "lower body",
        equipment: "body weight",
        gifUrl: null,
        instructions: [
            "Stand with feet shoulder-width apart",
            "Lower body as if sitting back into a chair",
            "Keep chest up and knees behind toes",
            "Return to standing position"
        ],
        targetMuscles: ["quadriceps"],
        secondaryMuscles: ["glutes", "hamstrings"]
    },
    {
        id: "fallback-3",
        name: "Planks",
        target: "core",
        bodyPart: "core",
        equipment: "body weight", 
        gifUrl: null,
        instructions: [
            "Start in push-up position",
            "Lower to forearms",
            "Keep body in straight line",
            "Hold position while breathing normally"
        ],
        targetMuscles: ["core"],
        secondaryMuscles: ["shoulders", "back"]
    }
];

// Sample workout history (for demo purposes)
window.mockWorkouts = [
    {
        id: 1,
        date: "2025-10-04",
        exercises: [
            { name: "Push-ups", sets: 3, reps: 15, weight: "bodyweight" },
            { name: "Squats", sets: 3, reps: 20, weight: "bodyweight" }
        ],
        duration: "30 minutes",
        notes: "Great workout! Feeling strong."
    },
    {
        id: 2,
        date: "2025-10-02",
        exercises: [
            { name: "Planks", sets: 3, reps: "60s", weight: "bodyweight" },
            { name: "Lunges", sets: 3, reps: 12, weight: "bodyweight" }
        ],
        duration: "25 minutes", 
        notes: "Core focused session"
    },
    {
        id: 3,
        date: "2025-09-30",
        exercises: [
            { name: "Burpees", sets: 3, reps: 10, weight: "bodyweight" },
            { name: "Mountain Climbers", sets: 3, reps: 20, weight: "bodyweight" }
        ],
        duration: "20 minutes",
        notes: "High intensity cardio"
    }
];

// Initialize database on page load
document.addEventListener('DOMContentLoaded', function() {
    loadExerciseDatabase();
});

// Export functions for global use
window.loadExerciseDatabase = loadExerciseDatabase;
window.updateExerciseStats = updateExerciseStats;
