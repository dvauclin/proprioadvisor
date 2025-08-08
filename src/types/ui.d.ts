// Types pour les composants UI

export interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  disabled?: boolean
  loading?: boolean
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  className?: string
}

export interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  placeholder?: string
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  onBlur?: () => void
  onFocus?: () => void
  disabled?: boolean
  required?: boolean
  error?: string
  className?: string
  name?: string
  id?: string
}

export interface SelectProps {
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  required?: boolean
  error?: string
  className?: string
  name?: string
  id?: string
  children: React.ReactNode
}

export interface CheckboxProps {
  checked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  required?: boolean
  error?: string
  className?: string
  name?: string
  id?: string
  label?: string
}

export interface RadioGroupProps {
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
  required?: boolean
  error?: string
  className?: string
  name?: string
  children: React.ReactNode
}

export interface TextareaProps {
  placeholder?: string
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  onBlur?: () => void
  onFocus?: () => void
  disabled?: boolean
  required?: boolean
  error?: string
  className?: string
  name?: string
  id?: string
  rows?: number
  cols?: number
}

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
  className?: string
}

export interface TooltipProps {
  content: string
  children: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
  className?: string
}

export interface BadgeProps {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  size?: 'default' | 'sm' | 'lg'
  children: React.ReactNode
  className?: string
}

export interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  shadow?: 'none' | 'sm' | 'md' | 'lg'
  border?: boolean
}

export interface AlertProps {
  variant?: 'default' | 'destructive' | 'warning' | 'info'
  title?: string
  description?: string
  children?: React.ReactNode
  className?: string
  onClose?: () => void
}

export interface ProgressProps {
  value: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'success' | 'warning' | 'error'
  className?: string
  showLabel?: boolean
}

export interface SkeletonProps {
  className?: string
  width?: string | number
  height?: string | number
  variant?: 'text' | 'circular' | 'rectangular'
}

export interface AvatarProps {
  src?: string
  alt?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  fallback?: React.ReactNode
  className?: string
}

export interface TabsProps {
  value?: string
  onChange?: (value: string) => void
  children: React.ReactNode
  className?: string
  orientation?: 'horizontal' | 'vertical'
}

export interface AccordionProps {
  type?: 'single' | 'multiple'
  value?: string | string[]
  onChange?: (value: string | string[]) => void
  children: React.ReactNode
  className?: string
  collapsible?: boolean
} 

