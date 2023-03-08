import { ProviderRpcClient } from 'everscale-inpage-provider'
import { useState } from 'react'
import Button from '../components/Button'
import Panel from '../components/Panel'
import { RJson } from '../components/RJson'

export const GetFullContractState = ({ provider, address }: { provider: ProviderRpcClient; address?: string }) => {
  const [active, setActive] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean | undefined>()
  // const [address, setAddress] = useState<Address | undefined>()
  const [fullContractState, setFullContractState] = useState<
    Awaited<ReturnType<(typeof provider)['getFullContractState']>> | undefined
  >()

  const onButtonClick = async () => {
    setActive(true)
    setIsLoading(true)

    setFullContractState(undefined)

    await provider.ensureInitialized()
    const providerState = await provider.getProviderState()
    const _address = providerState?.permissions.accountInteraction?.address
    // setAddress(_address)
    const fullContractState = _address && (await provider.getFullContractState({ address: _address }))
    setFullContractState(fullContractState)
    console.log('getFullContractState', _address, fullContractState)
    setIsLoading(false)
  }

  return (
    <Panel open={active} onClick={() => setActive(!active)} isLoading={isLoading}>
      <Panel.Title>getFullContractState</Panel.Title>

      <Panel.Description>
        getFullContractState is a method that gives you information about contract state
      </Panel.Description>
      <Panel.Buttons>
        <Button disabled={!provider} onClick={onButtonClick}>
          Run
        </Button>
      </Panel.Buttons>
      <Panel.Input>
        <div className='flex w-full flex-col lg:flex-row'>
          <span className='w-full text-gray-400 lg:w-1/5'>Address</span>
          <span className='ml-2 break-all text-white'>{address}</span>
        </div>
      </Panel.Input>
      <Panel.Output active={!!fullContractState}>
        <div className='rounded-lg bg-white bg-opacity-5 p-6'>
          <RJson src={fullContractState} />
        </div>
      </Panel.Output>
    </Panel>
  )
}
