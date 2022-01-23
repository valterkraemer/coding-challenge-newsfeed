import {Fellowship, NewsCursor, Paginated} from 'types'
import db, {AnnouncementRow, ProjectRow, UserRow} from '../../db'

type GetArgs = {
  limit: number;
  oldestId: number;
  forFellowship: Fellowship;
}

function getUsers({ limit, oldestId, forFellowship }: GetArgs) {
  const where: string[] = []
  const params = []

  // Skip if id is 0
  if (oldestId) {
    where.push('u.id < ?')
    params.push(oldestId)
  }

  switch (forFellowship) {
    case 'founders':
    case 'angels':
      where.push('u.fellowship IN ("angels", "founders")')
      break
    case 'writers':
      where.push('u.fellowship = "writers"')
      break
  }

  return db.getAll<UserRow>(
    `
    SELECT u.*
    FROM users u
    WHERE ${where.join(" AND ")}
    ORDER BY u.id DESC
    LIMIT ?
  `,
    [...params, limit]
  )
}

function getProjects({ limit, oldestId, forFellowship }: GetArgs) {
  const where: string[] = []
  const params = []

  // Skip if id is 0
  if (oldestId) {
    where.push('p.id < ?')
    params.push(oldestId)
  }

  switch (forFellowship) {
    case 'founders':
    case 'angels':
      where.push('u.fellowship = "founders"')
      break
    case 'writers':
      where.push('u.fellowship != "founders"')
      break
  }

  return db.getAll<ProjectRow>(
    `
    SELECT DISTINCT p.*
    FROM projects p
    JOIN user_projects up ON up.project_id = p.id
    JOIN users u ON up.user_id = u.id
    WHERE ${where.join(" AND ")}
    ORDER BY p.id DESC
    LIMIT ?
  `,
    [...params, limit]
  )
}

function getAnnouncements({ limit, oldestId, forFellowship }: GetArgs) {
  const where: string[] = []
  const params = []

  // Skip if id is 0
  if (oldestId) {
    where.push('a.id < ?')
    params.push(oldestId)
  }

  where.push(`a.fellowship IN ('all', ?)`)
  params.push(forFellowship)

  return db.getAll<ProjectRow>(
    `
    SELECT a.*
    FROM announcements a
    WHERE ${where.join(' AND ')}
    ORDER BY a.id DESC
    LIMIT ?
  `,
    [...params, limit]
  )
}

type News = UserRow | ProjectRow | AnnouncementRow

type Args = {
  after?: NewsCursor;
  forFellowship: Fellowship;
}

export default async function news(
  parent: unknown,
  { after, forFellowship }: Args
): Promise<Paginated<News, NewsCursor>> {
  const limit = 10
  after = after || [0, 0, 0]

  if (!['founders', 'angels', 'writers'].includes(forFellowship)) {
    throw new Error('Invalid forFellowship')
  }

  // Query one item extra so we now if there are more
  const queryCount = limit + 1

  const result = await Promise.all([
    getUsers({ limit: queryCount, oldestId: after[0], forFellowship }),
    getProjects({ limit: queryCount, oldestId: after[1], forFellowship }),
    getAnnouncements({ limit: queryCount, oldestId: after[2], forFellowship }),
  ])

  const edges: {
    node: News;
  }[] = []

  for (let i = 0; i < limit; i++) {
    // Which of the first item in users, projects and annoucements are the newest
    // 0 - users
    // 1 - projects
    // 2 - announcements
    const newestIndex = result.reduce<number | undefined>(
      (res, rows, index) => {
        // Ignore table if now rows return
        if (!rows.length) {
          return res
        }

        // Set table if nothing has been set yet
        if (!res) {
          return index
        }

        // Set table if it's newest row is newer than current newest row
        if (rows[0].created_ts > result[res][0].created_ts) {
          return index
        }

        return res
      },
      undefined
    )

    // All tables returned empty array
    if (newestIndex === undefined) {
      break
    }

    const newestItem = result[newestIndex].shift() as News
    edges.push({
      node: newestItem,
    })

    // Store newest id of users/projects/announcements in cursor
    after[newestIndex] = newestItem.id
  }

  return {
    edges,
    pageInfo: {
      endCursor: after,
      hasNextPage: result.some((row) => row.length),
    },
  }
}
