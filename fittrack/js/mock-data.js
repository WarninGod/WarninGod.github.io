// Mock exercise data for frontend presentation
const mockExercises = [
  // CHEST EXERCISES
  {
    id: "0001",
    name: "Barbell Bench Press",
    target: "pectorals",
    bodyPart: "chest",
    equipment: "barbell",
    gifUrl: "https://via.placeholder.com/180x180/FF6536/white?text=Bench+Press",
    instructions: ["Lie flat on bench", "Lower bar to chest", "Press up explosively", "Control the descent"]
  },
  {
    id: "0002",
    name: "Incline Dumbbell Press",
    target: "pectorals",
    bodyPart: "chest",
    equipment: "dumbbell",
    gifUrl: "https://via.placeholder.com/180x180/FF6536/white?text=Incline+Press",
    instructions: ["Set bench to 30-45 degrees", "Press dumbbells up", "Lower with control", "Keep core tight"]
  },
  {
    id: "0003",
    name: "Push-ups",
    target: "pectorals",
    bodyPart: "chest",
    equipment: "body weight",
    gifUrl: "https://via.placeholder.com/180x180/FF6536/white?text=Push+Ups",
    instructions: ["Start in plank position", "Lower body down", "Push back up", "Keep straight line"]
  },
  {
    id: "0004",
    name: "Dumbbell Flyes",
    target: "pectorals",
    bodyPart: "chest",
    equipment: "dumbbell",
    gifUrl: "https://via.placeholder.com/180x180/FF6536/white?text=Flyes",
    instructions: ["Lie on bench", "Open arms wide", "Bring dumbbells together", "Feel chest stretch"]
  },
  {
    id: "0005",
    name: "Cable Crossovers",
    target: "pectorals",
    bodyPart: "chest",
    equipment: "cable",
    gifUrl: "https://via.placeholder.com/180x180/FF6536/white?text=Crossovers",
    instructions: ["Stand between cables", "Bring handles together", "Squeeze chest", "Control return"]
  },

  // BACK EXERCISES
  {
    id: "0006",
    name: "Pull-ups",
    target: "lats",
    bodyPart: "back",
    equipment: "body weight",
    gifUrl: "https://via.placeholder.com/180x180/FF6536/white?text=Pull+Ups",
    instructions: ["Hang from bar", "Pull body up", "Lower slowly", "Full range of motion"]
  },
  {
    id: "0007",
    name: "Bent-over Barbell Row",
    target: "lats",
    bodyPart: "back",
    equipment: "barbell",
    gifUrl: "https://via.placeholder.com/180x180/FF6536/white?text=Barbell+Row",
    instructions: ["Hinge at hips", "Pull bar to chest", "Squeeze shoulder blades", "Lower slowly"]
  },
  {
    id: "0008",
    name: "Lat Pulldown",
    target: "lats",
    bodyPart: "back",
    equipment: "cable",
    gifUrl: "https://via.placeholder.com/180x180/FF6536/white?text=Lat+Pulldown",
    instructions: ["Sit at machine", "Pull bar to chest", "Lean back slightly", "Return with control"]
  },
  {
    id: "0009",
    name: "T-Bar Row",
    target: "lats",
    bodyPart: "back",
    equipment: "machine",
    gifUrl: "https://via.placeholder.com/180x180/FF6536/white?text=T+Bar+Row",
    instructions: ["Straddle T-bar", "Pull to chest", "Keep back straight", "Squeeze at top"]
  },
  {
    id: "0010",
    name: "Seated Cable Row",
    target: "lats",
    bodyPart: "back",
    equipment: "cable",
    gifUrl: "https://via.placeholder.com/180x180/FF6536/white?text=Cable+Row",
    instructions: ["Sit upright", "Pull to torso", "Squeeze shoulder blades", "Keep chest out"]
  },

  // ARM EXERCISES - BICEPS
  {
    id: "0011",
    name: "Barbell Bicep Curls",
    target: "biceps",
    bodyPart: "upper arms",
    equipment: "barbell",
    gifUrl: "https://via.placeholder.com/180x180/FF6536/white?text=Bicep+Curls",
    instructions: ["Stand with feet hip-width", "Curl bar up", "Squeeze at top", "Lower slowly"]
  },
  {
    id: "0012",
    name: "Dumbbell Hammer Curls",
    target: "biceps",
    bodyPart: "upper arms",
    equipment: "dumbbell",
    gifUrl: "https://via.placeholder.com/180x180/FF6536/white?text=Hammer+Curls",
    instructions: ["Hold dumbbells neutral grip", "Curl alternating", "Keep elbows still", "Control movement"]
  },
  {
    id: "0013",
    name: "Preacher Curls",
    target: "biceps",
    bodyPart: "upper arms",
    equipment: "barbell",
    gifUrl: "https://via.placeholder.com/180x180/FF6536/white?text=Preacher+Curls",
    instructions: ["Sit at preacher bench", "Curl with control", "Full range of motion", "Don't swing"]
  },
  {
    id: "0014",
    name: "Cable Bicep Curls",
    target: "biceps",
    bodyPart: "upper arms",
    equipment: "cable",
    gifUrl: "https://via.placeholder.com/180x180/FF6536/white?text=Cable+Curls",
    instructions: ["Stand at cable machine", "Curl handles up", "Squeeze biceps", "Lower with tension"]
  },
  {
    id: "0015",
    name: "21s Bicep Curls",
    target: "biceps",
    bodyPart: "upper arms",
    equipment: "barbell",
    gifUrl: "https://via.placeholder.com/180x180/FF6536/white?text=21s",
    instructions: ["7 bottom half reps", "7 top half reps", "7 full range reps", "No rest between"]
  },

  // ARM EXERCISES - TRICEPS
  {
    id: "0016",
    name: "Close-grip Bench Press",
    target: "triceps",
    bodyPart: "upper arms",
    equipment: "barbell",
    gifUrl: "https://via.placeholder.com/180x180/FF6536/white?text=Close+Grip",
    instructions: ["Narrow grip on bar", "Lower to chest", "Press up", "Focus on triceps"]
  },
  {
    id: "0017",
    name: "Tricep Dips",
    target: "triceps",
    bodyPart: "upper arms",
    equipment: "body weight",
    gifUrl: "https://via.placeholder.com/180x180/FF6536/white?text=Tricep+Dips",
    instructions: ["Support on bars", "Lower body down", "Push back up", "Keep torso upright"]
  },
  {
    id: "0018",
    name: "Overhead Tricep Extension",
    target: "triceps",
    bodyPart: "upper arms",
    equipment: "dumbbell",
    gifUrl: "https://via.placeholder.com/180x180/FF6536/white?text=Overhead+Tricep",
    instructions: ["Hold dumbbell overhead", "Lower behind head", "Extend back up", "Keep elbows still"]
  },
  {
    id: "0019",
    name: "Tricep Pushdowns",
    target: "triceps",
    bodyPart: "upper arms",
    equipment: "cable",
    gifUrl: "https://via.placeholder.com/180x180/FF6536/white?text=Pushdowns",
    instructions: ["Stand at cable machine", "Push handle down", "Squeeze triceps", "Return slowly"]
  },
  {
    id: "0020",
    name: "Diamond Push-ups",
    target: "triceps",
    bodyPart: "upper arms",
    equipment: "body weight",
    gifUrl: "https://via.placeholder.com/180x180/FF6536/white?text=Diamond+Pushups",
    instructions: ["Form diamond with hands", "Lower body down", "Push up", "Feel tricep burn"]
  },

  // LEG EXERCISES - QUADS
  {
    id: "0021",
    name: "Barbell Back Squats",
    target: "quads",
    bodyPart: "upper legs",
    equipment: "barbell",
    gifUrl: "https://via.placeholder.com/180x180/FF6536/white?text=Back+Squats",
    instructions: ["Bar on upper back", "Squat down deep", "Drive through heels", "Keep chest up"]
  },
  {
    id: "0022",
    name: "Front Squats",
    target: "quads",
    bodyPart: "upper legs",
    equipment: "barbell",
    gifUrl: "https://via.placeholder.com/180x180/FF6536/white?text=Front+Squats",
    instructions: ["Bar on front delts", "Squat down", "Keep torso upright", "Drive up"]
  },
  {
    id: "0023",
    name: "Leg Press",
    target: "quads",
    bodyPart: "upper legs",
    equipment: "machine",
    gifUrl: "https://via.placeholder.com/180x180/FF6536/white?text=Leg+Press",
    instructions: ["Sit in machine", "Press weight up", "Lower with control", "Full range"]
  },
  {
    id: "0024",
    name: "Bulgarian Split Squats",
    target: "quads",
    bodyPart: "upper legs",
    equipment: "body weight",
    gifUrl: "https://via.placeholder.com/180x180/FF6536/white?text=Split+Squats",
    instructions: ["Rear foot elevated", "Lower front leg", "Push back up", "Switch legs"]
  },
  {
    id: "0025",
    name: "Walking Lunges",
    target: "quads",
    bodyPart: "upper legs",
    equipment: "body weight",
    gifUrl: "https://via.placeholder.com/180x180/FF6536/white?text=Lunges",
    instructions: ["Step forward", "Lower back knee", "Push off front foot", "Alternate legs"]
  },

  // LEG EXERCISES - HAMSTRINGS
  {
    id: "0026",
    name: "Romanian Deadlift",
    target: "hamstrings",
    bodyPart: "upper legs",
    equipment: "barbell",
    gifUrl: "https://via.placeholder.com/180x180/FF6536/white?text=RDL",
    instructions: ["Hold barbell", "Hinge at hips", "Feel hamstring stretch", "Return to standing"]
  },
  {
    id: "0027",
    name: "Lying Leg Curls",
    target: "hamstrings",
    bodyPart: "upper legs",
    equipment: "machine",
    gifUrl: "https://via.placeholder.com/180x180/FF6536/white?text=Leg+Curls",
    instructions: ["Lie on machine", "Curl heels to glutes", "Squeeze hamstrings", "Lower slowly"]
  },
  {
    id: "0028",
    name: "Good Mornings",
    target: "hamstrings",
    bodyPart: "upper legs",
    equipment: "barbell",
    gifUrl: "https://via.placeholder.com/180x180/FF6536/white?text=Good+Mornings",
    instructions: ["Bar on shoulders", "Hinge at hips", "Keep back straight", "Feel stretch"]
  },
  {
    id: "0029",
    name: "Single Leg RDL",
    target: "hamstrings",
    bodyPart: "upper legs",
    equipment: "dumbbell",
    gifUrl: "https://via.placeholder.com/180x180/FF6536/white?text=Single+RDL",
    instructions: ["Balance on one leg", "Hinge forward", "Touch ground", "Return to standing"]
  },
  {
    id: "0030",
    name: "Nordic Hamstring Curls",
    target: "hamstrings",
    bodyPart: "upper legs",
    equipment: "body weight",
    gifUrl: "https://via.placeholder.com/180x180/FF6536/white?text=Nordic+Curls",
    instructions: ["Kneel with feet secured", "Lower body forward", "Control descent", "Return up"]
  },

  // LEG EXERCISES - GLUTES
  {
    id: "0031",
    name: "Hip Thrusts",
    target: "glutes",
    bodyPart: "upper legs",
    equipment: "barbell",
    gifUrl: "https://via.placeholder.com/180x180/FF6536/white?text=Hip+Thrusts",
    instructions: ["Back on bench", "Thrust hips up", "Squeeze glutes", "Lower slowly"]
  },
  {
    id: "0032",
    name: "Glute Bridges",
    target: "glutes",
    bodyPart: "upper legs",
    equipment: "body weight",
    gifUrl: "https://via.placeholder.com/180x180/FF6536/white?text=Glute+Bridges",
    instructions: ["Lie on back", "Lift hips up", "Squeeze glutes", "Hold at top"]
  },
  {
    id: "0033",
    name: "Clamshells",
    target: "glutes",
    bodyPart: "upper legs",
    equipment: "body weight",
    gifUrl: "https://via.placeholder.com/180x180/FF6536/white?text=Clamshells",
    instructions: ["Lie on side", "Open top knee", "Keep feet together", "Control movement"]
  },
  {
    id: "0034",
    name: "Lateral Lunges",
    target: "glutes",
    bodyPart: "upper legs",
    equipment: "body weight",
    gifUrl: "https://via.placeholder.com/180x180/FF6536/white?text=Lateral+Lunges",
    instructions: ["Step out wide", "Sit back on one leg", "Push off", "Alternate sides"]
  },
  {
    id: "0035",
    name: "Curtsy Lunges",
    target: "glutes",
    bodyPart: "upper legs",
    equipment: "body weight",
    gifUrl: "https://via.placeholder.com/180x180/FF6536/white?text=Curtsy+Lunges",
    instructions: ["Step back diagonally", "Lower into lunge", "Feel glute stretch", "Return to center"]
  },

  // SHOULDER EXERCISES
  {
    id: "0036",
    name: "Shoulder Press",
    target: "delts",
    bodyPart: "shoulders",
    equipment: "dumbbell",
    gifUrl: "https://via.placeholder.com/180x180/FF6536/white?text=Shoulder+Press",
    instructions: ["Hold dumbbells at shoulders", "Press overhead", "Lower with control", "Keep core tight"]
  },
  {
    id: "0037",
    name: "Lateral Raises",
    target: "delts",
    bodyPart: "shoulders",
    equipment: "dumbbell",
    gifUrl: "https://via.placeholder.com/180x180/FF6536/white?text=Lateral+Raises",
    instructions: ["Hold dumbbells at sides", "Raise to shoulder height", "Lead with pinkies", "Lower slowly"]
  },
  {
    id: "0038",
    name: "Front Raises",
    target: "delts",
    bodyPart: "shoulders",
    equipment: "dumbbell",
    gifUrl: "https://via.placeholder.com/180x180/FF6536/white?text=Front+Raises",
    instructions: ["Hold dumbbells at thighs", "Raise to shoulder height", "Keep arms straight", "Lower slowly"]
  },
  {
    id: "0039",
    name: "Rear Delt Flyes",
    target: "delts",
    bodyPart: "shoulders",
    equipment: "dumbbell",
    gifUrl: "https://via.placeholder.com/180x180/FF6536/white?text=Rear+Delt",
    instructions: ["Bend forward slightly", "Open arms wide", "Squeeze shoulder blades", "Control return"]
  },
  {
    id: "0040",
    name: "Arnold Press",
    target: "delts",
    bodyPart: "shoulders",
    equipment: "dumbbell",
    gifUrl: "https://via.placeholder.com/180x180/FF6536/white?text=Arnold+Press",
    instructions: ["Start with palms in", "Rotate and press up", "Reverse on way down", "Full rotation"]
  },

  // CORE EXERCISES
  {
    id: "0041",
    name: "Plank",
    target: "abs",
    bodyPart: "waist",
    equipment: "body weight",
    gifUrl: "https://via.placeholder.com/180x180/FF6536/white?text=Plank",
    instructions: ["Hold plank position", "Keep core tight", "Straight line body", "Breathe steadily"]
  },
  {
    id: "0042",
    name: "Crunches",
    target: "abs",
    bodyPart: "waist",
    equipment: "body weight",
    gifUrl: "https://via.placeholder.com/180x180/FF6536/white?text=Crunches",
    instructions: ["Lie on back", "Hands behind head", "Crunch up", "Lower slowly"]
  },
  {
    id: "0043",
    name: "Russian Twists",
    target: "abs",
    bodyPart: "waist",
    equipment: "body weight",
    gifUrl: "https://via.placeholder.com/180x180/FF6536/white?text=Russian+Twists",
    instructions: ["Sit with feet up", "Lean back slightly", "Twist side to side", "Keep core engaged"]
  },
  {
    id: "0044",
    name: "Mountain Climbers",
    target: "abs",
    bodyPart: "waist",
    equipment: "body weight",
    gifUrl: "https://via.placeholder.com/180x180/FF6536/white?text=Mountain+Climbers",
    instructions: ["Start in plank", "Alternate knee to chest", "Keep fast pace", "Stay in plank"]
  },
  {
    id: "0045",
    name: "Dead Bug",
    target: "abs",
    bodyPart: "waist",
    equipment: "body weight",
    gifUrl: "https://via.placeholder.com/180x180/FF6536/white?text=Dead+Bug",
    instructions: ["Lie on back", "Extend opposite arm/leg", "Keep core engaged", "Alternate sides"]
  },

  // CALF EXERCISES
  {
    id: "0046",
    name: "Standing Calf Raises",
    target: "calves",
    bodyPart: "lower legs",
    equipment: "body weight",
    gifUrl: "https://via.placeholder.com/180x180/FF6536/white?text=Calf+Raises",
    instructions: ["Stand on balls of feet", "Raise heels high", "Squeeze calves", "Lower slowly"]
  },
  {
    id: "0047",
    name: "Seated Calf Raises",
    target: "calves",
    bodyPart: "lower legs",
    equipment: "machine",
    gifUrl: "https://via.placeholder.com/180x180/FF6536/white?text=Seated+Calves",
    instructions: ["Sit at machine", "Place weight on thighs", "Raise heels", "Lower with control"]
  },
  {
    id: "0048",
    name: "Single Leg Calf Raises",
    target: "calves",
    bodyPart: "lower legs",
    equipment: "body weight",
    gifUrl: "https://via.placeholder.com/180x180/FF6536/white?text=Single+Calf",
    instructions: ["Balance on one foot", "Raise heel high", "Control descent", "Switch legs"]
  },

  // CARDIO EXERCISES
  {
    id: "0049",
    name: "Burpees",
    target: "cardiovascular system",
    bodyPart: "cardio",
    equipment: "body weight",
    gifUrl: "https://via.placeholder.com/180x180/FF6536/white?text=Burpees",
    instructions: ["Drop to push-up position", "Do push-up", "Jump feet in", "Jump up with arms overhead"]
  },
  {
    id: "0050",
    name: "Jumping Jacks",
    target: "cardiovascular system",
    bodyPart: "cardio",
    equipment: "body weight",
    gifUrl: "https://via.placeholder.com/180x180/FF6536/white?text=Jumping+Jacks",
    instructions: ["Start with feet together", "Jump feet apart", "Raise arms overhead", "Return to start"]
  }
];

