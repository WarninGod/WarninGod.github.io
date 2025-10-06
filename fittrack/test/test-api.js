// ExerciseDB API Test Script
class ExerciseDBTester {
    constructor() {
        this.apiBaseUrl = 'http://localhost:3000'; // Local ExerciseDB API
        this.localJsonPath = '../exercisedb-api-1-open-source/src/data/exercises.json';
        this.exercises = [];
        this.stats = {
            totalExercises: 0,
            loadedGifs: 0,
            failedGifs: 0,
            responseTime: 0
        };
    }

    updateStatus(message, type = 'info') {
        const statusElement = document.getElementById('status-text');
        const statusContainer = document.getElementById('api-status');
        
        statusElement.textContent = message;
        
        // Update status color based on type
        if (type === 'success') {
            statusContainer.style.borderLeftColor = '#44ff44';
        } else if (type === 'error') {
            statusContainer.style.borderLeftColor = '#ff4444';
        } else {
            statusContainer.style.borderLeftColor = '#ff6b35';
        }
    }

    updateStats() {
        document.getElementById('total-exercises').textContent = this.stats.totalExercises;
        document.getElementById('loaded-gifs').textContent = this.stats.loadedGifs;
        document.getElementById('failed-gifs').textContent = this.stats.failedGifs;
        document.getElementById('response-time').textContent = this.stats.responseTime + 'ms';
    }

    async testAPI() {
        this.updateStatus('Loading local exercise database...', 'info');
        const startTime = performance.now();

        try {
            // Load directly from local JSON file
            const jsonResponse = await fetch(this.localJsonPath);
            const endTime = performance.now();
            this.stats.responseTime = Math.round(endTime - startTime);
            
            if (jsonResponse.ok) {
                const data = await jsonResponse.json();
                this.exercises = data;
                this.stats.totalExercises = data.length;
                this.updateStats();
                this.updateStatus(`✅ Loaded ${data.length} exercises from local database`, 'success');
                this.showMessage(`Successfully loaded ${data.length} exercises from local JSON! Load time: ${this.stats.responseTime}ms`, 'success');
                return true;
            } else {
                throw new Error(`Failed to load JSON file: ${jsonResponse.status}`);
            }
        } catch (error) {
            this.updateStatus(`❌ Failed to load exercises: ${error.message}`, 'error');
            this.showMessage(`Failed to load local exercises: ${error.message}`, 'error');
            return false;
        }
    }

    async loadSampleExercises() {
        if (this.exercises.length === 0) {
            const connected = await this.testAPI();
            if (!connected) return;
        }

        const sampleExercises = this.exercises.slice(0, 12);
        this.displayExercises(sampleExercises);
        this.updateStatus(`Displaying ${sampleExercises.length} sample exercises`, 'success');
    }

