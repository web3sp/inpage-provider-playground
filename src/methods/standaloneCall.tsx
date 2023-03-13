import { ProviderRpcClient } from 'everscale-inpage-provider'
import { useState } from 'react'
import Button from '../components/Button'
import Panel from '../components/Panel'
import { RJson } from '../components/RJson'
import { testContract } from '../methods/test-venom-contract'

export const StandaloneCall = ({ venomConnect, currentNetworkId }: { venomConnect: any; currentNetworkId: any }) => {
  const [active, setActive] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean | undefined>()
  const [info, setInfo] = useState('')

  const onButtonClick = async () => {
    const standalone: ProviderRpcClient | undefined = await venomConnect?.getStandalone('venomwallet')

    setActive(true)

    if (standalone) {
      const contract = new standalone.Contract(
        testContract.testContractAbi,
        testContract.getTestContractAddress(currentNetworkId),
      )
      setIsLoading(true)
      const outputs = await contract.methods
        .getMuldivmod({
          a: 4,
          b: 5,
          c: (Date.now() % 3 ^ 0) + 1,
        } as never)
        .call()

      setInfo(JSON.stringify(outputs, null, 2))
    } else {
      alert('Standalone is not available now')
    }

    setIsLoading(false)
  }

  return (
    <Panel open={active} onClick={() => setActive(!active)} isLoading={isLoading}>
      <Panel.Title>Standalone test contract call</Panel.Title>
      <Panel.Description></Panel.Description>

      <Panel.Buttons>
        <Button onClick={onButtonClick}>Run</Button>
      </Panel.Buttons>
      <Panel.Input>
        <pre>
          {`getMuldivmod({
  a: 4,
  b: 5,
  c: random 1-3,
})`}
        </pre>
      </Panel.Input>

      <Panel.Output active={!!info}>
        <div className=' rounded-lg bg-white bg-opacity-5 p-6'>
          <RJson src={{ info }} />
        </div>
      </Panel.Output>
    </Panel>
  )
}
