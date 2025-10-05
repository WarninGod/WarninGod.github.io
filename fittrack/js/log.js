/**
 * Workout Log Page JavaScript
 * Handles exercise logging, daily tracking, and data persistence
 */

class WorkoutLog {
    constructor() {
        this.currentDate = new Date().toDateString();
        this.exercises = [];
        this.workoutHistory = window.mockWorkouts || [];
        this.init();
    }

    init() {
        this.loadExercises();
        this.updateDateDisplay();
        this.renderDailyLog();
        this.renderRecentDays();
        this.renderWorkoutHistory();
        this.setupEventListeners();
    }

    loadExercises() {
        // Use mock exercise data for presentation
        if (window.mockExercises) {
            this.exercises = window.mockExercises;
            console.log('📦 Loaded mock exercises for presentation');
            this.setupExerciseAutocomplete();
        }
    }

    setupExerciseAutocomplete() {
        const exerciseInput = document.getElementById('exercise-input');
        if (!exerciseInput) return;

        exerciseInput.addEventListener('input', (e) => {
            const value = e.target.value.toLowerCase();
            if (value.length < 2) {
                this.hideAutocomplete();
                return;
            }

            const matches = this.exercises.filter(exercise => 
                exercise.name.toLowerCase().includes(value)
            ).slice(0, 5);

            this.showAutocomplete(matches);
        });

        // Hide autocomplete when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.exercise-input-container')) {
                this.hideAutocomplete();
            }
        });
    }

    showAutocomplete(exercises) {
        let autocompleteDiv = document.getElementById('exercise-autocomplete');
        if (!autocompleteDiv) {
            autocompleteDiv = document.createElement('div');
            autocompleteDiv.id = 'exercise-autocomplete';
            autocompleteDiv.className = 'exercise-autocomplete';
            document.querySelector('.exercise-input-container')?.appendChild(autocompleteDiv);
        }

        autocompleteDiv.innerHTML = exercises.map(exercise => `
            <div class="autocomplete-item" data-exercise="${exercise.name}">
                <span class="exercise-name">${exercise.name}</span>
                <span class="exercise-target">${exercise.target}</span>
            </div>
        `).join('');

        autocompleteDiv.style.display = 'block';

        // Add click handlers
        autocompleteDiv.querySelectorAll('.autocomplete-item').forEach(item => {
            item.addEventListener('click', () => {
                document.getElementById('exercise-input').value = item.dataset.exercise;
                this.hideAutocomplete();
            });
        });
    }

    hideAutocomplete() {
        const autocompleteDiv = document.getElementById('exercise-autocomplete');
        if (autocompleteDiv) {
            autocompleteDiv.style.display = 'none';
        }
    }

    renderWorkoutHistory() {
        const historyContainer = document.getElementById('workout-history');
        if (!historyContainer || !this.workoutHistory.length) return;

        const historyHTML = this.workoutHistory.map(workout => `
            <div class="workout-history-item">
                <div class="workout-date">
                    <ion-icon name="calendar-outline"></ion-icon>
                    ${new Date(workout.date).toLocaleDateString()}
                </div>
                <div class="workout-exercises">
                    ${workout.exercises.map(exercise => `
                        <div class="exercise-summary">
                            <span class="exercise-name">${exercise.name}</span>
                            <span class="exercise-details">
                                ${exercise.sets} sets × ${exercise.reps} reps 
                                ${exercise.weight > 0 ? `@ ${exercise.weight}kg` : ''}
                            </span>
                        </div>
                    `).join('')}
                </div>
                ${workout.notes ? `
                    <div class="workout-notes">
                        <ion-icon name="document-text-outline"></ion-icon>
                        ${workout.notes}
                    </div>
                ` : ''}
            </div>
        `).join('');

        historyContainer.innerHTML = historyHTML;
    }

    setupEventListeners() {
        // Form submission
        const form = document.getElementById('workout-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Clear form button
        const clearBtn = document.getElementById('clear-form');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearForm());
        }

        // Date filter in recent days
        const dateFilter = document.getElementById('date-filter');
        if (dateFilter) {
            dateFilter.addEventListener('change', () => this.filterByDate());
        }

        // Form validation
        const inputs = form?.querySelectorAll('input[required]');
        inputs?.forEach(input => {
            input.addEventListener('blur', () => this.validateInput(input));
        });
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const exercise = {
            id: Date.now().toString(),
            name: formData.get('exercise-name').trim(),
            sets: parseInt(formData.get('sets')) || 0,
            reps: parseInt(formData.get('reps')) || 0,
            weight: parseFloat(formData.get('weight')) || 0,
            notes: formData.get('notes')?.trim() || '',
            timestamp: new Date().toISOString(),
            date: this.currentDate
        };

        // Validate required fields
        if (!exercise.name || exercise.sets <= 0 || exercise.reps <= 0) {
            this.showNotification('Please fill in all required fields correctly.', 'error');
            return;
        }

        this.addExercise(exercise);
        this.clearForm();
        this.showNotification('Exercise logged successfully!', 'success');
    }

    addExercise(exercise) {
        this.exercises.push(exercise);
        this.saveExercises();
        this.renderDailyLog();
        this.renderRecentDays();
    }

    deleteExercise(exerciseId) {
        if (confirm('Are you sure you want to delete this exercise?')) {
            this.exercises = this.exercises.filter(ex => ex.id !== exerciseId);
            this.saveExercises();
            this.renderDailyLog();
            this.renderRecentDays();
            this.showNotification('Exercise deleted.', 'success');
        }
    }

    clearForm() {
        const form = document.getElementById('workout-form');
        if (form) {
            form.reset();
            // Clear any validation states
            form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
        }
    }

    validateInput(input) {
        const value = input.value.trim();
        const isValid = input.type === 'number' ? 
            parseFloat(value) > 0 : 
            value.length > 0;

        input.classList.toggle('error', !isValid);
        return isValid;
    }

    updateDateDisplay() {
        const dateElement = document.querySelector('.current-date');
        if (dateElement) {
            const today = new Date();
            const options = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            };
            dateElement.textContent = today.toLocaleDateString('en-US', options);
        }
    }

    getTodaysExercises() {
        return this.exercises.filter(ex => ex.date === this.currentDate);
    }

    renderDailyLog() {
        const container = document.getElementById('daily-exercises');
        if (!container) return;

        const todaysExercises = this.getTodaysExercises();

        if (todaysExercises.length === 0) {
            container.innerHTML = `
                <div class="empty-log">
                    <ion-icon name="barbell-outline"></ion-icon>
                    <h3>No exercises logged today</h3>
                    <p>Start your workout by adding your first exercise!</p>
                </div>
            `;
        } else {
            container.innerHTML = todaysExercises.map(exercise => `
                <div class="exercise-entry">
                    <div class="exercise-header">
                        <h4 class="exercise-name">${this.escapeHtml(exercise.name)}</h4>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span class="exercise-time">${this.formatTime(exercise.timestamp)}</span>
                            <button class="delete-exercise" onclick="workoutLog.deleteExercise('${exercise.id}')" title="Delete exercise">
                                ×
                            </button>
                        </div>
                    </div>
                    <div class="exercise-details">
                        <span><strong>Sets:</strong> ${exercise.sets}</span>
                        <span><strong>Reps:</strong> ${exercise.reps}</span>
                        <span><strong>Weight:</strong> ${exercise.weight}kg</span>
                    </div>
                    ${exercise.notes ? `<div class="exercise-notes">${this.escapeHtml(exercise.notes)}</div>` : ''}
                </div>
            `).join('');
        }

        this.updateDailySummary(todaysExercises);
    }

    updateDailySummary(exercises) {
        const summaryContainer = document.querySelector('.summary-stats');
        if (!summaryContainer) return;

        const totalExercises = exercises.length;
        const totalSets = exercises.reduce((sum, ex) => sum + ex.sets, 0);
        const totalVolume = exercises.reduce((sum, ex) => sum + (ex.sets * ex.reps * ex.weight), 0);

        summaryContainer.innerHTML = `
            <div class="summary-item">
                <span class="summary-label">Exercises</span>
                <span class="summary-value">${totalExercises}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Total Sets</span>
                <span class="summary-value">${totalSets}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Volume (kg)</span>
                <span class="summary-value">${totalVolume.toFixed(1)}</span>
            </div>
        `;
    }

    renderRecentDays() {
        const container = document.getElementById('recent-days');
        if (!container) return;

        // Group exercises by date
        const groupedByDate = this.exercises.reduce((groups, exercise) => {
            const date = exercise.date;
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(exercise);
            return groups;
        }, {});

        // Get recent 7 days (excluding today)
        const dates = Object.keys(groupedByDate)
            .filter(date => date !== this.currentDate)
            .sort((a, b) => new Date(b) - new Date(a))
            .slice(0, 7);

        if (dates.length === 0) {
            container.innerHTML = `
                <div class="empty-log">
                    <ion-icon name="calendar-outline"></ion-icon>
                    <p>No workout history yet. Start logging exercises to see your progress!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = dates.map(date => {
            const exercises = groupedByDate[date];
            const exerciseNames = exercises.map(ex => ex.name).slice(0, 3);
            const totalSets = exercises.reduce((sum, ex) => sum + ex.sets, 0);

            return `
                <div class="day-entry" onclick="workoutLog.viewDayDetails('${date}')">
                    <div class="day-header">
                        <span class="day-date">${this.formatDate(date)}</span>
                        <span class="day-count">${exercises.length} exercises</span>
                    </div>
                    <div class="day-exercises">
                        ${exerciseNames.join(', ')}${exercises.length > 3 ? ` +${exercises.length - 3} more` : ''}
                        <br><small>${totalSets} total sets</small>
                    </div>
                </div>
            `;
        }).join('');
    }

    viewDayDetails(date) {
        const dayExercises = this.exercises.filter(ex => ex.date === date);
        
        let details = `Workout Summary for ${this.formatDate(date)}\n\n`;
        dayExercises.forEach((exercise, index) => {
            details += `${index + 1}. ${exercise.name}\n`;
            details += `   Sets: ${exercise.sets}, Reps: ${exercise.reps}, Weight: ${exercise.weight}kg\n`;
            if (exercise.notes) {
                details += `   Notes: ${exercise.notes}\n`;
            }
            details += '\n';
        });

        alert(details);
    }

    filterByDate() {
        const dateFilter = document.getElementById('date-filter');
        const selectedDate = dateFilter?.value;
        
        if (!selectedDate) {
            this.renderRecentDays();
            return;
        }

        const filteredExercises = this.exercises.filter(ex => {
            const exerciseDate = new Date(ex.date);
            const filterDate = new Date(selectedDate);
            return exerciseDate.toDateString() === filterDate.toDateString();
        });

        // Update recent days to show only filtered date
        const container = document.getElementById('recent-days');
        if (filteredExercises.length === 0) {
            container.innerHTML = `
                <div class="empty-log">
                    <ion-icon name="search-outline"></ion-icon>
                    <p>No exercises found for ${this.formatDate(selectedDate)}</p>
                </div>
            `;
        } else {
            // Show exercises for the selected date
            const date = selectedDate;
            const exerciseNames = filteredExercises.map(ex => ex.name);
            const totalSets = filteredExercises.reduce((sum, ex) => sum + ex.sets, 0);

            container.innerHTML = `
                <div class="day-entry">
                    <div class="day-header">
                        <span class="day-date">${this.formatDate(date)}</span>
                        <span class="day-count">${filteredExercises.length} exercises</span>
                    </div>
                    <div class="day-exercises">
                        ${exerciseNames.join(', ')}
                        <br><small>${totalSets} total sets</small>
                    </div>
                </div>
            `;
        }
    }

    // Utility functions
    formatTime(timestamp) {
        return new Date(timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
            });
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">×</button>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 3000);
    }

    // Data persistence
    saveExercises() {
        try {
            localStorage.setItem('workout-exercises', JSON.stringify(this.exercises));
        } catch (error) {
            console.error('Error saving exercises:', error);
            this.showNotification('Failed to save data. Please try again.', 'error');
        }
    }

    loadExercises() {
        try {
            const saved = localStorage.getItem('workout-exercises');
            this.exercises = saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading exercises:', error);
            this.exercises = [];
            this.showNotification('Failed to load saved data.', 'error');
        }
    }

    // Export/Import functionality
    exportData() {
        const dataStr = JSON.stringify(this.exercises, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `workout-data-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        this.showNotification('Data exported successfully!', 'success');
    }

    importData(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                if (Array.isArray(importedData)) {
                    this.exercises = importedData;
                    this.saveExercises();
                    this.renderDailyLog();
                    this.renderRecentDays();
                    this.showNotification('Data imported successfully!', 'success');
                } else {
                    throw new Error('Invalid data format');
                }
            } catch (error) {
                this.showNotification('Failed to import data. Invalid file format.', 'error');
            }
        };
        reader.readAsText(file);
    }
}
// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.workoutLog = new WorkoutLog();
});

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .form-input.error,
    .form-textarea.error {
        border-color: #ef4444 !important;
        background: rgba(239, 68, 68, 0.1) !important;
    }
`;
document.head.appendChild(style);
