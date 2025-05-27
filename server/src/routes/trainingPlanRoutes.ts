import express from 'express';
import {
  getAllTrainingPlans,
  createTrainingPlan,
  startTraining,
  completeTraining,
  getTrainingHistory
} from '../controllers/trainingPlanController';

const router = express.Router();

// Plany treningowe
router.get('/plans', getAllTrainingPlans);
router.post('/plans', createTrainingPlan);

// Treningi
router.post('/plans/:trainingPlanId/start', startTraining);
router.put('/trainings/:trainingId/complete', completeTraining);
router.get('/trainings/history', getTrainingHistory);

export default router; 