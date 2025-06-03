import React, { useState, useEffect, useCallback } from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  Button, 
  Typography, 
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
  ListItemSecondaryAction,
  useTheme,
  useMediaQuery,
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight: number;
  completed?: boolean;
}

interface TrainingPlan {
  id: string;
  name: string;
  exercises: Exercise[];
}

interface TrainingPlanListProps {
  onStartTraining: (trainingId: string) => void;
}

const TrainingPlanList: React.FC<TrainingPlanListProps> = ({ onStartTraining }) => {
  const [trainingPlans, setTrainingPlans] = useState<TrainingPlan[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPlan, setEditingPlan] = useState<TrainingPlan | null>(null);
  const [planName, setPlanName] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<TrainingPlan | null>(null);
  const [showExercisesDialog, setShowExercisesDialog] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    try {
      const savedPlans = localStorage.getItem('trainingPlans');
      if (savedPlans) {
        setTrainingPlans(JSON.parse(savedPlans));
      }
    } catch (error) {
      console.error('Błąd podczas ładowania planów:', error);
      setTrainingPlans([]);
    }
  }, []);

  const savePlans = useCallback((plans: TrainingPlan[]) => {
    try {
      localStorage.setItem('trainingPlans', JSON.stringify(plans));
      setTrainingPlans(plans);
    } catch (error) {
      console.error('Błąd podczas zapisywania planów:', error);
    }
  }, []);

  const handleCreatePlan = useCallback(() => {
    try {
      const newPlan: TrainingPlan = {
        id: Date.now().toString(),
        name: 'Nowy plan',
        exercises: []
      };
      savePlans([...trainingPlans, newPlan]);
      onStartTraining(newPlan.id);
    } catch (error) {
      console.error('Błąd podczas tworzenia nowego planu:', error);
    }
  }, [trainingPlans, savePlans, onStartTraining]);

  const handleEditPlan = useCallback((plan: TrainingPlan) => {
    try {
      onStartTraining(plan.id);
    } catch (error) {
      console.error('Błąd podczas edycji planu:', error);
    }
  }, [onStartTraining]);

  const handleDeletePlan = useCallback((planId: string) => {
    try {
      const updatedPlans = trainingPlans.filter(plan => plan.id !== planId);
      savePlans(updatedPlans);
    } catch (error) {
      console.error('Błąd podczas usuwania planu:', error);
    }
  }, [trainingPlans, savePlans]);

  const handleSavePlan = useCallback(() => {
    if (!planName.trim()) return;

    try {
      if (editingPlan) {
        const updatedPlans = trainingPlans.map(plan =>
          plan.id === editingPlan.id ? { ...plan, name: planName } : plan
        );
        savePlans(updatedPlans);
      } else {
        const newPlan: TrainingPlan = {
          id: Date.now().toString(),
          name: planName,
          exercises: []
        };
        savePlans([...trainingPlans, newPlan]);
      }

      setOpenDialog(false);
      setPlanName('');
      setEditingPlan(null);
    } catch (error) {
      console.error('Błąd podczas zapisywania planu:', error);
    }
  }, [planName, editingPlan, trainingPlans, savePlans]);

  const handleShowExercises = useCallback((plan: TrainingPlan) => {
    setSelectedPlan(plan);
    setShowExercisesDialog(true);
  }, []);

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          size={isMobile ? "medium" : "large"}
          sx={{
            px: { xs: 2, sm: 4 },
            py: { xs: 1, sm: 1.5 }
          }}
        >
          Utwórz nowy plan
        </Button>
      </Box>

      {trainingPlans.length === 0 ? (
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
            Brak planów treningowych. Utwórz swój pierwszy plan!
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {trainingPlans.map((plan) => (
            <Grid item xs={12} sm={6} md={4} key={plan.id}>
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
                    {plan.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {plan.exercises.length} ćwiczeń
                  </Typography>
                </CardContent>
                <Divider />
                <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => onStartTraining(plan.id)}
                    size="small"
                    sx={{
                      px: 2,
                      py: 0.5,
                      fontSize: '0.875rem'
                    }}
                  >
                    Rozpocznij trening
                  </Button>
                  <Box>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => handleEditPlan(plan)}
                      color="primary"
                      size={isMobile ? "small" : "medium"}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="info"
                      onClick={() => handleShowExercises(plan)}
                      color="info"
                      size={isMobile ? "small" : "medium"}
                      sx={{ mr: 1 }}
                    >
                      <InfoIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeletePlan(plan.id)}
                      color="error"
                      size={isMobile ? "small" : "medium"}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Utwórz nowy plan treningowy</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nazwa planu"
            type="text"
            fullWidth
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            variant="outlined"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenDialog(false)} color="inherit">
            Anuluj
          </Button>
          <Button 
            onClick={handleSavePlan} 
            color="primary" 
            variant="contained"
            disabled={!planName.trim()}
          >
            Utwórz
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={showExercisesDialog} 
        onClose={() => setShowExercisesDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedPlan?.name} - Lista ćwiczeń
        </DialogTitle>
        <DialogContent>
          <List>
            {selectedPlan?.exercises.map((exercise, index) => (
              <Paper key={index} sx={{ mb: 1, p: 1 }}>
                <ListItem>
                  <ListItemText
                    primary={exercise.name}
                    secondary={`${exercise.sets} serie x ${exercise.reps} powtórzeń, ${exercise.weight}kg`}
                  />
                </ListItem>
              </Paper>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowExercisesDialog(false)}>Zamknij</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TrainingPlanList; 