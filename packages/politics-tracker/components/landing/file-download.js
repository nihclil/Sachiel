import React from 'react'
import styled from 'styled-components'
import Image from 'next/image'

const TeamIntroContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 16px;
  background: ${({ theme }) => theme.backgroundColor.landingYellow};
  color: ${({ theme }) => theme.textColor.black};
  box-shadow: inset 0px -4px 0px #000000;
`
const TeamIntroWrap = styled.div`
  width: 100%;
  text-align: center;
  margin-bottom: 20px;
  h4 {
    ${({ theme }) => theme.fontSize['title-sub-md']};
    font-weight: 700;
    margin-bottom: 10px;
    margin: 0 12px 10px 12px;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    max-width: 850px;
    h4 {
      font-size: 18px;
    }
  }
`
const TeamSubtitle = styled.div`
  width: 100%;
  padding-top: 10px;
  text-align: center;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.3;
  margin-bottom: 20px;
  ${({ theme }) => theme.breakpoint.xl} {
    font-size: 28px;
  }
`
const CreditButtonWrap = styled.div`
  margin: auto;
  ${({ theme }) => theme.breakpoint.md} {
    display: flex;
    justify-content: center;
    width: 450px;
  }
  div {
    padding: 8px 24px 8px 32px;
    background: ${({ theme }) => theme.backgroundColor.white};
    border: 2px solid #000000;
    border-radius: 24px;
    font-size: 16px;
    max-width: 250px;
    font-weight: 500;
    margin: 0px auto 20px auto;
    ${({ theme }) => theme.breakpoint.md} {
      margin: 0px auto 10px auto;
    }
    ${({ theme }) => theme.breakpoint.xl} {
      font-size: 18px;
    }
  }
  div:hover {
    cursor: pointer;
    background: ${({ theme }) => theme.backgroundColor.skinDark};
  }
  a {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  p {
    margin-right: 3px;
  }
`
const TeamWrap = styled.div``
/**
 *
 * @returns {React.ReactElement}
 */

export default function TeamIntro() {
  const ButtonData = [
    {
      buttonTitle: '下載縣市長政見',
      // TODO: put Mayor URL file Link here
      buttonURL: '#',
    },
    {
      buttonTitle: '下載縣市議員政見',
      // TODO: put Councilor URL file Link here
      buttonURL: '#',
    },
  ]
  return (
    <TeamIntroContainer>
      <TeamWrap>
        <TeamSubtitle>下載資料</TeamSubtitle>
        <TeamIntroWrap>
          <h4>
            READr
            致力於產製資料驅動的新聞報導，並將所使用的資料公開，歡迎加以利用！（License：CC0）
          </h4>
        </TeamIntroWrap>
        <CreditButtonWrap>
          {ButtonData.map((v) => {
            return (
              <div key={v.buttonTitle}>
                <a href={v.buttonURL}>
                  <p>下載縣市長政見</p>
                  <Image
                    alt="arrowRightblack"
                    src="/landingpage/arrow_right_black.svg"
                    width="20"
                    height="20"
                    onClick={() => {}}
                  />
                </a>
              </div>
            )
          })}
        </CreditButtonWrap>
      </TeamWrap>
    </TeamIntroContainer>
  )
}
