import { InputAdornment, TextField, IconButton } from '@mui/material';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { useRef } from 'react';

export default function DateInput({
  defaultValue,
  label,
  onChange,
  name
}: {
  defaultValue: string;
  label: string;
  onChange: any;
  name: string;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleOpenPicker = () => {
    if (inputRef.current) {
      if (typeof inputRef.current.showPicker === 'function') {
        inputRef.current.showPicker();
      } else {
        inputRef.current.focus();
      }
    }
  };

  return (
    <TextField
      inputRef={inputRef}
      InputLabelProps={{
        className: '3xl:text-2xl 3xl:mt-2 pt-0',
        sx: [{ color: '#391f0f' }, { '&.Mui-focused': { color: '#391f0f' } }]
      }}
      onChange={onChange}
      InputProps={{
        disableUnderline: true,
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={handleOpenPicker} edge="end">
              <CalendarMonthOutlinedIcon className="text-[#6F219E]" />
            </IconButton>
          </InputAdornment>
        ),
        className: 'bg-[#fef8ee] hover:bg-[#fef8ee] rounded-3xl',
        sx: { border: 1 }
      }}
      inputProps={{
        sx: {
          '&::-webkit-calendar-picker-indicator': {
            opacity: 0,
            position: 'absolute',
            right: 0,
            width: '100%',
            height: '100%',
            cursor: 'pointer'
          },
          height: '14.5px'
        },
        className: 'text-2xl block w-full',
        name
      }}
      variant="filled"
      fullWidth
      label={label}
      value={defaultValue || ''}
      type="date"
    />
  );
}