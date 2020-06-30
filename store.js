import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'

import files from './slices/files'

const prod = process.env.NODE_ENV === 'production'

const middleware = getDefaultMiddleware()

const reducer = { files }

const devTools = !prod

export default configureStore({ devTools, reducer, middleware })
