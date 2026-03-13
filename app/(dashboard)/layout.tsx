import DashboardLayout from '@/components/Layout/DashboardLayout'
import React from 'react'

const AppLayout = ({children}: { children: React.ReactNode}) => {
  return (
    <DashboardLayout>
        {children}
    </DashboardLayout>
  )
}

export default DashboardLayout