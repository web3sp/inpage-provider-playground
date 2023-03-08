import { useEffect, useState } from 'react'

// @ts-ignore
import korova from '../audio/mp3/korova.mp3'
// @ts-ignore
import hello from '../audio/mp3/hello.mp3'

const useMultiAudio = (urls: string[] = [korova, korova, hello, korova]) => {
  const [sources] = useState(
    urls.map((url) => {
      return {
        url,
        audio: new Audio(url),
      }
    }),
  )

  const [players, setPlayers] = useState(
    urls.map((url) => {
      return {
        url,
        playing: false,
      }
    }),
  )

  const [targetIndex, setTargetIndex] = useState(0)

  const toggle = () => {
    const newPlayers = [...players]
    const currentIndex = players.findIndex((p) => p.playing === true)
    if (currentIndex !== -1 && currentIndex !== targetIndex) {
      newPlayers[currentIndex].playing = false
      newPlayers[targetIndex].playing = true
    } else if (currentIndex !== -1) {
      newPlayers[targetIndex].playing = false
    } else {
      newPlayers[targetIndex].playing = true
    }
    setPlayers(newPlayers)
    setTargetIndex(targetIndex >= urls.length - 1 ? 0 : targetIndex + 1)
  }

  useEffect(() => {
    sources.forEach((source, i) => {
      console.log(`audio::`)
      players[i].playing ? source.audio.play() : source.audio.pause()
    })
  }, [sources, players])

  useEffect(() => {
    sources.forEach((source, i) => {
      source.audio.addEventListener('ended', () => {
        const newPlayers = [...players]
        newPlayers[i].playing = false
        setPlayers(newPlayers)
      })
    })
    return () => {
      sources.forEach((source, i) => {
        source.audio.removeEventListener('ended', () => {
          const newPlayers = [...players]
          newPlayers[i].playing = false
          setPlayers(newPlayers)
        })
      })
    }
  }, [])

  return [players, toggle] as const
}

export const CowAudio = () => {
  const [players, toggle] = useMultiAudio()

  const isPlay = players.reduce((r, player) => r && player.playing, true)

  return (
    <div
      style={{
        position: 'absolute',
        width: '7vw',
        height: '5vw',
        background: 'black',
        opacity: 0,
        marginTop: '16vw',
        marginLeft: '4vw',
        cursor: isPlay ? 'default' : 'pointer',
      }}
      onClick={isPlay ? undefined : toggle}
    />
  )
}
