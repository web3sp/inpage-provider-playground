/* This example requires Tailwind CSS v2.0+ */
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import classNames from 'classnames'
import { Fragment, useState } from 'react'

type Props = {
  className?: string
  networks: any
  currentNetworkId: number
  onChange: (networkId: number) => void
}

export default function Select({ className, networks, currentNetworkId, onChange }: Props) {
  const [selected, setSelected] = useState(networks.find((network: any) => network.connection.id === currentNetworkId))

  return (
    <div className={className}>
      <Listbox
        value={selected}
        onChange={(e) => {
          setSelected(networks.find((network: any) => network.connection.id === e))
          onChange(e)
        }}
      >
        {({ open }) => (
          <>
            <div className='relative mt-1'>
              <Listbox.Button className='relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 sm:text-sm'>
                <div className='flex items-center'>
                  <span
                    aria-label={selected.connection.id === currentNetworkId ? 'Online' : 'Offline'}
                    className={classNames(
                      selected.connection.id === currentNetworkId ? 'bg-green-400' : 'bg-gray-200',
                      'inline-block h-2 w-2 flex-shrink-0 rounded-full',
                    )}
                  />
                  <span className='ml-3 block text-gray-800'>{selected.connection.id + ' - ' + selected.name}</span>
                </div>
                <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
                  <ChevronUpDownIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
                </span>
              </Listbox.Button>

              <Transition
                show={open}
                as={Fragment}
                leave='transition ease-in duration-100'
                leaveFrom='opacity-100'
                leaveTo='opacity-0'
              >
                <Listbox.Options className='absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
                  {networks?.map((network: any) => (
                    <Listbox.Option
                      key={network.connection.id}
                      className={({ active }) =>
                        classNames(
                          active ? 'bg-green-600 text-white' : 'text-gray-900',
                          'relative cursor-default select-none py-2 pl-3 pr-9',
                        )
                      }
                      value={network.connection.id}
                    >
                      {({ selected, active }) => (
                        <>
                          <div className='flex items-center'>
                            <span
                              className={classNames(
                                network.connection.id === currentNetworkId ? 'bg-green-400' : 'bg-gray-200',
                                'inline-block h-2 w-2 flex-shrink-0 rounded-full',
                              )}
                              aria-hidden='true'
                            />
                            <span
                              className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
                            >
                              {network.connection.id + ' - ' + network.name}
                              <span className='sr-only'>
                                {' '}
                                is {network.connection.id === currentNetworkId ? 'online' : 'offline'}
                              </span>
                            </span>
                          </div>

                          {selected ? (
                            <span
                              className={classNames(
                                active ? 'text-white' : 'text-green-600',
                                'absolute inset-y-0 right-0 flex items-center pr-4',
                              )}
                            >
                              <CheckIcon className='h-5 w-5' aria-hidden='true' />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )}
      </Listbox>
    </div>
  )
}
