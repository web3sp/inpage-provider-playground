import { links } from '../constants'
import Info from './Info'
import Social from './Social'

const Footer = () => {
  return (
    <footer className='mx-auto mt-auto flex max-w-5xl flex-col'>
      <Social />
      <Info />
      <div className='mx-auto my-4 flex space-x-4'>
        <a href={links.policy} className='hover:text-green-500' target='_blank' rel='noopener noreferrer'>
          Privacy Policy
        </a>
        <a href={links.terms} className='hover:text-green-500' target='_blank' rel='noopener noreferrer'>
          Terms of Use
        </a>
      </div>
    </footer>
  )
}

export default Footer
