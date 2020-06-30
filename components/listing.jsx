import React, { useEffect, useState } from 'react'
import ReactCrop from 'react-image-crop'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { getCroppedImage } from '../lib/cropper'
import { files, getPaths } from '../slices/files'

// Set defaults with axes for crops
const aspectRatios = {
  horizontal: [755, 450, { width: 100 }],
  vertical: [365, 450, { height: 100 }],
  horizontalSmall: [365, 212, { width: 100 }],
  gallery: [380, 380, { height: 100 }],
}

// Map aspect ratios to a default crops objects
const getDefaultCrops = () => {
  return Object.fromEntries(
    Object.entries(aspectRatios).map(([aspectType, aspectRatio]) => {
      const [width, height, initial] = aspectRatio
      return [
        aspectType,
        {
          aspect: width / height,
          keepSelection: true,
          originalHeight: height,
          originalWidth: width,
          unit: '%',
          ...initial,
        },
      ]
    })
  )
}

const Hello = styled.img`
  left: 50%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
`

const Figure = styled.figure`
  margin-bottom: 20px;
  margin-top: 20px;
`

function Listing() {
  const paths = useSelector(getPaths)
  const [crops, setCrops] = useState({})

  useEffect(() => {
    // Initialize default crops for new images
    paths.forEach(
      ({ path }) =>
        !crops[path] &&
        setCrops((crops) => ({
          ...crops,
          [path]: getDefaultCrops(),
        }))
    )
  }, [paths])

  return Object.entries(crops).length ? (
    Object.entries(crops).map(([cropPath, aspectRatios]) => (
      <section key={cropPath} className="level">
        {/* Preview the original image */}
        <div className="level-item has-text-centered">
          <Figure className="image" style={{ maxWidth: 256 }}>
            <img src={files[cropPath].preview} />
            <p>Original</p>
          </Figure>
        </div>

        {/* Iterate over aspect ratios inside crops */}
        {Object.entries(aspectRatios).map(([aspectType, aspectRatio]) => (
          <div key={cropPath + aspectType} className="level-item has-text-centered">
            <Figure className="image" style={{ maxWidth: 256 }}>
              <ReactCrop
                crop={aspectRatio}
                onChange={(_crop, percentCrop) => {
                  setCrops((crops) => ({
                    ...crops,
                    [cropPath]: {
                      ...crops[cropPath],
                      [aspectType]: { ...aspectRatio, ...percentCrop },
                    },
                  }))
                }}
                src={files[cropPath].preview}
              />
              <p>
                {aspectRatio.originalWidth} x {aspectRatio.originalHeight}
              </p>
            </Figure>
          </div>
        ))}

        {/* Button to upload all cropped images */}
        <div className="level-item has-text-centered">
          <button
            className="button is-warning"
            onClick={() => {
              Object.entries(aspectRatios).forEach(([aspectType, aspectRatio]) => {
                getCroppedImage(files[cropPath], aspectRatio, aspectType)
              })
            }}
          >
            Download All Crops
          </button>
        </div>
      </section>
    ))
  ) : (
    // Show a cute hello gif if no image is loaded :)
    <Hello src="/hello.gif" />
  )
}

export default Listing
