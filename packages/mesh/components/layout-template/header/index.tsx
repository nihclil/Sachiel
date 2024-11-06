import ArticleHeader from './article-header'
import CollectionHeader from './collection-header'
import DefaultHeader from './default-header'
import StatelessHeader from './stateless-header'

export enum HeaderType {
  Default = 'default',
  Stateless = 'stateless',
  Article = 'article',
  Collection = 'collection',
}

type HeaderProps =
  | {
      type: HeaderType.Default
    }
  | {
      type: HeaderType.Stateless
    }
  | {
      type: HeaderType.Article
      showNav: () => void
    }
  | {
      type: HeaderType.Collection
    }

export default function Header(props: HeaderProps) {
  switch (props.type) {
    case HeaderType.Default:
      return <DefaultHeader />
    case HeaderType.Stateless:
      return <StatelessHeader />
    case HeaderType.Article:
      return <ArticleHeader showNav={props.showNav} />
    case HeaderType.Collection:
      return <CollectionHeader />
    default:
      return null
  }
}
