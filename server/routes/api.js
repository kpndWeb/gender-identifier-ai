const express = require('express');
const router = express.Router();
const TrainingData = require('../models/TrainingData');
const { trainModel, predictGender } = require('../../models/genderModel');

// Get all training data
router.get('/training-data', async (req, res) => {
    try {
        const data = await TrainingData.findAll({
            order: [['created_at', 'DESC']]
        });
        console.log(`📊 Retrieved ${data.length} training records`);
        res.json(data);
    } catch (error) {
        console.error('Error fetching training data:', error);
        res.status(500).json({ error: error.message });
    }
});

// Add training data - FIXED VERSION
router.post('/training-data', async (req, res) => {
    try {
        console.log('📥 Received training data:', req.body);
        
        const { name, gender } = req.body;
        
        // Validate input
        if (!name || !gender) {
            return res.status(400).json({ 
                error: 'Name and gender are required' 
            });
        }
        
        if (!['male', 'female'].includes(gender)) {
            return res.status(400).json({ 
                error: 'Gender must be "male" or "female"' 
            });
        }
        
        // Create new training record
        const newData = await TrainingData.create({
            name: name.trim(),
            gender: gender.toLowerCase(),
            features: {} // Will be populated during training
        });
        
        console.log('✅ Training data saved:', newData.toJSON());
        
        res.status(201).json({
            success: true,
            data: newData
        });
        
    } catch (error) {
        console.error('❌ Error saving training data:', error);
        res.status(500).json({ 
            error: 'Failed to save training data',
            details: error.message 
        });
    }
});

// Train model
router.post('/train', async (req, res) => {
    try {
        console.log('🚀 Starting model training...');
        const result = await trainModel();
        console.log('✅ Model training completed:', result);
        res.json(result);
    } catch (error) {
        console.error('❌ Training error:', error);
        res.status(500).json({ 
            error: 'Training failed',
            details: error.message 
        });
    }
});

// Predict gender
router.post('/predict', async (req, res) => {
    try {
        const { name } = req.body;
        
        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }
        
        const prediction = await predictGender(name);
        console.log(`🔮 Prediction for "${name}":`, prediction);
        res.json(prediction);
    } catch (error) {
        console.error('❌ Prediction error:', error);
        res.status(500).json({ 
            error: 'Prediction failed',
            details: error.message 
        });
    }
});

module.exports = router;