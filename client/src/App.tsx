import React, { useState, useCallback, useEffect } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  useTheme,
  useMediaQuery,
  Paper,
  CssBaseline,
  ThemeProvider,
  createTheme
} from '@mui/material';
import TrainingPlanList from './components/TrainingPlanList';
import ActiveTraining from './components/ActiveTraining';
import TrainingHistory from './components/TrainingHistory';

interface CompletedTraining {
  id: string;
  planId: string;
  planName: string;
  date: string;
  duration: number;
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
    },
    secondary: {
      main: '#f50057',
      light: '#ff4081',
      dark: '#c51162',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 500,
    },
    h2: {
      fontWeight: 500,
    },
    h3: {
      fontWeight: 500,
    },
    h4: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

function App() {
  const [activeTrainingId, setActiveTrainingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [completedTrainings, setCompletedTrainings] = useState<CompletedTraining[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    try {
      // Inicjalizacja danych w localStorage jeśli nie istnieją
      if (!localStorage.getItem('trainingPlans')) {
        localStorage.setItem('trainingPlans', JSON.stringify([]));
      }
      if (!localStorage.getItem('completedTrainings')) {
        localStorage.setItem('completedTrainings', JSON.stringify([]));
      }

      // Wczytanie historii treningów
      const savedTrainings = localStorage.getItem('completedTrainings');
      if (savedTrainings) {
        setCompletedTrainings(JSON.parse(savedTrainings));
      }

      setIsInitialized(true);
    } catch (error) {
      console.error('Błąd podczas inicjalizacji aplikacji:', error);
      // W przypadku błędu, ustawiamy puste tablice
      localStorage.setItem('trainingPlans', JSON.stringify([]));
      localStorage.setItem('completedTrainings', JSON.stringify([]));
      setCompletedTrainings([]);
      setIsInitialized(true);
    }
  }, []);

  const handleStartTraining = useCallback((id: string) => {
    setActiveTrainingId(id);
  }, []);

  const handleCompleteTraining = useCallback(() => {
    setActiveTrainingId(null);
    try {
      const savedTrainings = localStorage.getItem('completedTrainings');
      if (savedTrainings) {
        setCompletedTrainings(JSON.parse(savedTrainings));
      }
    } catch (error) {
      console.error('Błąd podczas odświeżania historii treningów:', error);
    }
  }, []);

  const handleDeleteTraining = useCallback((id: string) => {
    try {
      const updatedTrainings = completedTrainings.filter(training => training.id !== id);
      localStorage.setItem('completedTrainings', JSON.stringify(updatedTrainings));
      setCompletedTrainings(updatedTrainings);
    } catch (error) {
      console.error('Błąd podczas usuwania treningu z historii:', error);
    }
  }, [completedTrainings]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (!isInitialized) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="md">
          <Box sx={{ my: 4, textAlign: 'center' }}>
            <Typography variant="h5">Ładowanie aplikacji...</Typography>
          </Box>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        minHeight: '100vh',
        backgroundColor: 'background.default',
        py: { xs: 2, sm: 4 }
      }}>
        <Container maxWidth="md">
          <Paper 
            elevation={3} 
            sx={{ 
              p: { xs: 2, sm: 4 },
              mb: 4,
              borderRadius: 4
            }}
          >
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom 
              align="center"
              sx={{
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                mb: 4,
                color: 'primary.main'
              }}
            >
              Planer Treningowy
            </Typography>

            {activeTrainingId ? (
              <ActiveTraining
                trainingId={activeTrainingId}
                onComplete={handleCompleteTraining}
              />
            ) : (
              <Box>
                <Tabs 
                  value={activeTab} 
                  onChange={handleTabChange} 
                  centered
                  sx={{
                    mb: 4,
                    '& .MuiTab-root': {
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      minWidth: { xs: 'auto', sm: 160 }
                    }
                  }}
                >
                  <Tab label="Plany treningowe" />
                  <Tab label="Historia treningów" />
                </Tabs>

                {activeTab === 0 ? (
                  <TrainingPlanList onStartTraining={handleStartTraining} />
                ) : (
                  <TrainingHistory 
                    trainings={completedTrainings} 
                    onDeleteTraining={handleDeleteTraining}
                  />
                )}
              </Box>
            )}
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
