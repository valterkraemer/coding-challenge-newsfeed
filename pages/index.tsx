import Head from 'next/head'
import { useRouter } from 'next/router'

import { Fellowship } from 'types'
import AlertError from 'components/AlertError'
import Feed from 'components/Feed'
import FellowshipLink from 'components/FellowshipLink'
import Layout from 'components/Layout'

export default function Home() {
  const { query } = useRouter()

  const fellowship = (query.fellowship || "founders") as Fellowship
  const validFellowship = ["founders", "angels", "writers"].includes(
    fellowship
  )

  return (
    <Layout>
      <Head>
        <title>On Deck Newsfeed</title>
      </Head>
      <h1>Newsfeed</h1>

      <div>
        <FellowshipLink fellowship="founders" />
        <FellowshipLink fellowship="angels" />
        <FellowshipLink fellowship="writers" />
      </div>

      {validFellowship ? (
        <Feed fellowship={fellowship} />
      ) : (
        <AlertError role="alert">Invalid fellowship</AlertError>
      )}
    </Layout>
  )
}
