<template>
  <div class="login-container">
    <div class="login-left">
      <div class="welcome-wrapper">
        <h1>Welcome Back!</h1>
      </div>
    </div>

    <div class="login-right">
      <div class="login-header">
        <h2>Login</h2>
        <p class="subtitle">Welcome back! Please login to your account.</p>
      </div>
      <div class="form-container">
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="username">Username or Email</label>
            <input id="username" v-model="userName" type="text" placeholder="username or email" required />
          </div>

          <div class="form-group password-group">
            <label for="password">Password</label>
            <div class="password-input">
              <input id="password" v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="••••••••"
                required />
              <span class="toggle-icon" @click="togglePassword">
                <img v-if="!showPassword" src="/icons/eye-closed.ico" alt="Show password" />
                <img v-else src="/icons/eye-open.ico" alt="Hide password" />
              </span>
            </div>
          </div>

          <div class="form-bottom">
            <div class="remember-me">
              <input type="checkbox" id="rememberMe" />
              <label for="rememberMe">Remember Me</label>
            </div>
            <a href="#" class="forgot-password">Forgot Password?</a>
          </div>

          <button type="submit" class="login-btn">Login</button>
        </form>

        <p class="register-prompt">
          New User?
          <router-link to="/register">Signup</router-link>
        </p>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { loginUser } from '../api/services/authService'
import { LoginPayload } from '@/types/auth/LoginPayload'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'LoginView',
  setup() {
    const userName = ref('')
    const password = ref('')
    const showPassword = ref(false)
    const errorMessage = ref('')
    const router = useRouter()
    const store = useStore()

    const validateUserName = (value: string): boolean => {
      if (value.includes('@')) {
        const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/
        return emailRegex.test(value)
      } else {
        return value.trim().length >= 3
      }
    }

    const handleLogin = async () => {
      errorMessage.value = ''

      if (!userName.value || !password.value) {
        errorMessage.value = 'Please fill in all fields.'
        return
      }

      if (!validateUserName(userName.value)) {
        errorMessage.value =
          'Please enter a valid email or username (minimum 3 characters).'
        return
      }

      try {
        const payload: LoginPayload = {
          nameOrEmail: userName.value,
          password: password.value
        }
        const data = await loginUser(payload)
        localStorage.setItem('token', data.token)
        await store.dispatch('auth/fetchUser')
        router.push({ name: 'home' })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error('Login error:', error)
        errorMessage.value =
          error.response?.data?.message || 'Помилка при вході користувача.'
      }
    }

    const togglePassword = () => {
      showPassword.value = !showPassword.value
    }

    return {
      userName,
      password,
      showPassword,
      togglePassword,
      handleLogin,
      errorMessage
    }
  }
})
</script>

<style scoped>
.login-container {
  display: flex;
  height: 100vh;
  font-family: sans-serif;
}

.login-left {
  flex: 1;
  background: linear-gradient(to bottom right, #f39c12, #8e44ad);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-grow: 1;
}

.welcome-wrapper {
  text-align: left;
  padding: 2rem;
  font-size: 3.5rem;
  margin-left: 1em;
}

.login-right {
  flex: 1;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-header {
  max-width: 350px;
  width: 100%;
  margin: 0 auto 1rem auto;
  text-align: left;
}

.login-header h2 {
  font-size: 2rem;
  margin: 0;
}

.form-container {
  max-width: 350px;
  width: 100%;
  margin: 0 auto;
}

.subtitle {
  margin-bottom: 2rem;
  color: var(--gray-color);
  text-align: left;
  font-size: 1.2rem;
}

.form-group {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.5rem;
  font-weight: 600;
  text-align: left;
  font-size: 1.2rem;
  color: var(--gray-color);
}

.form-group input {
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.password-group {
  position: relative;
}

.password-input {
  display: flex;
  align-items: center;
  position: relative;
}

.password-input input {
  flex: 1;
  padding-right: 2.5rem;
}

.toggle-icon {
  position: absolute;
  right: 0.75rem;
  cursor: pointer;
  display: none;
  align-items: center;
  justify-content: center;
}

.toggle-icon img {
  width: 20px;
  height: 20px;
}

.password-input:hover .toggle-icon,
.password-input:focus-within .toggle-icon {
  display: flex;
}

.form-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.remember-me {
  display: flex;
  align-items: center;
}

.remember-me input {
  margin-right: 0.25rem;
}

.forgot-password {
  text-decoration: none;
  color: #8e44ad;
  font-weight: 600;
}

.login-btn {
  width: 100%;
  padding: 0.75rem;
  background-color: #8e44ad;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

.login-btn:hover {
  opacity: 0.9;
}

.register-prompt {
  margin-top: 1.5rem;
  text-align: left;
}

.register-prompt a {
  color: #8e44ad;
  font-weight: 600;
  text-decoration: none;
}

.error {
  color: red;
  margin-top: 1rem;
  font-weight: bold;
  text-align: center;
}

input[type="password"]::-ms-reveal {
  display: none;
}
</style>
