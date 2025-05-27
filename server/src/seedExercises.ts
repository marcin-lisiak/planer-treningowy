import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Exercise from './models/Exercise';

dotenv.config();

const exercises = [
  { name: 'Przysiad ze sztangą/dumbbell', sets: 0, reps: 0, completed: false },
  { name: 'Wyciskanie sztangi na ławce płaskiej', sets: 0, reps: 0, completed: false },
  { name: 'Wiosłowanie hantlami', sets: 0, reps: 0, completed: false },
  { name: 'Martwy ciąg rumuński', sets: 0, reps: 0, completed: false },
  { name: 'Plank', sets: 0, reps: 0, completed: false },
  { name: 'Finisher: Interwały (rower/bieżnia 30s sprint / 90s trucht)', sets: 0, reps: 0, completed: false },
  { name: 'Martwy ciąg klasyczny', sets: 0, reps: 0, completed: false },
  { name: 'Ściąganie drążka wyciągu do klatki', sets: 0, reps: 0, completed: false },
  { name: 'Wyciskanie żołnierskie (sztanga lub hantle)', sets: 0, reps: 0, completed: false },
  { name: 'Split squat / wykroki', sets: 0, reps: 0, completed: false },
  { name: 'Face pulls / band pulls', sets: 0, reps: 0, completed: false },
  { name: 'Unoszenie hantli bokiem (barki)', sets: 0, reps: 0, completed: false },
  { name: 'Uginanie ramion z hantlami (biceps)', sets: 0, reps: 0, completed: false },
  { name: 'Ściąganie linki w dół (triceps)', sets: 0, reps: 0, completed: false },
  { name: 'Wiosłowanie', sets: 0, reps: 0, completed: false },
  { name: 'Szybki marsz pod górkę / schodki', sets: 0, reps: 0, completed: false },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || '', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as any);
    console.log('Połączono z MongoDB');

    await Exercise.deleteMany({});
    await Exercise.insertMany(exercises);
    console.log('Dodano ćwiczenia!');
    process.exit(0);
  } catch (err) {
    console.error('Błąd podczas seedowania ćwiczeń:', err);
    process.exit(1);
  }
}

seed(); 