import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import exerciseRoutes from './routes/exerciseRoutes';
import trainingPlanRoutes from './routes/trainingPlanRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/planertreningowy')
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Routes
app.use('/api/exercises', exerciseRoutes);
app.use('/api', trainingPlanRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Planer Treningowy API' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 