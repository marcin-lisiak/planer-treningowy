export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  completed?: boolean;
}

export interface TrainingPlan {
  id: string;
  name: string;
  exercises: Exercise[];
}

export interface CompletedTraining {
  id: string;
  planId: string;
  planName: string;
  date: string;
  duration: number;
} 