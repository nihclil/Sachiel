import { useEffect, useRef } from 'react'
import styled from 'styled-components'

export const Block = styled.div`
  position: relative;
  min-height: 100vh;

  img.img-responsive {
    margin: 0 auto;
    max-width: 100%;
    height: auto;
    display: block;
  }
`

export const Caption = styled.div`
  line-height: 1.43;
  letter-spacing: 0.4px;
  font-size: 14px;
  color: #808080;
  padding: 15px 15px 0 15px;
`

type FirstEmbeddedCodeProps = {
  embeddedCode: string
  setState?: (value: boolean) => void
}

export default function LeadingEmbeddedCode({
  embeddedCode,
  setState,
}: FirstEmbeddedCodeProps): JSX.Element {
  const onEmbeddedFinish = () => {
    setState && setState(true)
  }

  const embedded = useRef(null)

  useEffect(() => {
    if (!embedded.current) return
    const node: HTMLElement = embedded.current

    const fragment = document.createDocumentFragment()

    // `embeddedCode` is a string, which may includes
    // multiple '<script>' tags and other html tags.
    // For executing '<script>' tags on the browser,
    // we need to extract '<script>' tags from `embeddedCode` string first.
    //
    // The approach we have here is to parse html string into elements,
    // and we could use DOM element built-in functions,
    // such as `querySelectorAll` method, to query '<script>' elements,
    // and other non '<script>' elements.
    const parser = new DOMParser()
    const ele = parser.parseFromString(
      `<div id="draft-embed">${embeddedCode}</div>`,
      'text/html'
    )
    const scripts = ele.querySelectorAll('script')
    const nonScripts = ele.querySelectorAll('div#draft-embed > :not(script)')

    nonScripts.forEach((ele) => {
      fragment.appendChild(ele)
    })

    scripts.forEach((s) => {
      //preload
      const scriptHref = s.getAttribute('src')
      const existingLink = document.querySelector(
        `link[href="${scriptHref}"][rel="preload"]`
      )
      if (existingLink) {
        return
      } else {
        const preloadLink = document.createElement('link')
        preloadLink.href = scriptHref || ''
        preloadLink.rel = 'preload'
        preloadLink.as = 'script'
        document.head.appendChild(preloadLink)
      }

      const scriptEle = document.createElement('script')

      const attrs = s.attributes
      for (let i = 0; i < attrs.length; i++) {
        scriptEle.setAttribute(attrs[i].name, attrs[i].value)
      }
      scriptEle.text = s.text || ''
      fragment.appendChild(scriptEle)
    })

    node.appendChild(fragment)
    onEmbeddedFinish()
  }, [embeddedCode])

  return (
    <>
      {
        // WORKAROUND:
        // The following `<input>` is to solve [issue 153](https://github.com/mirror-media/openwarehouse-k6/issues/153).
        // If the emebed code generates `<input>` or `<textarea>` and appends them onto DOM,
        // and then the generated `<input>` or `<textarea>` will hijack the users' cursors.
        // It will cause that users could not edit the DraftJS Editor anymore.
        // The following phony `<input>` is used to prevent the generated `<input>` or `<textare>` from
        // hijacking the users' cursors.
      }
      <input hidden disabled />
      <Block ref={embedded} />
    </>
  )
}
