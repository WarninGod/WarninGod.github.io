// Exercise API Manager - handles loading and displaying exercises
class ExerciseAPIManager {
    constructor() {
        console.log('🚀 ExerciseAPIManager starting...');
        this.exercises = [];
        this.filteredExercises = [];
        this.currentPage = 1;
        this.exercisesPerPage = 12;
        this.currentFilters = {
            bodyPart: 'all',
            equipment: 'all',
            target: 'all'
        };
        this.searchTerm = '';
    }

    async init() {
        try {
            await this.loadExercises();
            this.setupEventListeners();
            this.applyFilter('all');
            console.log('✅ ExerciseAPIManager initialized successfully');
        } catch (error) {
            console.error('❌ ExerciseAPIManager failed:', error);
            this.showError('Failed to initialize exercise system');
        }
    }

    // Helper function to try multiple GIF sources
    getGifErrorHandler(exerciseId, exerciseName, fallbackSize = '300x200') {
        return `
            (function(img) {
                const alternatives = [
                    'https://static.exercisedb.dev/media/${exerciseId}.gif',
                    'https://v2.exercisedb.io/image/${exerciseId}',
                    'https://exercisedb.p.rapidapi.com/exercises/exercise/${exerciseId}',
                    'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${exerciseId.toString().padStart(4, '0')}.gif',
                    'https://via.placeholder.com/${fallbackSize}/f39c12/ffffff?text=${encodeURIComponent(exerciseName)}'
                ];
                
                let currentIndex = 0;
                function tryNext() {
                    if (currentIndex < alternatives.length - 1) {
                        console.log('🔄 Trying alternative GIF source:', alternatives[currentIndex]);
                        const testImg = new Image();
                        testImg.onload = function() {
                            img.src = alternatives[currentIndex];
                            console.log('✅ Alternative GIF loaded:', alternatives[currentIndex]);
                        };
                        testImg.onerror = function() {
                            currentIndex++;
                            tryNext();
                        };
                        testImg.src = alternatives[currentIndex];
                    } else {
                        img.src = alternatives[alternatives.length - 1];
                        console.log('❌ All GIF sources failed, using placeholder');
                    }
                }
                tryNext();
            })(this)
        `;
    }

