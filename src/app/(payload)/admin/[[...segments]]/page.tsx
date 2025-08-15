/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { Metadata } from 'next'

import config from '@payload-config'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{ [key: string]: string | string[] }>
}

export const generateMetadata = async ({ params, searchParams }: Args): Promise<Metadata> => {
  const resolvedConfig = await config
  return generatePageMetadata({ config: resolvedConfig, params, searchParams })
}

const Page = async ({ params, searchParams }: Args) => {
  const resolvedConfig = await config
  console.log('Admin page - resolvedConfig:', !!resolvedConfig)
  console.log('Admin page - config keys:', resolvedConfig ? Object.keys(resolvedConfig) : 'none')
  console.log('Admin page - serverURL:', resolvedConfig?.serverURL)
  console.log('Admin page - admin config:', !!resolvedConfig?.admin)
  
  return RootPage({ 
    config: resolvedConfig, 
    importMap: resolvedConfig.admin?.importMap || { baseDir: process.cwd() },
    params, 
    searchParams 
  })
}

export default Page