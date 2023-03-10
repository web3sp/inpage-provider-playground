import { ProviderRpcClient } from 'everscale-inpage-provider'
import { useState } from 'react'
import Button from '../components/Button'
import Panel from '../components/Panel'
import { RJson } from '../components/RJson'

export const GetProviderState = ({ provider }: { provider: ProviderRpcClient }) => {
  const [active, setActive] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean | undefined>()
  const [providerState, setProviderState] = useState<
    Awaited<ReturnType<(typeof provider)['getProviderState']>> | undefined
  >()

  const onButtonClick = async () => {
    setActive(true)
    setIsLoading(true)

    setProviderState(undefined)

    await provider.ensureInitialized()
    const providerState = await provider.getProviderState()

    console.log(`providerState::`, providerState)
    setProviderState(providerState)
    setIsLoading(false)
  }

  return (
    <Panel open={active} onClick={() => setActive(!active)} isLoading={isLoading}>
      <Panel.Title>getProviderState</Panel.Title>
      <Panel.Description>
        getProviderState is a method that gives you to information about provider's state from extension
      </Panel.Description>

      <Panel.Buttons>
        <Button disabled={!provider} onClick={onButtonClick}>
          Run
        </Button>
      </Panel.Buttons>
      <Panel.Output active={!!providerState}>
        <div className=' rounded-lg bg-white bg-opacity-5 p-6'>
          <RJson src={providerState} />
        </div>
      </Panel.Output>
    </Panel>
  )
}
