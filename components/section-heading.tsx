interface SectionHeadingProps {
  children: React.ReactNode
}

export function SectionHeading({ children }: SectionHeadingProps) {
  return <h2 className="text-3xl font-bold tracking-tight text-center mb-8 md:mb-12">{children}</h2>
}

