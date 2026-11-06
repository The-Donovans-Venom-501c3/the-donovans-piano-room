import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import VolumeDown from '@mui/icons-material/VolumeDown';
import VolumeUp from '@mui/icons-material/VolumeUp';

interface VolumeSliderProps {
  volume: number;
  setVolume: (value: number) => void;
  lightMode?: boolean;
}

const VolumeSlider: React.FC<VolumeSliderProps> = ({ volume, setVolume, lightMode = false }) => {
  const handleChange = (_event: Event, newValue: number | number[]) => {
    setVolume(newValue as number);
  };

  const lavenderColor = '#E9D5FF'; 
  const darkPurpleColor = '#6B109B';

  return (
    <Box sx={{ width: 180 }}>
      <Stack spacing={1.5} direction="row" alignItems="center">
        <VolumeDown sx={{ color: lightMode ? lavenderColor : darkPurpleColor, fontSize: 22 }} />
        <Slider 
          aria-label="Volume" 
          value={volume} 
          onChange={handleChange}  
          sx={{ 
            color: lightMode ? lavenderColor : darkPurpleColor,
            height: 4,
            '& .MuiSlider-thumb': {
              width: 18,
              height: 18,
              backgroundColor: lightMode ? lavenderColor : darkPurpleColor,
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
              '&:hover, &.Mui-focusVisible, &.Mui-active': {
                boxShadow: '0 0 0 8px rgba(233, 213, 255, 0.2)',
              },
            },
            '& .MuiSlider-track': {
              backgroundColor: lightMode ? lavenderColor : darkPurpleColor,
              border: 'none',
              height: 4,
            },
            '& .MuiSlider-rail': {
              backgroundColor: lightMode ? 'rgba(255, 255, 255, 0.25)' : 'rgba(107, 16, 155, 0.25)',
              opacity: 1,
              height: 4,
            }
          }}
        />
        <VolumeUp sx={{ color: lightMode ? lavenderColor : darkPurpleColor, fontSize: 22 }} />
      </Stack>
    </Box>
  );
};

export default VolumeSlider;