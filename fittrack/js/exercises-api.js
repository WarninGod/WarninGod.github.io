// Exercise Management System with Hosted ExerciseDB API
class ExerciseAPI {
    constructor() {
        this.exercises = [];
        this.filteredExercises = [];
        this.currentPage = 1;
        this.exercisesPerPage = 12;
        this.searchTerm = '';
        this.bodyPartFilter = '';
        this.equipmentFilter = '';
        
        // Configure your hosted API URL here
        this.apiBaseUrl = 'https://exercisedb-six-phi.vercel.app'; // Your hosted ExerciseDB API
        this.apiEndpoints = {
            exercises: '/exercises',
            bodyparts: '/bodyparts',
            equipments: '/equipments',
            muscles: '/muscles'
        };
    }

    async loadExercises() {
        console.log('🏃‍♂️ Loading exercises from hosted ExerciseDB API...');
        try {
            const response = await fetch(`${this.apiBaseUrl}${this.apiEndpoints.exercises}`);
            
            if (response.ok) {
                this.exercises = await response.json();
                this.filteredExercises = [...this.exercises];
                console.log(`✅ Loaded ${this.exercises.length} exercises from hosted API`);
                return this.exercises;
            } else {
                throw new Error(`API request failed with status: ${response.status}`);
            }
        } catch (error) {
            console.warn('⚠️ Hosted API failed, using local fallback:', error.message);
            this.exercises = await this.getLocalExerciseDatabase();
            this.filteredExercises = [...this.exercises];
            console.log(`✅ Loaded ${this.exercises.length} local exercises as fallback`);
            return this.exercises;
        }
    }

    async getLocalExerciseDatabase() {
        try {
            const response = await fetch('./exercisedb-api-1-open-source/src/data/exercises.json');
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error('Failed to load local fallback:', error);
        }
        return [];
    }

    createDumbbellPlaceholder(exerciseName) {
        // Get appropriate icon based on exercise name
        const icon = this.getExerciseIcon(exerciseName);
        
        return `
            <div class="exercise-placeholder">
                <div class="placeholder-icon">
                    <ion-icon name="${icon}"></ion-icon>
                </div>
                <div class="placeholder-text">${exerciseName}</div>
            </div>
        `;
    }

    // Convert old GIF URLs to working format
    getWorkingGifUrl(originalUrl) {
        if (!originalUrl) return null;
        
        // Convert from: https://v1.cdn.exercisedb.dev/media/trmte8s.gif
        // To: https://static.exercisedb.dev/media/trmte8s.gif
        if (originalUrl.includes('v1.cdn.exercisedb.dev')) {
            return originalUrl.replace('v1.cdn.exercisedb.dev', 'static.exercisedb.dev');
        }
        
        return originalUrl;
    }

    getExerciseIcon(exerciseName) {
        const name = exerciseName.toLowerCase();
        
        // Cardio exercises
        if (name.includes('running') || name.includes('jog') || name.includes('sprint')) return 'walk-outline';
        if (name.includes('cycling') || name.includes('bike')) return 'bicycle-outline';
        if (name.includes('swimming') || name.includes('swim')) return 'water-outline';
        if (name.includes('jumping') || name.includes('jump')) return 'fitness-outline';
        
        // Body weight exercises
        if (name.includes('push') || name.includes('press')) return 'hand-left-outline';
        if (name.includes('pull') || name.includes('row')) return 'hand-right-outline';
        if (name.includes('squat') || name.includes('lunge')) return 'body-outline';
        if (name.includes('plank') || name.includes('crunch') || name.includes('sit')) return 'body-outline';
        
        // Weight exercises
        if (name.includes('barbell') || name.includes('deadlift')) return 'barbell-outline';
        if (name.includes('dumbbell') || name.includes('curl')) return 'barbell-outline';
        if (name.includes('bench')) return 'barbell-outline';
        
        // Stretching/Flexibility
        if (name.includes('stretch') || name.includes('yoga')) return 'leaf-outline';
        
        // Default
        return 'fitness-outline';
    }

