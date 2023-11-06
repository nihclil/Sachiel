import Image from '@readr-media/react-image'
import styled from 'styled-components'

import RelatedLinks from '~/components/politics-detail/related-links'
import { SOURCE_DELIMITER } from '~/constants/politics'
import FactCheckIcon from '~/public/icons/fact-check-icon.svg'
import type { FactCheck } from '~/types/politics-detail'
import { getCheckResultString } from '~/utils/utils'

const ListWrapper = styled.li`
  padding: 20px;
  background: ${({ theme }) => theme.backgroundColor.black5};
  border-radius: 20px;

  & + * {
    margin-top: 12px;
  }
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid ${({ theme }) => theme.borderColor.black10};
`

const Content = styled.div`
  margin-bottom: 15px;

  .point {
    font-weight: 500;
    font-size: 16px;
    line-height: 1.8;
    text-align: justify;
    color: rgba(15, 45, 53, 0.66);

    & + * {
      margin-top: 12px;
    }
  }

  ${({ theme }) => theme.breakpoint.md} {
    .point {
      font-size: 18px;
    }
  }
`

const PartnerImage = styled.div`
  width: 24px;
  height: 24px;
  min-width: 24px;
  min-height: 24px;

  margin-right: 8px;
  border-radius: 8px;
  overflow: hidden;
`

const Name = styled.p`
  font-weight: 700;
  font-size: 14px;
  line-height: 1.3;
  color: ${({ theme }) => theme.textColor.black};

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 16px;
  }
`

const Title = styled.div`
  display: flex;
  align-items: center;
`

const Status = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-weight: 500;
  font-size: 12px;
  margin-bottom: 12px;
  color: ${({ theme }) => theme.textColor.blue};

  svg {
    margin-right: 4px;

    path {
      fill: ${({ theme }) => theme.textColor.blue};
      fill-opacity: 1;
    }
  }
  ${({ theme }) => theme.breakpoint.md} {
    font-size: 14px;
  }
`

const SubTitle = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.textColor.black50};

  svg {
    margin-right: 4px;
  }

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 14px;
  }
`

type FactItemProps = {
  factItem: FactCheck
}
export default function FactItem({ factItem }: FactItemProps): JSX.Element {
  const { checkResultType, link, content, factcheckPartner, factCheckSummary } =
    factItem

  const factType = getCheckResultString(checkResultType, factItem)
  const factText = content.split(SOURCE_DELIMITER).map((item, index) => {
    return (
      <p key={index} className="point">
        {item}
      </p>
    )
  })

  return (
    <ListWrapper>
      <Header>
        <Title>
          <PartnerImage>
            <Image
              images={factcheckPartner?.slogo?.resized}
              defaultImage="/images/default-head-photo.png"
              alt={factcheckPartner?.name || 'factcheck-partner-image'}
              priority={false}
            />
          </PartnerImage>

          {factcheckPartner?.name && <Name>{factcheckPartner?.name}</Name>}
        </Title>

        <SubTitle>查核單位</SubTitle>
      </Header>

      <Content>
        {factCheckSummary && (
          <Status>
            <FactCheckIcon />
            <span>
              政見提出背景：【{factType}】{factCheckSummary}
            </span>
          </Status>
        )}

        {factText}
      </Content>
      <RelatedLinks links={link} />
    </ListWrapper>
  )
}
