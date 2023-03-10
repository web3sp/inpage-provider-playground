import { ProviderRpcClient } from 'everscale-inpage-provider'
import { useState } from 'react'
import Button from '../components/Button'
import Panel from '../components/Panel'
import { RJson } from '../components/RJson'

const limit = 3

const hashObj = {
  '1000': '0202c0af2814fb560455ee6261c554f03d36a94a1b34a17a1fb91ccb82918c7f',
  '1': '84dafa449f98a6987789ba232358072bc0f76dc4524002a5d0918b9a75d2d599',
}

export const GetAccountsByCodeHash = ({
  provider,
  networkId,
}: {
  provider: ProviderRpcClient
  networkId?: number | string
}) => {
  const [active, setActive] = useState<boolean>(false)
  // @ts-ignore
  const hash = (!!networkId && hashObj[networkId]) || hashObj[1000]
  const [isLoading, setIsLoading] = useState<boolean | undefined>()
  const [accounts, setAccounts] = useState<
    Awaited<ReturnType<(typeof provider)['getAccountsByCodeHash']>> | undefined
  >()

  const onButtonClick = async () => {
    setActive(true)
    setIsLoading(true)

    setAccounts(undefined)

    await provider.ensureInitialized()
    const _accounts = await provider.getAccountsByCodeHash({
      codeHash: hash,
      limit,
    })
    setAccounts(_accounts)
    console.log(`accounts::`, _accounts)

    setIsLoading(false)
  }

  return (
    <Panel open={active} onClick={() => setActive(!active)} isLoading={isLoading}>
      <Panel.Title>getAccountsByCodeHash</Panel.Title>
      <Panel.Description>
        getAccountsByCodeHash is a method that provides you with all the information about the status of several
        transactions at a specific address. You can <br />
        1. specify a Code hash to view transactions at <br />
        2. specify a limit on the number of transactions received
      </Panel.Description>
      <Panel.Buttons>
        <Button disabled={!provider} onClick={onButtonClick}>
          Run
        </Button>
      </Panel.Buttons>

      <Panel.Input>
        <div className='flex w-full flex-col lg:flex-row'>
          <span className='w-full text-gray-400 lg:w-1/5'>Code hash</span>
          <span className='ml-2 break-all text-white'>{hash}</span>
        </div>
        <div className='flex w-full flex-col lg:flex-row'>
          <span className='w-full text-gray-400 lg:w-1/5'>Limit</span>
          <span className='ml-2 break-all text-white'>{limit}</span>
        </div>
      </Panel.Input>

      <Panel.Output active={!!accounts}>
        <div className='rounded-lg bg-white bg-opacity-5 p-6'>
          <RJson src={accounts} />
        </div>
      </Panel.Output>
    </Panel>
  )
}
