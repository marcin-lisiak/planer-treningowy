import mongoose, { Schema, Document } from 'mongoose';

export interface ICompletedExercise {
  exerciseId: mongoose.Types.ObjectId;
  sets: number;
  reps: number;
  weight: number;
  completed: boolean;
}

export interface ICompletedTraining extends Document {
  trainingPlanId: mongoose.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  duration: number; // w sekundach
  exercises: ICompletedExercise[];
  notes?: string;
}

const CompletedTrainingSchema: Schema = new Schema({
  trainingPlanId: { type: Schema.Types.ObjectId, ref: 'TrainingPlan', required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  duration: { type: Number, required: true },
  exercises: [{
    exerciseId: { type: Schema.Types.ObjectId, ref: 'Exercise', required: true },
    sets: { type: Number, required: true },
    reps: { type: Number, required: true },
    weight: { type: Number, required: true },
    completed: { type: Boolean, default: false }
  }],
  notes: { type: String }
}, {
  timestamps: true
});

export default mongoose.model<ICompletedTraining>('CompletedTraining', CompletedTrainingSchema); 