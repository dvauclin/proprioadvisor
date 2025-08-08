import Link from 'next/link'
import { ReactNode } from 'react'

interface NextLinkProps {
  href: string
  children: ReactNode
  className?: string
  onClick?: () => void
  target?: string
  rel?: string
  prefetch?: boolean
}

export const NextLink: React.FC<NextLinkProps> = ({
  href,
  children,
  className,
  onClick,
  target,
  rel,
  prefetch = true,
}) => {
  // Si c'est un lien externe, utiliser une balise a normale
  if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
    return (
      <a
        href={href}
        className={className}
        onClick={onClick}
        target={target}
        rel={rel}
      >
        {children}
      </a>
    )
  }

  // Pour les liens internes, utiliser Next.js Link
  return (
    <Link
      href={href}
      className={className}
      onClick={onClick}
      target={target}
      rel={rel}
      prefetch={prefetch}
    >
      {children}
    </Link>
  )
} 