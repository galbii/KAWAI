'use client'

import * as React from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
} from '@/components/ui/dialog'
import * as DialogPrimitive from '@radix-ui/react-dialog'

const modalVariants = cva(
  'fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background text-foreground shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg',
  {
    variants: {
      size: {
        sm: 'w-full max-w-sm',
        md: 'w-full max-w-md',
        lg: 'w-full max-w-lg',
        xl: 'w-full max-w-xl',
        full: 'w-full max-w-[90vw]',
      },
      layout: {
        centered: 'grid p-6',
        split: 'grid grid-cols-1 md:grid-cols-[60%_40%] p-0 overflow-hidden',
      },
    },
    defaultVariants: {
      size: 'md',
      layout: 'centered',
    },
  }
)

const overlayVariants = cva(
  'fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'
)

export interface ModalProps extends VariantProps<typeof modalVariants> {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
}

export function Modal({
  isOpen,
  onClose,
  children,
  size = 'md',
  layout = 'centered',
  className,
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
}: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogPrimitive.Overlay className={overlayVariants()} />
        <DialogPrimitive.Content
          className={cn(modalVariants({ size, layout }), className)}
          onEscapeKeyDown={(e) => {
            if (!closeOnEscape) {
              e.preventDefault()
            }
          }}
          onPointerDownOutside={(e) => {
            if (!closeOnOverlayClick) {
              e.preventDefault()
            }
          }}
          onInteractOutside={(e) => {
            if (!closeOnOverlayClick) {
              e.preventDefault()
            }
          }}
        >
          {children}
          {showCloseButton && (
            <DialogPrimitive.Close
              className="absolute right-4 top-4 z-10 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
              onClick={onClose}
            >
              <XMarkIcon className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          )}
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  )
}

Modal.displayName = 'Modal'
