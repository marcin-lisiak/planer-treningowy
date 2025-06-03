import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Chip,
  Divider,
  IconButton,
  CardActions
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import DeleteIcon from '@mui/icons-material/Delete';

interface CompletedTraining {
  id: string;
  planId: string;
  planName: string;
  date: string;
  duration: number;
}

interface TrainingHistoryProps {
  trainings: CompletedTraining[];
  onDeleteTraining?: (id: string) => void;
}

const TrainingHistory: React.FC<TrainingHistoryProps> = ({ trainings, onDeleteTraining }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (trainings.length === 0) {
    return (
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
          Brak historii treningów. Rozpocznij swój pierwszy trening!
        </Typography>
      </Paper>
    );
  }

  return (
    <Grid container spacing={2}>
      {trainings.map((training) => (
        <Grid item xs={12} sm={6} md={4} key={training.id}>
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
                {training.planName}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarTodayIcon color="primary" fontSize={isMobile ? "small" : "medium"} />
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(training.date)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTimeIcon color="secondary" fontSize={isMobile ? "small" : "medium"} />
                  <Typography variant="body2" color="text.secondary">
                    {formatDuration(training.duration)}
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Chip
                  icon={<FitnessCenterIcon />}
                  label="Ukończony"
                  color="success"
                  variant="outlined"
                  size={isMobile ? "small" : "medium"}
                />
              </Box>
            </CardContent>
            {onDeleteTraining && (
              <CardActions sx={{ justifyContent: 'flex-end', p: 1 }}>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => onDeleteTraining(training.id)}
                  color="error"
                  size={isMobile ? "small" : "medium"}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            )}
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default TrainingHistory; 