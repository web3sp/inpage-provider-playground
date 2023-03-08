type Props = {
  src: string
  className?: string
}

export function Svg({ src, className }: Props): JSX.Element {
  return <span className={className} dangerouslySetInnerHTML={{ __html: src }} />
}
