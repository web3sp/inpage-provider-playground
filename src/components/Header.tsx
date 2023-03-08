import logo from '../img/logo.svg'

const Header = () => {
  return (
    <header className='my-8 mx-6 flex flex-row items-center lg:my-6'>
      <a className='h-4 w-20 lg:h-6 lg:w-28' href='/'>
        <img src={logo} alt='' />
      </a>
    </header>
  )
}

export default Header
