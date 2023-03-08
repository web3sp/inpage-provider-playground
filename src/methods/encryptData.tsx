import { ProviderRpcClient } from 'everscale-inpage-provider'
import { Base64 } from 'js-base64'
import { useState } from 'react'
import Button from '../components/Button'
import Panel from '../components/Panel'
import { RJson } from '../components/RJson'
import TextArea from '../components/TextArea'

const defaultData = 'encrypt-test'

export const EncryptData = ({
  provider,
  address,
  publicKey,
}: {
  provider: ProviderRpcClient
  address?: string
  publicKey?: string
}) => {
  const [active, setActive] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean | undefined>()
  // const [address, setAddress] = useState<Address | undefined>()
  // const [publicKey, setPublicKey] = useState<string | undefined>()
  const [encryptedData, setEncryptedData] = useState<
    Awaited<ReturnType<(typeof provider)['encryptData']>>[0] | undefined
  >()
  const [decryptData, setDecryptData] = useState<Awaited<ReturnType<(typeof provider)['decryptData']>> | undefined>()
  const [data, setData] = useState<string>(defaultData)

  const onButtonClick = async () => {
    setActive(true)
    setIsLoading(true)

    setEncryptedData(undefined)
    setDecryptData(undefined)

    await provider.ensureInitialized()
    const providerState = await provider.getProviderState()
    const _address = providerState?.permissions.accountInteraction?.address
    const _publicKey = providerState?.permissions.accountInteraction?.publicKey
    // setAddress(_address)
    // setPublicKey(_publicKey)

    try {
      if (_address && _publicKey) {
        console.log(`data::`, data)
        console.log(`btoa(data)::`, Base64.encode(data))

        const encryptedDataList = await provider.encryptData({
          publicKey: _publicKey,
          recipientPublicKeys: [_publicKey],
          algorithm: 'ChaCha20Poly1305',
          data: Base64.encode(data),
        })

        const _encryptedData = encryptedDataList[0]
        console.log(`encryptedData::`, _encryptedData)
        setEncryptedData(_encryptedData)

        const _decryptData = await provider.decryptData(_encryptedData)

        console.log(`decryptData::`, _decryptData)
        setDecryptData(_decryptData)
      }
    } catch (error) {
      setEncryptedData(error as any)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Panel open={active} onClick={() => setActive(!active)} isLoading={isLoading}>
      <Panel.Title>encryptData</Panel.Title>
      <Panel.Description>EncryptData testing</Panel.Description>

      <Panel.Buttons>
        <Button onClick={onButtonClick}>encryptData / decryptData</Button>
      </Panel.Buttons>

      <Panel.Input>
        <div className='flex w-full flex-col lg:flex-row'>
          <span className='w-full text-gray-400 lg:w-1/5'>Address</span>
          <span className='ml-2 break-all text-white'>{address}</span>
        </div>
        <div className='flex w-full flex-col lg:flex-row'>
          <span className='w-full text-gray-400 lg:w-1/5'>Public Key</span>
          <span className='ml-2 break-all text-white'> {publicKey}</span>
        </div>
        <div className='flex w-full flex-col lg:flex-row'>
          <span className='w-full text-gray-400 lg:w-1/5 lg:shrink-0'>Data for encryption:</span>
          <TextArea
            value={data}
            autoFocus={true}
            onChange={(e) => {
              setData(e.target.value)
              setDecryptData(undefined)
              setEncryptedData(undefined)
              setIsLoading(false)
            }}
            onClear={() => {
              setData(defaultData)
              setDecryptData(undefined)
              setEncryptedData(undefined)
              setIsLoading(false)
            }}
          />
        </div>
        <div className='flex w-full flex-col lg:flex-row'>
          <span className='w-full text-gray-400 lg:w-1/5'>Base64 data (before Encrypt):</span>
          <span className='ml-2 break-all text-white'>{Base64.encode(data)}</span>
        </div>
      </Panel.Input>

      <Panel.Output active={!!encryptedData || !!decryptData}>
        <div className='mt-2 text-gray-400'>
          Encrypted data:
          <div className='rounded-lg bg-white bg-opacity-5 p-6'>
            <RJson src={encryptedData} />
            {/* <span className='font-mono text-white'>{encryptedData?.data}</span> */}
          </div>
        </div>
        {!!decryptData && (
          <>
            <div className='mt-6 text-gray-400'>
              Decrypted data:
              <div className='rounded-lg bg-white bg-opacity-5 p-6'>
                <span className='break-all font-mono text-white'>{decryptData}</span>
              </div>
            </div>
            <div className='mt-6 text-gray-400'>
              Initial data again:
              <div className='rounded-lg bg-white bg-opacity-5 p-6'>
                <span className='break-all font-mono text-white'>{!!decryptData && Base64.decode(decryptData)}</span>
              </div>
            </div>
          </>
        )}
      </Panel.Output>
    </Panel>
  )
}
