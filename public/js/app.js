const API_BASE = 'http://localhost:3000/api';

const trainingForm = document.getElementById('trainingForm');
const trainingMessage = document.getElementById('trainingMessage');
const trainBtn = document.getElementById('trainBtn');
const trainingStatus = document.getElementById('trainingStatus');
const predictionForm = document.getElementById('predictionForm');
const predictionResult = document.getElementById('predictionResult');
const statsDiv = document.getElementById('stats');

// Add Training Data - FIXED VERSION
trainingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nameInput = document.getElementById('name');
    const genderInput = document.getElementById('gender');
    
    const name = nameInput.value.trim();
    const gender = genderInput.value;
    
    // Validate
    if (!name) {
        showNotification(trainingMessage, 'Please enter a name', 'error');
        return;
    }
    
    if (!gender) {
        showNotification(trainingMessage, 'Please select a gender', 'error');
        return;
    }
    
    trainingMessage.style.display = 'block';
    trainingMessage.innerHTML = '<div class="loading"></div> Saving...';
    trainingMessage.className = 'info';
    
    try {
        const response = await fetch(`${API_BASE}/training-data`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                name: name,
                gender: gender 
            })
        });
        
        const result = await response.json();
        console.log('Server response:', result);
        
        if (!response.ok) {
            throw new Error(result.error || 'Failed to save data');
        }
        
        showNotification(
            trainingMessage, 
            `✅ "${name}" added as ${gender}!`, 
            'success'
        );
        
        trainingForm.reset();
        updateStats();
        
    } catch (error) {
        console.error('Error:', error);
        showNotification(
            trainingMessage, 
            `❌ ${error.message}`, 
            'error'
        );
    }
});

// Train Model
trainBtn.addEventListener('click', async () => {
    trainingStatus.style.display = 'block';
    trainingStatus.innerHTML = '<div class="loading"></div> Training model...';
    trainingStatus.className = 'info';
    
    try {
        const response = await fetch(`${API_BASE}/train`, {
            method: 'POST'
        });
        
        const result = await response.json();
        console.log('Training result:', result);
        
        if (!response.ok) {
            throw new Error(result.error || result.details || 'Training failed');
        }
        
        showNotification(
            trainingStatus, 
            `✅ Model trained! Accuracy: ${(result.accuracy * 100).toFixed(2)}%`,
            'success'
        );
        
    } catch (error) {
        console.error('Training error:', error);
        showNotification(
            trainingStatus, 
            `❌ ${error.message}`,
            'error'
        );
    }
});

// Predict Gender
predictionForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('predictName').value.trim();
    
    if (!name) {
        showNotification(predictionResult, 'Please enter a name', 'error');
        return;
    }
    
    predictionResult.style.display = 'block';
    predictionResult.innerHTML = '<div class="loading"></div> Predicting...';
    predictionResult.className = 'info';
    
    try {
        const response = await fetch(`${API_BASE}/predict`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: name })
        });
        
        const result = await response.json();
        console.log('Prediction result:', result);
        
        if (!response.ok || result.error) {
            throw new Error(result.error || result.details || 'Prediction failed');
        }
        
        const confidence = (result.confidence * 100).toFixed(2);
        const emoji = result.gender === 'male' ? '👨' : '👩';
        
        predictionResult.innerHTML = `
            <strong>${emoji} Predicted:</strong> ${result.gender.toUpperCase()}<br>
            <strong>Confidence:</strong> ${confidence}%<br>
            <strong>Probability:</strong> ${result.probability.toFixed(4)}
        `;
        predictionResult.className = 'success';
        
    } catch (error) {
        console.error('Prediction error:', error);
        predictionResult.innerHTML = `❌ ${error.message}`;
        predictionResult.className = 'error';
    }
});

// Update Stats
async function updateStats() {
    try {
        const response = await fetch(`${API_BASE}/training-data`);
        const data = await response.json();
        
        const maleCount = data.filter(d => d.gender === 'male').length;
        const femaleCount = data.filter(d => d.gender === 'female').length;
        
        statsDiv.innerHTML = `
            <p><strong>📊 Total Samples:</strong> ${data.length}</p>
            <p><strong>👨 Male:</strong> ${maleCount}</p>
            <p><strong>👩 Female:</strong> ${femaleCount}</p>
        `;
        
    } catch (error) {
        console.error('Error updating stats:', error);
        statsDiv.innerHTML = '<p>❌ Unable to load stats</p>';
    }
}

// Helper function
function showNotification(element, message, type) {
    element.textContent = message;
    element.className = type;
    element.style.display = 'block';
}

// Initialize
updateStats();

// Add browser console logging for debugging
console.log('🚀 Gender AI App loaded');
console.log('📡 API Base:', API_BASE);