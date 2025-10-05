// Exercises page functionality with backend database integration
class ExerciseManager {
    constructor() {
        this.exercises = [];
        this.filteredExercises = [];
        this.currentPage = 1;
        this.exercisesPerPage = 12;
        this.currentFilter = 'all';
        this.currentSearch = '';
        this.searchDebounceTimer = null;
        this.init();
    }
    
    debounce(func, wait) {
        return (...args) => {
            clearTimeout(this.searchDebounceTimer);
            this.searchDebounceTimer = setTimeout(() => func.apply(this, args), wait);
        };
    }

    init() {
        this.bindEvents();
        this.loadExercises();
    }

    bindEvents() {
        // Filter buttons
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.muscle);
            });
        });

        // Search input
        const searchInput = document.getElementById('exercise-search');
        if (searchInput) {
            const debouncedSearch = this.debounce((value) => {
                this.setSearch(value);
            }, 300);
            
            searchInput.addEventListener('input', (e) => {
                debouncedSearch(e.target.value);
            });
        }
    }

    async loadExercises() {
        const exerciseList = document.getElementById('exercise-list');
        
        try {
            // Show loading state
            if (exerciseList) {
                exerciseList.innerHTML = '<p class="loading">Loading exercises from database...</p>';
            }

            // Load from backend database first
            console.log('🔄 Loading exercises from backend database...');
            const response = await fetch('http://localhost:5000/exercises-cached');
            
            if (response.ok) {
                const exercises = await response.json();
                console.log(`✅ Loaded ${exercises.length} exercises from backend database`);
                this.exercises = exercises;
                
                // Update global reference for compatibility
                window.mockExercises = exercises;
                window.exerciseDatabase = exercises;
                
                // Update exercise count display
                this.updateExerciseCount(exercises.length);
                
            } else {
                throw new Error(`Backend response: ${response.status}`);
            }
        } catch (error) {
            console.warn('⚠️ Backend unavailable, using fallback exercises:', error.message);
            
            // Fallback to window.mockExercises if available
            if (window.mockExercises && window.mockExercises.length > 0) {
                this.exercises = window.mockExercises;
            } else {
                // Final fallback to minimal exercise set
                this.exercises = [
                    {
                        id: "fallback-1",
                        name: "Push-ups",
                        target: "chest",
                        bodyPart: "upper body",
                        equipment: "body weight",
                        instructions: ["Start in plank position", "Lower chest to ground", "Push back up"]
                    },
                    {
                        id: "fallback-2",
                        name: "Squats", 
                        target: "quadriceps",
                        bodyPart: "lower body",
                        equipment: "body weight",
                        instructions: ["Stand with feet apart", "Lower as if sitting", "Return to standing"]
                    },
                    {
                        id: "fallback-3",
                        name: "Planks",
                        target: "core",
                        bodyPart: "core", 
                        equipment: "body weight",
                        instructions: ["Hold plank position", "Keep body straight", "Breathe normally"]
                    }
                ];
            }
        }

        // Initialize the display
        this.applyFilters();
    }

    updateExerciseCount(count) {
        // Update any elements showing exercise count
        const countElements = document.querySelectorAll('.exercise-count, #total-exercises');
        countElements.forEach(element => {
            if (element) {
                element.textContent = count + '+';
            }
        });
        
        console.log(`📊 Exercise database loaded: ${count} exercises available`);
    }

    updateStats() {
        // Update total exercises count
        const totalExercisesEl = document.getElementById('total-exercises');
        if (totalExercisesEl) {
            totalExercisesEl.textContent = this.exercises.length;
        }

        // Update filtered count
        const filteredCountEl = document.getElementById('filtered-count');
        if (filteredCountEl) {
            filteredCountEl.textContent = this.filteredExercises.length;
        }
    }

    setFilter(muscle) {
        this.currentFilter = muscle;
        this.currentPage = 1;
        
        // Update filter button states
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-muscle="${muscle}"]`).classList.add('active');
        
        this.applyFilters();
    }

    setSearch(searchTerm) {
        this.currentSearch = searchTerm.toLowerCase();
        this.currentPage = 1;
        this.applyFilters();
    }

    applyFilters() {
        this.filteredExercises = this.exercises.filter(exercise => {
            const matchesFilter = this.currentFilter === 'all' || 
                                  this.getExerciseMuscleGroup(exercise) === this.currentFilter;
            
            const matchesSearch = !this.currentSearch || 
                                  exercise.name.toLowerCase().includes(this.currentSearch) ||
                                  exercise.target.toLowerCase().includes(this.currentSearch) ||
                                  exercise.bodyPart.toLowerCase().includes(this.currentSearch);
            
            return matchesFilter && matchesSearch;
        });

        this.renderExercises();
        this.renderPagination();
        this.updateStats();
    }

    getExerciseMuscleGroup(exercise) {
        // Map exercise targets to our muscle groups
        const muscleMap = {
            // Arms
            'biceps': 'arms',
            'triceps': 'arms',
            'forearms': 'arms',
            
            // Legs  
            'quadriceps': 'legs',
            'hamstrings': 'legs',
            'calves': 'legs',
            'glutes': 'legs',
            'adductors': 'legs',
            'abductors': 'legs',
            
            // Chest
            'pectorals': 'chest',
            'chest': 'chest',
            
            // Back
            'lats': 'back',
            'traps': 'back',
            'rhomboids': 'back',
            'erector spinae': 'back',
            'middle back': 'back',
            'lower back': 'back',
            'upper back': 'back',
            
            // Core
            'abs': 'core',
            'obliques': 'core',
            'serratus anterior': 'core',
            
            // Shoulders
            'shoulders': 'shoulders',
            'delts': 'shoulders',
            'rear delts': 'shoulders',
            'front delts': 'shoulders',
            'side delts': 'shoulders'
        };

        const target = exercise.target ? exercise.target.toLowerCase() : '';
        const bodyPart = exercise.bodyPart ? exercise.bodyPart.toLowerCase() : '';
        
        // Check target first, then bodyPart
        if (muscleMap[target]) {
            return muscleMap[target];
        }
        
        // Check bodyPart mappings
        if (bodyPart.includes('upper') || bodyPart.includes('chest') || bodyPart.includes('arms')) {
            if (target.includes('chest') || target.includes('pectorals')) return 'chest';
            if (target.includes('biceps') || target.includes('triceps')) return 'arms';
            if (target.includes('shoulders') || target.includes('delts')) return 'shoulders';
            if (target.includes('back') || target.includes('lats') || target.includes('traps')) return 'back';
        }
        
        if (bodyPart.includes('lower') || bodyPart.includes('legs')) {
            return 'legs';
        }
        
        if (bodyPart.includes('waist') || bodyPart.includes('core')) {
            return 'core';
        }
        
        // Default fallback based on common patterns
        if (target.includes('cardiovascular')) return 'fullbody';
        
        return 'fullbody'; // Default
    }

    renderExercises() {
        const exerciseList = document.getElementById('exercise-list');
        if (!exerciseList) return;

        const startIndex = (this.currentPage - 1) * this.exercisesPerPage;
        const endIndex = startIndex + this.exercisesPerPage;
        const exercisesToShow = this.filteredExercises.slice(startIndex, endIndex);

        if (exercisesToShow.length === 0) {
            exerciseList.innerHTML = '<p class="no-exercises">No exercises found. Try adjusting your filters.</p>';
            return;
        }

        exerciseList.innerHTML = exercisesToShow.map(exercise => `
            <div class="exercise-card" data-exercise="${exercise.name}">
                <div class="exercise-image">
                    ${exercise.gifUrl ? 
                        `<img src="${exercise.gifUrl}" alt="${exercise.name}" loading="lazy" onerror="this.style.display='none'">` :
                        `<div class="exercise-placeholder">
                            <ion-icon name="fitness-outline"></ion-icon>
                            <span>Exercise</span>
                        </div>`
                    }
                </div>
                <div class="exercise-info">
                    <h3 class="exercise-name">${exercise.name}</h3>
                    <div class="exercise-details">
                        <span class="target-muscle">${exercise.target || 'General'}</span>
                        <span class="body-part">${exercise.bodyPart || 'Full Body'}</span>
                        <span class="equipment">${exercise.equipment || 'Body Weight'}</span>
                    </div>
                    <div class="exercise-actions">
                        <button class="btn-details" onclick="exerciseManager.showExerciseDetails('${exercise.id}')">
                            <ion-icon name="information-circle-outline"></ion-icon>
                            Details
                        </button>
                        <button class="btn-add" onclick="exerciseManager.addToWorkout('${exercise.name}')">
                            <ion-icon name="add-circle-outline"></ion-icon>
                            Add to Workout
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderPagination() {
        const paginationEl = document.getElementById('pagination');
        if (!paginationEl) return;

        const totalPages = Math.ceil(this.filteredExercises.length / this.exercisesPerPage);
        
        if (totalPages <= 1) {
            paginationEl.innerHTML = '';
            return;
        }

        let paginationHTML = '';
        
        // Previous button
        paginationHTML += `
            <button class="page-btn ${this.currentPage === 1 ? 'disabled' : ''}" 
                    onclick="exerciseManager.goToPage(${this.currentPage - 1})"
                    ${this.currentPage === 1 ? 'disabled' : ''}>
                <ion-icon name="chevron-back-outline"></ion-icon>
                Previous
            </button>
        `;

        // Page numbers
        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(totalPages, this.currentPage + 2);

        if (startPage > 1) {
            paginationHTML += `<button class="page-btn" onclick="exerciseManager.goToPage(1)">1</button>`;
            if (startPage > 2) {
                paginationHTML += `<span class="page-dots">...</span>`;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <button class="page-btn ${i === this.currentPage ? 'active' : ''}" 
                        onclick="exerciseManager.goToPage(${i})">
                    ${i}
                </button>
            `;
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHTML += `<span class="page-dots">...</span>`;
            }
            paginationHTML += `<button class="page-btn" onclick="exerciseManager.goToPage(${totalPages})">${totalPages}</button>`;
        }

        // Next button
        paginationHTML += `
            <button class="page-btn ${this.currentPage === totalPages ? 'disabled' : ''}" 
                    onclick="exerciseManager.goToPage(${this.currentPage + 1})"
                    ${this.currentPage === totalPages ? 'disabled' : ''}>
                Next
                <ion-icon name="chevron-forward-outline"></ion-icon>
            </button>
        `;

        paginationEl.innerHTML = paginationHTML;
    }

    goToPage(page) {
        const totalPages = Math.ceil(this.filteredExercises.length / this.exercisesPerPage);
        if (page < 1 || page > totalPages) return;
        
        this.currentPage = page;
        this.renderExercises();
        this.renderPagination();
        
        // Scroll to top of exercise list
        document.getElementById('exercise-list').scrollIntoView({ behavior: 'smooth' });
    }

    showExerciseDetails(exerciseId) {
        const exercise = this.exercises.find(ex => ex.id === exerciseId);
        if (!exercise) return;

        // Create modal with exercise details
        const modal = document.createElement('div');
        modal.className = 'exercise-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${exercise.name}</h2>
                    <button class="modal-close" onclick="this.parentElement.parentElement.parentElement.remove()">
                        <ion-icon name="close-outline"></ion-icon>
                    </button>
                </div>
                <div class="modal-body">
                    ${exercise.gifUrl ? `<img src="${exercise.gifUrl}" alt="${exercise.name}" class="exercise-gif">` : ''}
                    <div class="exercise-meta">
                        <p><strong>Target Muscle:</strong> ${exercise.target || 'General'}</p>
                        <p><strong>Body Part:</strong> ${exercise.bodyPart || 'Full Body'}</p>
                        <p><strong>Equipment:</strong> ${exercise.equipment || 'Body Weight'}</p>
                    </div>
                    <div class="exercise-instructions">
                        <h3>Instructions:</h3>
                        <ol>
                            ${(exercise.instructions || ['Instructions not available']).map(instruction => 
                                `<li>${instruction}</li>`
                            ).join('')}
                        </ol>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="exerciseManager.addToWorkout('${exercise.name}'); this.parentElement.parentElement.parentElement.remove();">
                        Add to Workout
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    addToWorkout(exerciseName) {
        // Store in localStorage for the workout log page
        let workoutPlan = JSON.parse(localStorage.getItem('currentWorkoutPlan') || '[]');
        
        // Check if exercise already exists
        if (!workoutPlan.some(ex => ex.name === exerciseName)) {
            workoutPlan.push({
                name: exerciseName,
                sets: 3,
                reps: 10,
                weight: 'bodyweight'
            });
            
            localStorage.setItem('currentWorkoutPlan', JSON.stringify(workoutPlan));
            
            // Show feedback
            this.showNotification(`${exerciseName} added to workout plan!`);
        } else {
            this.showNotification(`${exerciseName} is already in your workout plan.`);
        }
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Hide and remove notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize exercise manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.exerciseManager = new ExerciseManager();
});
