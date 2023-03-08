import { ArrowPathIcon } from '@heroicons/react/24/outline'
import cn from 'classnames'

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onClear?: () => void
  value?: string | number
}

const TextArea = ({ className, value, onChange, onClear, ...props }: TextAreaProps) => {
  return (
    <div className={cn('relative ml-2 mb-2 flex w-full flex-col', className)}>
      <textarea
        value={value}
        autoFocus={true}
        onChange={(e) => {
          onChange?.(e)
        }}
        className='my-2 h-24 w-full rounded bg-white bg-opacity-10 p-2 text-white'
        {...props}
      />
      <ArrowPathIcon
        className='h-6 w-6 text-green-300 hover:cursor-pointer hover:text-lightgreen'
        onClick={() => {
          onClear?.()
        }}
      />
    </div>
  )
}

export default TextArea
