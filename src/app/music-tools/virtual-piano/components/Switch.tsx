import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

interface SwitchComponentProps {
  label: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#9c27b0',
    },
  },
});

const SwitchComponent: React.FC<SwitchComponentProps> = ({ label, checked, onChange }) => {
  return (
    <ThemeProvider theme={theme}>
      <FormControlLabel
        control={
          <Switch
            checked={checked}
            onChange={onChange}
            color="primary"
            inputProps={{ 'aria-label': 'controlled' }}
          />
        }
        label={label}
      />
    </ThemeProvider>
  );
};

export default SwitchComponent;