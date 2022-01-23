import { gql, useQuery } from '@apollo/client'
import { useCallback, useEffect } from 'react'
import styled from 'styled-components'
import useInfiniteScroll from 'react-infinite-scroll-hook'

import { Fellowship, News, NewsCursor, Paginated } from 'types'
import AlertError from './AlertError'
import Loading from './Loading'
import NewsCard from './NewsCard'

const NEWSFEED_QUERY = gql`
  query News($forFellowship: String!, $cursor: [Int!]) {
    news(forFellowship: $forFellowship, after: $cursor) {
      edges {
        node {
          __typename

          ... on Project {
            id
            name
            description
            icon_url
            users {
              id
              name
              avatar_url
            }
          }

          ... on User {
            id
            name
            bio
            fellowship
            avatar_url
            projects {
              id
              name
              icon_url
            }
          }

          ... on Announcement {
            id
            fellowship
            title
            body
          }
        }
      }

      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`

type QueryData = {
  news: Paginated<News, NewsCursor>;
}

type QueryVars = {
  forFellowship: Fellowship;
}

type Props = {
  fellowship: Fellowship;
}

export default function Feed({ fellowship }: Props) {
  const { data, error, loading, fetchMore, refetch } = useQuery<
    QueryData,
    QueryVars
  >(NEWSFEED_QUERY, {
    notifyOnNetworkStatusChange: true,
    variables: {
      forFellowship: fellowship,
    },
  })

  useEffect(() => {
    refetch()
  }, [fellowship])

  const cursor = data?.news.pageInfo.endCursor
  const posts = data?.news.edges.map((edge) => edge.node)

  const handleLoadMore = useCallback(() => {
    fetchMore({
      variables: {
        cursor,
      },
    })
  }, [cursor])

  const [sentryRef] = useInfiniteScroll({
    loading,
    hasNextPage: Boolean(data?.news.pageInfo.hasNextPage),
    onLoadMore: handleLoadMore,
    disabled: !!error,
    rootMargin: "0px 0px 400px 0px",
  })

  return (
    <>
      {error && <AlertError role="alert">{error}</AlertError>}
      {posts &&
        posts.map((news) => {
          return (
            <Article key={news.__typename + news.id}>
              <NewsCard news={news} />
            </Article>
          )
        })}
      <Loading show={loading} />
      <div ref={sentryRef} />
    </>
  )
}

const Article = styled.article`
  margin-top: 1.5rem;
`
