import { Label } from '@/components/ui/label'

interface FundingAccountDetailsLayoutProps{
    label: string, 
    value: string | number
}

export const FundingAccountDetailsLayout = ({label, value}: FundingAccountDetailsLayoutProps) => {
  return (
    <div className='flex items-center justify-between'>
        <Label label={label} className='text-text'/>
        <p className='font-medium text-[14px] leading-5 text-card-text'>{value}</p>
    </div>
  )
}
