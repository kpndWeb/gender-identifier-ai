# 🤖 Gender Identification AI Web Application

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-4.x-blue.svg)](https://www.tensorflow.org/js)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14%2B-orange.svg)](https://www.postgresql.org/)

**A full-stack JavaScript AI application for learning machine learning concepts through hands-on development.**

</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🚀 Quick Start](#-quick-start)
- [🔧 Technologies](#-technologies)
- [📦 Prerequisites](#-prerequisites)
- [⚙️ Installation](#️-installation)
- [📝 Configuration](#-configuration)
- [🎮 Usage](#-usage)
- [🏗️ Project Structure](#️-project-structure)
- [🔌 API Endpoints](#-api-endpoints)
- [🧠 How It Works](#-how-it-works)
- [🐛 Troubleshooting](#-troubleshooting)
- [💡 Future Enhancements](#-future-enhancements)
- [📚 Learning Resources](#-learning-resources)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Features

- ✅ **Interactive Training Data Collection** - Collect and store training samples via web form
- ✅ **Real-time Model Training** - Train TensorFlow.js neural network directly in the browser
- ✅ **Gender Prediction** - Predict gender from names with confidence scores
- ✅ **PostgreSQL Database** - Persistent storage for training data and model versions
- ✅ **Full-Stack JavaScript** - Unified tech stack (Node.js + Express + TensorFlow.js)
- ✅ **Responsive UI** - Modern, clean interface with real-time feedback
- ✅ **Feature Engineering** - Automatic extraction of name-based features
- ✅ **Model Persistence** - Save and load trained models to/from disk
- ✅ **Training Statistics** - Live stats on collected data (male/female counts)
- ✅ **Error Handling** - Comprehensive validation and error messages

---

## 🚀 Quick Start

```bash
# Clone or download the project
git clone <your-repo-url>
cd gender-identification-ai

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your PostgreSQL credentials

# Initialize database
# Run SQL commands from docs/database-setup.sql

# Start development server
npm start

# Open browser
http://localhost:3000