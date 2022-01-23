import { gql, useQuery } from '@apollo/client'
import { useCallback, useEffect } from 'react'
import styled from 'styled-components'
import useInfiniteScroll from 'react-infinite-scroll-hook'

import { Fellowship, NewsCursor, Paginated } from 'types'
import AlertError from './AlertError'
import AnnouncementCard from './AnnouncementCard'
import Loading from './Loading'
import ProjectCard from './ProjectCard'
import UserCard from './UserCard'

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
`;

type Project = {
  __typename: "Project";
  id: number;
  name: string;
  description: string;
  icon_url: string;
  users: Pick<User, "id" | "name" | "avatar_url">[];
}

type User = {
  __typename: "User";
  id: number;
  name: string;
  bio: string;
  fellowship: Fellowship;
  avatar_url: string;
  projects: Pick<Project, "id" | "name" | "icon_url">[];
}

type Announcement = {
  __typename: "Announcement";
  id: number;
  fellowship: Fellowship;
  title: string;
  body: string;
}

type News = User | Project | Announcement

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
  const { data, error, loading, fetchMore, refetch, networkStatus } = useQuery<
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
        posts.map((item) => {
          const Card = () => {
            switch (item.__typename) {
              case "Project":
                return <ProjectCard project={item} />;
              case "User":
                return <UserCard user={item} key={"user" + item.id} />;
              case "Announcement":
                return (
                  <AnnouncementCard
                    key={"announcement" + item.id}
                    announcement={item}
                  />
                );
            }
          }

          return (
            <Article key={item.__typename + item.id}>
              <Card />
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
