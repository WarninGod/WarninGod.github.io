// Exercises page functionality
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
            exerciseList.innerHTML = '<div class="loading">Loading exercises...</div>';
            
            // Use mock data for presentation (comment out for backend connection)
            if (window.mockExercises) {
                console.log('📦 Using mock data for presentation');
                this.exercises = window.mockExercises;
                this.filteredExercises = [...this.exercises];
                this.renderExercises();
                this.renderPagination();
                this.updateStats();
                return;
            }
            
            // Fallback to backend if available
            const response = await fetch('http://localhost:5000/exercises');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            this.exercises = await response.json();
            this.filteredExercises = [...this.exercises];
            this.renderExercises();
            this.renderPagination();
            this.updateStats();
            
        } catch (error) {
            console.error('Error fetching exercises:', error);
            exerciseList.innerHTML = `<div class="error">Could not load exercises. Error: ${error.message}</div>`;
        }
    }

    updateStats() {
        // Update the stats on homepage if elements exist
        const exerciseCountElement = document.querySelector('.stat-number');
        if (exerciseCountElement) {
            exerciseCountElement.textContent = this.exercises.length + '+';
        }
        
        // Update exercise count in header if it exists
        const headerCount = document.getElementById('total-exercises');
        if (headerCount) {
            headerCount.textContent = this.exercises.length;
        }
    }

    setFilter(muscle) {
        this.currentFilter = muscle;
        this.currentPage = 1;
        
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
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
            // Apply muscle filter with expanded matching
            let muscleMatch = this.currentFilter === 'all';
            
            if (!muscleMatch && exercise.target && exercise.bodyPart) {
                const target = exercise.target.toLowerCase();
                const bodyPart = exercise.bodyPart.toLowerCase();
                
                switch(this.currentFilter) {
                    case 'chest':
                        muscleMatch = target.includes('pectoral') || bodyPart.includes('chest') || 
                                    target.includes('chest') || target.includes('pecs');
                        break;
                    case 'back':
                        muscleMatch = target.includes('lats') || target.includes('latissimus') || 
                                    target.includes('traps') || target.includes('trapezius') ||
                                    target.includes('rhomboids') || bodyPart.includes('back') ||
                                    target.includes('back');
                        break;
                    case 'shoulders':
                        muscleMatch = target.includes('deltoid') || target.includes('shoulder') ||
                                    bodyPart.includes('shoulder') || target.includes('delts');
                        break;
                    case 'biceps':
                        muscleMatch = target.includes('bicep') || target.includes('biceps') ||
                                    bodyPart.includes('upper arms') && target.includes('bicep');
                        break;
                    case 'triceps':
                        muscleMatch = target.includes('tricep') || target.includes('triceps') ||
                                    bodyPart.includes('upper arms') && target.includes('tricep');
                        break;
                    case 'quads':
                        muscleMatch = target.includes('quad') || target.includes('quadricep') ||
                                    target.includes('quads') || bodyPart.includes('upper legs') && target.includes('quad');
                        break;
                    case 'hamstrings':
                        muscleMatch = target.includes('hamstring') || target.includes('hamstrings') ||
                                    bodyPart.includes('upper legs') && target.includes('hamstring');
                        break;
                    case 'glutes':
                        muscleMatch = target.includes('glute') || target.includes('glutes') ||
                                    bodyPart.includes('upper legs') && target.includes('glute');
                        break;
                    case 'calves':
                        muscleMatch = target.includes('calves') || target.includes('calf') ||
                                    bodyPart.includes('lower legs');
                        break;
                    case 'abs':
                        muscleMatch = target.includes('abs') || target.includes('abdominal') ||
                                    target.includes('oblique') || target.includes('core') ||
                                    bodyPart.includes('waist');
                        break;
                    case 'arms':
                        muscleMatch = target.includes('bicep') || target.includes('tricep') ||
                                    target.includes('forearm') || bodyPart.includes('upper arms') ||
                                    bodyPart.includes('lower arms') || target.includes('brachii');
                        break;
                    case 'legs':
                        muscleMatch = target.includes('quadricep') || target.includes('hamstring') ||
                                    target.includes('glute') || target.includes('calves') ||
                                    target.includes('adductor') || target.includes('abductor') ||
                                    bodyPart.includes('upper legs') || bodyPart.includes('lower legs');
                        break;
                    case 'core':
                        muscleMatch = target.includes('abs') || target.includes('abdominal') ||
                                    target.includes('oblique') || target.includes('core') ||
                                    bodyPart.includes('waist');
                        break;
                    case 'cardio':
                        muscleMatch = target.includes('cardio') || target.includes('cardiovascular') ||
                                    bodyPart.includes('cardio');
                        break;
                    default:
                        muscleMatch = target.includes(this.currentFilter) || 
                                    bodyPart.includes(this.currentFilter);
                }
            }
            
            // Apply search filter
            const searchMatch = this.currentSearch === '' ||
                exercise.name?.toLowerCase().includes(this.currentSearch) ||
                exercise.target?.toLowerCase().includes(this.currentSearch) ||
                exercise.bodyPart?.toLowerCase().includes(this.currentSearch) ||
                exercise.equipment?.toLowerCase().includes(this.currentSearch);
            
            return muscleMatch && searchMatch;
        });
        
        this.renderExercises();
        this.renderPagination();
    }

    renderExercises() {
        const exerciseList = document.getElementById('exercise-list');
        const startIndex = (this.currentPage - 1) * this.exercisesPerPage;
        const endIndex = startIndex + this.exercisesPerPage;
        const exercisesToShow = this.filteredExercises.slice(startIndex, endIndex);
        
        if (exercisesToShow.length === 0) {
            exerciseList.innerHTML = '<div class="no-results">No exercises found matching your criteria.</div>';
            return;
        }
        
        exerciseList.innerHTML = exercisesToShow.map(exercise => {
            // Check if we have a valid GIF URL from the API
            const hasValidGif = exercise.gifUrl && exercise.gifUrl.trim() !== '';
            
            return `
                <div class="exercise-card" data-exercise-id="${exercise.id}">
                    <div class="exercise-image-container">
                        ${hasValidGif ? `
                            <img src="${exercise.gifUrl}" 
                                 alt="${exercise.name}" 
                                 loading="lazy"
                                 style="opacity: 0; transition: opacity 0.3s ease;"
                                 onload="this.style.opacity = '1';"
                                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                        ` : ''}
                        <div class="image-placeholder" style="display: ${hasValidGif ? 'none' : 'flex'};">
                            <ion-icon name="fitness-outline"></ion-icon>
                            <span>${exercise.name.split(' ')[0]}</span>
                        </div>
                    </div>
                    <div class="exercise-info">
                        <h3>${exercise.name}</h3>
                        <div class="exercise-details">
                            <p><strong>Target:</strong> ${exercise.target || 'N/A'}</p>
                            <p><strong>Body Part:</strong> ${exercise.bodyPart || 'N/A'}</p>
                            <p><strong>Equipment:</strong> ${exercise.equipment || 'N/A'}</p>
                        </div>
                        <div class="exercise-actions">
                            <button class="btn btn-small btn-primary" onclick="exerciseManager.addToWorkout('${exercise.name}')">
                                <span>Add to Workout</span>
                                <ion-icon name="add-outline"></ion-icon>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderPagination() {
        const pagination = document.getElementById('pagination');
        const totalPages = Math.ceil(this.filteredExercises.length / this.exercisesPerPage);
        
        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }
        
        let paginationHTML = '';
        
        // Previous button
        if (this.currentPage > 1) {
            paginationHTML += `<button class="pagination-btn" onclick="exerciseManager.goToPage(${this.currentPage - 1})">
                <ion-icon name="chevron-back-outline"></ion-icon>
            </button>`;
        }
        
        // Page numbers
        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(totalPages, this.currentPage + 2);
        
        if (startPage > 1) {
            paginationHTML += `<button class="pagination-btn" onclick="exerciseManager.goToPage(1)">1</button>`;
            if (startPage > 2) {
                paginationHTML += `<span class="pagination-dots">...</span>`;
            }
        }
        
        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `<button class="pagination-btn ${i === this.currentPage ? 'active' : ''}" 
                onclick="exerciseManager.goToPage(${i})">${i}</button>`;
        }
        
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHTML += `<span class="pagination-dots">...</span>`;
            }
            paginationHTML += `<button class="pagination-btn" onclick="exerciseManager.goToPage(${totalPages})">${totalPages}</button>`;
        }
        
        // Next button
        if (this.currentPage < totalPages) {
            paginationHTML += `<button class="pagination-btn" onclick="exerciseManager.goToPage(${this.currentPage + 1})">
                <ion-icon name="chevron-forward-outline"></ion-icon>
            </button>`;
        }
        
        pagination.innerHTML = paginationHTML;
    }

    goToPage(page) {
        this.currentPage = page;
        this.renderExercises();
        this.renderPagination();
        
        // Scroll to top of exercise list
        document.getElementById('exercise-list').scrollIntoView({ behavior: 'smooth' });
    }

    addToWorkout(exerciseName) {
        // Store the selected exercise for the log page
        localStorage.setItem('selectedExercise', exerciseName);
        
        // Show success message
        const button = event.target.closest('button');
        const originalHTML = button.innerHTML;
        
        button.innerHTML = '<span>Added!</span><ion-icon name="checkmark-outline"></ion-icon>';
        button.style.backgroundColor = '#28a745';
        
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.style.backgroundColor = '';
        }, 2000);
        
        // Optionally redirect to log page
        setTimeout(() => {
            if (confirm('Exercise added! Would you like to go to the workout log page?')) {
                window.location.href = 'log.html';
            }
        }, 1000);
    }
}

// Initialize exercise manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.exerciseManager = new ExerciseManager();
});
