import { Address, ProviderRpcClient, Transaction } from 'everscale-inpage-provider'
import { useEffect, useState } from 'react'

import TokenRootAbi from '../abi/TokenRoot.abi.json'
import TokenWalletAbi from '../abi/TokenWallet.abi.json'
import Button from '../components/Button'
import Panel from '../components/Panel'
import { RJson } from '../components/RJson'

// const tokenRootAddress = null as unknown as string

type GetWalletOf = {
  provider: ProviderRpcClient
  tokenRootAddress: string
  myAddress: Address
}
const getWalletOf = async ({ provider, tokenRootAddress, myAddress }: GetWalletOf) => {
  try {
    const tokenRootContract = new provider.Contract(TokenRootAbi, new Address(tokenRootAddress))
    const walletOfOutput: { value0: any } = await tokenRootContract.methods
      // @ts-ignore
      .walletOf({ answerId: 0, walletOwner: myAddress })
      .call()
    const tokenWalletAddress = walletOfOutput?.value0?.toString()
    return tokenWalletAddress
  } catch (error) {
    console.error(error)
    return null
  }
}

type GetRootTokenInfo = {
  provider: ProviderRpcClient
  tokenRootAddress: string
}
const getRootTokenInfo = async ({ provider, tokenRootAddress }: GetRootTokenInfo) => {
  try {
    const tokenRootContract = new provider.Contract(TokenRootAbi, new Address(tokenRootAddress))
    const name: { value0: any } = await tokenRootContract.methods
      // @ts-ignore
      .name({ answerId: 0 })
      .call()
    const decimals: { value0: any } = await tokenRootContract.methods
      // @ts-ignore
      .decimals({ answerId: 0 })
      .call()
    const symbol: { value0: any } = await tokenRootContract.methods
      // @ts-ignore
      .symbol({ answerId: 0 })
      .call()

    return {
      name: name?.value0?.toString(),
      decimals: decimals?.value0,
      symbol: symbol?.value0?.toString(),
    }
  } catch (error) {
    console.error(error)
    return null
  }
}
export const SendTip3 = ({ provider, address }: { provider: ProviderRpcClient; address?: string }) => {
  const [active, setActive] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean | undefined>()
  const [transaction, setTransaction] = useState<Transaction<Address> | undefined>()

  const [rootAddress, setRootAddress] = useState<string>('')
  const [rootInfo, setRootInfo] = useState<any>(null)
  const [sendToAddress, setSendToAddress] = useState<string>('')

  useEffect(() => {
    async function fetchRootTokenInfo() {
      if (rootAddress && provider) {
        const info = await getRootTokenInfo({
          tokenRootAddress: rootAddress!,
          provider,
        })
        setRootInfo(info)
      }
    }
    fetchRootTokenInfo()
  }, [rootAddress, provider])

  const onButtonClick = async () => {
    setActive(true)
    setIsLoading(true)

    setTransaction(undefined)

    await provider.ensureInitialized()
    const providerState = await provider.getProviderState()
    const _address = providerState?.permissions.accountInteraction?.address
    // setAddress(_address)

    try {
      if (_address) {
        const senderAddress = _address
        const recipientAddress = new Address(sendToAddress)
        console.log(`senderAddress::`, senderAddress)
        console.log(`recipientAddress::`, recipientAddress)

        const rootTokenInfo = await getRootTokenInfo({
          tokenRootAddress: rootAddress!,
          provider,
        })
        console.log(`rootTokenInfo::`, rootTokenInfo)

        const amount = 1 * 10 ** rootTokenInfo?.decimals

        const senderTokenWalletAddress = await getWalletOf({
          tokenRootAddress: rootAddress!,
          myAddress: senderAddress,
          provider,
        })
        console.log(`senderTokenWalletAddress::`, senderTokenWalletAddress)

        const recipientTokenWalletAddress = await getWalletOf({
          tokenRootAddress: rootAddress!,
          myAddress: recipientAddress,
          provider,
        })
        console.log(`recipientTokenWalletAddress::`, recipientTokenWalletAddress)

        const functionParams = {
          amount: String(Math.round(amount)),
          recipientTokenWallet: recipientTokenWalletAddress,
          remainingGasTo: senderAddress,
          notify: false,
          payload: '',
        }

        const contract = new provider.Contract(TokenWalletAbi, new Address(senderTokenWalletAddress))

        const tr = await contract.methods
          // @ts-ignore
          .transferToWallet(functionParams)
          .send({
            from: senderAddress,
            amount: '1000000000'
          })

        setTransaction(tr)
        console.log(`transaction::`, tr)
      }
    } catch (error) {
      setIsLoading(false)
      setTransaction(error as any)
    }
    setIsLoading(false)
  }

  // if (!tokenRootAddress)
  //   return (
  //     <div>
  //       <Button disabled>tokenRootAddress is not specified</Button>
  //     </div>
  //   )

  return (
    <Panel open={active} onClick={() => setActive(!active)} isLoading={isLoading}>
      <Panel.Title>SendTip3</Panel.Title>
      <Panel.Description>(with tokenRootAddress)</Panel.Description>
      <Panel.Buttons>
        {!rootAddress || !sendToAddress ? (
          <Button disabled>tokenRootAddress or recipientAddress is not specified</Button>
        ) : (
          <Button onClick={onButtonClick}>Send</Button>
        )}
      </Panel.Buttons>

      <Panel.Input>
        <div className='mb-2 flex w-full flex-col lg:flex-row'>
          <span className='w-full text-gray-400 lg:w-1/5'>Sender Address</span>
          <span className='ml-2 break-all text-white'>{address}</span>
        </div>
        <div className='flex w-full flex-col lg:flex-row'>
          <span className='w-full shrink-0 text-gray-400 lg:w-1/5'>Test contract address</span>
          <div className='mb-2 ml-2 flex w-full flex-col'>
            <input
              value={rootAddress}
              autoFocus={true}
              onChange={(e) => {
                setRootAddress(e.target.value)
                setTransaction(undefined)
                setIsLoading(false)
              }}
              className='mb-2 w-full rounded bg-white bg-opacity-10 p-2 text-white'
            />
            {rootInfo && (
              <div className='text-xs text-gray-400'>
                Name: <span className='mr-3 text-white'>{rootInfo.name}</span> Decimals:{' '}
                <span className='mr-3 text-white'>{rootInfo.decimals}</span> Symbol:{' '}
                <span className='mr-3 text-white'>{rootInfo.symbol}</span>
              </div>
            )}
          </div>
        </div>
        <div className='flex w-full flex-col lg:flex-row'>
          <span className='w-full shrink-0 text-gray-400 lg:w-1/5'>Recipient address</span>
          <div className='mb-2 ml-2 flex w-full flex-col'>
            <input
              value={sendToAddress}
              onChange={(e) => {
                setSendToAddress(e.target.value)
                setTransaction(undefined)
                setIsLoading(false)
              }}
              className='mb-2 w-full rounded bg-white bg-opacity-10 p-2 text-white'
            />
          </div>
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
