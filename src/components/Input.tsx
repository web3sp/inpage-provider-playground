import { ArrowPathIcon } from '@heroicons/react/24/outline'
import cn from 'classnames'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClear?: () => void
  value?: string | number
}

const Input = ({ className, value, onChange, onClear, ...props }: InputProps) => {
  return (
    <div className={cn('relative ml-2 mb-2 flex w-full flex-col', className)}>
      <input
        value={value}
        autoFocus={true}
        onChange={(e) => {
          onChange?.(e)
        }}
        className='mb-2 w-full rounded bg-white bg-opacity-10 p-2 text-white'
        {...props}
      />
      <ArrowPathIcon
        className='absolute top-2 right-2 h-6 w-6 text-green-300 hover:cursor-pointer hover:text-lightgreen'
        onClick={() => {
          onClear?.()
        }}
      />
    </div>
  )
}

export default Input
