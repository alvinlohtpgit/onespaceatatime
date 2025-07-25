<template>
  <div class="landing-layout">
    <!-- Navigation -->
    <nav class="navbar">
      <div class="nav-container">
        <div class="logo">
          <h2>One Thing at a Time</h2>
        </div>
        <div class="nav-links">
          <router-link v-if="!isLoggedIn" to="/login" class="nav-link">Login</router-link>
          <router-link v-if="isLoggedIn" to="/dashboard" class="nav-link">My Dashboard</router-link>
          <router-link v-if="!isLoggedIn" to="/register" class="btn-nav-cta">Start Free Trial</router-link>
        </div>
      </div>
    </nav>

    <main class="landing-content">
      <div class="content-area">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-container">
          <div class="hero-content">
            <h1 class="hero-title">
              Stop drowning in tasks.<br>
              <span class="highlight">Start accomplishing them.</span>
            </h1>
            <p class="hero-subtitle">
              The average knowledge worker switches tasks 31 times per day, losing 23 minutes of focus each time. 
              One Thing at a Time is the only task manager designed to protect your focus, not fragment it.
            </p>
            <div class="hero-cta">
              <router-link v-if="!isLoggedIn" to="/register" class="btn btn-primary btn-large">
                Start Your 14-Day Free Trial
              </router-link>
              <router-link v-if="isLoggedIn" to="/dashboard" class="btn btn-primary btn-large">
                Go to Dashboard
              </router-link>
              <p v-if="!isLoggedIn" class="trial-note">No credit card required • Cancel anytime</p>
            </div>
          </div>
          <div class="hero-visual">
            <div class="app-mockup">
              <div class="doing-now-box">
                <span class="label">DOING NOW</span>
                <h3>Finish quarterly report</h3>
                <div class="task-context">
                  <p><strong>Next Action:</strong> Add revenue charts</p>
                  <p><strong>Why this matters:</strong> Board meeting tomorrow</p>
                </div>
                <div class="timer-preview">
                  <span class="timer">23:42</span>
                  <span class="timer-label">Focus Time</span>
                </div>
              </div>
              <div class="blurred-tasks">
                <div class="blurred-task"></div>
                <div class="blurred-task"></div>
                <div class="blurred-task"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Problem Section -->
      <section class="problem-section">
        <div class="container">
          <h2 class="section-title">Your productivity tools are making you less productive</h2>
          <div class="problem-grid">
            <div class="problem-stat">
              <div class="stat-number">31x</div>
              <p>Daily task switches killing your deep work</p>
            </div>
            <div class="problem-stat">
              <div class="stat-number">23min</div>
              <p>Lost after each interruption trying to refocus</p>
            </div>
            <div class="problem-stat">
              <div class="stat-number">40%</div>
              <p>Drop in productivity from constant context switching</p>
            </div>
          </div>
          <p class="problem-summary">
            Traditional task managers show you everything at once, triggering anxiety and decision paralysis. 
            You're not broken—your tools are.
          </p>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features-section">
        <div class="container">
          <h2 class="section-title">Finally, a task manager that respects your brain</h2>
          
          <div class="feature-block feature-left">
            <div class="feature-visual">
              <div class="feature-mockup focus-mode">
                <div class="focus-header">FOCUS LOCK ACTIVE</div>
                <div class="single-task">
                  <h4>Write API documentation</h4>
                  <p>Everything else is hidden until you're done</p>
                </div>
                <div class="lock-icon">🔒</div>
              </div>
            </div>
            <div class="feature-content">
              <h3>Focus Lock™ Mode</h3>
              <p>One click hides everything except your current task. No peeking, no distractions, no temptation to switch. It's like noise-canceling headphones for your to-do list.</p>
            </div>
          </div>

          <div class="feature-block feature-right">
            <div class="feature-content">
              <h3>Context-Aware Tasks</h3>
              <p>Every task shows your next concrete action and why it matters. No more staring at "Write report" wondering where to start or why you're doing it.</p>
            </div>
            <div class="feature-visual">
              <div class="feature-mockup context-mockup">
                <h4>Update website copy</h4>
                <div class="context-fields">
                  <p><span>Next Action:</span> Review competitor sites</p>
                  <p><span>Why this matters:</span> 30% bounce rate on homepage</p>
                </div>
              </div>
            </div>
          </div>

          <div class="feature-block feature-left">
            <div class="feature-visual">
              <div class="feature-mockup ai-mockup">
                <div class="ai-suggestion">
                  <span class="ai-icon">✨</span>
                  <p>"You've been on this task for 47 minutes. Time for a 5-minute break?"</p>
                  <button>Take Break</button>
                </div>
              </div>
            </div>
            <div class="feature-content">
              <h3>Adaptive AI Assistant</h3>
              <p>Learns your focus patterns and gently nudges you toward better habits. Suggests optimal work sessions, break times, and even helps break down overwhelming tasks.</p>
            </div>
          </div>

          <div class="feature-grid">
            <div class="feature-card">
              <div class="feature-icon">🎯</div>
              <h4>Smart Prioritization</h4>
              <p>AI analyzes deadlines, importance, and your patterns to surface the right task at the right time</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">⏱️</div>
              <h4>Adaptive Pomodoro</h4>
              <p>Discovers your optimal focus duration and automatically adjusts timer settings</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">📱</div>
              <h4>Works Offline</h4>
              <p>Your focus doesn't depend on WiFi. Everything syncs when you're back online</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Social Proof Section -->
      <section class="testimonials-section">
        <div class="container">
          <h2 class="section-title">Join 10,000+ professionals who've reclaimed their focus</h2>
          <div class="testimonials-grid">
            <div class="testimonial">
              <p>"I went from 12-hour scattered days to 6-hour focused ones. This app literally gave me my evenings back."</p>
              <div class="author">
                <strong>Sarah Chen</strong>
                <span>Product Manager at Stripe</span>
              </div>
            </div>
            <div class="testimonial">
              <p>"ADHD nightmare solved. Focus Lock is the only thing that stops me from jumping between 20 tabs."</p>
              <div class="author">
                <strong>Alex Kumar</strong>
                <span>Senior Developer</span>
              </div>
            </div>
            <div class="testimonial">
              <p>"The AI suggestions are scary accurate. It knows when I'm procrastinating before I do."</p>
              <div class="author">
                <strong>Maria Rodriguez</strong>
                <span>Freelance Designer</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Pricing Section -->
      <section class="pricing-section">
        <div class="container">
          <h2 class="section-title">Simple pricing for focused minds</h2>
          <div class="pricing-cards">
            <div class="pricing-card">
              <h3>Personal</h3>
              <div class="price">
                <span class="amount">$8</span>
                <span class="period">/month</span>
              </div>
              <ul class="features-list">
                <li>✓ Unlimited tasks</li>
                <li>✓ Focus Lock™ mode</li>
                <li>✓ Adaptive Pomodoro timer</li>
                <li>✓ AI task recommendations</li>
                <li>✓ Offline sync</li>
                <li>✓ All future features</li>
              </ul>
              <router-link to="/register" class="btn btn-primary btn-full">
                Start 14-Day Free Trial
              </router-link>
            </div>
            <div class="pricing-card featured">
              <div class="badge">MOST POPULAR</div>
              <h3>Team</h3>
              <div class="price">
                <span class="amount">$6</span>
                <span class="period">/user/month</span>
              </div>
              <ul class="features-list">
                <li>✓ Everything in Personal</li>
                <li>✓ Team focus analytics</li>
                <li>✓ Shared focus sessions</li>
                <li>✓ Admin dashboard</li>
                <li>✓ Priority support</li>
                <li>✓ SSO integration</li>
              </ul>
              <router-link to="/register" class="btn btn-primary btn-full">
                Start Team Trial
              </router-link>
            </div>
          </div>
          <p class="pricing-note">
            14-day free trial • No credit card required • Cancel anytime
          </p>
        </div>
      </section>

      <!-- Final CTA -->
      <section class="final-cta-section">
        <div class="container">
          <h2>Ready to actually finish what you start?</h2>
          <p>Join thousands who've stopped managing tasks and started completing them.</p>
          <router-link to="/register" class="btn btn-primary btn-large">
            Start Your Free 14-Day Trial
          </router-link>
          <p class="guarantee">30-day money-back guarantee • No questions asked</p>
        </div>
      </section>

      <!-- Footer -->
      <footer class="footer">
        <div class="container">
          <p>&copy; 2024 One Thing at a Time. Focus on what matters.</p>
        </div>
      </footer>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const isAuthenticated = ref(false)

