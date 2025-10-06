// Local-only Exercise Management System
class ExerciseAPI {
    constructor() {
        this.exercises = [];
        this.filteredExercises = [];
        this.currentPage = 1;
        this.exercisesPerPage = 12;
        this.searchTerm = '';
        this.bodyPartFilter = '';
        this.equipmentFilter = '';
    }

    async loadExercises() {
        console.log('🏃‍♂️ Loading local exercise database...');
        try {
            this.exercises = this.getLocalExerciseDatabase();
            this.filteredExercises = [...this.exercises];
            console.log(`✅ Loaded ${this.exercises.length} local exercises successfully`);
            return this.exercises;
        } catch (error) {
            console.error('❌ Error loading local exercises:', error);
            return [];
        }
    }

    getLocalGifPath(exerciseId) {
        return `./exercisedb-api-1-open-source/media/${exerciseId}.gif`;
    }

    getLocalExerciseDatabase() {
        console.log('🗄️ Using local exercise database...');
        
        return [
            {
                id: "pushup_001",
                name: "Push-ups",
                target: "pectorals",
                bodyPart: "chest",
                equipment: "body weight",
                gifUrl: "pushup_001.gif",
                instructions: [
                    "Start in a plank position with hands slightly wider than shoulders",
                    "Lower your body until chest nearly touches the floor",
                    "Push back up to starting position",
                    "Keep your body in a straight line throughout the movement"
                ]
            },
            {
                id: "squat_001",
                name: "Squats",
                target: "quadriceps",
                bodyPart: "legs",
                equipment: "body weight",
                gifUrl: "squat_001.gif",
                instructions: [
                    "Stand with feet shoulder-width apart",
                    "Lower body by bending knees and hips",
                    "Keep chest up and knees behind toes",
                    "Return to standing position"
                ]
            },
            {
                id: "pullup_001",
                name: "Pull-ups",
                target: "lats",
                bodyPart: "back",
                equipment: "pull-up bar",
                gifUrl: "pullup_001.gif",
                instructions: [
                    "Hang from pull-up bar with palms facing away",
                    "Pull body up until chin clears the bar",
                    "Lower back down with control",
                    "Keep core engaged throughout"
                ]
            },
            {
                id: "plank_001",
                name: "Plank",
                target: "abs",
                bodyPart: "core",
                equipment: "body weight",
                gifUrl: "plank_001.gif",
                instructions: [
                    "Get into push-up position",
                    "Lower to forearms",
                    "Keep body in straight line",
                    "Hold position while breathing normally"
                ]
            },
            {
                id: "burpee_001",
                name: "Burpees",
                target: "cardiovascular system",
                bodyPart: "cardio",
                equipment: "body weight",
                gifUrl: "burpee_001.gif",
                instructions: [
                    "Start standing",
                    "Drop into squat, place hands on ground",
                    "Jump feet back to plank, do push-up",
                    "Jump feet back to squat, then jump up"
                ]
            },
            {
                id: "lunge_001",
                name: "Lunges",
                target: "quadriceps",
                bodyPart: "legs",
                equipment: "body weight",
                gifUrl: "lunge_001.gif",
                instructions: [
                    "Step forward with one leg",
                    "Lower hips until both knees at 90 degrees",
                    "Keep front knee over ankle",
                    "Return to starting position"
                ]
            },
            {
                id: "mountain_climber_001",
                name: "Mountain Climbers",
                target: "cardiovascular system",
                bodyPart: "cardio",
                equipment: "body weight",
                gifUrl: "mountain_climber_001.gif",
                instructions: [
                    "Start in plank position",
                    "Bring one knee toward chest",
                    "Quickly switch legs",
                    "Continue alternating at quick pace"
                ]
            },
            {
                id: "jumping_jack_001",
                name: "Jumping Jacks",
                target: "cardiovascular system",
                bodyPart: "cardio",
                equipment: "body weight",
                gifUrl: "jumping_jack_001.gif",
                instructions: [
                    "Start with feet together, arms at sides",
                    "Jump while spreading legs and raising arms",
                    "Jump back to starting position",
                    "Repeat at steady pace"
                ]
            },
            {
                id: "dip_001",
                name: "Dips",
                target: "triceps",
                bodyPart: "upper arms",
                equipment: "body weight",
                gifUrl: "dip_001.gif",
                instructions: [
                    "Position hands on parallel bars or chair",
                    "Lower body by bending elbows",
                    "Push back up to starting position",
                    "Keep body upright throughout"
                ]
            },
            {
                id: "situp_001",
                name: "Sit-ups",
                target: "abs",
                bodyPart: "core",
                equipment: "body weight",
                gifUrl: "situp_001.gif",
                instructions: [
                    "Lie on back with knees bent",
                    "Place hands behind head",
                    "Lift torso toward knees",
                    "Lower back down with control"
                ]
            },
            {
                id: "wall_sit_001",
                name: "Wall Sit",
                target: "quadriceps",
                bodyPart: "legs",
                equipment: "body weight",
                gifUrl: "wall_sit_001.gif",
                instructions: [
                    "Stand with back against wall",
                    "Slide down until thighs parallel to floor",
                    "Keep knees at 90 degrees",
                    "Hold position while breathing normally"
                ]
            },
            {
                id: "high_knees_001",
                name: "High Knees",
                target: "cardiovascular system",
                bodyPart: "cardio",
                equipment: "body weight",
                gifUrl: "high_knees_001.gif",
                instructions: [
                    "Stand with feet hip-width apart",
                    "Run in place lifting knees high",
                    "Bring knees up toward chest",
                    "Pump arms as you run"
                ]
            }
        ];
    }