    async loadExercises() {
        console.log('📥 Loading exercises from your deployed API...');
        
        try {
            // Try your deployed API first
            const response = await fetch('https://exercisedb-six-phi.vercel.app/api/v1/exercises?limit=1500');
            console.log('📡 API Response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const apiData = await response.json();
            console.log('✅ API Response:', apiData.success ? 'Success' : 'Failed');
            console.log('📊 Total exercises from API:', apiData.metadata?.totalExercises || 'Unknown');
            
            if (apiData.success && apiData.data) {
                const exercises = apiData.data;
                
                // Convert API format to our format
                this.exercises = exercises.map(exercise => {
                    return {
                        id: exercise.exerciseId,
                        name: exercise.name,
                        target: exercise.targetMuscles?.[0] || 'unknown',
                        bodyPart: exercise.bodyParts?.[0] || 'unknown',
                        equipment: exercise.equipments?.[0] || 'unknown',
                        instructions: exercise.instructions || [],
                        gifUrl: exercise.gifUrl, // Use direct GIF URL from your API
                        secondaryMuscles: exercise.secondaryMuscles || []
                    };
                });
                
                console.log('✅ Processed exercises from your API:', this.exercises.length);
                console.log('🎬 Sample GIF URL:', this.exercises[0]?.gifUrl);
                
            } else {
                throw new Error('API returned no data');
            }
            
        } catch (error) {
            console.error('❌ Failed to load from deployed API:', error);
            console.log('📁 Falling back to local cache...');
            
            // Fallback to local cache
            try {
                const response = await fetch('./data/exercises-cache.json');
                console.log('📡 Local cache response status:', response.status);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const data = await response.json();
                const exercises = data.exercises || data;
                console.log('📊 Raw exercises loaded from cache:', exercises.length);
                
                this.exercises = exercises.map(exercise => {
                    // Fix GIF URL to use working endpoint
                    let workingGifUrl = exercise.gifUrl;
                    if (workingGifUrl && workingGifUrl.includes('v1.cdn.exercisedb.dev')) {
                        // Replace with working ExerciseDB endpoint
                        const exerciseId = workingGifUrl.split('/').pop().replace('.gif', '');
                        workingGifUrl = `https://static.exercisedb.dev/media/${exerciseId}.gif`;
                    }
                    
                    return {
                        id: exercise.id,
                        name: exercise.name,
                        target: exercise.target,
                        bodyPart: exercise.bodyPart,
                        equipment: exercise.equipment,
                        instructions: exercise.instructions,
                        gifUrl: workingGifUrl,
                        secondaryMuscles: exercise.secondaryMuscles || exercise.targetMuscles || []
                    };
                });
                
            } catch (cacheError) {
                console.error('❌ Cache loading failed:', cacheError);
                // Use sample data as final fallback
                this.exercises = this.getSampleExercises();
                console.log('🔄 Using sample data:', this.exercises.length, 'exercises');
                this.showError('Unable to load exercise database. Using sample data.');
            }
        }
        
        this.filteredExercises = [...this.exercises];
        this.updateExerciseCount(this.exercises.length);
        console.log('✅ Exercises loaded successfully:', this.exercises.length);
        console.log('🎬 Sample GIF URL:', this.exercises[0]?.gifUrl);
    }

    getSampleExercises() {
        return [
            {
                id: "1", 
                name: "Push-ups",
                bodyPart: "chest",
                target: "pectorals",
                equipment: "body weight",
                gifUrl: "https://static.exercisedb.dev/media/0001.gif",
                instructions: [
                    "Start in a plank position with hands slightly wider than shoulders",
                    "Lower your body until chest nearly touches the floor",
                    "Push back up to starting position"
                ]
            },
            {
                id: "2", 
                name: "Squats",
                bodyPart: "upper legs",
                target: "quadriceps",
                equipment: "body weight",
                gifUrl: "https://static.exercisedb.dev/media/0002.gif",
                instructions: [
                    "Stand with feet shoulder-width apart",
                    "Lower body by bending knees and hips",
                    "Return to standing position"
                ]
            }
        ];
    }

    updateExerciseCount(count) {
        const countElement = document.getElementById('exercise-count');
        if (countElement) {
            countElement.textContent = count;
        }
    }

    setupEventListeners() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const filter = e.target.getAttribute('data-filter');
                this.applyFilter(filter);
                filterButtons.forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

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

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    applyFilter(filter) {
        console.log('🔍 Applying filter:', filter);
        this.currentPage = 1;
        
        if (filter === 'all') {
            this.filteredExercises = [...this.exercises];
        } else {
            this.filteredExercises = this.exercises.filter(exercise => {
                const bodyPart = this.getBodyPartFromFilter(filter);
                const equipment = filter.startsWith('equipment-') ? filter.replace('equipment-', '') : null;
                const target = filter.startsWith('target-') ? filter.replace('target-', '') : null;
                
                if (bodyPart) return exercise.bodyPart.toLowerCase().includes(bodyPart.toLowerCase());
                if (equipment) return exercise.equipment.toLowerCase().includes(equipment.toLowerCase());
                if (target) return exercise.target.toLowerCase().includes(target.toLowerCase());
                
                return exercise.bodyPart.toLowerCase().includes(filter.toLowerCase()) ||
                       exercise.equipment.toLowerCase().includes(filter.toLowerCase()) ||
                       exercise.target.toLowerCase().includes(filter.toLowerCase());
            });
        }

        this.updateExerciseCount(this.filteredExercises.length);
        this.displayExercises();
        this.renderPagination();
    }

    getBodyPartFromFilter(filter) {
        const bodyPartMap = {
            'chest': 'chest',
            'back': 'back', 
            'arms': 'upper arms',
            'legs': 'upper legs',
            'shoulders': 'shoulders',
            'abs': 'waist'
        };
        return bodyPartMap[filter] || null;
    }

    setSearch(searchTerm) {
        this.searchTerm = searchTerm.toLowerCase();
        this.applySearch();
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
        const container = document.getElementById('exercise-grid');
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
                        `<img src="${exercise.gifUrl}" alt="${exercise.name}" loading="lazy" 
                             onload="console.log('✅ GIF loaded:', '${exercise.name}')"
                             onerror="${this.getGifErrorHandler(exercise.id, exercise.name, '300x200')}" />` :
                        `<div class="exercise-placeholder">
                            <ion-icon name="fitness-outline"></ion-icon>
                            <span>Exercise Demo</span>
                        </div>`
                    }
                    <div class="exercise-overlay">
                        <button class="btn-view-details" onclick="exerciseManager.showExerciseDetails('${exercise.id}')">
                            <ion-icon name="eye-outline"></ion-icon>
                            View Details
                        </button>
                    </div>
                </div>
                <div class="exercise-info">
                    <h3 class="exercise-name">${exercise.name}</h3>
                    <div class="exercise-tags">
                        <span class="tag tag-bodypart">${exercise.bodyPart}</span>
                        <span class="tag tag-equipment">${exercise.equipment}</span>
                        <span class="tag tag-target">${exercise.target}</span>
                    </div>
                    <div class="exercise-actions">
                        <button class="btn-details" onclick="exerciseManager.showExerciseDetails('${exercise.id}')">
                            <ion-icon name="information-circle-outline"></ion-icon>
                            Details
                        </button>
                        <button class="btn-add" onclick="exerciseManager.addToWorkout('${exercise.id}')">
                            <ion-icon name="add-outline"></ion-icon>
                            Add to Workout
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        container.innerHTML = exerciseCards;
        this.renderPagination();
    }

