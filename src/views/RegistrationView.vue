<template>
  <div class="register-container">
    <div class="register-left">
      <div class="welcome-wrapper">
        <h1>Welcome!</h1>
      </div>
    </div>

    <div class="register-right">
      <div class="register-header">
        <h2>Register</h2>
        <p class="subtitle">Create your account.</p>
      </div>
      <div class="form-container">
        <form @submit.prevent="handleRegister">
          <div class="form-group">
            <label for="name">Name</label>
            <input id="name" v-model="name" type="text" placeholder="Your Name" required />
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input id="email" v-model="email" type="email" placeholder="your@email.com" required />
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
          <button type="submit" class="register-btn">Register</button>
        </form>
        <p class="register-prompt">
          Already have an account?
          <router-link to="/login">Login here</router-link>
        </p>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { registerUser } from '../api/services/authService'
import { RegisterPayload } from '@/types/auth/RegisterPayload'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'RegisterView',
  setup() {
    const name = ref('')
    const email = ref('')
    const password = ref('')
    const showPassword = ref(false)
    const errorMessage = ref('')
    const router = useRouter()
    const store = useStore()

    const handleRegister = async () => {
      try {
        const payload: RegisterPayload = {
          name: name.value,
          email: email.value,
          password: password.value
        }
        const data = await registerUser(payload)
        console.log('User registered successfully:', data)
        localStorage.setItem('token', data.token)
        await store.dispatch('auth/fetchUser')
        router.push({ name: 'home' })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error('Registration error:', error)
        errorMessage.value =
          error.response?.data?.message || 'Помилка при реєстрації користувача.'
      }
    }

    const togglePassword = () => {
      showPassword.value = !showPassword.value
    }

    return {
      name,
      email,
      password,
      showPassword,
      togglePassword,
      handleRegister,
      errorMessage
    }
  }
})
</script>

<style scoped>
.register-container {
  display: flex;
  height: 100vh;
  font-family: sans-serif;
}

.register-left {
  flex: 1;
  background: linear-gradient(to bottom right, #1e3c72, #2a5298);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.welcome-wrapper {
  text-align: left;
  padding: 2rem;
  font-size: 3.5rem;
  margin-left: 1em;
}

.register-right {
  flex: 1;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.register-header {
  max-width: 350px;
  width: 100%;
  margin: 0 auto 1rem;
  text-align: left;
}

.register-header h2 {
  font-size: 2rem;
  margin: 0;
}

.subtitle {
  margin-bottom: 2rem;
  color: var(--gray-color, #7f8c8d);
  width: 350px;
  text-align: left;
  font-size: 1.2rem;
}

.form-container {
  max-width: 350px;
  width: 100%;
  margin: 0 auto;
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
  color: var(--gray-color, #7f8c8d);
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

.register-btn {
  width: 100%;
  padding: 0.75rem;
  background-color: #8e44ad;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

.register-btn:hover {
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