    getLocalGifErrorHandler(img, exerciseId, exerciseName) {
        const alternatives = [
            `./exercisedb-api-1-open-source/media/${exerciseId}.gif`,
            `./exercisedb-api-1-open-source/gifs/${exerciseId}.gif`,
            `./exercisedb-api-1-open-source/assets/gifs/${exerciseId}.gif`,
            `./exercisedb-api-1-open-source/src/media/${exerciseId}.gif`,
            `./assets/images/exercises/${exerciseId}.gif`,
            `https://via.placeholder.com/300x200/2a2a2a/ffffff?text=${encodeURIComponent(exerciseName)}`
        ];
        
        let currentIndex = 0;
        function tryNext() {
            if (currentIndex < alternatives.length - 1) {
                console.log('🔄 Trying local path:', alternatives[currentIndex]);
                const testImg = new Image();
                testImg.onload = function() {
                    img.src = alternatives[currentIndex];
                    console.log('✅ Local GIF loaded:', alternatives[currentIndex]);
                };
                testImg.onerror = function() {
                    currentIndex++;
                    tryNext();
                };
                testImg.src = alternatives[currentIndex];
            } else {
                img.src = alternatives[alternatives.length - 1];
                console.log('❌ All local GIF sources failed, using placeholder');
            }
        }
        tryNext();
    }

    applyFilters(bodyPart, equipment) {
        this.bodyPartFilter = bodyPart || '';
        this.equipmentFilter = equipment || '';
        this.currentPage = 1;
        
        this.filteredExercises = this.exercises.filter(exercise => {
            const bodyPartMatch = !this.bodyPartFilter || exercise.bodyPart.toLowerCase() === this.bodyPartFilter.toLowerCase();
            const equipmentMatch = !this.equipmentFilter || exercise.equipment.toLowerCase() === this.equipmentFilter.toLowerCase();
            return bodyPartMatch && equipmentMatch;
        });

        this.updateExerciseCount(this.filteredExercises.length);
        this.displayExercises();
        this.renderPagination();
    }

    applySearch() {
        this.currentPage = 1;
        
        if (!this.searchTerm) {
            this.filteredExercises = [...this.exercises];
        } else {
            this.filteredExercises = this.exercises.filter(exercise => 
                exercise.name.toLowerCase().includes(this.searchTerm) ||
                exercise.bodyPart.toLowerCase().includes(this.searchTerm) ||
                exercise.equipment.toLowerCase().includes(this.searchTerm) ||
                exercise.target.toLowerCase().includes(this.searchTerm)
            );
        }
        
        this.updateExerciseCount(this.filteredExercises.length);
        this.displayExercises();
        this.renderPagination();
    }

