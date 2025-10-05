// This event listener ensures the code runs after the HTML document is fully loaded.
document.addEventListener('DOMContentLoaded', () => {
    
    const exerciseList = document.getElementById('exercise-list');
    const apiUrl = 'http://localhost:5000/exercises'; // Your backend URL

    // Use the Fetch API to get data from your backend
    fetch(apiUrl)
        .then(response => response.json()) // Convert the response to JSON
        .then(data => {
            // Clear any loading text
            exerciseList.innerHTML = ''; 

            // Loop through each exercise and create a card for it
            data.forEach(exercise => {
                // Create a div container for the card
                const card = document.createElement('div');
                card.className = 'exercise-card'; // Add a class for styling

                // Create an image element for the GIF
                const image = document.createElement('img');
                image.src = exercise.gifUrl;

                // Create an element for the name
                const name = document.createElement('h3');
                name.textContent = exercise.name;
                
                // Create an element for the muscle group
                const muscleGroup = document.createElement('p');
                muscleGroup.textContent = `Muscle: ${exercise.muscleGroup}`;

                // Add the image, name, and muscle group to the card
                card.appendChild(image);
                card.appendChild(name);
                card.appendChild(muscleGroup);

                // Add the whole card to the list
                exerciseList.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error fetching exercises:', error);
            exerciseList.innerHTML = '<li>Could not load exercises. Is the backend server running?</li>';
        });

    // Add workout form handling
    const logForm = document.getElementById('log-form');

    logForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent the form from reloading the page

        const workoutData = {
            exerciseName: document.getElementById('exercise-input').value,
            reps: document.getElementById('reps-input').value,
            weight: document.getElementById('weight-input').value,
        };

        fetch('http://localhost:5000/workouts/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(workoutData),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            alert('Workout logged successfully!');
            logForm.reset(); // Clear the form
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Failed to log workout.');
        });
    });
});