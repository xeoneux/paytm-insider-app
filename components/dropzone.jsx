import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { addPaths, files } from '../slices/files'

const Container = styled.main`
  position: absolute;
  height: 100%;
  width: 100%;
`

function Dropzone({ children }) {
  const dispatch = useDispatch()
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((acceptedFile) => {
      /**
       * Convert files to data strings for preview using the FileReader API
       */
      const reader = new FileReader()

      reader.onload = ({ target }) => {
        /**
         * Construct image tag instance to reject images with width or height smaller than 1024
         */
        const image = new Image()
        image.src = target.result

        image.onload = () => {
          const { height, width } = image
          if (height >= 1024 && width >= 1024) {
            acceptedFile.preview = target.result
            const { path } = acceptedFile
            files[path] = acceptedFile
            dispatch(addPaths({ height, path, width }))
          }
        }
      }

      reader.readAsDataURL(acceptedFile)
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    accept: 'image/*',
    multiple: true,
    noClick: true,
    noKeyboard: true,
    onDrop,
  })

  return (
    <Container {...getRootProps()}>
      <section className="hero is-warning has-text-centered">
        <div className="hero-body">
          <div className="container">
            <h1 className="title">
              {isDragActive
                ? 'Yes, just drop them here so that we can begin cropping...'
                : 'Drag your images to be cropped anywhere on the page!'}
            </h1>
            <h2 className="subtitle">
              {isDragReject
                ? "Some files are not images, please make sure you're uploading only images!"
                : 'Make sure that both the dimensions are greater than 1024 pixels'}
            </h2>
          </div>
        </div>
      </section>
      <input {...getInputProps()} />
      {children}
    </Container>
  )
}

export default Dropzone
