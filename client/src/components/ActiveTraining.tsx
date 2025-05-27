import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Button,
  Paper,
  CircularProgress
} from '@mui/material';
import axios from 'axios';

interface Exercise {
  _id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  completed: boolean;
}

interface ActiveTraining {
  _id: string;
  trainingPlanId: string;
  startTime: string;
  exercises: Exercise[];
}

interface Props {
  trainingId: string;
  onComplete: () => void;
}

const ActiveTraining: React.FC<Props> = ({ trainingId, onComplete }) => {
  const [training, setTraining] = useState<ActiveTraining | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerActive, setTimerActive] = useState(true);

  useEffect(() => {
    fetchTraining();
    const timer = setInterval(() => {
      if (timerActive) {
        setElapsedTime(prev => prev + 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchTraining = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/trainings/${trainingId}`);
      setTraining(response.data);
    } catch (error) {
      console.error('Błąd podczas pobierania treningu:', error);
    }
  };

  const toggleExercise = async (exerciseId: string) => {
    if (!training) return;

    const updatedExercises = training.exercises.map(ex => 
      ex._id === exerciseId ? { ...ex, completed: !ex.completed } : ex
    );

    setTraining({ ...training, exercises: updatedExercises });
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleComplete = async () => {
    if (!training) return;

    try {
      await axios.put(`http://localhost:5000/api/trainings/${trainingId}/complete`, {
        exercises: training.exercises,
        notes: ''
      });
      setTimerActive(false);
      onComplete();
    } catch (error) {
      console.error('Błąd podczas kończenia treningu:', error);
    }
  };

  if (!training) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 2 }}>
      <Paper sx={{ padding: 2, marginBottom: 2 }}>
        <Typography variant="h5" gutterBottom>
          Trening w toku
        </Typography>
        <Typography variant="h6" color="primary">
          Czas: {formatTime(elapsedTime)}
        </Typography>
      </Paper>

      <List>
        {training.exercises.map((exercise) => (
          <Paper key={exercise._id} sx={{ marginBottom: 2, padding: 2 }}>
            <ListItem>
              <Checkbox
                checked={exercise.completed}
                onChange={() => toggleExercise(exercise._id)}
              />
              <ListItemText
                primary={exercise.name}
                secondary={`${exercise.sets} serie x ${exercise.reps} powtórzeń, ${exercise.weight}kg`}
              />
            </ListItem>
          </Paper>
        ))}
      </List>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleComplete}
        disabled={!training.exercises.every(ex => ex.completed)}
      >
        Zakończ Trening
      </Button>
    </Box>
  );
};

export default ActiveTraining; 