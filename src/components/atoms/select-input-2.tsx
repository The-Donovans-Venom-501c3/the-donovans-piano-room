import { FormControl, InputLabel, MenuItem, MenuList, Select } from '@mui/material'
import React from 'react'
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';

export default function selectInput(
    {name, label, value, options, onChange}:
    {name: string, label: string, value: string, options: string[], onChange: any}) {
  return (
    <FormControl fullWidth>
        {/* <InputLabel variant="filled" className='3xl:text-2xl' sx={[{color: "#391f0f"},()=>({'&.Mui-focused': { color: "#391f0f"}})]} htmlFor="uncontrolled-native">
            {label}
        </InputLabel> */}
        <Select
            onChange={onChange}
            disableUnderline
            value={value}
            MenuProps={{
                PaperProps: {
                    bgcolor: '#FEF8EE',
                },
            }}
            IconComponent={()=>(<ExpandMoreTwoToneIcon className='text-4xl 3xl:text-5xl 4xl:text-6xl text-primary-purple absolute right-2 transition group-open:rotate-180'/>)}
            inputProps={{
                name,
                id: 'uncontrolled-native',
            }}
            sx={[{ border: 1, '.MuiOutlinedInput-notchedOutline': { border: 0 } ,  borderColor: '#391f0f'}, {'&.Mui-focused': { border: 1, borderColor: '#391f0f', '.MuiOutlinedInput-notchedOutline': { border: 0 }}},]}
            className='bg-[#fef8ee] block rounded-full w-full h-[4vh] flex items-center justify-center text-lg 3xl:text-xl 4xl:text-2xl'
        >
            {options.map((option, i) => (
                <MenuItem
                    sx={{ bgcolor: "#FEF8EE", "&.Mui-selected": {bgcolor: "#F5E8FF",}}}
                    key={i} value={option}
                >{option}</MenuItem>
            ))}
        </Select>
    </FormControl>
  )
}
