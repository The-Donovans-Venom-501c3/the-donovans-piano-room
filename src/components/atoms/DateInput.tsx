import { InputAdornment, TextField } from '@mui/material';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
export default function DateInput({defaultValue, label, onChange}: {defaultValue: string, label: string, onChange: any}) {
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
                <CalendarMonthOutlinedIcon className='text-[#6F219E]'/>
              </InputAdornment>
            ),
            className: "bg-[#fef8ee] rounded-3xl",
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
          className:'text-2xl block w-full'
        }}
        variant="filled"
        fullWidth
        label={label}
        defaultValue={defaultValue}
        type='date'
    />
  )
}
