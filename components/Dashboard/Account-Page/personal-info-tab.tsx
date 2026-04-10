import React from 'react'

export interface PersonalInfoTabProps {
  label: string;
  title: string;
}

export const PersonalInfoTab = ({label, title}: PersonalInfoTabProps) => {
  return (
    <div>
        <p className='font-medium text-text text-xs leading-5'>{label}</p>
        <h1 className='font-medium text-card-text text-xs leading-5'>{title}</h1>
    </div>
  )
}
