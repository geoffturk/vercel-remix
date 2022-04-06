import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from '@remix-run/react'

import globalStylesUrl from './styles/global.css'

export const links = () => {
  return [
    {
      rel: 'stylesheet',
      href: globalStylesUrl
    }
  ]
}

export const meta = () => ({
  title: 'JSON Schema - Remix',
  charset: 'utf-8',
  viewport: 'width=device-width,initial-scale=1'
})

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
