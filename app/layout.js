import { Playfair_Display, Lato } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-playfair-display',
  display: 'swap',
})

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-lato',
  display: 'swap',
})

export const metadata = {
  title: 'Meine Wunschliste zum Einzug 🏠',
  description: 'Eine kleine Sammlung von Dingen, die mein neues Zuhause noch schöner machen würden.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="de" className={`${playfair.variable} ${lato.variable}`}>
      <body>{children}</body>
    </html>
  )
}
