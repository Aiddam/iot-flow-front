<template>
  <div class="home-layout">
    <aside class="sidebar" :class="{ collapsed: isCollapsed }">
      <div class="toggle-btn" @click="toggleSidebar">
        <span v-if="isCollapsed">&gt;</span>
        <span v-else>&lt;</span>
      </div>
      <div class="sidebar-content">
        <transition name="menu-fade">
          <div class="menu" v-show="!isCollapsed">
            <div class="logo">IoT Diploma</div>
            <nav class="nav-menu">
              <ul>
                <li>
                  <router-link to="/dashboard">
                    <img src="/icons/dashboard-2.ico" alt="Dashboard icon" class="menu-icon" />
                    <span>Dashboard</span>
                  </router-link>
                </li>
                <li>
                  <router-link to="/devices">
                    <img src="/icons/device.ico" alt="Devices icon" class="menu-icon" />
                    <span>Devices</span>
                  </router-link>
                </li>
                <li>
                  <router-link to="/about">
                    <img src="/icons/about.png" alt="About icon" class="menu-icon" />
                    <span>About</span>
                  </router-link>
                </li>
                <li>
                  <router-link to="/settings">
                    <img src="/icons/settings.ico" alt="Settings icon" class="menu-icon" />
                    <span>Settings</span>
                  </router-link>
                </li>
              </ul>
            </nav>
          </div>
        </transition>
        <transition name="menu-fade">
          <div class="user-section" v-show="!isCollapsed">
            <div class="user-info">
              <img src="/icons/user.ico" alt="User icon" class="user-icon" />
              <span>{{ $store.state.auth.user?.name }}</span>
            </div>
            <button class="logout-button" @click="logout">Log Out</button>
          </div>
        </transition>
      </div>
    </aside>
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'LayoutView',
  setup() {
    const router = useRouter()
    const isCollapsed = ref(false)
    const store = useStore()

    function toggleSidebar() {
      isCollapsed.value = !isCollapsed.value
    }

    async function logout() {
      localStorage.removeItem('token')
      router.push('/login')
      await store.dispatch('auth/clearUser')
    }

    return { isCollapsed, toggleSidebar, logout }
  }
})
</script>

<style scoped>
.home-layout {
  display: flex;
  height: 100vh;
  margin: 0;
  background-color: #f9f9f9;
}

.sidebar {
  width: 250px;
  background-color: #ffffff;
  border-right: 1px solid #ddd;
  position: relative;
  transition: width 0.3s ease, padding 0.3s ease;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.sidebar.collapsed {
  width: 60px;
  padding: 20px 5px;
}

.toggle-btn {
  position: absolute;
  top: 50%;
  right: -15px;
  width: 30px;
  height: 30px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transform: translateY(-50%);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
}

.logo {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #333;
}

.nav-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-menu li {
  margin-bottom: 1rem;
}

.nav-menu a {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #333;
  font-size: 18px;
  transition: background-color 0.2s, color 0.2s;
  padding: 8px;
  border-radius: 4px;
}

.nav-menu a:hover {
  background-color: #f0f0f0;
  color: #42b983;
}

/* Highlight active link */
.nav-menu a.router-link-exact-active {
  background-color: #f0f0f0;
  color: #42b983;
}

.menu-icon {
  width: 28px;
  height: 28px;
  margin-right: 10px;
}

.user-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #ddd;
  padding-top: 15px;
}

.user-info {
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 8px;
}

.user-icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.logout-button {
  background-color: #42b983;
  color: #fff;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.logout-button:hover {
  background-color: #369f75;
}

.menu-fade-enter-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.menu-fade-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.menu-fade-enter-to {
  opacity: 1;
  transform: translateX(0);
}

.menu-fade-leave-active {
  transition: none;
}

.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}
</style>
