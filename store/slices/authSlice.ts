import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface User {
  id: string
  email: string
  name?: string
  role?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload
      state.isAuthenticated = !!action.payload
    },
  },
})

export const { setUser } = authSlice.actions
export default authSlice.reducer
