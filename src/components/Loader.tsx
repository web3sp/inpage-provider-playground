import cn from 'classnames'
import './Loader.css'

export const Loader = ({ className }: { className?: string }) => {
  return <div className={cn('dot-typing', className)}></div>
}
