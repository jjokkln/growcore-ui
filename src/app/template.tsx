import { Seitenwechsel } from '@/components/motion/seitenwechsel'

// Seitenwechsel über das Template, nicht im Layout: Ein Template wird bei jeder Navigation neu
// angelegt, darum feuern enter/exit hier, ohne usePathname() (components/motion/seitenwechsel.tsx).
export default function Template({ children }: { children: React.ReactNode }) {
  return <Seitenwechsel>{children}</Seitenwechsel>
}
