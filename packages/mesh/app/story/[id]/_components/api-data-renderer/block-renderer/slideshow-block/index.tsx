'use client'

import CustomImage from '@readr-media/react-image'
import Image from 'next/image'
import { useState } from 'react'

import {
  type ApiDataBlockBase,
  type Image as ImageType,
  ApiDataBlockType,
} from '../../types'
import Lightbox from './lightbox'

export type SlideshowImage = Pick<
  ImageType,
  'id' | 'desc' | 'name' | 'resized' | 'resizedWebp'
>

type ContentSlideshowV1 = SlideshowImage[]

type ContentSlideshowV2 = {
  delay: number
  images: SlideshowImage[]
}

interface ApiDataSlideshowV1 extends ApiDataBlockBase {
  type: ApiDataBlockType.Slideshow
  content: [ContentSlideshowV1]
  alignment: 'center'
}
interface ApiDataSlideshowV2 extends ApiDataBlockBase {
  type: ApiDataBlockType.SlideshowV2
  content: [ContentSlideshowV2]
  alignment: 'center'
}

export type ApiDataSlideshow = ApiDataSlideshowV1 | ApiDataSlideshowV2

const Slideshow = ({ images }: { images: SlideshowImage[] }) => {
  const [showLightbox, setShowLightbox] = useState(false)
  const [focusImageIndex, setFocusImageIndex] = useState(0)
  // only works on device wider than tablet
  const [foldSlideshow, setFoldSlideshow] = useState(images.length > 9)

  const expandSlideshow = () => {
    setFoldSlideshow(false)
  }

  return (
    <>
      <div className={`slideshow-block ${foldSlideshow ? 'fold' : ''}`}>
        {images.map((image, i) => (
          <figure
            key={image.id}
            onClick={() => {
              if (window.innerWidth >= 768) {
                setShowLightbox(true)
                setFocusImageIndex(i)
              }
            }}
          >
            <CustomImage
              images={image.resized}
              imagesWebP={image.resizedWebp}
              alt={image.name}
            />
            <figcaption>{image.desc}</figcaption>
          </figure>
        ))}
        {showLightbox && (
          <Lightbox
            images={images}
            focusImageIndex={focusImageIndex}
            setFocusImageIndedx={setFocusImageIndex}
            setShowLightbox={setShowLightbox}
          />
        )}
        {foldSlideshow && (
          <div
            className="mask"
            onClick={() => {
              expandSlideshow()
            }}
          ></div>
        )}
      </div>
      {foldSlideshow && (
        <div
          className="slideshow-unfold-hint"
          onClick={() => {
            expandSlideshow()
          }}
        >
          <div className="text">展開所有圖片</div>
          <div className="icon">
            <Image
              src="/icons/icon-slideshow-expand-arrow.png"
              width={13}
              height={13}
              alt="expand slideshow icon"
            />
          </div>
        </div>
      )}
    </>
  )
}

export default function SlideshowBlock({
  apiDataBlock,
}: {
  apiDataBlock: ApiDataSlideshow
}) {
  switch (apiDataBlock.type) {
    case ApiDataBlockType.Slideshow: {
      const images = apiDataBlock.content[0]
      return <Slideshow images={images} />
    }
    case ApiDataBlockType.SlideshowV2: {
      const images = apiDataBlock.content[0].images
      return <Slideshow images={images} />
    }
    default:
      return null
  }
}
