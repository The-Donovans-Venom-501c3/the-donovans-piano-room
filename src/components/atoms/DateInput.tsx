import { TextField } from '@mui/material';

export default function DateInput({defaultValue, label, onChange}: {defaultValue: string, label: string, onChange: any}) {
  return (
    <TextField
        InputLabelProps={{
            className:'3xl:text-2xl 3xl:mt-2 pt-0', 
            sx:[{color: "#391f0f"}, {'&.Mui-focused': { color: "#391f0f"}}]
        }}
        onChange={onChange}
        InputProps={{
            disableUnderline: true,
          }}
          inputProps={{
          style: {height: "14.5px"},
          sx: { border: 1,},

          className:'text-2xl bg-[#fef8ee] block rounded-3xl w-full'
        }}
        variant="filled"
        fullWidth
        label={label}
        defaultValue={defaultValue}
        type='date'
    />
  )
}
