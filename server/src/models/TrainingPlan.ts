import mongoose, { Schema, Document } from 'mongoose';

export interface IExerciseInPlan {
  exerciseId: mongoose.Types.ObjectId;
  sets: number;
  reps: number;
  weight: number;
  notes?: string;
}

export interface ITrainingPlan extends Document {
  name: string;
  description?: string;
  exercises: IExerciseInPlan[];
  createdAt: Date;
  updatedAt: Date;
}

const TrainingPlanSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  exercises: [{
    exerciseId: { type: Schema.Types.ObjectId, ref: 'Exercise', required: true },
    sets: { type: Number, required: true },
    reps: { type: Number, required: true },
    weight: { type: Number, required: true },
    notes: { type: String }
  }],
}, {
  timestamps: true
});

export default mongoose.model<ITrainingPlan>('TrainingPlan', TrainingPlanSchema); 