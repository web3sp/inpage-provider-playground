import { ProviderRpcClient } from 'everscale-inpage-provider'
import { useState } from 'react'
import Button from '../components/Button'
import Panel from '../components/Panel'
import { RJson } from '../components/RJson'

const hashObj = {
  '1000': '9b26bf735e32eacf7836d4495f7f39e76841425bee64ab4b67248dcba7d16d51',
  '1': '49c3f8b7ccd30dbaf7b3b77d60af3aa593412559e95db6ace317673b65d9dc62',
}

export const GetTransaction = ({
  provider,
  networkId,
}: {
  provider: ProviderRpcClient
  networkId?: number | string
}) => {
  // @ts-ignore
  const hash: string | undefined = hashObj[networkId]

  const [active, setActive] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean | undefined>()
  const [transaction, setTransaction] = useState<Awaited<ReturnType<(typeof provider)['getTransaction']>> | undefined>()

  const onButtonClick = async () => {
    setActive(true)
    setIsLoading(true)

    setTransaction(undefined)

    await provider.ensureInitialized()

    const _transaction = await provider.getTransaction({ hash: hash! })
    setTransaction(_transaction)
    console.log(`transaction::`, _transaction)

    setIsLoading(false)
  }

  if (!hash) return <strong>getTransaction: Not available on this network</strong>

  return (
    <Panel open={active} onClick={() => setActive(!active)} isLoading={isLoading}>
      <Panel.Title>getTransaction</Panel.Title>
      <Panel.Buttons>
        <Button disabled={!provider} onClick={onButtonClick}>
          Run
        </Button>
      </Panel.Buttons>
      <Panel.Input>
        <div className='flex w-full flex-col lg:flex-row'>
          <span className='w-full text-gray-400 lg:w-1/5'>Transaction hash</span>
          <span className='ml-2 break-all text-white'>{hash}</span>
        </div>
      </Panel.Input>

      <Panel.Output active={!!transaction}>
        <div className='rounded-lg bg-white bg-opacity-5 p-6'>
          <RJson src={transaction} />
        </div>
      </Panel.Output>
    </Panel>
  )
}
