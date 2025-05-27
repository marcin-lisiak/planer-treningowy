import mongoose, { Schema, Document } from 'mongoose';

export interface IExercise extends Document {
  name: string;
  sets: number;
  reps: number;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ExerciseSchema: Schema = new Schema({
  name: { type: String, required: true },
  sets: { type: Number, required: true },
  reps: { type: Number, required: true },
  completed: { type: Boolean, default: false },
}, {
  timestamps: true
});

export default mongoose.model<IExercise>('Exercise', ExerciseSchema); 