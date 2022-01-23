import Head from 'next/head'

import Feed from 'components/Feed'
import Layout from 'components/Layout'

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>On Deck Newsfeed</title>
      </Head>
      <h1>Newsfeed</h1>

      <Feed fellowship={"founders"} />
    </Layout>
  )
}