    async testRandomGifs() {
        if (this.exercises.length === 0) {
            const connected = await this.testAPI();
            if (!connected) return;
        }

        // Get 9 random exercises for GIF testing
        const randomExercises = this.getRandomExercises(9);
        this.stats.loadedGifs = 0;
        this.stats.failedGifs = 0;

        const gifTestContainer = document.getElementById('gif-test');
        const gifGrid = document.getElementById('gif-grid');
        
        gifTestContainer.style.display = 'block';
        gifGrid.innerHTML = '<div style="text-align: center; color: #888;">Loading GIFs...</div>';

        this.updateStatus('Testing GIF loading...', 'info');

        // Log the first few GIF URLs to console for debugging
        console.log('Testing GIF URLs:');
        randomExercises.slice(0, 3).forEach((exercise, index) => {
            console.log(`${index + 1}. ${exercise.name}: ${exercise.gifUrl}`);
        });

        const gifPromises = randomExercises.map(exercise => this.createGifTest(exercise));
        const results = await Promise.allSettled(gifPromises);

        gifGrid.innerHTML = '';
        results.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                gifGrid.appendChild(result.value);
            } else {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'gif-item';
                errorDiv.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #ff4444;">Failed</div>';
                gifGrid.appendChild(errorDiv);
                this.stats.failedGifs++;
            }
        });

        this.updateStats();
        this.updateStatus(`GIF test complete: ${this.stats.loadedGifs} loaded, ${this.stats.failedGifs} failed`, 
                         this.stats.failedGifs === 0 ? 'success' : 'info');
        
        // Show more info about the failures
        if (this.stats.failedGifs > 0) {
            this.showMessage(`⚠️ ${this.stats.failedGifs} GIFs failed to load. This is likely due to CORS policy or CDN issues. Check console for details.`, 'info');
        }
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

    createGifTest(exercise) {
        return new Promise((resolve, reject) => {
            const gifDiv = document.createElement('div');
            gifDiv.className = 'gif-item';
            
            const workingGifUrl = this.getWorkingGifUrl(exercise.gifUrl);
            
            if (workingGifUrl) {
                const img = document.createElement('img');
                img.src = workingGifUrl;
                img.alt = exercise.name;
                img.title = `${exercise.name} - ${workingGifUrl}`;
                
                // Add loading indicator
                gifDiv.innerHTML = `
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #888; padding: 10px; text-align: center;">
                        <div style="font-size: 20px;">⏳</div>
                        <div style="font-size: 10px; margin-top: 5px;">Loading...</div>
                    </div>
                `;
                
                img.onload = () => {
                    gifDiv.innerHTML = '';
                    gifDiv.appendChild(img);
                    this.stats.loadedGifs++;
                    this.updateStats();
                    resolve(gifDiv);
                };
                
                img.onerror = (error) => {
                    console.error(`Failed to load GIF: ${workingGifUrl}`, error);
                    gifDiv.innerHTML = `
                        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #ff4444; padding: 5px; text-align: center;">
                            <div style="font-size: 20px;">❌</div>
                            <div style="font-size: 9px; margin-top: 5px; word-break: break-all;">${exercise.name}</div>
                            <div style="font-size: 8px; margin-top: 2px; color: #888;">Failed</div>
                        </div>
                    `;
                    this.stats.failedGifs++;
                    this.updateStats();
                    resolve(gifDiv);
                };
                
                // Set a timeout for loading
                setTimeout(() => {
                    if (!img.complete) {
                        img.onerror(new Error('Timeout'));
                    }
                }, 10000); // 10 second timeout
                
            } else {
                gifDiv.innerHTML = `
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #888; padding: 10px; text-align: center;">
                        <div style="font-size: 20px;">🚫</div>
                        <div style="font-size: 10px; margin-top: 5px;">No GIF URL</div>
                    </div>
                `;
                resolve(gifDiv);
            }
        });
    }

    async testSpecificExercise() {
        const exerciseName = prompt('Enter exercise name to test:');
        if (!exerciseName) return;

        if (this.exercises.length === 0) {
            const connected = await this.testAPI();
            if (!connected) return;
        }

        const exercise = this.exercises.find(ex => 
            ex.name.toLowerCase().includes(exerciseName.toLowerCase())
        );

        if (exercise) {
            this.displayExercises([exercise]);
            this.updateStatus(`Found exercise: ${exercise.name}`, 'success');
            
            // Test the specific GIF
            if (exercise.gifUrl) {
                this.testSingleGif(exercise);
            }
        } else {
            this.showMessage(`Exercise "${exerciseName}" not found`, 'error');
            this.updateStatus(`Exercise "${exerciseName}" not found`, 'error');
        }
    }

    async searchExercises() {
        const searchTerm = document.getElementById('search-input').value.trim();
        if (!searchTerm) {
            this.showMessage('Please enter a search term', 'error');
            return;
        }

        if (this.exercises.length === 0) {
            const connected = await this.testAPI();
            if (!connected) return;
        }

        const filteredExercises = this.exercises.filter(exercise =>
            exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (exercise.target && exercise.target.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (exercise.bodyPart && exercise.bodyPart.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (exercise.equipment && exercise.equipment.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        if (filteredExercises.length > 0) {
            this.displayExercises(filteredExercises.slice(0, 20)); // Limit to 20 results
            this.updateStatus(`Found ${filteredExercises.length} exercises matching "${searchTerm}"`, 'success');
        } else {
            this.showMessage(`No exercises found matching "${searchTerm}"`, 'error');
            this.updateStatus(`No results for "${searchTerm}"`, 'error');
        }
    }

    async testSingleGif() {
        if (this.exercises.length === 0) {
            const connected = await this.testAPI();
            if (!connected) return;
        }

        // Get the first exercise for testing
        const exercise = this.exercises[0];
        const workingGifUrl = this.getWorkingGifUrl(exercise.gifUrl);
        
        this.updateStatus(`Testing single GIF: ${exercise.name}`, 'info');
        
        console.log('Original GIF URL:', exercise.gifUrl);
        console.log('Working GIF URL:', workingGifUrl);
        
        // Test if the working URL is accessible
        try {
            const response = await fetch(workingGifUrl, { method: 'HEAD' });
            console.log('Working GIF URL Response:', response.status, response.statusText);
            console.log('Response Headers:', [...response.headers.entries()]);
            
            if (response.ok) {
                this.showMessage(`✅ Working GIF URL is accessible (${response.status})`, 'success');
                this.testSingleGifDisplay(exercise, workingGifUrl);
            } else {
                this.showMessage(`❌ Working GIF URL returned ${response.status}: ${response.statusText}`, 'error');
            }
        } catch (error) {
            console.error('Working GIF URL Test Error:', error);
            this.showMessage(`❌ Working GIF URL test failed: ${error.message}`, 'error');
            
            // Still try to display it to see what happens
            this.testSingleGifDisplay(exercise, workingGifUrl);
        }
    }

    testSingleGifDisplay(exercise, workingGifUrl) {
    testSingleGifDisplay(exercise, workingGifUrl) {
        const gifTestContainer = document.getElementById('gif-test');
        const gifGrid = document.getElementById('gif-grid');
        
        gifTestContainer.style.display = 'block';
        gifGrid.innerHTML = '';

        const testDiv = document.createElement('div');
        testDiv.style.cssText = `
            background: #333;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            max-width: 400px;
            margin: 0 auto;
        `;

        testDiv.innerHTML = `
            <h3 style="color: #ff6b35; margin-bottom: 15px;">${exercise.name}</h3>
            <p style="color: #888; margin-bottom: 10px; word-break: break-all; font-size: 12px;">
                <strong>Original:</strong> ${exercise.gifUrl}
            </p>
            <p style="color: #888; margin-bottom: 15px; word-break: break-all; font-size: 12px;">
                <strong>Working:</strong> ${workingGifUrl}
            </p>
            <div id="gif-container" style="min-height: 200px; background: #222; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                <div style="color: #888;">Loading...</div>
            </div>
        `;

        gifGrid.appendChild(testDiv);

        // Try to load the image
        const img = document.createElement('img');
        img.style.cssText = 'max-width: 100%; max-height: 300px; border-radius: 4px;';
        img.src = workingGifUrl;
        
        img.onload = () => {
            document.getElementById('gif-container').innerHTML = '';
            document.getElementById('gif-container').appendChild(img);
            this.showMessage(`✅ GIF loaded successfully!`, 'success');
            this.updateStatus(`GIF test passed for ${exercise.name}`, 'success');
        };
        
        img.onerror = (error) => {
            console.error('Image load error:', error);
            document.getElementById('gif-container').innerHTML = `
                <div style="color: #ff4444; padding: 20px;">
                    <div style="font-size: 40px; margin-bottom: 10px;">❌</div>
                    <div>Failed to load GIF</div>
                    <div style="font-size: 12px; margin-top: 10px; color: #888;">
                        This could be due to:<br>
                        • CORS policy restrictions<br>
                        • CDN server issues<br>
                        • Network connectivity<br>
                        • File not found (404)
                    </div>
                </div>
            `;
            this.showMessage(`❌ Failed to display GIF for ${exercise.name}`, 'error');
            this.updateStatus(`GIF display failed for ${exercise.name}`, 'error');
        };
    }

    displayExercises(exercises) {
        const resultsContainer = document.getElementById('results');
        
        if (exercises.length === 0) {
            resultsContainer.innerHTML = '<div class="loading">No exercises to display</div>';
            return;
        }

        const exerciseGrid = document.createElement('div');
        exerciseGrid.className = 'exercise-grid';

        exercises.forEach(exercise => {
            const exerciseCard = this.createExerciseCard(exercise);
            exerciseGrid.appendChild(exerciseCard);
        });

        resultsContainer.innerHTML = '';
        resultsContainer.appendChild(exerciseGrid);
    }

    createExerciseCard(exercise) {
        const card = document.createElement('div');
        card.className = 'exercise-card';

        const imageContainer = document.createElement('div');
        imageContainer.className = 'exercise-image';

        if (exercise.gifUrl) {
            const img = document.createElement('img');
            img.src = exercise.gifUrl;
            img.alt = exercise.name;
            img.loading = 'lazy';
            
            img.onload = () => {
                this.stats.loadedGifs++;
                this.updateStats();
            };
            
            img.onerror = () => {
                this.stats.failedGifs++;
                this.updateStats();
                imageContainer.innerHTML = `
                    <div class="placeholder">
                        <div class="placeholder-icon">❌</div>
                        <div>GIF Failed</div>
                    </div>
                `;
            };
            
            imageContainer.appendChild(img);
        } else {
            imageContainer.innerHTML = `
                <div class="placeholder">
                    <div class="placeholder-icon">🏋️</div>
                    <div>No GIF</div>
                </div>
            `;
        }

        const exerciseName = document.createElement('div');
        exerciseName.className = 'exercise-name';
        exerciseName.textContent = exercise.name;

        const exerciseDetails = document.createElement('div');
        exerciseDetails.className = 'exercise-details';
        exerciseDetails.innerHTML = `
            <p><strong>ID:</strong> ${exercise.id || exercise.exerciseId || 'N/A'}</p>
            <p><strong>Target:</strong> ${exercise.target || exercise.targetMuscles?.join(', ') || 'N/A'}</p>
            <p><strong>Body Part:</strong> ${exercise.bodyPart || exercise.bodyParts?.join(', ') || 'N/A'}</p>
            <p><strong>Equipment:</strong> ${exercise.equipment || exercise.equipments?.join(', ') || 'N/A'}</p>
            ${exercise.gifUrl ? `<p><strong>GIF URL:</strong> <a href="${exercise.gifUrl}" target="_blank" style="color: #ff6b35;">View</a></p>` : ''}
        `;

        card.appendChild(imageContainer);
        card.appendChild(exerciseName);
        card.appendChild(exerciseDetails);

        return card;
    }

    getRandomExercises(count) {
        const shuffled = [...this.exercises].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    clearResults() {
        document.getElementById('results').innerHTML = '<div class="loading">Results cleared. Click a test button to start...</div>';
        document.getElementById('gif-test').style.display = 'none';
        document.getElementById('search-input').value = '';
        this.stats.loadedGifs = 0;
        this.stats.failedGifs = 0;
        this.updateStats();
        this.updateStatus('Ready for testing', 'info');
    }

    showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = type;
        messageDiv.textContent = message;
        
        const container = document.querySelector('.container');
        const header = document.querySelector('.header');
        
        // Remove existing messages
        const existingMessages = container.querySelectorAll('.error, .success');
        existingMessages.forEach(msg => msg.remove());
        
        // Insert new message after header
        header.insertAdjacentElement('afterend', messageDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }

    // Auto-run initial test
    async initialize() {
        this.updateStatus('Initializing API test...', 'info');
        await this.testAPI();
    }
}

// Global instance
const apiTester = new ExerciseDBTester();

// Global functions for button clicks
function testAPI() {
    apiTester.testAPI();
}

function loadSampleExercises() {
    apiTester.loadSampleExercises();
}

function testRandomGifs() {
    apiTester.testRandomGifs();
}

function testSpecificExercise() {
    apiTester.testSpecificExercise();
}

function searchExercises() {
    apiTester.searchExercises();
}

function testSingleGif() {
    apiTester.testSingleGif();
}

function clearResults() {
    apiTester.clearResults();
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    apiTester.initialize();
});

// Allow Enter key in search input
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchExercises();
        }
    });
});
