import { FormControl, InputAdornment, InputLabel, MenuItem, MenuList, Select } from '@mui/material'
import Image from 'next/image'
import React from 'react'
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
export default function selectInput(
    {name, label, value, options, onChange}:
    {name: string, label: string, value: string, options: string[], onChange: any}) {
  return (
    <FormControl fullWidth>
        <InputLabel variant="filled" className='3xl:text-2xl' sx={[{color: "#391f0f"},()=>({'&.Mui-focused': { color: "#391f0f"}})]} htmlFor="uncontrolled-native">
            {label}
        </InputLabel>
        <Select
            onChange={onChange}
            disableUnderline
            value={value}
            MenuProps={{
                PaperProps: {
                    bgcolor: '#FEF8EE',
                },
                
            }}
            IconComponent={()=>(<ExpandMoreTwoToneIcon className='text-5xl text-primary-purple absolute bottom-3 right-2 transition group-open:rotate-180'/>
            )}
            inputProps={{
                name,
                id: 'uncontrolled-native',
            }}
            sx={[{ border: 1, '.MuiOutlinedInput-notchedOutline': { border: 0 } ,  borderColor: '#391f0f'}, {'&.Mui-focused': { border: 1, borderColor: '#391f0f', '.MuiOutlinedInput-notchedOutline': { border: 0 }}},]}
            className='h-20 text-2xl bg-[#fef8ee] block rounded-3xl w-full'
        >
            {options.map((option, i) => (
                <MenuItem className='text-2xl'
                    sx={{ padding: "13px" ,bgcolor: "#FEF8EE", "&.Mui-selected": {bgcolor: "#F5E8FF",}}}
                    key={i} value={option}
                >{option}</MenuItem>
            ))}
        </Select>
    </FormControl>
  )
}
