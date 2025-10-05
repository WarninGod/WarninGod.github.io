// Home page functionality
class HomeManager {
    constructor() {
        this.init();
    }

    init() {
        this.updateStats();
        this.bindEvents();
    }

    updateStats() {
        // Update exercise count using mock data
        if (window.mockExercises) {
            const exercisesCount = document.getElementById('exercises-count');
            const totalExercises = document.getElementById('total-exercises');
            
            if (exercisesCount) {
                exercisesCount.textContent = window.mockExercises.length + '+';
            }
            if (totalExercises) {
                totalExercises.textContent = window.mockExercises.length + '+';
            }
        }

        // Update workout count using mock data
        if (window.mockWorkouts) {
            const workoutsCount = document.getElementById('workouts-count');
            if (workoutsCount) {
                workoutsCount.textContent = window.mockWorkouts.length;
            }
        }

        // Animate counters
        this.animateCounters();
    }

    animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.textContent.replace('+', ''));
            if (isNaN(target)) return;
            
            let current = 0;
            const increment = target / 30; // Animation duration
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.ceil(current) + (counter.textContent.includes('+') ? '+' : '');
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target + (counter.textContent.includes('+') ? '+' : '');
                }
            };
            
            // Start animation when element comes into view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateCounter();
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(counter);
        });
    }

    bindEvents() {
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Add hover effects to feature cards
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
    }

    async loadStats() {
        try {
            // Fallback to backend if mock data isn't available
            const exerciseResponse = await fetch('http://localhost:5000/exercises');
            if (exerciseResponse.ok) {
                const exercises = await exerciseResponse.json();
                document.getElementById('total-exercises').textContent = exercises.length + '+';
            }

            const workoutResponse = await fetch('http://localhost:5000/workouts');
            if (workoutResponse.ok) {
                const data = await workoutResponse.json();
                const totalWorkouts = data.workouts ? data.workouts.length : 0;
                document.getElementById('total-workouts').textContent = totalWorkouts;
            }

            const users = JSON.parse(localStorage.getItem('users') || '[]');
            document.getElementById('total-users').textContent = users.length;

        } catch (error) {
            console.error('Error loading stats:', error);
        }
    }
}

// Initialize home manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.homeManager = new HomeManager();
});