    showExerciseDetails(exerciseId) {
        const exercise = this.exercises.find(ex => ex.id === exerciseId);
        if (!exercise) {
            console.error('❌ Exercise not found:', exerciseId);
            return;
        }

        console.log('👁️ Showing details for:', exercise.name);
        
        // Create and show modal
        const modal = this.createExerciseModal(exercise);
        document.body.appendChild(modal);
        
        // Trigger show animation
        setTimeout(() => modal.classList.add('show'), 10);
    }

    createExerciseModal(exercise) {
        const modal = document.createElement('div');
        modal.className = 'exercise-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${exercise.name}</h2>
                    <button class="modal-close" onclick="exerciseManager.closeModal(this.closest('.exercise-modal'))">
                        <ion-icon name="close"></ion-icon>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="exercise-demo">
                        ${exercise.gifUrl ? 
                            `<img src="${exercise.gifUrl}" alt="${exercise.name}" 
                                 onload="console.log('✅ Modal GIF loaded:', '${exercise.name}')"
                                 onerror="${this.getGifErrorHandler(exercise.id, exercise.name, '400x300')}" />` :
                            `<div class="demo-placeholder">
                                <ion-icon name="fitness-outline"></ion-icon>
                                <p>Exercise Demonstration</p>
                            </div>`
                        }
                    </div>
                    <div class="exercise-meta">
                        <div class="meta-tags">
                            <span class="tag tag-bodypart">${exercise.bodyPart}</span>
                            <span class="tag tag-equipment">${exercise.equipment}</span>
                            <span class="tag tag-target">${exercise.target}</span>
                        </div>
                        <div class="exercise-instructions">
                            <h3>Instructions</h3>
                            <ol>
                                ${exercise.instructions.map(instruction => `<li>${instruction}</li>`).join('')}
                            </ol>
                        </div>
                        ${exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 ? `
                            <div class="secondary-muscles">
                                <h3>Secondary Muscles</h3>
                                <div class="muscle-tags">
                                    ${exercise.secondaryMuscles.map(muscle => `<span class="tag tag-muscle">${muscle}</span>`).join('')}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-secondary" onclick="exerciseManager.closeModal(this.closest('.exercise-modal'))">
                        Close
                    </button>
                    <button class="btn btn-primary" onclick="exerciseManager.addToWorkout('${exercise.id}'); exerciseManager.closeModal(this.closest('.exercise-modal'))">
                        <ion-icon name="add"></ion-icon>
                        Add to Workout
                    </button>
                </div>
            </div>
        `;

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modal);
            }
        });

        return modal;
    }

    closeModal(modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }

    addToWorkout(exerciseId) {
        const exercise = this.exercises.find(ex => ex.id === exerciseId);
        if (!exercise) {
            console.error('❌ Exercise not found:', exerciseId);
            return;
        }

        console.log('➕ Adding to workout:', exercise.name);
        
        // Get existing workout from localStorage
        let workout = JSON.parse(localStorage.getItem('workout') || '[]');
        
        // Check if exercise already exists
        const existingIndex = workout.findIndex(item => item.id === exerciseId);
        
        if (existingIndex >= 0) {
            this.showNotification(`${exercise.name} is already in your workout!`, 'warning');
            return;
        }
        
        // Add exercise with default sets/reps
        workout.push({
            id: exercise.id,
            name: exercise.name,
            sets: 3,
            reps: 10,
            addedAt: new Date().toISOString()
        });
        
        // Save to localStorage
        localStorage.setItem('workout', JSON.stringify(workout));
        
        this.showNotification(`${exercise.name} added to workout!`, 'success');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <ion-icon name="${type === 'success' ? 'checkmark-circle' : type === 'warning' ? 'warning' : 'information-circle'}"></ion-icon>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    renderPagination() {
        const totalPages = Math.ceil(this.filteredExercises.length / this.exercisesPerPage);
        const paginationContainer = document.getElementById('pagination');
        
        if (!paginationContainer || totalPages <= 1) {
            if (paginationContainer) paginationContainer.innerHTML = '';
            return;
        }

        let paginationHTML = `
            <div class="pagination-info">
                <span class="page-info">Page ${this.currentPage} of ${totalPages}</span>
                <span class="total-exercises">${this.filteredExercises.length} exercises</span>
            </div>
            <div class="pagination-controls">
                <button class="page-btn ${this.currentPage === 1 ? 'disabled' : ''}" 
                        onclick="exerciseManager.goToPage(1)" 
                        ${this.currentPage === 1 ? 'disabled' : ''}>
                    <ion-icon name="chevron-back-circle"></ion-icon>
                    First
                </button>
                <button class="page-btn ${this.currentPage === 1 ? 'disabled' : ''}" 
                        onclick="exerciseManager.goToPage(${this.currentPage - 1})" 
                        ${this.currentPage === 1 ? 'disabled' : ''}>
                    <ion-icon name="chevron-back"></ion-icon>
                    Previous
                </button>
        `;

        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(totalPages, startPage + 4);

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
                paginationHTML += `<span class="page-ellipsis">...</span>`;
            }
            paginationHTML += `
                <button class="page-btn" onclick="exerciseManager.goToPage(${totalPages})">
                    ${totalPages}
                </button>
            `;
        }

        paginationHTML += `
                <button class="page-btn ${this.currentPage === totalPages ? 'disabled' : ''}" 
                        onclick="exerciseManager.goToPage(${this.currentPage + 1})" 
                        ${this.currentPage === totalPages ? 'disabled' : ''}>
                    Next
                    <ion-icon name="chevron-forward"></ion-icon>
                </button>
                <button class="page-btn ${this.currentPage === totalPages ? 'disabled' : ''}" 
                        onclick="exerciseManager.goToPage(${totalPages})" 
                        ${this.currentPage === totalPages ? 'disabled' : ''}>
                    Last
                    <ion-icon name="chevron-forward-circle"></ion-icon>
                </button>
            </div>
        `;

        paginationContainer.innerHTML = paginationHTML;
    }

    goToPage(page) {
        const totalPages = Math.ceil(this.filteredExercises.length / this.exercisesPerPage);
        if (page < 1 || page > totalPages) return;
        
        this.currentPage = page;
        this.displayExercises();
        
        // Scroll to top of exercises
        document.getElementById('exercise-grid')?.scrollIntoView({ behavior: 'smooth' });
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <div class="error-content">
                <ion-icon name="warning"></ion-icon>
                <p>${message}</p>
            </div>
        `;
        
        const container = document.getElementById('exercise-grid');
        if (container) {
            container.innerHTML = '';
            container.appendChild(errorDiv);
        }
    }
}

// Initialize when DOM is loaded
let exerciseManager;
document.addEventListener('DOMContentLoaded', () => {
    exerciseManager = new ExerciseAPIManager();
    exerciseManager.init();
});
