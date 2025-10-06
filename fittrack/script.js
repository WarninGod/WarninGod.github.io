
document.addEventListener('DOMContentLoaded', () => {
    
    const exerciseList = document.getElementById('exercise-list');
    const apiUrl = 'http:

    
    fetch(apiUrl)
        .then(response => response.json()) 
        .then(data => {
            
            exerciseList.innerHTML = ''; 

            
            data.forEach(exercise => {
                
                const card = document.createElement('div');
                card.className = 'exercise-card'; 

                
                const image = document.createElement('img');
                image.src = exercise.gifUrl;

                
                const name = document.createElement('h3');
                name.textContent = exercise.name;
                
                
                const muscleGroup = document.createElement('p');
                muscleGroup.textContent = `Muscle: ${exercise.muscleGroup}`;

                
                card.appendChild(image);
                card.appendChild(name);
                card.appendChild(muscleGroup);

                
                exerciseList.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error fetching exercises:', error);
            exerciseList.innerHTML = '<li>Could not load exercises. Is the backend server running?</li>';
        });

    
    const logForm = document.getElementById('log-form');

    logForm.addEventListener('submit', (event) => {
        event.preventDefault(); 

        const workoutData = {
            exerciseName: document.getElementById('exercise-input').value,
            reps: document.getElementById('reps-input').value,
            weight: document.getElementById('weight-input').value,
        };

        fetch('http:
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
            logForm.reset(); 
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Failed to log workout.');
        });
    });
});
