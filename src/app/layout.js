"use client"
import Footer from '@/Components/Shared-Pages/Footer'
import NavBar from '@/Components/Shared-Pages/NavBar'
import OrderState from '@/Components/State/OrderState'
import { PayPalScriptProvider } from "@paypal/react-paypal-js"
import { Inter } from 'next/font/google'
import Script from 'next/script'
import React from 'react'
import { Toaster } from 'react-hot-toast'

// if (typeof window === 'undefined') {
//   global.window = {};
// }

import { usePathname } from 'next/navigation'
import './globals.css'

import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

const inter = Inter({ subsets: ['latin'] })

const initialOptions = {
  clientId: "ASzjP5eXg-r22-YQKnqc74y7p3txoOQEpwKnc0kL5R227CQY6OaKyEEpjOiY3KtOMOTj3IcMAE-oc_Wx",
  currency: "USD",
  intent: "capture",
};

// export const metadata = {
//   title: 'OdbhootStore',
//   // description: 'Generated by create next app',
// }

export default function RootLayout({ children }) {
  const pathname = usePathname()
  const resultArray = pathname.split("/").filter(Boolean);
  return (
    <html lang="en">

      {/* <!-- Google tag (gtag.js) --> */}
      <Script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.MEASUREMENT_ID}`}></Script>
      <Script id='google-analytics'>
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
  
            gtag('config', ${process.env.MEASUREMENT_ID});
          `}
      </Script>

      <body className={`${inter.className} min-h-screen`}>
        <PayPalScriptProvider options={initialOptions}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <OrderState>
              {
                resultArray[0] != "dashboard" && <NavBar />
              }

              <div className='min-h-[80vh]'>
                {children}
                <Toaster />
              </div>
              {
                resultArray[0] != "dashboard" && <Footer />
              }
            </OrderState>
          </LocalizationProvider>
        </PayPalScriptProvider>
      </body>
    </html>
  )
}
