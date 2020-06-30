import dynamic from 'next/dynamic'

import Listing from '../components/listing'

const Dropzone = dynamic(() => import('../components/dropzone'), { ssr: false })

function Home() {
  return (
    <Dropzone>
      <Listing />
    </Dropzone>
  )
}

export default Home
