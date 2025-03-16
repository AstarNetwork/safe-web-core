import CustomLink from '@/components/common/CustomLink'
import type { MDXComponents } from 'mdx/types'
import type { NextPage } from 'next'
import Head from 'next/head'
import SafePrivacyPolicy from '@/markdown/privacy/privacy.md'
import { BRAND_NAME } from '@/config/constants'

const overrideComponents: MDXComponents = {
  // @ts-expect-error
  a: CustomLink,
}

const PrivacyPolicy: NextPage = () => {
  return (
    <>
      <Head>
        <title>{`${BRAND_NAME} – Privacy policy`}</title>
      </Head>

      <main>
        <SafePrivacyPolicy components={overrideComponents} />
      </main>
    </>
  )
}

export default PrivacyPolicy
