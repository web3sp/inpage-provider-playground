import {Network, ProviderRpcClient} from "everscale-inpage-provider";
import Panel from "../components/Panel";
import Button from "../components/Button";
import {useState} from "react";
import {RJson} from "../components/RJson";

export const AddNetwork = ({ provider }: { provider: ProviderRpcClient }) => {
    const [active, setActive] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean | undefined>()
    const [response, setResponse] = useState<
        Awaited<ReturnType<(typeof provider)['addNetwork']>> | undefined
    >()
    const network =  {
        networkId: 1337,
        name: "Venom Testnet 1337",

        connection: {type: "jrpc", data: {
                endpoint: 'https://jrpc-broxustestnet.everwallet.net/rpc'
            }},
        config: {

        },
    }
    const onButtonClick = async () => {
        setIsLoading(true)
        setActive(true)
        try{

            await provider.ensureInitialized()
            const response = await provider.addNetwork({network:network,switchNetwork:true})
            setResponse(response)
        } catch (error){
            setResponse(error as any)
        } finally {
          setIsLoading(false)
        }

    }

    return (
        <Panel open={active} onClick={() => setActive(!active)} isLoading={isLoading}>
            <Panel.Title>addNetwork</Panel.Title>
            <Panel.Description>addAccount is a method that allows you to add the network</Panel.Description>
            <Panel.Buttons>
                <Button disabled={!provider} onClick={onButtonClick}>
                    Add the Testnet 1337
                </Button>
            </Panel.Buttons>
            <Panel.Input>
                <div className='flex w-full flex-col lg:flex-row'>
                    <span className='w-full text-gray-400 lg:w-1/5'>Network</span>
                    <span className='w-full ml-2 rounded-lg bg-white bg-opacity-5 p-6'><RJson src={network} /></span>
                </div>
                <div className='flex w-full flex-col lg:flex-row'>
                    <span className='w-full text-gray-400 lg:w-1/5'>switchNetwork</span>
                    <span className='ml-2 break-all text-white'>true</span>
                </div>
            </Panel.Input>
            <Panel.Output active={!!response}>
                <div className='rounded-lg bg-white bg-opacity-5 p-6'>
                    <RJson src={response} />
                </div>
            </Panel.Output>
        </Panel>
    )
}
