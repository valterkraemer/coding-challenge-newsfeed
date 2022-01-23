import { memo } from 'react'

import { News } from 'types'
import AnnouncementCard from './AnnouncementCard'
import ProjectCard from './ProjectCard'
import UserCard from './UserCard'

type Props = {
  news: News;
}

const NewsCard = ({ news }: Props) => {
  switch (news.__typename) {
    case 'Project':
      return <ProjectCard project={news} />
    case 'User':
      return <UserCard user={news} />
    case 'Announcement':
      return <AnnouncementCard announcement={news} />
  }
}

export default memo(NewsCard)
