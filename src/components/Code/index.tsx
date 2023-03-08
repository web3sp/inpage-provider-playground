import * as React from 'react'
import AceEditor from 'react-ace'

import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/theme-tomorrow_night_blue'
import 'ace-builds/webpack-resolver'

import { Copy } from '../Copy'
import { CodePopup } from './Popup'
import { useToggler } from './useToggler'

import expandSvg from './expand.inline.svg'
import hideSvg from './hide.inline.svg'
import styles from './index.module.scss'
// import linkSvg from './link.inline.svg'

export * from './Tab'

type Props = {
  id?: string
  value?: string
  mode?: string
  title?: string
  tabs?: React.ReactNode[]
  maxLines?: number
  minLines?: number
  readOnly?: boolean
  isFullScreen?: boolean
  onFullScreen?: () => void
}

export function Code({
  id,
  value = '',
  mode = 'json',
  title,
  tabs,
  minLines,
  readOnly = true,
  isFullScreen,
  onFullScreen,
  ...props
}: Props): JSX.Element {
  const fullScreen = useToggler()

  const reactAceComponent = React.useRef<AceEditor>(null)

  const codeUrl = React.useMemo(() => {
    if (id) {
      const url = new URL(window.location.href)
      url.searchParams.set('code', id)
      return url.toString()
    }
    return undefined
  }, [id])

  const maxLines = React.useMemo(
    () => (props.maxLines && value.split(/\r\n|\r|\n/).length > props.maxLines ? props.maxLines : Infinity),
    [value, props.maxLines],
  )

  return (
    <>
      {fullScreen.active && (
        <CodePopup onClose={fullScreen.disable}>
          <Code
            isFullScreen
            id={id}
            value={value}
            mode={mode}
            title={title}
            tabs={tabs}
            minLines={minLines}
            readOnly={readOnly}
            maxLines={props.maxLines}
            onFullScreen={fullScreen.disable}
          />
        </CodePopup>
      )}

      <div className={styles.code}>
        <header className={styles.header}>
          {tabs ? <div className={styles.tabs}>{tabs}</div> : <h2 className={styles.title}>{title}</h2>}
          <div className={styles.bar}>
            <Copy text={value} />

            <button type='button' className={styles.icon} onClick={onFullScreen ?? fullScreen.enable}>
              <img src={isFullScreen ? hideSvg : expandSvg} />
            </button>
          </div>
        </header>

        <AceEditor
          ref={reactAceComponent}
          readOnly={readOnly}
          maxLines={isFullScreen ? undefined : maxLines}
          minLines={isFullScreen ? undefined : minLines}
          height={isFullScreen ? 'calc(100vh - 36px)' : undefined}
          mode={mode}
          width='100%'
          value={value}
          // wrapEnabled={true}
          theme={'tomorrow_night_blue'}
          setOptions={{
            printMargin: false,
            displayIndentGuides: false,
            showFoldWidgets: false,
          }}
        />
      </div>
    </>
  )
}
