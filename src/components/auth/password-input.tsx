import { FormControl, IconButton, Input, InputAdornment, InputLabel } from '@mui/material'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import React, { useState } from 'react'
import ErrorIcon from '@mui/icons-material/Error';

interface passwordInputInterface {
    name: string,
    onChange: any,
    label: string,
    error: string,
    inputValue: string
}
export default function PasswordInput({ onChange, name, label, error, inputValue}: passwordInputInterface) {
  const [showPassword, setShowPassword] = useState(false)
  const toggleShowPassword = () => setShowPassword(prev => !prev)
  return (
    <div>

      <FormControl variant="filled" sx={{ border: 1, borderColor: '#391f0f'}} error={!!error} className='bg-[#fef8ee] hover:bg-[#FCF0D8] focus:bg-[#FCF0D8] block rounded-3xl w-full 2xl:mb-[25px] 2xl:py-2 3xl:py-4'>
          <InputLabel className='3xl:text-2xl 3xl:mt-3' sx={[{color: "#391f0f"},!error && {'&.Mui-focused': {color: "#391f0f"}}]} htmlFor="standard-adornment-password">{label}</InputLabel>
          <Input
              required
              value={inputValue}
              sx={{border: 0}}
              className='w-full pl-6 text-[16px]'
              type={showPassword ? 'text' : 'password'}
              name={name}
              onChange={onChange}
              disableUnderline
              endAdornment={
                <InputAdornment position="end">
              <IconButton
                  aria-label="toggle password visibility"
                  onClick={toggleShowPassword}>
                  {error ? <ErrorIcon sx={{fontSize: "20px", color: "#b3261e"}} className='mb-[12px] mr-2'/> : showPassword ? <Visibility sx={{fontSize: "20px", color: "#6F219E"}} className='mb-[12px] mr-2'/> : <VisibilityOff sx={{fontSize: "20px", color: "#6F219E"}} className='mb-[12px] mr-2'/>}
              </IconButton>
              </InputAdornment>
          }
          />
      </FormControl>
      {error && <p className='text-[#b3261e] mt-2 font-semibold'>{error}</p>}
  </div>

  )
}