    applyFilters(bodyPart, equipment) {
        this.bodyPartFilter = bodyPart || '';
        this.equipmentFilter = equipment || '';
        this.currentPage = 1;
        
        this.filteredExercises = this.exercises.filter(exercise => {
            const matchesSearch = this.searchTerm === '' || 
                exercise.name.toLowerCase().includes(this.searchTerm) ||
                (exercise.targetMuscles && exercise.targetMuscles.some(target => target.toLowerCase().includes(this.searchTerm))) ||
                (exercise.bodyParts && exercise.bodyParts.some(part => part.toLowerCase().includes(this.searchTerm))) ||
                (exercise.target && exercise.target.toLowerCase().includes(this.searchTerm)) ||
                (exercise.bodyPart && exercise.bodyPart.toLowerCase().includes(this.searchTerm));
                
            const matchesBodyPart = this.bodyPartFilter === '' || 
                this.checkBodyPartMatch(exercise, this.bodyPartFilter);
                
            const matchesEquipment = this.equipmentFilter === '' || 
                this.checkEquipmentMatch(exercise, this.equipmentFilter);
                
            return matchesSearch && matchesBodyPart && matchesEquipment;
        });

        this.updateExerciseCount(this.filteredExercises.length);
        this.displayExercises();
        this.renderPagination();
    }

    checkBodyPartMatch(exercise, filter) {
        if (exercise.bodyParts) {
            return exercise.bodyParts.some(part => this.mapBodyPartToMuscle(part) === filter);
        }
        if (exercise.bodyPart) {
            return this.mapBodyPartToMuscle(exercise.bodyPart) === filter;
        }
        return false;
    }

