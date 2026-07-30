import { Box, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import React, { useState, ChangeEvent } from 'react';
import ErrorIcon from '@mui/icons-material/Error';

interface passwordInputInterface {
  name: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  label: string;
  error?: string;
  inputValue: string;
  autoComplete?: string;
}

export default function PasswordInput({
  onChange,
  name,
  label,
  error,
  inputValue,
  autoComplete = 'new-password',
}: passwordInputInterface) {
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const cleanLabel = label.replace(/\s*\*/, '');
  const isRequired = label.includes('*');

  return (
    <div className="w-full text-left">
      <Box
        sx={{
          backgroundColor: '#FFFDF5',
          border: '1px solid #391f0f',
          borderRadius: '16px',
          padding: '6px 16px',
          height: '52px', // Matches Figma 52px height
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'background-color 0.2s',
          '&:hover, &:focus-within': {
            backgroundColor: '#FCF0D8',
          },
          '& input:-webkit-autofill': {
            WebkitBoxShadow: '0 0 0 100px #FFFDF5 inset !important',
            WebkitTextFillColor: '#391f0f !important',
          },
        }}
      >
        <div className="flex flex-col flex-1 min-w-0 pr-2 justify-center">
          <label
            htmlFor={name}
            className="text-[11px] font-semibold text-[#391f0f] leading-none mb-0.5 block select-none"
          >
            {cleanLabel}
            {isRequired && <span className="text-[#FF4D4D] ml-0.5 font-bold">*</span>}
          </label>

          <input
            id={name}
            name={name}
            type={showPassword ? 'text' : 'password'}
            value={inputValue || ''}
            onChange={onChange}
            autoComplete={autoComplete}
            className="w-full bg-transparent text-[15px] font-medium text-[#391f0f] focus:outline-none p-0 m-0 border-none leading-normal"
          />
        </div>

        <IconButton
          aria-label="toggle password visibility"
          onClick={toggleShowPassword}
          edge="end"
          sx={{ padding: '2px', color: '#6F219E' }}
        >
          {error ? (
            <ErrorIcon sx={{ fontSize: '18px', color: '#b3261e' }} />
          ) : showPassword ? (
            <VisibilityOff sx={{ fontSize: '18px' }} />
          ) : (
            <Visibility sx={{ fontSize: '18px' }} />
          )}
        </IconButton>
      </Box>

      {error && <p className="mt-1 text-[#FFA480] text-xs font-medium">{error}</p>}
    </div>
  );
}