import { social } from '../constants'

const Social = () => {
  return (
    <div className='mx-auto my-9 flex justify-center space-x-3'>
      {social.map(({ key, icon, link }) => {
        return (
          <a key={key} href={link} target='_blank' rel='noopener noreferrer'>
            <img className='h-6 w-6 text-green-500 hover:text-lightgreen' src={icon} alt='key' />
          </a>
        )
      })}
    </div>
  )
}

export default Social
