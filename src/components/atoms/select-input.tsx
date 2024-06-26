import { FormControl, InputLabel, MenuItem, NativeSelect, Select } from '@mui/material'
import React from 'react'

export default function selectInput(
    {name, label, value, options,}:
    {name: string, label: string, value: string, options: string[]}) {
  return (
    <FormControl fullWidth>
        <InputLabel variant="filled" className='3xl:text-2xl 3xl:mt-2' sx={[{color: "#391f0f"},()=>({'&.Mui-focused': { color: "#391f0f"}})]} htmlFor="uncontrolled-native">
            {label}
        </InputLabel>
        <Select
            disableUnderline
            value={value}
            inputProps={{
            name,
            id: 'uncontrolled-native',
            }}
            sx={[{ border: 1, '.MuiOutlinedInput-notchedOutline': { border: 0 } ,  borderColor: '#391f0f'}, {'&.Mui-focused': { border: 1, borderColor: '#391f0f', '.MuiOutlinedInput-notchedOutline': { border: 0 }}},]}
            className='h-20 text-2xl bg-[#fef8ee] block rounded-3xl w-full'
        >
            {options.map((option, i) => (<MenuItem className='text-2xl' key={i} value={option}>{option}</MenuItem>))}
        </Select>
    </FormControl>
  )
}