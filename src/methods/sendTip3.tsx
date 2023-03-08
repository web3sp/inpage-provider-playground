import { Address, ProviderRpcClient, Transaction } from 'everscale-inpage-provider'
import { useState } from 'react'

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

export const SendTip3 = ({ provider, address }: { provider: ProviderRpcClient; address?: string }) => {
  const [active, setActive] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean | undefined>()
  // const [address, setAddress] = useState<Address | undefined>()
  const [transaction, setTransaction] = useState<Transaction<Address> | undefined>()

  const [data, setData] = useState<string | undefined>(undefined)

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
        const amount = 1 * 10 ** 9

        const senderAddress = _address
        const recipientAddress = _address

        const senderTokenWalletAddress = await getWalletOf({
          tokenRootAddress: data!,
          myAddress: senderAddress,
          provider,
        })

        const recipientTokenWalletAddress = await getWalletOf({
          tokenRootAddress: data!,
          myAddress: recipientAddress,
          provider,
        })

        const functionParams = {
          amount: String(Math.round(amount)),
          recipientTokenWallet: recipientTokenWalletAddress,
          remainingGasTo: senderAddress,
          notify: true,
          payload: '',
        }

        const contract = new provider.Contract(TokenWalletAbi, new Address(senderTokenWalletAddress))

        const tr = await contract.methods
          // @ts-ignore
          .transferToWallet(functionParams)
          .send({
            from: senderAddress,
            amount: amount.toString(),
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
        {!data ? (
          <Button disabled>tokenRootAddress is not specified</Button>
        ) : (
          <Button onClick={onButtonClick}>sending 1 token to yourself</Button>
        )}
      </Panel.Buttons>

      <Panel.Input>
        <div className='flex w-full flex-col lg:flex-row'>
          <span className='w-full shrink-0 text-gray-400 lg:w-1/5'>Test contract address</span>
          <div className='ml-2 mb-2 flex w-full flex-col'>
            <input
              value={data}
              autoFocus={true}
              onChange={(e) => {
                setData(e.target.value)
                setTransaction(undefined)
                setIsLoading(false)
              }}
              className='mb-2 w-full rounded bg-white bg-opacity-10 p-2 text-white'
            />
          </div>
        </div>
        <div className='flex w-full flex-col lg:flex-row'>
          <span className='w-full text-gray-400 lg:w-1/5'>For address</span>
          <span className='ml-2 break-all text-white'>{address}</span>
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