// Mock workout data for presentation
const mockWorkouts = [
  {
    id: 1,
    date: "2025-10-03",
    exercises: [
      { name: "Barbell Bench Press", sets: 3, reps: 12, weight: 80 },
      { name: "Incline Dumbbell Press", sets: 3, reps: 10, weight: 30 },
      { name: "Push-ups", sets: 2, reps: 15, weight: 0 }
    ],
    notes: "Great chest workout! Felt strong today."
  },
  {
    id: 2,
    date: "2025-10-02",
    exercises: [
      { name: "Pull-ups", sets: 4, reps: 8, weight: 0 },
      { name: "Bent-over Barbell Row", sets: 3, reps: 12, weight: 70 },
      { name: "Lat Pulldown", sets: 3, reps: 12, weight: 60 }
    ],
    notes: "Back day complete. Good pump."
  },
  {
    id: 3,
    date: "2025-10-01",
    exercises: [
      { name: "Barbell Back Squats", sets: 4, reps: 10, weight: 100 },
      { name: "Romanian Deadlift", sets: 3, reps: 12, weight: 80 },
      { name: "Walking Lunges", sets: 3, reps: 16, weight: 0 }
    ],
    notes: "Leg day was tough but rewarding!"
  }
];

// Export for use in other files
window.mockExercises = mockExercises;
window.mockWorkouts = mockWorkouts;
