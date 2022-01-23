export type Fellowship = "founders" | "angels" | "writers";
export type Paginated<T, U> = {
  edges: {
    node: T;
  }[];
  pageInfo: {
    endCursor: U;
    hasNextPage: boolean;
  };
};
export type NewsCursor = [number, number, number];

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

export type News = User | Project | Announcement
