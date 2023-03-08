import { ProviderRpcClient } from 'everscale-inpage-provider'
import { useState } from 'react'
import Button from '../components/Button'
import Panel from '../components/Panel'
import { RJson } from '../components/RJson'

const structure = [
  { name: 'publicKey', type: 'uint256' },
  { name: 'timestamp', type: 'uint64' },
] as const

export const Cell = ({ provider }: { provider: ProviderRpcClient }) => {
  const [active, setActive] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean | undefined>()
  const [data, setData] = useState<
    | {
        publicKey: string
        timestamp: number
      }
    | undefined
  >()
  const [packCell, setPackCell] = useState<
    | {
        boc: string
      }
    | undefined
  >()
  const [unpackCell, setUnpackCell] = useState<any | undefined>()
  const [bocHash, setBocHash] = useState<any | undefined>()

  const pack = async () => {
    setActive(true)
    setIsLoading(true)

    setPackCell(undefined)

    await provider.ensureInitialized()

    const providerState = await provider.getProviderState()
    const _publicKey = providerState?.permissions.accountInteraction?.publicKey

    const data = {
      publicKey: `0x${_publicKey}`,
      timestamp: 0,
    }

    setData(data)

    const { boc } = await provider.packIntoCell({
      structure,
      data,
    })
    setPackCell({
      boc,
    })
    console.log(`boc::`, boc)

    setIsLoading(false)
  }

  const unpack = async () => {
    setActive(true)
    setIsLoading(true)

    setUnpackCell(undefined)

    await provider.ensureInitialized()

    const unpacked =
      packCell &&
      (await provider.unpackFromCell({
        structure: structure,
        boc: packCell.boc,
        allowPartial: true,
      }))

    setUnpackCell(
      unpacked && {
        ...unpacked.data,
        publicKey: `0x${BigInt(unpacked.data.publicKey).toString(16)}`,
      },
    )

    setIsLoading(false)
  }

  const getBocHash = async () => {
    setActive(true)
    setIsLoading(true)

    setBocHash(undefined)

    await provider.ensureInitialized()

    const _bocHash = packCell && (await provider.getBocHash(packCell.boc))

    setBocHash(_bocHash)
    console.log(`_bocHash::`, _bocHash)

    setIsLoading(false)
  }

  return (
    <Panel open={active} onClick={() => setActive(!active)} isLoading={isLoading}>
      <Panel.Title>packIntoCell, unpackFromCell, getBocHash</Panel.Title>

      <Panel.Description>
        <p>Use packIntoCell first</p>
      </Panel.Description>
      <Panel.Buttons>
        <Button onClick={pack}>packIntoCell </Button>
        <Button onClick={unpack} disabled={!packCell}>
          unpackFromCell
        </Button>
        <Button onClick={getBocHash} disabled={!packCell}>
          getBocHash
        </Button>
      </Panel.Buttons>

      {data && (
        <Panel.Input>
          <RJson src={data} title='From' />
        </Panel.Input>
      )}

      <Panel.Output active={packCell || unpackCell || bocHash}>
        {packCell && (
          <div className='mt-2 rounded-lg bg-white bg-opacity-5 p-6'>
            <RJson src={packCell} title='packIntoCell' />
          </div>
        )}
        {/* <div className='mt-6 text-gray-400'>unpackFromCell</div> */}
        {/* <pre>{!!unpackCell && JSON.stringify(unpackCell)}</pre> */}
        {unpackCell && (
          <div className='mt-6 rounded-lg bg-white bg-opacity-5 p-6'>
            <RJson src={unpackCell} title='unpackFromCell' />
          </div>
        )}
        {/* <div className='mt-6 text-gray-400'>getBocHash</div> */}
        {/* <pre>{!!bocHash && JSON.stringify(bocHash)}</pre> */}
        {bocHash && (
          <div className='mt-6 rounded-lg bg-white bg-opacity-5 p-6'>
            <RJson src={bocHash} title='getBocHash' />
            {/* <div className='break-all'>{!!bocHash && JSON.stringify(bocHash)}</div> */}
          </div>
        )}
      </Panel.Output>
    </Panel>
  )
}
