const tf = require('@tensorflow/tfjs-node');
const TrainingData = require('../server/models/TrainingData');

// Feature extraction function
function extractFeatures(name) {
    const features = {
        nameLength: name.length,
        firstChar: name.charCodeAt(0),
        lastChar: name.charCodeAt(name.length - 1),
        vowelCount: (name.match(/[aeiouAEIOU]/g) || []).length,
        consonantCount: (name.match(/[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]/g) || []).length
    };
    return features;
}

// Prepare training data
async function prepareTrainingData() {
    const data = await TrainingData.findAll();
    
    const xs = [];
    const ys = [];
    
    data.forEach(item => {
        const features = extractFeatures(item.name);
        xs.push([
            features.nameLength,
            features.firstChar,
            features.lastChar,
            features.vowelCount,
            features.consonantCount
        ]);
        ys.push(item.gender === 'male' ? 0 : 1); // 0 for male, 1 for female
    });
    
    return { xs, ys };
}

// Train model
async function trainModel() {
    const { xs, ys } = await prepareTrainingData();
    
    if (xs.length < 10) {
        throw new Error('Need at least 10 training samples');
    }
    
    // Convert to tensors
    const xsTensor = tf.tensor2d(xs);
    const ysTensor = tf.tensor1d(ys, 'int32');
    
    // Normalize features
    const xsMean = xsTensor.mean(0);
    const xsStd = xsTensor.sub(xsMean).abs().mean(0).add(1e-7);
    const normalizedXs = xsTensor.sub(xsMean).div(xsStd);
    
    // Create model
    const model = tf.sequential();
    model.add(tf.layers.dense({
        inputShape: [5],
        units: 16,
        activation: 'relu'
    }));
    model.add(tf.layers.dense({
        units: 8,
        activation: 'relu'
    }));
    model.add(tf.layers.dense({
        units: 1,
        activation: 'sigmoid'
    }));
    
    // Compile model
    model.compile({
        optimizer: tf.train.adam(0.01),
        loss: 'binaryCrossentropy',
        metrics: ['accuracy']
    });
    
    // Train model
    const history = await model.fit(normalizedXs, ysTensor, {
        epochs: 100,
        batchSize: 8,
        validationSplit: 0.2,
        callbacks: {
            onEpochEnd: async (epoch, logs) => {
                console.log(`Epoch ${epoch}: loss = ${logs.loss.toFixed(4)}, accuracy = ${logs.acc.toFixed(4)}`);
            }
        }
    });
    
    // Save model
    await model.save('file://./models/saved_model');
    
    return {
        accuracy: history.history.acc[history.history.acc.length - 1],
        loss: history.history.loss[history.history.loss.length - 1],
        epochs: history.history.acc.length
    };
}

// Predict gender
async function predictGender(name, features = {}) {
    try {
        // Load model
        const model = await tf.loadLayersModel('file://./models/saved_model/model.json');
        
        // Extract features
        const extractedFeatures = extractFeatures(name);
        const inputFeatures = [
            extractedFeatures.nameLength,
            extractedFeatures.firstChar,
            extractedFeatures.lastChar,
            extractedFeatures.vowelCount,
            extractedFeatures.consonantCount
        ];
        
        // Normalize (using same stats as training)
        const xsTensor = tf.tensor2d([inputFeatures]);
        const xsMean = tf.tensor1d([6.5, 77.5, 110.5, 2.5, 4.0]); // Example means
        const xsStd = tf.tensor1d([2.5, 15.0, 20.0, 1.0, 1.5]); // Example stds
        const normalizedInput = xsTensor.sub(xsMean).div(xsStd);
        
        // Predict
        const prediction = model.predict(normalizedInput);
        const probability = prediction.dataSync()[0];
        
        return {
            gender: probability > 0.5 ? 'female' : 'male',
            confidence: Math.abs(probability - 0.5) * 2,
            probability: probability
        };
    } catch (error) {
        console.error('Prediction error:', error);
        return { error: 'Model not trained yet' };
    }
}

module.exports = {
    trainModel,
    predictGender,
    extractFeatures
};