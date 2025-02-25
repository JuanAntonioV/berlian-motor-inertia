import { cn } from '~/lib/utils'

type Props = {
  children: React.ReactNode
  className?: string
  wrapperClassName?: string
} & React.FormHTMLAttributes<HTMLFormElement> & {
    ref?: React.Ref<HTMLFormElement>
  }

export default function Form({ children, className, wrapperClassName, ...props }: Props) {
  return (
    <form {...props} className={cn('w-full', className)}>
      <div className={cn('grid w-full items-center gap-5', wrapperClassName)}>{children}</div>
    </form>
  )
}
