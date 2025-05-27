import { Request, Response } from 'express';
import TrainingPlan from '../models/TrainingPlan';
import CompletedTraining from '../models/CompletedTraining';

// Pobierz wszystkie plany treningowe
export const getAllTrainingPlans = async (req: Request, res: Response) => {
  try {
    const plans = await TrainingPlan.find().populate('exercises.exerciseId');
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: 'Błąd podczas pobierania planów treningowych', error });
  }
};

// Utwórz nowy plan treningowy
export const createTrainingPlan = async (req: Request, res: Response) => {
  try {
    const { name, description, exercises } = req.body;
    const plan = new TrainingPlan({
      name,
      description,
      exercises
    });
    const savedPlan = await plan.save();
    res.status(201).json(savedPlan);
  } catch (error) {
    res.status(400).json({ message: 'Błąd podczas tworzenia planu treningowego', error });
  }
};

// Rozpocznij trening
export const startTraining = async (req: Request, res: Response) => {
  try {
    const { trainingPlanId } = req.params;
    const plan = await TrainingPlan.findById(trainingPlanId).populate('exercises.exerciseId');
    
    if (!plan) {
      return res.status(404).json({ message: 'Plan treningowy nie znaleziony' });
    }

    const completedTraining = new CompletedTraining({
      trainingPlanId: plan._id,
      startTime: new Date(),
      endTime: new Date(), // tymczasowo
      duration: 0,
      exercises: plan.exercises.map(ex => ({
        exerciseId: ex.exerciseId,
        sets: ex.sets,
        reps: ex.reps,
        weight: ex.weight,
        completed: false
      }))
    });

    const savedTraining = await completedTraining.save();
    res.status(201).json(savedTraining);
  } catch (error) {
    res.status(400).json({ message: 'Błąd podczas rozpoczynania treningu', error });
  }
};

// Zakończ trening
export const completeTraining = async (req: Request, res: Response) => {
  try {
    const { trainingId } = req.params;
    const { exercises, notes } = req.body;
    
    const training = await CompletedTraining.findById(trainingId);
    if (!training) {
      return res.status(404).json({ message: 'Trening nie znaleziony' });
    }

    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - training.startTime.getTime()) / 1000);

    training.endTime = endTime;
    training.duration = duration;
    training.exercises = exercises;
    training.notes = notes;

    const updatedTraining = await training.save();
    res.json(updatedTraining);
  } catch (error) {
    res.status(400).json({ message: 'Błąd podczas kończenia treningu', error });
  }
};

// Pobierz historię treningów
export const getTrainingHistory = async (req: Request, res: Response) => {
  try {
    const trainings = await CompletedTraining.find()
      .populate('trainingPlanId')
      .populate('exercises.exerciseId')
      .sort({ startTime: -1 });
    res.json(trainings);
  } catch (error) {
    res.status(500).json({ message: 'Błąd podczas pobierania historii treningów', error });
  }
}; 