import React from 'react';
import { CssBaseline, Container, ThemeProvider, createTheme } from '@mui/material';
import ExerciseList from './components/ExerciseList';

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
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <ExerciseList />
      </Container>
    </ThemeProvider>
  );
}

export default App;