    checkEquipmentMatch(exercise, filter) {
        if (exercise.equipments) {
            return exercise.equipments.some(equip => equip.toLowerCase().includes(filter.toLowerCase()));
        }
        if (exercise.equipment) {
            return exercise.equipment.toLowerCase().includes(filter.toLowerCase());
        }
        return false;
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

        const exerciseCards = exercisesToShow.map(exercise => {
            const exerciseId = exercise.exerciseId || exercise.id;
            const targetMuscles = this.getTargetMuscles(exercise);
            const workingGifUrl = this.getWorkingGifUrl(exercise.gifUrl);
            
            return `
                <div class="exercise-card" data-exercise-id="${exerciseId}">
                    <div class="exercise-image">
                        ${workingGifUrl ? 
                            `<img src="${workingGifUrl}" alt="${exercise.name}" loading="lazy" 
                                 onerror="this.parentNode.innerHTML = exerciseAPI.createDumbbellPlaceholder('${exercise.name}')" />` :
                            this.createDumbbellPlaceholder(exercise.name)
                        }
                    </div>
                    <div class="exercise-info">
                        <h3 class="exercise-name">${exercise.name}</h3>
                        <div class="exercise-tags">
                            <span class="tag tag-target">Target: ${targetMuscles}</span>
                        </div>
                        <div class="exercise-actions">
                            <button class="btn-details" onclick="exerciseAPI.showExerciseModal('${exerciseId}')">
                                <ion-icon name="information-circle-outline"></ion-icon>
                                <span>Details</span>
                            </button>
                            <button class="btn-add" onclick="exerciseAPI.addToWorkout('${exerciseId}')">
                                <ion-icon name="add-circle-outline"></ion-icon>
                                <span>Add to Workout</span>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = exerciseCards;
        this.renderPagination();
    }

    getTargetMuscles(exercise) {
        if (exercise.targetMuscles) return exercise.targetMuscles.join(', ');
        if (exercise.target) return exercise.target;
        return 'N/A';
    }

    getBodyParts(exercise) {
        if (exercise.bodyParts) return exercise.bodyParts.join(', ');
        if (exercise.bodyPart) return exercise.bodyPart;
        return 'N/A';
    }

    getEquipments(exercise) {
        if (exercise.equipments) return exercise.equipments.join(', ');
        if (exercise.equipment) return exercise.equipment;
        return 'N/A';
    }

    showExerciseModal(exerciseId) {
        const exercise = this.exercises.find(ex => 
            (ex.exerciseId && ex.exerciseId === exerciseId) || 
            (ex.id && ex.id === exerciseId)
        );
        if (!exercise) return;

        const modal = document.getElementById('exercise-modal') || this.createModal();
        const modalContent = modal.querySelector('.modal-content') || modal;
        
        const targetMuscles = this.getTargetMuscles(exercise);
        const bodyParts = this.getBodyParts(exercise);
        const equipments = this.getEquipments(exercise);
        const workingGifUrl = this.getWorkingGifUrl(exercise.gifUrl);
        
        modalContent.innerHTML = `
            <div class="modal-header">
                <h2>${exercise.name}</h2>
                <span class="close-modal" onclick="exerciseAPI.closeModal()">&times;</span>
            </div>
            <div class="modal-body">
                <div class="exercise-gif">
                    ${workingGifUrl ? 
                        `<img src="${workingGifUrl}" alt="${exercise.name}" 
                             onerror="this.parentNode.innerHTML = exerciseAPI.createDumbbellPlaceholder('${exercise.name}')" />` :
                        this.createDumbbellPlaceholder(exercise.name)
                    }
                    ${workingGifUrl ? `<p style="color: #888; font-size: 12px; margin-top: 10px; text-align: center;">
                        Original: <a href="${exercise.gifUrl}" target="_blank" style="color: #ff6b35;">View original</a> | 
                        Working: <a href="${workingGifUrl}" target="_blank" style="color: #ff6b35;">View working</a>
                    </p>` : ''}
                </div>
                <div class="exercise-details">
                    <div class="detail-group">
                        <h3>Target Muscles</h3>
                        <p>${targetMuscles}</p>
                    </div>
                    <div class="detail-group">
                        <h3>Body Parts</h3>
                        <p>${bodyParts}</p>
                    </div>
                    <div class="detail-group">
                        <h3>Equipment</h3>
                        <p>${equipments}</p>
                    </div>
                    ${exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 ? `
                    <div class="detail-group">
                        <h3>Secondary Muscles</h3>
                        <p>${exercise.secondaryMuscles.join(', ')}</p>
                    </div>
                    ` : ''}
                    ${exercise.instructions && exercise.instructions.length > 0 ? `
                    <div class="detail-group">
                        <h3>Instructions</h3>
                        <ol class="instructions-list">
                            ${exercise.instructions.map(instruction => `<li>${instruction}</li>`).join('')}
                        </ol>
                    </div>
                    ` : ''}
                </div>
                <div class="modal-actions">
                    <button class="btn-primary" onclick="exerciseAPI.addToWorkout('${exercise.exerciseId || exercise.id}')">
                        <ion-icon name="add-circle-outline"></ion-icon>
                        Add to Workout
                    </button>
                </div>
            </div>
        `;
        
        modal.style.display = 'flex';
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    createModal() {
        const modal = document.createElement('div');
        modal.id = 'exercise-modal';
        modal.className = 'exercise-modal';
        modal.innerHTML = '<div class="modal-content"></div>';
        document.body.appendChild(modal);
        
        // Add click event to close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });
        
        return modal;
    }

    closeModal() {
        const modal = document.getElementById('exercise-modal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300); // Match transition duration
            document.body.style.overflow = 'auto';
        }
    }

    addToWorkout(exerciseId) {
        const exercise = this.exercises.find(ex => 
            (ex.exerciseId && ex.exerciseId === exerciseId) || 
            (ex.id && ex.id === exerciseId)
        );
        if (!exercise) return;

        let workout = JSON.parse(localStorage.getItem('currentWorkout') || '[]');
        
        const workoutExerciseId = exercise.exerciseId || exercise.id;
        if (!workout.find(ex => (ex.exerciseId === workoutExerciseId) || (ex.id === workoutExerciseId))) {
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
            badge.textContent = workout.length;
            badge.style.display = workout.length > 0 ? 'block' : 'none';
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
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    renderPagination() {
        const paginationContainer = document.getElementById('pagination');
        if (!paginationContainer) return;

        const totalPages = Math.ceil(this.filteredExercises.length / this.exercisesPerPage);
        
        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }

        let paginationHTML = `
            <div class="pagination-info">
                <div class="page-info">Page ${this.currentPage} of ${totalPages}</div>
                <div class="total-exercises">${this.filteredExercises.length} exercises total</div>
            </div>
            <div class="pagination-controls">
        `;
        
        // Previous button
        if (this.currentPage > 1) {
            paginationHTML += `<button class="page-btn" onclick="exerciseAPI.goToPage(${this.currentPage - 1})">Prev</button>`;
        } else {
            paginationHTML += `<button class="page-btn disabled">Prev</button>`;
        }
        
        // Page numbers with ellipsis logic
        for (let i = 1; i <= totalPages; i++) {
            if (i === this.currentPage) {
                paginationHTML += `<button class="page-btn active">${i}</button>`;
            } else if (i === 1 || i === totalPages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
                paginationHTML += `<button class="page-btn" onclick="exerciseAPI.goToPage(${i})">${i}</button>`;
            } else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
                paginationHTML += `<span class="page-ellipsis">...</span>`;
            }
        }
        
        // Next button
        if (this.currentPage < totalPages) {
            paginationHTML += `<button class="page-btn" onclick="exerciseAPI.goToPage(${this.currentPage + 1})">Next</button>`;
        } else {
            paginationHTML += `<button class="page-btn disabled">Next</button>`;
        }
        
        paginationHTML += `</div>`;
        
        paginationContainer.innerHTML = paginationHTML;
    }

    goToPage(page) {
        this.currentPage = page;
        this.displayExercises();

        // Scroll to top of exercise list
        const exerciseSection = document.getElementById('exercise-list');
        if (exerciseSection) {
            exerciseSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    updateExerciseCount(count) {
        const countElement = document.getElementById('total-exercises');
        if (countElement) {
            countElement.textContent = count;
        }
    }

    setSearchTerm(term) {
        this.searchTerm = term.toLowerCase();
        this.applyFilters(this.bodyPartFilter, this.equipmentFilter);
    }

    clearFilters() {
        this.searchTerm = '';
        this.bodyPartFilter = '';
        this.equipmentFilter = '';
        this.currentPage = 1;
        
        // Clear search input
        const searchInput = document.getElementById('exercise-search');
        if (searchInput) {
            searchInput.value = '';
        }
        
        // Clear filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => btn.classList.remove('active'));
        const allButton = document.querySelector('.filter-btn[data-muscle="all"]');
        if (allButton) {
            allButton.classList.add('active');
        }
        
        this.filteredExercises = [...this.exercises];
        this.updateExerciseCount(this.filteredExercises.length);
        this.displayExercises();
        this.renderPagination();
    }

    // Map body parts to muscle groups for filtering
    mapBodyPartToMuscle(bodyPart) {
        const bodyPartLower = bodyPart.toLowerCase();
        if (bodyPartLower.includes('arm') || bodyPartLower.includes('forearm') || bodyPartLower.includes('upper arms') || bodyPartLower.includes('lower arms')) return 'arms';
        if (bodyPartLower.includes('leg') || bodyPartLower.includes('thigh') || bodyPartLower.includes('calf') || bodyPartLower.includes('upper legs') || bodyPartLower.includes('lower legs')) return 'legs';
        if (bodyPartLower.includes('chest') || bodyPartLower.includes('pec')) return 'chest';
        if (bodyPartLower.includes('back') || bodyPartLower.includes('lat')) return 'back';
        if (bodyPartLower.includes('core') || bodyPartLower.includes('waist') || bodyPartLower.includes('abs')) return 'core';
        if (bodyPartLower.includes('shoulder') || bodyPartLower.includes('delt')) return 'shoulders';
        if (bodyPartLower.includes('neck')) return 'shoulders';
        if (bodyPartLower.includes('cardio') || bodyPartLower.includes('full')) return 'fullbody';
        return bodyPartLower;
    }

    // Setup filter buttons
    setupFilterButtons() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');
                
                const muscle = button.getAttribute('data-muscle');
                this.filterByBodyPart(muscle);
            });
        });
    }

    // Setup search input
    setupSearchInput() {
        const searchInput = document.getElementById('exercise-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value.toLowerCase();
                this.currentPage = 1;
                this.applyFilters(this.bodyPartFilter, this.equipmentFilter);
            });
        }
    }

    // Filter by body part
    filterByBodyPart(bodyPart) {
        this.bodyPartFilter = bodyPart === 'all' ? '' : bodyPart;
        this.currentPage = 1;
        this.applyFilters(this.bodyPartFilter, this.equipmentFilter);
    }

    // Load additional data endpoints
    async loadBodyParts() {
        try {
            const response = await fetch(`${this.apiBaseUrl}${this.apiEndpoints.bodyparts}`);
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.warn('Failed to load body parts:', error);
        }
        return [];
    }

    async loadEquipments() {
        try {
            const response = await fetch(`${this.apiBaseUrl}${this.apiEndpoints.equipments}`);
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.warn('Failed to load equipments:', error);
        }
        return [];
    }

    async loadMuscles() {
        try {
            const response = await fetch(`${this.apiBaseUrl}${this.apiEndpoints.muscles}`);
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.warn('Failed to load muscles:', error);
        }
        return [];
    }
}

// Global instance
const exerciseAPI = new ExerciseAPI();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing Exercise System with Hosted API...');
    exerciseAPI.loadExercises().then(() => {
        exerciseAPI.displayExercises();
        exerciseAPI.updateWorkoutBadge();
        exerciseAPI.updateExerciseCount(exerciseAPI.filteredExercises.length);
        exerciseAPI.setupFilterButtons();
        exerciseAPI.setupSearchInput();
    });
});
