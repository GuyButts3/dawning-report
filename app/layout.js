import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Dawning Report',
  description: 'Track your Destiny 2 Dawning ingredients',
  icons: {
    icon: 'https://murporyhvykyfzzvuzkv.supabase.co/storage/v1/object/public/gaming_d2_dawning_images/dawning_icon_v1.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
