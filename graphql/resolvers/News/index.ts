export function __resolveType(obj: any, context: unknown, info: unknown) {
  if (obj.avatar_url) {
    // Only User has a avatar_url field
    return 'User'
  }

  if (obj.icon_url) {
    // Only Project has a icon_url field
    return 'Project'
  }

  if (obj.body) {
    // Only Announcement has a body field
    return 'Announcement'
  }

  return null
}