// Check authentication status on mount
onMounted(async () => {
  await authStore.checkAuth()
  isAuthenticated.value = authStore.isAuthenticated
})

// Watch for auth changes
const isLoggedIn = computed(() => authStore.isAuthenticated)
</script>

<style scoped>
/* Base styles */
.landing-layout {
  min-height: 100vh;
  background-color: #ffffff;
  color: #262626;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.landing-content {
  padding: 2rem;
}

.content-area {
  min-width: 1200px;
  max-width: 1400px;
  margin: 0 auto;
}

.container {
  min-width: 1200px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Navigation */
.navbar {
  position: sticky;
  top: 0;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;
  z-index: 100;
  padding: 1rem 0;
}

.nav-container {
  min-width: 1200px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo h2 {
  font-size: 1.5rem;
  color: #262626;
  margin: 0;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  color: #262626;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-link:hover {
  color: #ffa90a;
}

.btn-nav-cta {
  background: #ffa90a;
  color: #ffffff;
  padding: 0.5rem 1.5rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-nav-cta:hover {
  background: #ff9500;
  transform: translateY(-1px);
}

/* Hero Section */
.hero-section {
  padding: 5rem 0;
  background: linear-gradient(to bottom, #ffffff, #fafafa);
}

.hero-container {
  min-width: 1200px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.hero-title {
  font-size: 3.5rem;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  font-weight: 800;
  color: #262626;
}

.highlight {
  color: #ffa90a;
}

.hero-subtitle {
  font-size: 1.25rem;
  line-height: 1.6;
  color: #666666;
  margin-bottom: 2rem;
}

.hero-cta {
  margin-top: 2rem;
}

.btn {
  display: inline-block;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;
  cursor: pointer;
  border: none;
}

.btn-primary {
  background: #ffa90a;
  color: #ffffff;
}

.btn-primary:hover {
  background: #ff9500;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 169, 10, 0.3);
}

.btn-large {
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
}

.trial-note {
  margin-top: 1rem;
  color: #999999;
  font-size: 0.9rem;
}

/* App Mockup */
.app-mockup {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  max-width: 400px;
  margin: 0 auto;
}

.doing-now-box {
  background: #fff9f0;
  border: 2px solid #ffd793;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.doing-now-box .label {
  color: #ffa90a;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 1px;
}

.doing-now-box h3 {
  margin: 0.5rem 0 1rem 0;
  color: #262626;
  font-size: 1.5rem;
}

.task-context p {
  margin: 0.5rem 0;
  font-size: 0.9rem;
  color: #666666;
}

.task-context strong {
  color: #262626;
}

.timer-preview {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #ffd793;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.timer {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffa90a;
}

.timer-label {
  color: #999999;
  font-size: 0.9rem;
}

.blurred-tasks {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.blurred-task {
  height: 50px;
  background: #f5f5f5;
  border-radius: 6px;
  position: relative;
  overflow: hidden;
}

.blurred-task::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(4px);
}

/* Problem Section */
.problem-section {
  padding: 5rem 0;
  background: #ffffff;
}

.section-title {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
  color: #262626;
  font-weight: 700;
}

.problem-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-bottom: 3rem;
}

.problem-stat {
  text-align: center;
}

.stat-number {
  font-size: 3rem;
  font-weight: 800;
  color: #ffa90a;
  margin-bottom: 0.5rem;
}

.problem-stat p {
  color: #666666;
  font-size: 1.1rem;
}

.problem-summary {
  text-align: center;
  font-size: 1.25rem;
  color: #666666;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Features Section */
.features-section {
  padding: 5rem 0;
  background: #fafafa;
}

.feature-block {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  margin-bottom: 5rem;
}

.feature-block.feature-right {
  direction: rtl;
}

.feature-block.feature-right > * {
  direction: ltr;
}

.feature-content h3 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #262626;
}

.feature-content p {
  font-size: 1.15rem;
  color: #666666;
  line-height: 1.6;
}

.feature-mockup {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  max-width: 350px;
  margin: 0 auto;
}

.focus-mode {
  text-align: center;
}

.focus-header {
  color: #ffa90a;
  font-weight: 700;
  font-size: 0.8rem;
  letter-spacing: 1px;
  margin-bottom: 1rem;
}

.single-task h4 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: #262626;
}

.single-task p {
  color: #999999;
  font-size: 0.9rem;
}

.lock-icon {
  font-size: 2rem;
  margin-top: 1rem;
}

.context-mockup h4 {
  margin-bottom: 1rem;
  color: #262626;
}

.context-fields p {
  margin: 0.5rem 0;
  font-size: 0.9rem;
  color: #666666;
}

.context-fields span {
  font-weight: 600;
  color: #262626;
}

.ai-suggestion {
  text-align: center;
  padding: 1rem;
}

.ai-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 1rem;
}

.ai-suggestion p {
  margin-bottom: 1rem;
  color: #262626;
}

.ai-suggestion button {
  background: #ffa90a;
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 3rem;
}

.feature-card {
  background: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.feature-card h4 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: #262626;
}

.feature-card p {
  color: #666666;
  font-size: 0.95rem;
}

/* Testimonials */
.testimonials-section {
  padding: 5rem 0;
  background: #ffffff;
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.testimonial {
  background: #fafafa;
  padding: 2rem;
  border-radius: 8px;
  border-left: 4px solid #ffd793;
}

.testimonial p {
  font-size: 1.1rem;
  color: #262626;
  margin-bottom: 1.5rem;
  font-style: italic;
}

.author strong {
  display: block;
  color: #262626;
  margin-bottom: 0.25rem;
}

.author span {
  color: #999999;
  font-size: 0.9rem;
}

/* Pricing */
.pricing-section {
  padding: 5rem 0;
  background: #fafafa;
}

.pricing-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto 2rem;
}

.pricing-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  position: relative;
  transition: transform 0.2s;
}

.pricing-card.featured {
  border: 2px solid #ffa90a;
  transform: scale(1.05);
}

.badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: #ffa90a;
  color: white;
  padding: 0.25rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.pricing-card h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #262626;
}

