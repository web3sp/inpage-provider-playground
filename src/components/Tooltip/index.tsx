import classNames from 'classnames'
import * as React from 'react'

import styles from './index.module.scss'

type Props = {
  children: React.ReactNode
}

export function Tooltip({ children }: Props): JSX.Element | null {
  const [active, setActive] = React.useState(false)

  React.useEffect(() => {
    setTimeout(() => {
      setActive(true)
    }, 1)
  }, [])

  return (
    <div
      className={classNames(styles.tooltip, {
        [styles.active]: active,
      })}
    >
      {children}
    </div>
  )
}
