import { ProviderRpcClient } from 'everscale-inpage-provider'
import { useState } from 'react'
import Button from '../components/Button'
import Panel from '../components/Panel'
import { RJson } from '../components/RJson'

export const ExtractPublicKey = ({ provider, address }: { provider: ProviderRpcClient; address?: string }) => {
  const [active, setActive] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean | undefined>()
  const [publicKey, setPublicKey] = useState<any | undefined>()
  // const [address, setAddress] = useState<string | undefined>()
  const [boc, setBoc] = useState<any | undefined>()

  const extractPublicKey = async () => {
    setActive(true)
    setIsLoading(true)

    setPublicKey(undefined)
    setBoc(undefined)

    await provider.ensureInitialized()

    const providerState = await provider.getProviderState()
    const _address = providerState?.permissions.accountInteraction?.address
    // setAddress(_address?.toString())
    const fullContractState = _address && (await provider.getFullContractState({ address: _address }))

    const _boc = fullContractState?.state?.boc
    setBoc(_boc)
    if (!_boc) return

    const { publicKey: _publicKey } = await provider.rawApi.extractPublicKey({
      boc: _boc,
    })

    setPublicKey(_publicKey)
    console.log(`_publicKey::`, _publicKey)

    setIsLoading(false)
  }

  return (
    <Panel open={active} onClick={() => setActive(!active)} isLoading={isLoading}>
      <Panel.Title>extractPublicKey</Panel.Title>
      <Panel.Description>Extracts public key from the contract state BOC.</Panel.Description>

      <Panel.Buttons>
        <Button onClick={extractPublicKey}>Run</Button>
      </Panel.Buttons>
      <Panel.Input>
        <div className='mt-2 text-gray-400'>Address</div>
        <div className='break-all rounded-lg bg-white bg-opacity-5 p-6'>{address}</div>
      </Panel.Input>

      <Panel.Output active={boc || publicKey}>
        <div className='rounded-lg bg-white bg-opacity-5 p-6'>
          <RJson src={boc} title='Boc' />
        </div>

        <div className='mt-6 rounded-lg bg-white bg-opacity-5 p-6'>
          <RJson src={publicKey} title='Extracted public key:' />
        </div>
      </Panel.Output>
    </Panel>
  )
}
