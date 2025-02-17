import { createStore } from 'vuex'
import auth, { AuthState } from './modules/authStore'

export interface RootState {
  auth: AuthState
}

export default createStore<RootState>({
  modules: {
    auth
  }
})
