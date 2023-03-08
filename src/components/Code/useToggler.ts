import * as React from 'react'

type Toggler = {
  active: boolean
  enable: () => void
  disable: () => void
  toggle: () => void
}

export function useToggler(_active?: boolean): Toggler {
  const [active, setActive] = React.useState(_active ?? false)

  const enable = React.useCallback(() => {
    setActive(true)
  }, [setActive])

  const disable = React.useCallback(() => {
    setActive(false)
  }, [setActive])

  const toggle = React.useCallback(() => {
    setActive(!active)
  }, [active, setActive])

  return React.useMemo(
    () => ({
      active,
      enable,
      disable,
      toggle,
    }),
    [active, enable, disable, toggle],
  )
}
