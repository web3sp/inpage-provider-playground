import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/solid'
import cn from 'classnames'
import React, { FC, ReactNode } from 'react'
import { Loader } from './Loader'

interface PanelProps {
  open: boolean
  isLoading?: boolean

  onClick: () => void
  children?: ReactNode
  chevron?: boolean
}
interface PanelTitleProps {
  children?: ReactNode
}
interface PanelDescriptionProps {
  children?: ReactNode
}
interface PanelButtonsProps {
  children?: ReactNode
}
interface PanelOutputProps {
  active?: boolean
  children?: ReactNode
}
interface PanelInputProps {
  children?: ReactNode
}

interface PanelType extends FC<PanelProps> {
  Title: FC<PanelTitleProps>
  Description: FC<PanelDescriptionProps>
  Buttons: FC<PanelButtonsProps>
  Output: FC<PanelOutputProps>
  Input: FC<PanelInputProps>
}

const Panel: PanelType = (props: PanelProps) => {
  const { open, isLoading, onClick, children, chevron = true } = props

  const childrenArray = React.Children.toArray(children)

  const titleIndex = childrenArray.findIndex((child) => (child as React.ReactElement)?.type === PanelTitle)
  const descriptionIndex = childrenArray.findIndex((child) => (child as React.ReactElement)?.type === PanelDescription)
  const buttonsIndex = childrenArray.findIndex((child) => (child as React.ReactElement)?.type === PanelButtons)
  const outputIndex = childrenArray.findIndex((child) => (child as React.ReactElement)?.type === PanelOutput)
  const inputIndex = childrenArray.findIndex((child) => (child as React.ReactElement)?.type === PanelInput)

  const title = titleIndex === -1 ? null : childrenArray[titleIndex]
  const description = descriptionIndex === -1 ? null : childrenArray[descriptionIndex]
  const buttons = buttonsIndex === -1 ? null : childrenArray[buttonsIndex]
  const output = outputIndex === -1 ? null : childrenArray[outputIndex]
  const input = inputIndex === -1 ? null : childrenArray[inputIndex]

  return (
    <div className='block hover:bg-gray-50 hover:bg-opacity-5'>
      <div className='flex w-full flex-col justify-between px-4 py-4 sm:px-6 lg:flex-row'>
        <div onClick={onClick} className='group mb-2 flex w-full min-w-0 cursor-pointer flex-row'>
          <div className='flex w-7 shrink-0'>
            {chevron ? (
              open ? (
                <ChevronDownIcon className='mr-1 mt-1 h-4 w-4 text-gray-500 group-hover:text-lightgreen' />
              ) : (
                <ChevronRightIcon className='mr-1 mt-1 h-4 w-4 text-gray-500 group-hover:text-lightgreen' />
              )
            ) : null}
          </div>
          <div className='group flex w-full flex-col text-xs lg:text-sm'>
            <div className='flex flex-row items-center'>
              {title}
              {isLoading && <Loader className='ml-6' />}
            </div>
            <div
              className={cn(
                'relative mt-1 flex flex-col text-xs font-normal text-gray-400 group-hover:text-gray-200',
                open ? 'h-fit w-3/4' : 'max-h-24 overflow-hidden ',
              )}
            >
              {/* <div className='absolute bottom-0 h-[20px] w-full bg-gradient-to-t from-[black] to-transparent'></div> */}
              {description}
            </div>
          </div>
        </div>
        {!open && (
          <div className='ml-0 flex w-1/4 min-w-fit flex-shrink-0 flex-col space-y-2 pl-7 lg:pl-5 '>{buttons}</div>
        )}
      </div>

      {open && (
        <div className='w-full py-4 pl-5 lg:pl-7'>
          {input}
          <div className='ml-6 flex w-fit flex-col flex-wrap space-y-2 lg:flex-row lg:space-x-2 lg:space-y-0'>
            {buttons}
          </div>
          {output}
        </div>
      )}
    </div>
  )
}

const PanelTitle: FC<PanelTitleProps> = (props) => {
  return <div className=' font-medium text-green-500 group-hover:text-lightgreen'>{props.children}</div>
}

const PanelDescription: FC<PanelDescriptionProps> = (props) => {
  return <>{props.children}</>
}

const PanelButtons: FC<PanelButtonsProps> = (props) => {
  return <>{props.children}</>
}

const PanelInput: FC<PanelInputProps> = (props) => {
  return (
    <div className='px-6 py-2'>
      <h2>Input</h2>
      <div className='flex w-full flex-col rounded-lg bg-white bg-opacity-5 p-6'>{props.children}</div>
    </div>
  )
}

const PanelOutput: FC<PanelOutputProps> = (props) => {
  if (!props.active) return null
  return (
    <div className='p-6'>
      <h2>Output</h2>
      {props.children}
    </div>
  )
}

Panel.Title = PanelTitle
Panel.Description = PanelDescription
Panel.Buttons = PanelButtons
Panel.Output = PanelOutput
Panel.Input = PanelInput

export default Panel
