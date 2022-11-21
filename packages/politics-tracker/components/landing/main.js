import React, { useState } from 'react'
import styled from 'styled-components'
import { ThemeProvider } from 'styled-components'
import theme from '~/styles/theme'
import { InView } from 'react-intersection-observer'
import { logGAEvent } from '~/utils/analytics'

//components
import Header from '~/components/header'
import Footer from '~/components/footer'
import FrontPage from '~/components/landing/frontpage-main'
import How from '~/components/landing/how-main'
import TeamIntro from '~/components/landing/credit'
import Credit from '~/components/landing/file-download'
import Mayor from '~/components/landing/mayor-main'
import Councilor from '~/components/landing/council-main'
import Report from '~/components/landing/report'

const Main = styled.main`
  width: 100%;
  padding-top: 64px;
  ${({ theme }) => theme.breakpoint.md} {
    padding-top: 80px;
  }
`
const HeaderWrap = styled.div`
  box-shadow: inset 0px -4px 0px #000000;
`
const QaGaAnchorWrapper = styled.div``
const QaGaAnchor = styled.div``

/**
 * @property {Object} titleData
 * @returns {React.ReactElement}
 */
// @ts-ignore : fix in the future
export default function LandingMain({ propsData }) {
  const [inView, setInView] = useState(false)
  const [hasSentGa, setHasSentGa] = useState(false)

  // @ts-ignore
  const handleGaInview = (isInView) => {
    setInView(isInView)
    if (isInView && !hasSentGa) {
      logGAEvent('click', '頁面滑動至最底端')
      setHasSentGa(true)
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <HeaderWrap>
        <Header />
      </HeaderWrap>
      <Main>
        <FrontPage
          // @ts-ignore : fix in the future
          propsData={propsData}
        />
        <How />
        <Mayor
          // @ts-ignore
          propsData={propsData}
        />
        <Councilor
          // @ts-ignore
          propsData={propsData}
        />
        <Credit />
        {propsData.postsWithPoliticsTrackerTag?.length !== 0 && (
          <Report
            // @ts-ignore
            propsData={propsData.postsWithPoliticsTrackerTag}
          />
        )}
        <TeamIntro />
      </Main>
      <InView onChange={handleGaInview}>
        {({ ref, inView }) => (
          <QaGaAnchorWrapper ref={ref}>
            <QaGaAnchor ref={ref} />
            <QaGaAnchor />
          </QaGaAnchorWrapper>
        )}
      </InView>
      <Footer />
    </ThemeProvider>
  )
}