    displayExercises() {
        const container = document.getElementById('exercise-list');
        if (!container) {
            console.error('❌ Exercise grid container not found');
            return;
        }

        const start = (this.currentPage - 1) * this.exercisesPerPage;
        const end = start + this.exercisesPerPage;
        const exercisesToShow = this.filteredExercises.slice(start, end);

        console.log(`📄 Displaying page ${this.currentPage}: exercises ${start + 1}-${Math.min(end, this.filteredExercises.length)} of ${this.filteredExercises.length}`);

        if (exercisesToShow.length === 0) {
            container.innerHTML = `
                <div class="no-exercises">
                    <ion-icon name="search"></ion-icon>
                    <h3>No exercises found</h3>
                    <p>Try adjusting your search or filter criteria</p>
                </div>
            `;
            this.renderPagination();
            return;
        }

        const exerciseCards = exercisesToShow.map(exercise => `
            <div class="exercise-card" data-exercise-id="${exercise.id}">
                <div class="exercise-image">
                    ${exercise.gifUrl ? 
                        `<img src="./exercisedb-api-1-open-source/media/${exercise.gifUrl}" alt="${exercise.name}" loading="lazy" 
                             onerror="exerciseAPI.getLocalGifErrorHandler(this, '${exercise.id}', '${exercise.name}')" />` :
                        `<div class="placeholder-image">
                            <ion-icon name="fitness"></ion-icon>
                        </div>`
                    }
                </div>
                <div class="exercise-info">
                    <h3 class="exercise-name">${exercise.name}</h3>
                    <p class="exercise-target">Target: ${exercise.target}</p>
                    <p class="exercise-bodypart">Body Part: ${exercise.bodyPart}</p>
                    <p class="exercise-equipment">Equipment: ${exercise.equipment}</p>
                    <div class="exercise-actions">
                        <button class="btn-secondary" onclick="exerciseAPI.showExerciseModal('${exercise.id}')">
                            <ion-icon name="information-circle"></ion-icon>
                            Details
                        </button>
                        <button class="btn-primary" onclick="exerciseAPI.addToWorkout('${exercise.id}')">
                            <ion-icon name="add"></ion-icon>
                            Add to Workout
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        container.innerHTML = exerciseCards;
        this.renderPagination();
    }

    showExerciseModal(exerciseId) {
        const exercise = this.exercises.find(ex => ex.id === exerciseId);
        if (!exercise) return;

        const modal = document.getElementById('exercise-modal');
        const modalContent = document.getElementById('modal-exercise-content');
        
        modalContent.innerHTML = `
            <div class="modal-header">
                <h2>${exercise.name}</h2>
                <span class="close-modal" onclick="exerciseAPI.closeModal()">&times;</span>
            </div>
            <div class="modal-body">
                <div class="exercise-gif">
                    ${exercise.gifUrl ? 
                        `<img src="./exercisedb-api-1-open-source/media/${exercise.gifUrl}" alt="${exercise.name}" 
                             onerror="exerciseAPI.getLocalGifErrorHandler(this, '${exercise.id}', '${exercise.name}')" />` :
                        `<div class="placeholder-gif">
                            <ion-icon name="fitness"></ion-icon>
                            <p>No demonstration available</p>
                        </div>`
                    }
                </div>
                <div class="exercise-details">
                    <div class="detail-group">
                        <h3>Target Muscle</h3>
                        <p>${exercise.target}</p>
                    </div>
                    <div class="detail-group">
                        <h3>Body Part</h3>
                        <p>${exercise.bodyPart}</p>
                    </div>
                    <div class="detail-group">
                        <h3>Equipment</h3>
                        <p>${exercise.equipment}</p>
                    </div>
                    <div class="detail-group">
                        <h3>Instructions</h3>
                        <ol>
                            ${exercise.instructions.map(instruction => `<li>${instruction}</li>`).join('')}
                        </ol>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="btn-primary" onclick="exerciseAPI.addToWorkout('${exercise.id}')">
                        <ion-icon name="add"></ion-icon>
                        Add to Workout
                    </button>
                </div>
            </div>
        `;
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        const modal = document.getElementById('exercise-modal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    addToWorkout(exerciseId) {
        const exercise = this.exercises.find(ex => ex.id === exerciseId);
        if (!exercise) return;

        let workout = JSON.parse(localStorage.getItem('currentWorkout') || '[]');
        
        if (!workout.find(ex => ex.id === exerciseId)) {
            workout.push(exercise);
            localStorage.setItem('currentWorkout', JSON.stringify(workout));
            
            this.showToast(`${exercise.name} added to workout!`, 'success');
            this.updateWorkoutBadge();
        } else {
            this.showToast(`${exercise.name} is already in your workout`, 'info');
        }
    }

    updateWorkoutBadge() {
        const badge = document.getElementById('workout-badge');
        const workout = JSON.parse(localStorage.getItem('currentWorkout') || '[]');
        
        if (badge) {
            if (workout.length > 0) {
                badge.textContent = workout.length;
                badge.style.display = 'block';
            } else {
                badge.style.display = 'none';
            }
        }
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <ion-icon name="${type === 'success' ? 'checkmark-circle' : type === 'error' ? 'alert-circle' : 'information-circle'}"></ion-icon>
            <span>${message}</span>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 3000);
    }

    renderPagination() {
        const container = document.getElementById('pagination');
        if (!container) return;

        const totalPages = Math.ceil(this.filteredExercises.length / this.exercisesPerPage);
        
        if (totalPages <= 1) {
            container.innerHTML = '';
            return;
        }

        let paginationHTML = '<div class="pagination-info">';
        paginationHTML += `<span>Page ${this.currentPage} of ${totalPages}</span>`;
        paginationHTML += '</div><div class="pagination-controls">';

        // First page
        if (this.currentPage > 1) {
            paginationHTML += `<button onclick="exerciseAPI.goToPage(1)" class="page-btn">First</button>`;
        }

        // Previous page
        if (this.currentPage > 1) {
            paginationHTML += `<button onclick="exerciseAPI.goToPage(${this.currentPage - 1})" class="page-btn">Previous</button>`;
        }

        // Page numbers
        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(totalPages, this.currentPage + 2);

        for (let i = startPage; i <= endPage; i++) {
            const activeClass = i === this.currentPage ? 'active' : '';
            paginationHTML += `<button onclick="exerciseAPI.goToPage(${i})" class="page-btn ${activeClass}">${i}</button>`;
        }

        // Next page
        if (this.currentPage < totalPages) {
            paginationHTML += `<button onclick="exerciseAPI.goToPage(${this.currentPage + 1})" class="page-btn">Next</button>`;
        }

        // Last page
        if (this.currentPage < totalPages) {
            paginationHTML += `<button onclick="exerciseAPI.goToPage(${totalPages})" class="page-btn">Last</button>`;
        }

        paginationHTML += '</div>';
        container.innerHTML = paginationHTML;
    }

    goToPage(page) {
        this.currentPage = page;
        this.displayExercises();
        
        // Scroll to top of exercise list
        const container = document.getElementById('exercise-list');
        if (container) {
            container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    updateExerciseCount(count) {
        const countElement = document.getElementById('exercise-count');
        if (countElement) {
            countElement.textContent = `${count} exercise${count !== 1 ? 's' : ''} found`;
        }
    }

    setSearchTerm(term) {
        this.searchTerm = term.toLowerCase();
        this.applySearch();
    }

    clearFilters() {
        this.searchTerm = '';
        this.bodyPartFilter = '';
        this.equipmentFilter = '';
        this.currentPage = 1;
        this.filteredExercises = [...this.exercises];
        
        // Reset UI elements
        const searchInput = document.getElementById('exercise-search');
        if (searchInput) searchInput.value = '';
        
        const bodyPartFilter = document.getElementById('bodypart-filter');
        if (bodyPartFilter) bodyPartFilter.value = '';
        
        const equipmentFilter = document.getElementById('equipment-filter');
        if (equipmentFilter) equipmentFilter.value = '';
        
        this.updateExerciseCount(this.filteredExercises.length);
        this.displayExercises();
        this.renderPagination();
    }
}

// Global instance
const exerciseAPI = new ExerciseAPI();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing Local Exercise System...');
    exerciseAPI.loadExercises().then(() => {
        exerciseAPI.displayExercises();
        exerciseAPI.updateWorkoutBadge();
        exerciseAPI.updateExerciseCount(exerciseAPI.filteredExercises.length);
    });
});
