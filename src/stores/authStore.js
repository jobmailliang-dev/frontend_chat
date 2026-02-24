import { defineStore } from 'pinia';
import { getUserIdentity, initializeIdentity } from '@/utils/auth';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    userType: 'anonymous' // 默认为匿名用户
  }),

  getters: {
    /**
     * 获取用户ID
     */
    getUserId: (state) => state.user?.id || null,

    /**
     * 获取用户名
     */
    getUserName: (state) => state.user?.name || null,

    /**
     * 获取用户类型
     */
    getUserType: (state) => state.user?.type || 'anonymous',

    /**
     * 检查是否为匿名用户
     */
    isAnonymous: (state) => state.user?.type === 'anonymous',

    /**
     * 检查是否为真实用户
     */
    isRealUser: (state) => state.user?.type === 'real'
  },

  actions: {
    /**
     * 初始化用户身份
     */
    initializeUser() {
      const identity = initializeIdentity();
      this.setUser(identity);
    },

    /**
     * 设置用户信息
     */
    setUser(userData) {
      this.user = userData;
      this.isAuthenticated = true;
      this.userType = userData.type;
    },

    /**
     * 获取用户身份信息（统一的API，适用于匿名和真实用户）
     */
    getUserIdentity() {
      if (!this.user) {
        this.initializeUser();
      }
      return this.user;
    },

    /**
     * 登出用户
     */
    logout() {
      this.user = null;
      this.isAuthenticated = false;
      this.userType = 'anonymous';
    }
  }
});