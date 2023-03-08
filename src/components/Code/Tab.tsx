import classNames from 'classnames'
import * as React from 'react'

import styles from './index.module.scss'

type Props = {
  active?: boolean
  onClick?: () => void
  children: React.ReactNode
}

export function Tab({ active, onClick, children }: Props): JSX.Element {
  return (
    <button
      type='button'
      className={classNames('btn', styles.tab, {
        [styles.active]: active,
      })}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
