import { ProviderRpcClient } from 'everscale-inpage-provider'
import { useState } from 'react'
import Button from '../components/Button'
import Panel from '../components/Panel'
import { RJson } from '../components/RJson'

const limit = 3

export const GetTransactions = ({ provider, address }: { provider: ProviderRpcClient; address?: string }) => {
  const [active, setActive] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean | undefined>()
  // const [address, setAddress] = useState<Address | undefined>()
  const [transactions, setTransactions] = useState<
    Awaited<ReturnType<(typeof provider)['getTransactions']>> | undefined
  >()

  const onButtonClick = async () => {
    setActive(true)
    setIsLoading(true)

    setTransactions(undefined)

    await provider.ensureInitialized()
    const providerState = await provider.getProviderState()
    const _address = providerState?.permissions.accountInteraction?.address
    // setAddress(_address)
    const _transactions = _address
      ? await provider.getTransactions({
          address: _address,
          limit,
        })
      : undefined
    setTransactions(_transactions)
    console.log(`transactions::`, _transactions)

    setIsLoading(false)
  }

  return (
    <Panel open={active} onClick={() => setActive(!active)} isLoading={isLoading}>
      <Panel.Title>getTransactions</Panel.Title>

      <Panel.Buttons>
        <Button disabled={!provider} onClick={onButtonClick}>
          Run
        </Button>
      </Panel.Buttons>
      <Panel.Description>
        GetTransactions is a method that provides you with all the information about the status of several transactions
        at a specific address. You can
        <br />
        1. specify a specific address to view transactions at
        <br />
        2. limit the time interval for receiving transactions
        <br />
        3. specify a limit on the number of transactions received
        <br />
      </Panel.Description>

      <Panel.Input>
        <div className='flex w-full flex-col lg:flex-row'>
          <span className='w-full text-gray-400 lg:w-1/5'>Address</span>
          <span className='ml-2 break-all text-white'>{address}</span>
        </div>
        <div className='flex w-full flex-col lg:flex-row'>
          <span className='w-full text-gray-400 lg:w-1/5'>Limit</span>
          <span className='ml-2 break-all text-white'>{limit}</span>
        </div>
      </Panel.Input>
      <Panel.Output active={!!transactions}>
        <div className='flex w-full flex-col rounded-lg bg-white bg-opacity-5 p-6'>
          <RJson src={transactions} />
        </div>
      </Panel.Output>
    </Panel>
  )
}
