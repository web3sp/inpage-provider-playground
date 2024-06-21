import {ProviderRpcClient} from "everscale-inpage-provider";
import Panel from "../components/Panel";
import Button from "../components/Button";
import {RJson} from "../components/RJson";
import {useState} from "react";

export const ChangeNetwork = ({ provider }: { provider: ProviderRpcClient }) => {
    const networkId = 1000
    const [active, setActive] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean | undefined>()
    const [response, setResponse] = useState<
        Awaited<ReturnType<(typeof provider)['changeNetwork']>> | undefined
    >()
    const onButtonClick = async () => {
        setActive(true)
        setIsLoading(true)
        try {
            await provider.ensureInitialized()
            const response = await provider.changeNetwork({networkId})
            console.log("ChangeNetwork::",response)
            setResponse(response)
            if(response.network){
                localStorage.setItem('selectedNetwork', response.network?.description?.globalId.toString())
            }
        } catch (error) {
            setResponse(error as any)
        } finally {
            setIsLoading(false)
        }

    }

    return (
        <Panel open={active}  onClick={() => setActive(!active)} isLoading={isLoading} >
            <Panel.Title>changeNetwork</Panel.Title>
            <Panel.Description>changeAccount is a method that allows you to change the network</Panel.Description>
            <Panel.Buttons>
                <Button disabled={!provider} onClick={onButtonClick}>
                    Change network to Testnet
                </Button>
            </Panel.Buttons>
            <Panel.Input>
                <div className='flex w-full flex-col lg:flex-row'>
                    <span className='w-full text-gray-400 lg:w-1/5'>networkId</span>
                    <span className='ml-2 break-all text-white'>{networkId} </span>
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
