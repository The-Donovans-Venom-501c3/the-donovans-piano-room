import { InputAdornment, TextField } from '@mui/material';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { useRef } from 'react';

export default function DateInput({defaultValue, label, onChange, name}: {defaultValue: string, label: string, onChange: any, name: string}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const openPicker = () => {
    // Native date inputs expose showPicker() in Chromium/Edge/recent Firefox.
    // Fall back to focusing the field for browsers that don't support it (e.g. Safari).
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
        InputLabelProps={{
            className:'3xl:text-2xl 3xl:mt-2 pt-0', 
            sx:[{color: "#391f0f"}, {'&.Mui-focused': { color: "#391f0f"}},]
        }}
        onChange={onChange}
        InputProps={{
            disableUnderline: true,
            endAdornment: (
              <InputAdornment position='end'>
                <CalendarMonthOutlinedIcon
                  className='text-[#6F219E] cursor-pointer'
                  onClick={openPicker}
                />
              </InputAdornment>
            ),
            className: "bg-[#fef8ee] hover:bg-[#fef8ee] rounded-3xl",
            sx: {border: 1,}
          }}
          inputProps={{
          sx: {
            '&::-webkit-calendar-picker-indicator': {
              display: 'none',
              '-webkit-appearance': 'none',
            },
            height: "14.5px"
          },
          className:'text-2xl block w-full',
          name
        }}
        inputRef={inputRef}
        variant="filled"
        fullWidth
        label={label}
        defaultValue={defaultValue}
        type='date'
    />
  )
}
