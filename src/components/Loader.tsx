import cn from 'classnames'
import './Loader.css'

export const Loader = ({ className }: { className?: string }) => {
  return <div className={cn('dot-typing ml-4 mb-2', className)}></div>
}
