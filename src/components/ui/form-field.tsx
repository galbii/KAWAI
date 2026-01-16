import * as React from "react"
import type { FieldError, UseFormRegister } from "react-hook-form"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface FormFieldProps {
  name: string
  label: string
  type?: "text" | "email" | "tel" | "password" | "number"
  placeholder?: string
  required?: boolean
  disabled?: boolean
  icon?: React.ComponentType<{ className?: string }>
  helpText?: string
  error?: FieldError | string
  register?: UseFormRegister<any>
  className?: string
  inputClassName?: string
}

function FormField({
  name,
  label,
  type = "text",
  placeholder,
  required = false,
  disabled = false,
  icon: Icon,
  helpText,
  error,
  register,
  className,
  inputClassName,
}: FormFieldProps) {
  const errorMessage = typeof error === "string" ? error : error?.message

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-kawai-red ml-1">*</span>}
      </Label>

      <div className="relative">
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
        )}

        <Input
          id={name}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={!!errorMessage}
          className={cn(Icon && "pl-10", inputClassName)}
          {...(register && register(name))}
        />
      </div>

      {errorMessage && (
        <p className="text-sm text-kawai-red">{errorMessage}</p>
      )}

      {!errorMessage && helpText && (
        <p className="text-sm text-muted-foreground">{helpText}</p>
      )}
    </div>
  )
}

export { FormField }
export type { FormFieldProps }
