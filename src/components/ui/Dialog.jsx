import React from 'react'
import { TbXboxXFilled } from "react-icons/tb";
export default function Dialog({children, open, onClose}) {
    if(!open) return null
    return (
        <div className='h-screen w-screen fixed top-0 left-0 bg-black/50 z-50 flex justify-center items-center'>
            <div className='relative bg-white min-w-[50%] min-h-[50%] w-max h-max p-3 rounded-lg'>
                <button className='absolute top-2 right-2' onClick={onClose}>
                    <TbXboxXFilled size={20} color='red'/>
                </button>
                {children}
            </div>
        </div>
    )
}
