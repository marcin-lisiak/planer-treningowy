import React, { useState } from 'react';
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import TrainingPlanList from './components/TrainingPlanList';
import ActiveTraining from './components/ActiveTraining';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [activeTrainingId, setActiveTrainingId] = useState<string | null>(null);

  const handleStartTraining = (trainingId: string) => {
    setActiveTrainingId(trainingId);
  };

  const handleCompleteTraining = () => {
    setActiveTrainingId(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        {activeTrainingId ? (
          <ActiveTraining
            trainingId={activeTrainingId}
            onComplete={handleCompleteTraining}
          />
        ) : (
          <TrainingPlanList />
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
