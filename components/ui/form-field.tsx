import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "./label"

export interface FormFieldProps {
  label: string
  htmlFor?: string
  required?: boolean
  error?: string
  className?: string
  children: React.ReactNode
  description?: string
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ label, htmlFor, required, error, className, children, description }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-2", className)}>
        <Label htmlFor={htmlFor} className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        {children}
        {description && (
          <p className="text-sm text-gray-500">{description}</p>
        )}
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
    )
  }
)

FormField.displayName = "FormField"

export { FormField }
