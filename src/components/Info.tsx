import { links } from '../constants'

const Info = () => {
  return (
    <div className='mx-auto max-w-xl justify-center space-x-3 text-center text-sm'>
      If you have any questions, please contact us on the{' '}
      <a
        href={links.developerDiscordChannel}
        className='text-green-500 underline hover:text-lightgreen'
        target='_blank'
        rel='noopener noreferrer'
      >
        Developer Discord channel
      </a>
    </div>
  )
}

export default Info
