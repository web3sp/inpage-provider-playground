import { ProviderRpcClient } from 'everscale-inpage-provider'
import { useState } from 'react'
import Button from '../components/Button'
import Input from '../components/Input'
import Panel from '../components/Panel'
import { RJson } from '../components/RJson'
import { testContract } from './test-venom-contract'

export const RunLocal = ({ provider, networkId }: { provider: ProviderRpcClient; networkId?: number | string }) => {
  const [active, setActive] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean | undefined>()
  const [output, setOutput] = useState<any | undefined>()
  const [data, setData] = useState<string>(testContract.getTestContractAddress(networkId!))

  const runLocal = async () => {
    setActive(true)
    setIsLoading(true)

    setOutput(undefined)

    await provider.ensureInitialized()

    console.log(`runLocal::`, runLocal, networkId, data)

    try {
      const fromLocal = await provider.rawApi.runLocal({
        address: data,
        functionCall: {
          abi: JSON.stringify(testContract.testContractAbi),
          method: 'getDetails',
          params: {},
        },
      })
      setOutput(fromLocal)
      console.log(`fromLocal::`, fromLocal)
    } catch (e) {
      setOutput(e)
    }

    setIsLoading(false)
  }

  // eslint-disable-next-line eqeqeq
  if (!(networkId && testContract.getTestContractAddress(networkId)))
    return <strong>runLocal: Not available on this network</strong>

  return (
    <Panel open={active} onClick={() => setActive(!active)} isLoading={isLoading}>
      <Panel.Title>runLocal</Panel.Title>
      <Panel.Description>Run methods locally</Panel.Description>
      <Panel.Buttons>
        <Button disabled={!provider} onClick={runLocal}>
          Run
        </Button>
      </Panel.Buttons>

      <Panel.Input>
        <div className='flex w-full flex-col lg:flex-row'>
          <span className='w-full shrink-0 text-gray-400 lg:w-1/5'>Test contract address</span>
          <Input
            value={data}
            autoFocus={false}
            onChange={(e) => {
              setData(e.target.value)
              setOutput(undefined)
              setIsLoading(false)
            }}
            onClear={() => {
              setData(testContract.getTestContractAddress(networkId!))
              setOutput(undefined)
              setIsLoading(false)
            }}
          />
        </div>
        <div className='flex w-full flex-col lg:flex-row'>
          <span className='w-full text-gray-400 lg:w-1/5'>Method</span>
          <span className='ml-2 break-all text-white'>getDetails</span>
        </div>
      </Panel.Input>
      <Panel.Output active={!!output}>
        <div className='rounded-lg bg-white bg-opacity-5 p-6'>
          <RJson src={output} />
        </div>
      </Panel.Output>
    </Panel>
  )
}
