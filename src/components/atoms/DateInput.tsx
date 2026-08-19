import { InputAdornment, TextField } from '@mui/material';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { useRef } from 'react';
import dayjs from 'dayjs';

export default function DateInput({
  value, 
  label, 
  onChange, 
  name, 
  max,
  disabled = false
}: {
  value?: string; 
  label: string; 
  onChange: any; 
  name: string; 
  max?: string;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Format date to YYYY-MM-DD for native HTML date input compatibility
  const formattedValue = value ? dayjs(value).format('YYYY-MM-DD') : '';

  const openPicker = () => {
    if (disabled) return;
    if (inputRef.current) {
      if (typeof inputRef.current.showPicker === 'function') {
        try {
          inputRef.current.showPicker();
        } catch {
          inputRef.current.focus();
        }
      } else {
        inputRef.current.focus();
      }
    }
  };

  return (
    <TextField
      disabled={disabled}
      InputLabelProps={{
        shrink: true, // Ensures label stays elevated when date is selected
        className: '3xl:text-2xl 3xl:mt-2 pt-0', 
        sx: [{ color: "#391f0f" }, { '&.Mui-focused': { color: "#391f0f" } }]
      }}
      onChange={onChange}
      InputProps={{
        disableUnderline: true,
        endAdornment: (
          <InputAdornment position='end'>
            <CalendarMonthOutlinedIcon
              className={`${disabled ? 'text-gray-400 cursor-not-allowed' : 'text-[#6F219E] cursor-pointer'}`}
              onClick={openPicker}
            />
          </InputAdornment>
        ),
        className: "bg-[#fef8ee] hover:bg-[#fef8ee] rounded-3xl",
        sx: { border: 1 }
      }}
      inputProps={{
        max, // 👈 Disables future dates in browser popup
        sx: {
          '&::-webkit-calendar-picker-indicator': {
            display: 'none',
            '-webkit-appearance': 'none',
          },
          height: "14.5px"
        },
        className: 'text-2xl block w-full',
        name
      }}
      inputRef={inputRef}
      variant="filled"
      fullWidth
      label={label}
      value={formattedValue} // 👈 Controlled component value
      type='date'
    />
  );
}