.price {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.amount {
  font-size: 3rem;
  font-weight: 700;
  color: #ffa90a;
}

.period {
  color: #999999;
}

.features-list {
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
}

.features-list li {
  padding: 0.75rem 0;
  color: #666666;
  border-bottom: 1px solid #f0f0f0;
}

.features-list li:last-child {
  border-bottom: none;
}

.btn-full {
  width: 100%;
  text-align: center;
}

.pricing-note {
  text-align: center;
  color: #999999;
}

/* Final CTA */
.final-cta-section {
  padding: 5rem 0;
  background: linear-gradient(135deg, #ffa90a 0%, #ffd793 100%);
  text-align: center;
  color: #ffffff;
}

.final-cta-section h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #ffffff;
}

.final-cta-section p {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.95;
}

.final-cta-section .btn {
  background: #ffffff;
  color: #ffa90a;
}

.guarantee {
  margin-top: 1rem;
  font-size: 0.9rem;
  opacity: 0.9;
}

/* Footer */
.footer {
  padding: 2rem 0;
  background: #262626;
  color: #999999;
  text-align: center;
}

/* Responsive Design */
@media (max-width: 1400px) {
  .nav-container,
  .container,
  .hero-container,
  .content-area {
    min-width: auto;
  }
}

@media (max-width: 1024px) {
  .hero-container,
  .feature-block {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .feature-block.feature-right {
    direction: ltr;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .problem-grid,
  .feature-grid,
  .testimonials-grid {
    grid-template-columns: 1fr;
  }
  
  .pricing-cards {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .landing-content {
    padding: 1rem;
  }
  
  .nav-container,
  .container,
  .hero-container {
    padding: 0 1rem;
  }
  
  .hero-section,
  .problem-section,
  .features-section,
  .testimonials-section,
  .pricing-section,
  .final-cta-section {
    padding: 3rem 0;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .section-title {
    font-size: 1.75rem;
  }
  
  .nav-links {
    gap: 1rem;
  }
  
  .btn-nav-cta {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
}
</style>