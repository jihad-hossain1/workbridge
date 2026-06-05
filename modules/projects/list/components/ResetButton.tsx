
import { Button } from '@/components/ui/button/button'
import { useDataContext } from '../hooks/useDataContext'

export const ResetButton = () => {
  const { resetFilter } = useDataContext()
  return (
    <Button onClick={resetFilter} variant='outline' >Reset</Button>
  )
}