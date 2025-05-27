import React, { useState, useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
  TextField,
  Button,
  Box,
  Typography,
  Paper
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import axios from 'axios';

interface Exercise {
  _id: string;
  name: string;
  sets: number;
  reps: number;
  completed: boolean;
}

const ExerciseList: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [newExercise, setNewExercise] = useState({
    name: '',
    sets: 0,
    reps: 0
  });

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/exercises');
      setExercises(response.data);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    }
  };

  const handleAddExercise = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/exercises', newExercise);
      setExercises([...exercises, response.data]);
      setNewExercise({ name: '', sets: 0, reps: 0 });
    } catch (error) {
      console.error('Error adding exercise:', error);
    }
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/exercises/${id}`, {
        completed: !completed
      });
      setExercises(exercises.map(ex => ex._id === id ? response.data : ex));
    } catch (error) {
      console.error('Error updating exercise:', error);
    }
  };

  const handleDeleteExercise = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/exercises/${id}`);
      setExercises(exercises.filter(ex => ex._id !== id));
    } catch (error) {
      console.error('Error deleting exercise:', error);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Plan Treningowy
      </Typography>
      
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField
            label="Nazwa ćwiczenia"
            value={newExercise.name}
            onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
            fullWidth
          />
          <TextField
            label="Serie"
            type="number"
            value={newExercise.sets}
            onChange={(e) => setNewExercise({ ...newExercise, sets: parseInt(e.target.value) })}
            sx={{ width: 100 }}
          />
          <TextField
            label="Powtórzenia"
            type="number"
            value={newExercise.reps}
            onChange={(e) => setNewExercise({ ...newExercise, reps: parseInt(e.target.value) })}
            sx={{ width: 100 }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddExercise}
          >
            Dodaj
          </Button>
        </Box>
      </Paper>

      <List>
        {exercises.map((exercise) => (
          <ListItem
            key={exercise._id}
            sx={{
              bgcolor: 'background.paper',
              mb: 1,
              borderRadius: 1,
              '&:hover': { bgcolor: 'action.hover' }
            }}
          >
            <Checkbox
              checked={exercise.completed}
              onChange={() => handleToggleComplete(exercise._id, exercise.completed)}
            />
            <ListItemText
              primary={exercise.name}
              secondary={`${exercise.sets} serie x ${exercise.reps} powtórzeń`}
              sx={{
                textDecoration: exercise.completed ? 'line-through' : 'none',
                color: exercise.completed ? 'text.secondary' : 'text.primary'
              }}
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleDeleteExercise(exercise._id)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ExerciseList; 