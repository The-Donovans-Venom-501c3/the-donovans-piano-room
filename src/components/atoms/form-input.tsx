import { Box } from '@mui/material';
import React, { ChangeEvent } from 'react';

export interface InputData {
  name: string;
  type: string;
  label: string;
  required?: boolean;
  autoComplete?: string;
}

export default function InputForm({
  field,
  error,
  text,
  onChange,
  disabled = false,
}: {
  field: InputData;
  error: string;
  text: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  numRows?: number;
  disabled?: boolean;
}) {
  const cleanLabel = field.label.replace(/\s*\*/, '');
  const isRequired = field.required || field.label.includes('*');

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
          flexDirection: 'column',
          justifyContent: 'center',
          transition: 'background-color 0.2s',
          '&:hover, &:focus-within': {
            backgroundColor: '#FCF0D8',
          },
          '& input:-webkit-autofill': {
            WebkitBoxShadow: '0 0 0 100px #FFFDF5 inset !important',
            WebkitTextFillColor: '#391f0f !important',
          },
        }}
        className={disabled ? 'opacity-60 cursor-not-allowed' : ''}
      >
        <label
          htmlFor={field.name}
          className="text-[11px] font-semibold text-[#391f0f] leading-none mb-0.5 block select-none"
        >
          {cleanLabel}
          {isRequired && <span className="text-[#FF4D4D] ml-0.5 font-bold">*</span>}
        </label>

        <input
          id={field.name}
          type={field.type}
          name={field.name}
          value={text || ''}
          onChange={onChange}
          disabled={disabled}
          autoComplete={field.autoComplete}
          className="w-full bg-transparent text-[15px] font-medium text-[#391f0f] focus:outline-none p-0 m-0 border-none leading-normal"
        />
      </Box>

      {error && <p className="mt-1 text-[#FFA480] text-xs font-medium">{error}</p>}
    </div>
  );
}