import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  List,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

interface Exercise {
  _id: string;
  name: string;
}

interface ExerciseInPlan {
  exerciseId: string;
  customName?: string;
  sets: number;
  reps: number;
  weight: number;
}

const CreateTrainingPlan: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<ExerciseInPlan[]>([]);

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/exercises');
      setAvailableExercises(response.data);
    } catch (error) {
      console.error('Błąd podczas pobierania ćwiczeń:', error);
    }
  };

  const handleAddExercise = () => {
    setSelectedExercises([
      ...selectedExercises,
      { exerciseId: '', sets: 3, reps: 10, weight: 0 }
    ]);
  };

  const handleRemoveExercise = (index: number) => {
    setSelectedExercises(selectedExercises.filter((_, i) => i !== index));
  };

  const handleExerciseChange = (index: number, field: keyof ExerciseInPlan, value: string | number) => {
    const updatedExercises = [...selectedExercises];
    updatedExercises[index] = {
      ...updatedExercises[index],
      [field]: value
    };
    if (field === 'exerciseId' && value === 'custom') {
      updatedExercises[index].customName = '';
    }
    setSelectedExercises(updatedExercises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const exercisesToSend = selectedExercises.map(ex =>
        ex.exerciseId === 'custom'
          ? { name: ex.customName, sets: ex.sets, reps: ex.reps, weight: ex.weight }
          : { exerciseId: ex.exerciseId, sets: ex.sets, reps: ex.reps, weight: ex.weight }
      );
      await axios.post('http://localhost:5000/api/plans', {
        name,
        description,
        exercises: exercisesToSend
      });
      onClose();
    } catch (error) {
      console.error('Błąd podczas tworzenia planu:', error);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 2 }}>
      <Paper sx={{ padding: 3 }}>
        <Typography variant="h5" gutterBottom>
          Utwórz Nowy Plan Treningowy
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Nazwa planu"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Opis"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={2}
            />
          </Box>

          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
            Ćwiczenia
          </Typography>

          <List>
            {selectedExercises.map((exercise, index) => (
              <Paper key={index} sx={{ mb: 2, p: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                  <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                    <FormControl fullWidth>
                      <InputLabel>Ćwiczenie</InputLabel>
                      <Select
                        value={exercise.exerciseId}
                        onChange={(e) => handleExerciseChange(index, 'exerciseId', e.target.value)}
                        required
                      >
                        {availableExercises.map((ex) => (
                          <MenuItem key={ex._id} value={ex._id}>
                            {ex.name}
                          </MenuItem>
                        ))}
                        <MenuItem value="custom">Wpisz własne ćwiczenie</MenuItem>
                      </Select>
                    </FormControl>
                    {exercise.exerciseId === 'custom' && (
                      <TextField
                        fullWidth
                        label="Nazwa własnego ćwiczenia"
                        value={exercise.customName || ''}
                        onChange={(e) => handleExerciseChange(index, 'customName', e.target.value)}
                        sx={{ mt: 1 }}
                        required
                      />
                    )}
                  </Box>
                  <Box sx={{ flex: '0 1 150px' }}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Serie"
                      value={exercise.sets}
                      onChange={(e) => handleExerciseChange(index, 'sets', parseInt(e.target.value))}
                      required
                    />
                  </Box>
                  <Box sx={{ flex: '0 1 150px' }}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Powtórzenia"
                      value={exercise.reps}
                      onChange={(e) => handleExerciseChange(index, 'reps', parseInt(e.target.value))}
                      required
                    />
                  </Box>
                  <Box sx={{ flex: '0 1 150px' }}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Ciężar (kg)"
                      value={exercise.weight}
                      onChange={(e) => handleExerciseChange(index, 'weight', parseFloat(e.target.value))}
                      required
                    />
                  </Box>
                  <Box sx={{ flex: '0 0 auto' }}>
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveExercise(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Paper>
            ))}
          </List>

          <Button
            variant="outlined"
            onClick={handleAddExercise}
            sx={{ mb: 2 }}
          >
            Dodaj Ćwiczenie
          </Button>

          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!name || selectedExercises.length === 0}
            >
              Zapisz Plan
            </Button>
            <Button
              variant="outlined"
              onClick={onClose}
            >
              Anuluj
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateTrainingPlan; 