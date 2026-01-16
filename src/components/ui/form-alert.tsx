import { cva, type VariantProps } from 'class-variance-authority'
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

const formAlertVariants = cva(
  'rounded-lg border p-4',
  {
    variants: {
      variant: {
        success: 'bg-green-50 border-green-200 text-green-800',
        error: 'bg-red-50 border-red-200 text-red-800',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        info: 'bg-blue-50 border-blue-200 text-blue-800',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  }
)

const iconVariants = cva('h-5 w-5 flex-shrink-0', {
  variants: {
    variant: {
      success: 'text-green-600',
      error: 'text-red-600',
      warning: 'text-yellow-600',
      info: 'text-blue-600',
    },
  },
  defaultVariants: {
    variant: 'info',
  },
})

const iconMap = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  warning: ExclamationTriangleIcon,
  info: InformationCircleIcon,
}

export interface FormAlertProps extends VariantProps<typeof formAlertVariants> {
  title?: string
  message: string
  className?: string
  showIcon?: boolean
}

export function FormAlert({
  variant = 'info',
  title,
  message,
  className,
  showIcon = true,
}: FormAlertProps) {
  const Icon = iconMap[variant || 'info']

  return (
    <div className={cn(formAlertVariants({ variant }), className)}>
      <div className="flex items-start gap-3">
        {showIcon && <Icon className={iconVariants({ variant })} />}
        <div className="flex-1">
          {title && (
            <h3 className="font-semibold text-sm mb-1">
              {title}
            </h3>
          )}
          <p className="text-sm">
            {message}
          </p>
        </div>
      </div>
    </div>
  )
}
