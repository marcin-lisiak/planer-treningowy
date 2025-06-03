import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Grid,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  CardActions,
  Divider,
  Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { TrainingPlan, Exercise } from '../types';

interface ActiveTrainingProps {
  trainingId: string;
  onComplete: () => void;
}

const ActiveTraining: React.FC<ActiveTrainingProps> = ({ trainingId, onComplete }) => {
  const [plan, setPlan] = useState<TrainingPlan | null>(null);
  const [planName, setPlanName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newExercise, setNewExercise] = useState<Exercise>({
    id: '',
    name: '',
    sets: 3,
    reps: 10,
    weight: 0
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    try {
      const savedPlans = localStorage.getItem('trainingPlans');
      if (savedPlans) {
        const plans = JSON.parse(savedPlans);
        const currentPlan = plans.find((p: TrainingPlan) => p.id === trainingId);
        if (currentPlan) {
          setPlan(currentPlan);
          setPlanName(currentPlan.name);
        }
      }
    } catch (error) {
      console.error('Błąd podczas wczytywania planu:', error);
    }
  }, [trainingId]);

  const savePlan = (updatedPlan: TrainingPlan) => {
    try {
      const savedPlans = localStorage.getItem('trainingPlans');
      if (savedPlans) {
        const plans = JSON.parse(savedPlans);
        const updatedPlans = plans.map((p: TrainingPlan) =>
          p.id === updatedPlan.id ? updatedPlan : p
        );
        localStorage.setItem('trainingPlans', JSON.stringify(updatedPlans));
        setPlan(updatedPlan);
      }
    } catch (error) {
      console.error('Błąd podczas zapisywania planu:', error);
    }
  };

  const handleAddExercise = () => {
    if (plan && newExercise.name.trim()) {
      const updatedPlan = {
        ...plan,
        exercises: [...plan.exercises, { ...newExercise, id: Date.now().toString() }]
      };
      savePlan(updatedPlan);
      setNewExercise({ id: '', name: '', sets: 3, reps: 10, weight: 0 });
      setIsDialogOpen(false);
    }
  };

  const handleDeleteExercise = (exerciseId: string) => {
    if (plan) {
      const updatedPlan = {
        ...plan,
        exercises: plan.exercises.filter((ex: Exercise) => ex.id !== exerciseId)
      };
      savePlan(updatedPlan);
    }
  };

  const handleSavePlan = () => {
    if (plan) {
      const updatedPlan = {
        ...plan,
        name: planName
      };
      savePlan(updatedPlan);
      onComplete(); // Powrót do menu głównego po zapisaniu
    }
  };

  if (!plan) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          Ładowanie planu...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton 
          onClick={onComplete}
          color="primary"
          size={isMobile ? "medium" : "large"}
        >
          <ArrowBackIcon />
        </IconButton>
        <TextField
          fullWidth
          value={planName}
          onChange={(e) => setPlanName(e.target.value)}
          variant="outlined"
          size={isMobile ? "small" : "medium"}
          sx={{
            '& .MuiOutlinedInput-root': {
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
              fontWeight: 500
            }
          }}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handleSavePlan}
          size={isMobile ? "medium" : "large"}
        >
          Zapisz i wróć
        </Button>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setIsDialogOpen(true)}
          fullWidth
          size={isMobile ? "medium" : "large"}
          sx={{ py: 1.5 }}
        >
          Dodaj ćwiczenie
        </Button>
      </Box>

      {plan.exercises.length === 0 ? (
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            textAlign: 'center',
            backgroundColor: 'background.default',
            borderRadius: 2
          }}
        >
          <Typography variant="h6" color="text.secondary">
            Brak ćwiczeń w planie. Dodaj swoje pierwsze ćwiczenie!
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {plan.exercises.map((exercise) => (
            <Grid item xs={12} sm={6} md={4} key={exercise.id}>
              <Card 
                elevation={2}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {exercise.name}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                    <Chip 
                      label={`${exercise.sets} serie`} 
                      color="primary" 
                      variant="outlined"
                      size={isMobile ? "small" : "medium"}
                    />
                    <Chip 
                      label={`${exercise.reps} powtórzeń`} 
                      color="secondary" 
                      variant="outlined"
                      size={isMobile ? "small" : "medium"}
                    />
                    {exercise.weight > 0 && (
                      <Chip 
                        label={`${exercise.weight} kg`} 
                        color="info" 
                        variant="outlined"
                        size={isMobile ? "small" : "medium"}
                      />
                    )}
                  </Box>
                </CardContent>
                <Divider />
                <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteExercise(exercise.id)}
                    color="error"
                    size={isMobile ? "small" : "medium"}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog 
        open={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Dodaj nowe ćwiczenie</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nazwa ćwiczenia"
            type="text"
            fullWidth
            value={newExercise.name}
            onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
            variant="outlined"
            sx={{ mt: 2 }}
          />
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={4}>
              <TextField
                label="Serie"
                type="number"
                fullWidth
                value={newExercise.sets}
                onChange={(e) => setNewExercise({ ...newExercise, sets: parseInt(e.target.value) || 0 })}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Powtórzenia"
                type="number"
                fullWidth
                value={newExercise.reps}
                onChange={(e) => setNewExercise({ ...newExercise, reps: parseInt(e.target.value) || 0 })}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Ciężar (kg)"
                type="number"
                fullWidth
                value={newExercise.weight}
                onChange={(e) => setNewExercise({ ...newExercise, weight: parseInt(e.target.value) || 0 })}
                variant="outlined"
                size="small"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setIsDialogOpen(false)} color="inherit">
            Anuluj
          </Button>
          <Button 
            onClick={handleAddExercise} 
            color="primary" 
            variant="contained"
            disabled={!newExercise.name.trim()}
          >
            Dodaj
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ActiveTraining; 