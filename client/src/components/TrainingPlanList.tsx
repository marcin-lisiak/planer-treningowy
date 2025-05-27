import React, { useState, useEffect } from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  Button, 
  Typography, 
  Paper,
  Box
} from '@mui/material';
import axios from 'axios';
import CreateTrainingPlan from './CreateTrainingPlan';

interface Exercise {
  _id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
}

interface TrainingPlan {
  _id: string;
  name: string;
  description?: string;
  exercises: Exercise[];
}

const TrainingPlanList: React.FC = () => {
  const [plans, setPlans] = useState<TrainingPlan[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/plans');
      setPlans(response.data);
    } catch (error) {
      console.error('Błąd podczas pobierania planów:', error);
    }
  };

  const startTraining = async (planId: string) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/plans/${planId}/start`);
      // Tutaj przekierujemy do komponentu wykonywania treningu
      console.log('Rozpoczęto trening:', response.data);
    } catch (error) {
      console.error('Błąd podczas rozpoczynania treningu:', error);
    }
  };

  const handleCreatePlan = () => {
    setShowCreateForm(true);
  };

  const handleCloseCreateForm = () => {
    setShowCreateForm(false);
    fetchPlans(); // Odśwież listę planów po zamknięciu formularza
  };

  if (showCreateForm) {
    return <CreateTrainingPlan onClose={handleCloseCreateForm} />;
  }

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Plany Treningowe
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        sx={{ marginBottom: 2 }}
        onClick={handleCreatePlan}
      >
        Utwórz Nowy Plan
      </Button>
      <List>
        {plans.map((plan) => (
          <Paper key={plan._id} sx={{ marginBottom: 2, padding: 2 }}>
            <ListItem>
              <ListItemText
                primary={plan.name}
                secondary={plan.description}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => startTraining(plan._id)}
              >
                Rozpocznij Trening
              </Button>
            </ListItem>
            <List>
              {plan.exercises.map((exercise) => (
                <ListItem key={exercise._id}>
                  <ListItemText
                    primary={exercise.name}
                    secondary={`${exercise.sets} serie x ${exercise.reps} powtórzeń, ${exercise.weight}kg`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        ))}
      </List>
    </Box>
  );
};

export default TrainingPlanList; 