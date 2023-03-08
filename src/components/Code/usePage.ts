type Page = {
  block: () => void
  unblock: () => void
}

export function usePage(): Page {
  const block = () => {
    const root = document.getElementById('root')

    if (root) {
      root.style.top = `-${window.scrollY}px`
      root.style.left = '0'
      root.style.right = '0'
      root.style.position = 'fixed'
      root.style.pointerEvents = 'none'

      window.scrollTo({
        top: 0,
        // @ts-ignore
        behavior: 'instant',
      })
    }
  }

  const unblock = () => {
    const root = document.getElementById('root')

    if (root) {
      const scrollTop = Math.abs(parseInt(root.style.top, 10))

      root.style.position = ''
      root.style.left = ''
      root.style.right = ''
      root.style.top = ''
      root.style.pointerEvents = ''

      window.scrollTo({
        top: scrollTop,
        // @ts-ignore
        behavior: 'instant',
      })
    }
  }

  return {
    block,
    unblock,
  }
}
