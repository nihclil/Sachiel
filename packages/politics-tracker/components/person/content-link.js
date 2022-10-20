import {
  ContentItemContainer,
  ContentItemTitle,
  ContentItemContent,
} from './content-item'
import styled from 'styled-components'
import React, { useMemo } from 'react'
import { stringToSources, getNewSource } from '~/utils/utils'
import { ContentItemEmpty } from './content-item'

const ContentItemLink = styled(ContentItemContent)`
  color: ${({ theme }) => theme.textColor.blue};
  margin-bottom: 8px;
`
/**
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {import('~/types/person').Person["links"]} props.links
 * @returns {React.ReactElement}
 */
export default function ContentLink({ title, links }) {
  const linkList = useMemo(
    () =>
      links ? stringToSources(links, '\n').filter((link) => link.value) : [],
    [links]
  )
  return (
    <ContentItemContainer>
      <ContentItemTitle>{title}</ContentItemTitle>
      <div>
        {linkList && linkList.length !== 0 ? (
          linkList?.map((item) => (
            <ContentItemLink
              key={item.id}
              as={item.value ? 'a' : 'block'}
              href={item.value}
              target="_blank"
              rel="noreferrer noopener"
            >
              {item.value}
            </ContentItemLink>
          ))
        ) : (
          <ContentItemEmpty>尚未新增</ContentItemEmpty>
        )}
      </div>
    </ContentItemContainer>
  )
}
