import React from 'react'

interface CheckboxProps{
    children: React.ReactNode;
    checked: boolean;
    onChange: (checked: boolean) => void; 
}

export default function Checkbox({ children, checked, onChange }: CheckboxProps) {
  return ( 
   <div className="flex items-center">
        <label className="relative flex items-center p-3 rounded-full cursor-pointer" htmlFor="check">
            <input type="checkbox" 
                required
                checked={checked}
                onChange={(e)=> onChange(e.target.checked)}
                className="before:content[''] peer relative h-6 w-6 3xl:h-8 3xl:w-8  cursor-pointer appearance-none rounded-md border before:border-[#391f0f] checked:border-primary-yellow transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:opacity-0 before:transition-opacity checked:bg-primary-yellow bg-[#fef8ee] hover:before:opacity-10"
                id="check" />
            <span
                className="absolute text-primary-purple transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 3xl:h-7 3xl:w-7" viewBox="0 0 20 20" fill="currentColor"
                    stroke="currentColor" strokeWidth="1">
                    <path fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd">
                    </path>
                </svg>
            </span>
        </label>
        {children}   
    </div>
  )
}
