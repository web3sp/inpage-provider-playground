import { ChevronRightIcon } from '@heroicons/react/24/outline'
import cn from 'classnames'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
  icon?: boolean
}

const Button = ({ children, icon = true, className, ...props }: ButtonProps) => {
  return (
    <button
      type='button'
      className={cn(
        'inline-flex items-center  rounded border border-transparent bg-green-500 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-lightgreen focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-green-100 disabled:bg-opacity-10 ',
        className,
      )}
      {...props}
    >
      {children}
      {icon && <ChevronRightIcon className='ml-2 h-4 w-4' />}
    </button>
  )
}
export default Button
