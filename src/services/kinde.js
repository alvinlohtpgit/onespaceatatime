import createKindeClient from '@kinde-oss/kinde-auth-pkce-js'

class KindeService {
  constructor() {
    this.client = null
    this.initialized = false
  }

  async init() {
    if (this.initialized) return this.client

    this.client = await createKindeClient({
      client_id: import.meta.env.VITE_KINDE_CLIENT_ID,
      domain: import.meta.env.VITE_KINDE_DOMAIN,
      redirect_uri: import.meta.env.VITE_KINDE_REDIRECT_URI,
      logout_uri: import.meta.env.VITE_KINDE_LOGOUT_URI,
    })

    this.initialized = true
    return this.client
  }

  async login() {
    const client = await this.init()
    await client.login()
  }

  async register() {
    const client = await this.init()
    await client.register()
  }

  async logout() {
    const client = await this.init()
    await client.logout()
  }

  async handleCallback() {
    const client = await this.init()
    const url = new URL(window.location.href)
    const searchParams = new URLSearchParams(url.search)
    
    if (searchParams.has('code')) {
      await client.handleRedirectToApp({
        url: window.location.href
      })
      return true
    }
    return false
  }

  async getUser() {
    const client = await this.init()
    return await client.getUser()
  }

  async getToken() {
    const client = await this.init()
    const token = await client.getToken()
    
    // Check if token needs refresh
    if (this.isTokenExpired(token)) {
      await this.refreshToken()
      return await client.getToken()
    }
    
    return token
  }

  async isAuthenticated() {
    const client = await this.init()
    const authenticated = await client.isAuthenticated()
    
    if (authenticated) {
      // Check if token is still valid
      const token = await client.getToken()
      if (this.isTokenExpired(token)) {
        try {
          await this.refreshToken()
          return await client.isAuthenticated()
        } catch (error) {
          console.error('Token refresh failed:', error)
          return false
        }
      }
    }
    
    return authenticated
  }

  isTokenExpired(token) {
    if (!token) return true
    
    try {
      // Decode token payload
      const payload = JSON.parse(atob(token.split('.')[1]))
      const exp = payload.exp * 1000 // Convert to milliseconds
      const now = Date.now()
      const buffer = 60000 // 1 minute buffer
      
      return now >= (exp - buffer)
    } catch (error) {
      console.error('Error checking token expiry:', error)
      return true
    }
  }

  async refreshToken() {
    const client = await this.init()
    
    try {
      // Kinde SDK handles token refresh internally
      await client.refreshTokens()
    } catch (error) {
      console.error('Failed to refresh token:', error)
      throw error
    }
  }

  async getUsername() {
    const user = await this.getUser()
    return user?.given_name || user?.email?.split('@')[0] || 'user'
  }

  async getUserId() {
    const user = await this.getUser()
    return user?.id || null
  }
}

export const kindeService = new KindeService()