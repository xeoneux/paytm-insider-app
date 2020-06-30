import { saveAs } from 'file-saver'

export function getCroppedImage(source, crop, fileName) {
  const reader = new FileReader()

  reader.onload = ({ target }) => {
    const image = new Image()
    image.src = target.result

    image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = crop.originalWidth
      canvas.height = crop.originalHeight

      // Calculate based on percentages
      const ctx = canvas.getContext('2d')
      ctx.drawImage(
        image,
        (crop.x * image.width) / 100,
        (crop.y * image.height) / 100,
        (crop.width * image.width) / 100,
        (crop.height * image.height) / 100,
        0,
        0,
        crop.originalWidth,
        crop.originalHeight
      )

      canvas.toBlob((blob) => saveAs(blob, fileName), 'image/jpeg', 1)
    }
  }

  reader.readAsDataURL(source)
}
