// store/modules/auth.ts
import { Module } from 'vuex'
import { getUser } from '@/api/services/authService'
import { RootState } from '@/store' // кореневий тип стану вашого store

export interface AuthState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: Record<string, any> | null
}

const auth: Module<AuthState, RootState> = {
  namespaced: true,
  state: {
    user: null
  },
  mutations: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SET_USER(state, user: Record<string, any>) {
      state.user = user
    },
    CLEAR_USER(state) {
      state.user = null
    }
  },
  actions: {
    async fetchUser({ commit }) {
      try {
        const data = await getUser()
        commit('SET_USER', data)
      } catch (error) {
        commit('CLEAR_USER')
      }
    },
    clearUser({ commit }) {
      commit('CLEAR_USER')
    }
  }
}

export default auth
