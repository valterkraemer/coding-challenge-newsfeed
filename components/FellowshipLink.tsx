import Link from "next/link"
import { useRouter } from "next/router"
import styled from "styled-components"

import { Fellowship } from "types"

type Props = {
  fellowship: Fellowship;
}

const labels: Record<Fellowship, string> = {
  founders: "Founders",
  angels: "Angels",
  writers: "Writers",
}

export default function FellowshipLink({ fellowship }: Props) {
  const { query } = useRouter()
  const active =
    query.fellowship === fellowship ||
    (fellowship === "founders" && !query.fellowship)

  return (
    <Link href={{ query: { fellowship } }}>
      <Anchor active={active}>
        {labels[fellowship]}
      </Anchor>
    </Link>
  )
}

type AnchorProps = {
  active: boolean;
}

const Anchor = styled.a<AnchorProps>`
  cursor: pointer;
  font-size: 1.3em;
  margin-right: 1em;

  ${(props) => props.active && "text-decoration: underline"};
`
