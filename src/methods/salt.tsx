import { Address, ProviderRpcClient } from 'everscale-inpage-provider'
import { useState } from 'react'
import Button from '../components/Button'
import Panel from '../components/Panel'
import { RJson } from '../components/RJson'
import TextArea from '../components/TextArea'

const INDEX_BASE_64 =
  'te6ccgECIAEAA4IAAgE0AwEBAcACAEPQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAgaK2zUfBAQkiu1TIOMDIMD/4wIgwP7jAvILHAYFHgOK7UTQ10nDAfhmifhpIds80wABn4ECANcYIPkBWPhC+RDyqN7TPwH4QyG58rQg+COBA+iogggbd0CgufK0+GPTHwHbPPI8EQ4HA3rtRNDXScMB+GYi0NMD+kAw+GmpOAD4RH9vcYIImJaAb3Jtb3Nwb3T4ZNwhxwDjAiHXDR/yvCHjAwHbPPI8GxsHAzogggujrde64wIgghAWX5bBuuMCIIIQR1ZU3LrjAhYSCARCMPhCbuMA+EbycyGT1NHQ3vpA0fhBiMjPjits1szOyds8Dh8LCQJqiCFus/LoZiBu8n/Q1PpA+kAwbBL4SfhKxwXy4GT4ACH4a/hs+kJvE9cL/5Mg+GvfMNs88gAKFwA8U2FsdCBkb2Vzbid0IGNvbnRhaW4gYW55IHZhbHVlAhjQIIs4rbNYxwWKiuIMDQEK103Q2zwNAELXTNCLL0pA1yb0BDHTCTGLL0oY1yYg10rCAZLXTZIwbeICFu1E0NdJwgGOgOMNDxoCSnDtRND0BXEhgED0Do6A34kg+Gz4a/hqgED0DvK91wv/+GJw+GMQEQECiREAQ4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAD/jD4RvLgTPhCbuMA0x/4RFhvdfhk0ds8I44mJdDTAfpAMDHIz4cgznHPC2FeIMjPkll+WwbOWcjOAcjOzc3NyXCOOvhEIG8TIW8S+ElVAm8RyM+EgMoAz4RAzgH6AvQAcc8LaV4gyPhEbxXPCx/OWcjOAcjOzc3NyfhEbxTi+wAaFRMBCOMA8gAUACjtRNDT/9M/MfhDWMjL/8s/zsntVAAi+ERwb3KAQG90+GT4S/hM+EoDNjD4RvLgTPhCbuMAIZPU0dDe+kDR2zww2zzyABoYFwA6+Ez4S/hK+EP4QsjL/8s/z4POWcjOAcjOzc3J7VQBMoj4SfhKxwXy6GXIz4UIzoBvz0DJgQCg+wAZACZNZXRob2QgZm9yIE5GVCBvbmx5AELtRNDT/9M/0wAx+kDU0dD6QNTR0PpA0fhs+Gv4avhj+GIACvhG8uBMAgr0pCD0oR4dABRzb2wgMC41OC4yAAAADCD4Ye0e2Q=='

const saltStruct = [
  { name: 'zero', type: 'address' },
  { name: 'owner', type: 'address' },
  { name: 'type', type: 'fixedbytes3' },
] as const

export const Salt = ({ provider }: { provider: ProviderRpcClient }) => {
  const [active, setActive] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean | undefined>()
  const [saltedCode, setSaltedCode] = useState<any | undefined>()
  const [salt, setSalt] = useState<any | undefined>()
  const [callData, setCallData] = useState<any | undefined>()

  const [data, setData] = useState<string>(INDEX_BASE_64)

  const setCodeSalt = async () => {
    setActive(true)
    setIsLoading(true)

    setSaltedCode(undefined)

    await provider.ensureInitialized()

    const providerState = await provider.getProviderState()
    const _address = providerState?.permissions.accountInteraction?.address

    const tvc = await provider.splitTvc(data)

    if (!_address || !tvc.code) return

    setCallData({
      zero: new Address(_address?.toString()),
      owner: new Address(_address?.toString()),
      type: btoa('tst'),
    })

    const { code: _saltedCode } = await provider.setCodeSalt({
      code: tvc.code,
      salt: {
        structure: saltStruct,
        abiVersion: '2.1',
        data: {
          zero: new Address(_address?.toString()),
          owner: new Address(_address?.toString()),
          type: btoa('tst'),
        },
      },
    })

    setSaltedCode(_saltedCode)
    console.log(`mergeTvc/tvc::`, _saltedCode)

    setIsLoading(false)
  }

  const getCodeSalt = async () => {
    setActive(true)
    setIsLoading(true)

    setSalt(undefined)

    await provider.ensureInitialized()

    if (!saltedCode) return

    const salt = await provider.getCodeSalt({
      code: saltedCode,
    })

    setSalt(salt)
    console.log(`salt::`, salt)

    setIsLoading(false)
  }

  return (
    <Panel open={active} onClick={() => setActive(!active)} isLoading={isLoading}>
      <Panel.Title>getCodeSalt, setCodeSalt</Panel.Title>
      <Panel.Description>
        <p>Methods that are used to manage the code salt of a smart contract.</p>
        INDEX you should take from github. It ALWAYS constant!
      </Panel.Description>

      <Panel.Buttons>
        <Button onClick={setCodeSalt}>setCodeSalt </Button>
        <Button onClick={getCodeSalt} disabled={!saltedCode}>
          getCodeSalt
        </Button>
      </Panel.Buttons>
      <Panel.Input>
        <div className='flex w-full flex-col align-middle lg:flex-row'>
          <span className='w-full text-gray-400 lg:w-1/5 lg:shrink-0'>INDEX BASE64</span>
          <TextArea
            value={data}
            autoFocus={false}
            onChange={(e) => {
              setData(e.target.value)
              setSaltedCode(undefined)
              setIsLoading(false)
            }}
            onClear={() => {
              setData(INDEX_BASE_64)
              setSaltedCode(undefined)
              setIsLoading(false)
            }}
          />
        </div>

        {callData && (
          <div className='mt-2 rounded-lg bg-white bg-opacity-5 p-6'>
            <RJson src={callData} />
          </div>
        )}
      </Panel.Input>

      <Panel.Output active={saltedCode}>
        <div className='rounded-lg bg-white bg-opacity-5 p-6'>
          <RJson src={saltedCode} title='Salted code' />
        </div>
        {salt && (
          <div className='mt-6 rounded-lg bg-white bg-opacity-5 p-6'>
            <RJson src={salt} title='Salt' />
          </div>
        )}
      </Panel.Output>
    </Panel>
  )
}
