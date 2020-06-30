import { createSlice } from '@reduxjs/toolkit'

export const files = {}

const { actions, reducer } = createSlice({
  name: 'files',
  initialState: { paths: [] },
  reducers: {
    addPaths: (state, { payload }) => {
      const { path } = payload
      if (!state.paths.includes(path)) state.paths.push(payload)
    },
  },
})

export const getPaths = (state) => state.files.paths

export const { addPaths } = actions

export default reducer
