import type { ApiDataBlockBase, ApiDataBlockType, Organization } from '../types'
import { genMMSideIndexHeaderId } from '../utils/side-index'

export interface ApiDataHeader2 extends ApiDataBlockBase {
  type: ApiDataBlockType.HeaderTwo
  content: [string]
  alignment: 'center'
}

export interface ApiDataHeader3 extends ApiDataBlockBase {
  type: ApiDataBlockType.HeaderThree
  content: [string]
  alignment: 'center'
}

export function Header2Block({
  apiDataBlock,
  organization,
}: {
  apiDataBlock: ApiDataHeader2
  organization: Organization
}) {
  switch (organization) {
    case 'mirror-media':
      return (
        <h2
          id={genMMSideIndexHeaderId(apiDataBlock.id)}
          dangerouslySetInnerHTML={{ __html: apiDataBlock.content[0] }}
        />
      )
    case 'readr-media':
      return (
        <h2 dangerouslySetInnerHTML={{ __html: apiDataBlock.content[0] }} />
      )
    default:
      return null
  }
}

export function Header3Block({
  apiDataBlock,
  organization,
}: {
  apiDataBlock: ApiDataHeader3
  organization: Organization
}) {
  switch (organization) {
    case 'mirror-media':
      return (
        <h3
          id={genMMSideIndexHeaderId(apiDataBlock.id)}
          dangerouslySetInnerHTML={{ __html: apiDataBlock.content[0] }}
        />
      )
    case 'readr-media':
      return (
        <h3 dangerouslySetInnerHTML={{ __html: apiDataBlock.content[0] }} />
      )
    default:
      return null
  }
}
