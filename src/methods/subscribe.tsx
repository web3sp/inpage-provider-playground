import { ProviderRpcClient } from 'everscale-inpage-provider'
import { useState } from 'react'
import Button from '../components/Button'
import Panel from '../components/Panel'
import { RJson } from '../components/RJson'

export const Subscribe = ({ provider, address }: { provider: ProviderRpcClient; address?: string }) => {
  const [active, setActive] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean | undefined>()
  // const [address, setAddress] = useState<Address | undefined>()

  const [isSubscriptionActive, setIsSubscriptionActive] = useState(false)
  const [isUnsubscribe, setIsUnsubscribe] = useState(false)
  const [data, setData] = useState<any | undefined>()
  const [error, setError] = useState<any | undefined>()

  const subscribe = async () => {
    setActive(true)
    await provider.ensureInitialized()
    const providerState = await provider.getProviderState()
    const _address = providerState?.permissions.accountInteraction?.address
    // setAddress(_address)

    const _subscription =
      _address &&
      (await provider.subscribe('transactionsFound', {
        address: _address,
      }))

    _subscription?.on('data', (_data) => {
      console.log(`_data::`, _data)
      setData(_data)
      setIsLoading(false)
    })

    setIsSubscriptionActive(true)
  }

  const call = async () => {
    setActive(true)
    setIsLoading(true)

    setData(undefined)

    await provider.ensureInitialized()
    const providerState = await provider.getProviderState()
    const _address = providerState?.permissions.accountInteraction?.address

    if (_address) {
      const amount = 1 * 10 ** 9

      const senderAddress = _address
      const recipientAddress = _address

      try {
        provider.sendMessage({
          sender: senderAddress,
          recipient: recipientAddress,
          amount: String(Math.round(amount)),
          bounce: true,
        })
      } catch (error) {
        setData(error)
        setIsLoading(false)
      }
    }
  }

  const unsubscribe = async () => {
    setActive(true)
    try {
      if (address) {
        await provider.rawApi.unsubscribe({
          address: address.toString(),
        })
        setIsUnsubscribe(true)
        setIsSubscriptionActive(false)
      }
    } catch (error) {
      setError('unsubscribe error')
    }
  }

  const unsubscribeAll = async () => {
    setActive(true)
    try {
      if (address) {
        await provider.rawApi.unsubscribeAll()
        setIsUnsubscribe(true)
        setIsSubscriptionActive(false)
      }
    } catch (error) {
      setError('unsubscribeAll error')
    }
  }

  return (
    <Panel open={active} onClick={() => setActive(!active)} isLoading={isLoading}>
      <Panel.Title>subscribe, unsubscribe, unsubscribeAll, test transaction call</Panel.Title>
      <Panel.Description>
        <ul className='flex flex-col space-y-2'>
          <li>
            <strong>Subscribe</strong>
            <br /> The subscribe method is used to subscribe to a specific event in the blockchain network.
          </li>
          <li>
            <strong>Unsubscribe</strong>
            <br />
            The unsubscribe method is used to unsubscribe from a previously subscribed event.
          </li>
          <li>
            <strong>UnsubscribeAll</strong>
            <br /> The unsubscribeAll method is used to unsubscribe from all previously subscribed events.
          </li>
          <li>
            <strong>Test Transaction Call</strong>
            <br /> Use to test a transaction call in a smart contract.
          </li>
        </ul>
      </Panel.Description>

      <Panel.Buttons>
        <Button onClick={subscribe} disabled={!!isSubscriptionActive}>
          subscribe to transaction
        </Button>
        <Button onClick={unsubscribe} disabled={!isSubscriptionActive}>
          unsubscribe
        </Button>
        <Button onClick={unsubscribeAll} disabled={!isSubscriptionActive}>
          unsubscribeAll
        </Button>
        <Button onClick={call} disabled={!isSubscriptionActive}>
          test transaction call
        </Button>
      </Panel.Buttons>

      <Panel.Input>
        <div className='mt-2 text-gray-400'>Address</div>
        <div className='rounded-lg bg-white bg-opacity-5 p-6'>
          <div className='break-all font-mono '>{address}</div>
        </div>

        {!!error && <pre>{!!error && JSON.stringify(error, null, 2)}</pre>}
      </Panel.Input>

      <Panel.Output active={true}>
        <div className='mt-4'>
          Subscription is{' '}
          <span className={isSubscriptionActive ? 'text-green-500' : 'text-red-500'}>
            {!isSubscriptionActive ? 'not' : ''} active
          </span>
        </div>
        {data && (
          <div className='mt-6 text-gray-400'>
            Test transaction call result
            <div className='rounded-lg bg-white bg-opacity-5 p-6'>
              <RJson src={data} />
            </div>
          </div>
        )}
      </Panel.Output>
    </Panel>
  )
}
