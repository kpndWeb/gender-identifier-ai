const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database');

const TrainingData = sequelize.define('TrainingData', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['male', 'female']]
        }
    },
    features: {
        type: DataTypes.JSONB,
        allowNull: true
    }
}, {
    tableName: 'training_data',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

// Sync model with database
(async () => {
    try {
        await TrainingData.sync({ alter: true });
        console.log('✅ TrainingData model synced with database');
    } catch (error) {
        console.error('❌ Model sync error:', error);
    }
})();

module.exports = TrainingData;