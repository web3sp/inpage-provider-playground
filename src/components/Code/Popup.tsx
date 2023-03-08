import classNames from 'classnames'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { usePage } from './usePage'

import styles from './index.module.scss'

type Props = {
  children?: React.ReactNode
  onClose: () => void
}

export function CodePopup({ children, onClose }: Props): JSX.Element {
  const page = usePage()
  const [active, setActive] = React.useState(false)

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    page.block()
    setActive(true)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      page.unblock()
    }
  }, [])

  return ReactDOM.createPortal(
    <div
      className={classNames(styles.popup, {
        [styles.active]: active,
      })}
    >
      {children}
    </div>,
    document.body,
  )
}
