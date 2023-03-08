import * as React from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Popover } from 'react-tiny-popover'

import { useToggler } from '../Code/useToggler'
import { Tooltip } from '../Tooltip'

import copySvg from './copy.inline.svg'
import styles from './index.module.scss'

type Props = {
  text: string
  label?: string
  hint?: string
  children?: React.ReactNode
}

export function Copy({ text, label, hint, children }: Props): JSX.Element | null {
  const toggler = useToggler()

  const onCopy = async () => {
    toggler.enable()
    setTimeout(() => {
      toggler.disable()
    }, 1000)
  }

  return (
    <Popover
      padding={10}
      align='center'
      positions={['top']}
      isOpen={toggler.active}
      onClickOutside={toggler.disable}
      containerStyle={{
        zIndex: '9999',
      }}
      content={<Tooltip>{hint ?? 'Copied'}</Tooltip>}
    >
      <div>
        <CopyToClipboard text={text} onCopy={onCopy}>
          {children ?? (
            <div className={styles.root}>
              {label && <div className={styles.label}>{label}</div>}

              <button title='Copy' type='button' className={styles.btn}>
                <img src={copySvg} />
              </button>
            </div>
          )}
        </CopyToClipboard>
      </div>
    </Popover>
  )
}
