<template>
  <div class="landing-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">Stop Task Switching.<br>Start <span class="highlight">Focusing</span>.</h1>
          <p class="hero-subtitle">
            31.6 interruptions per day. 20% cognitive capacity lost per task switch. 
            It's time to reclaim your focus with the only to-do app designed for single-tasking.
          </p>
          <div class="cta-buttons">
            <Button 
              label="Start Free Trial" 
              icon="pi pi-play"
              @click="handleStartTrial"
              class="cta-primary"
              size="large"
            />
            <Button 
              label="See How It Works" 
              icon="pi pi-eye"
              @click="scrollToFeatures"
              class="cta-secondary"
              size="large"
              outlined
            />
          </div>
          <p class="trial-note">7-day free trial • No credit card required</p>
        </div>
        <div class="hero-visual">
          <div class="app-preview">
            <div class="doing-now-preview">
              <h3>Doing Now</h3>
              <div class="current-task">Finish quarterly report</div>
              <div class="task-details">
                <p><strong>Next Action:</strong> Add financial charts</p>
                <p><strong>Why this matters:</strong> Board presentation Friday</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Problem Section -->
    <section class="problem-section">
      <div class="container">
        <h2 class="section-title">The Hidden Cost of Task Switching</h2>
        <div class="problem-stats">
          <div class="stat-card">
            <div class="stat-number">31.6</div>
            <div class="stat-label">Daily interruptions per person</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">20%</div>
            <div class="stat-label">Cognitive capacity lost per switch</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">23</div>
            <div class="stat-label">Minutes to refocus after interruption</div>
          </div>
        </div>
        <p class="problem-description">
          Traditional to-do apps enable endless task switching, leaving you scattered and unproductive. 
          You're not lacking motivation—you're lacking focus.
        </p>
      </div>
    </section>

    <!-- Solution Section -->
    <section class="solution-section" ref="featuresSection">
      <div class="container">
        <h2 class="section-title">One Task. One Focus. Maximum Impact.</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <i class="pi pi-eye"></i>
            </div>
            <h3>Single-Task Focus</h3>
            <p>Only see your current task. Everything else disappears until you're done.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <i class="pi pi-lock"></i>
            </div>
            <h3>Focus Lock Mode</h3>
            <p>Lock yourself into the current task. No peeking at other items until completion.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <i class="pi pi-clock"></i>
            </div>
            <h3>Adaptive Pomodoro</h3>
            <p>AI learns your focus patterns and suggests optimal work/break durations.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <i class="pi pi-brain"></i>
            </div>
            <h3>Smart Nudging</h3>
            <p>Gentle suggestions when you're stuck, overwhelmed, or procrastinating.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <i class="pi pi-lightbulb"></i>
            </div>
            <h3>Context-Aware Notes</h3>
            <p>"Next Action" and "Why this matters" keep you motivated and clear.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <i class="pi pi-mobile"></i>
            </div>
            <h3>Offline-First</h3>
            <p>Works everywhere, syncs when connected. Your focus never depends on WiFi.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section class="pricing-section">
      <div class="container">
        <h2 class="section-title">Simple Pricing for Focused Minds</h2>
        <div class="pricing-cards">
          <div class="pricing-card">
            <div class="plan-name">Free</div>
            <div class="plan-price">$0<span class="price-period">/month</span></div>
            <ul class="plan-features">
              <li>Single-task focus</li>
              <li>Basic Pomodoro timer</li>
              <li>Up to 50 tasks</li>
              <li>Local storage only</li>
            </ul>
            <Button 
              label="Start Free" 
              @click="handleStartFree"
              class="plan-button plan-button-free"
              outlined
            />
          </div>
          <div class="pricing-card featured">
            <div class="popular-badge">Most Popular</div>
            <div class="plan-name">Focus Pro</div>
            <div class="plan-price">$8<span class="price-period">/month</span></div>
            <ul class="plan-features">
              <li>Everything in Free</li>
              <li>Focus Lock mode</li>
              <li>Adaptive Pomodoro with AI</li>
              <li>Smart nudging system</li>
              <li>Unlimited tasks</li>
              <li>Cloud sync across devices</li>
              <li>Priority support</li>
            </ul>
            <Button 
              label="Start 7-Day Trial" 
              @click="handleStartTrial"
              class="plan-button plan-button-pro"
            />
          </div>
          <div class="pricing-card">
            <div class="plan-name">Team</div>
            <div class="plan-price">$6<span class="price-period">/person/month</span></div>
            <ul class="plan-features">
              <li>Everything in Focus Pro</li>
              <li>Team insights dashboard</li>
              <li>Shared focus sessions</li>
              <li>Admin controls</li>
              <li>SSO integration</li>
            </ul>
            <Button 
              label="Contact Sales" 
              @click="handleContactSales"
              class="plan-button plan-button-team"
              outlined
            />
          </div>
        </div>
        <p class="pricing-note">All plans include 7-day free trial. Cancel anytime.</p>
      </div>
    </section>

    <!-- Social Proof Section -->
    <section class="social-proof-section">
      <div class="container">
        <h2 class="section-title">Join Thousands Who've Reclaimed Their Focus</h2>
        <div class="testimonials">
          <div class="testimonial">
            <div class="testimonial-content">
              "Finally, a to-do app that doesn't make me more scattered. I'm 3x more productive since switching."
            </div>
            <div class="testimonial-author">
              <strong>Sarah Chen</strong> • Product Manager
            </div>
          </div>
          <div class="testimonial">
            <div class="testimonial-content">
              "The Focus Lock feature is a game-changer. No more jumping between tasks when I get anxious."
            </div>
            <div class="testimonial-author">
              <strong>Marcus Rodriguez</strong> • Software Developer
            </div>
          </div>
          <div class="testimonial">
            <div class="testimonial-content">
              "My ADHD brain finally found its match. The smart nudging keeps me on track without being pushy."
            </div>
            <div class="testimonial-author">
              <strong>Alex Kim</strong> • Designer
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA Section -->
    <section class="final-cta-section">
      <div class="container">
        <h2>Ready to Focus Like Never Before?</h2>
        <p>Join thousands who've eliminated task switching and multiplied their productivity.</p>
        <Button 
          label="Start Your 7-Day Free Trial" 
          icon="pi pi-arrow-right"
          @click="handleStartTrial"
          class="final-cta-button"
          size="large"
        />
        <p class="final-note">No credit card required • Cancel anytime • Works offline</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'

const router = useRouter()
const featuresSection = ref(null)

const scrollToFeatures = () => {
  featuresSection.value?.scrollIntoView({ 
    behavior: 'smooth',
    block: 'start'
  })
}

const handleStartTrial = () => {
  router.push('/register?trial=true')
}

const handleStartFree = () => {
  router.push('/register?plan=free')
}

const handleContactSales = () => {
  window.open('mailto:sales@onethingatatime.com?subject=Team Plan Inquiry', '_blank')
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.landing-page {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  line-height: 1.6;
  color: #262626;
  background: #ffffff;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  color: #262626;
  margin-bottom: 3rem;
  line-height: 1.2;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #fff9e6 0%, #ffffff 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  color: #262626;
  margin-bottom: 1.5rem;
  line-height: 1.1;
}

.highlight {
  color: #ffa90a;
  position: relative;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: #999999;
  margin-bottom: 2rem;
  line-height: 1.5;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.cta-primary {
  background: #ffa90a !important;
  border: none !important;
  color: white !important;
  padding: 1rem 2rem !important;
  font-weight: 600 !important;
  border-radius: 8px !important;
  transition: all 0.3s ease !important;
}

.cta-primary:hover {
  background: #e6960a !important;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 169, 10, 0.3) !important;
}

.cta-secondary {
  color: #ffa90a !important;
  border: 2px solid #ffa90a !important;
  background: transparent !important;
  padding: 1rem 2rem !important;
  font-weight: 600 !important;
  border-radius: 8px !important;
  transition: all 0.3s ease !important;
}

.cta-secondary:hover {
  background: #ffa90a !important;
  color: white !important;
  transform: translateY(-2px);
}

.trial-note {
  color: #999999;
  font-size: 0.9rem;
  margin: 0;
}

.hero-visual {
  display: flex;
  justify-content: center;
  align-items: center;
}

.app-preview {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 400px;
}

.doing-now-preview h3 {
  color: #ffa90a;
  margin-bottom: 1rem;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
}

.current-task {
  font-size: 1.5rem;
  font-weight: 600;
  color: #262626;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #ffd793;
  border-radius: 8px;
}

.task-details p {
  margin: 0.5rem 0;
  color: #999999;
  font-size: 0.9rem;
}

/* Problem Section */
.problem-section {
  padding: 6rem 0;
  background: #f8f9fa;
}

.problem-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.stat-number {
  font-size: 3rem;
  font-weight: 800;
  color: #ffa90a;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #999999;
  font-weight: 500;
}

.problem-description {
  font-size: 1.25rem;
  text-align: center;
  color: #262626;
  max-width: 600px;
  margin: 0 auto;
}

/* Solution Section */
.solution-section {
  padding: 6rem 0;
  background: white;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.feature-card {
  padding: 2rem;
  border-radius: 12px;
  background: #fff9e6;
  border: 1px solid #ffd793;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(255, 169, 10, 0.15);
}

.feature-icon {
  width: 60px;
  height: 60px;
  background: #ffa90a;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.feature-icon i {
  font-size: 1.5rem;
  color: white;
}

.feature-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #262626;
  margin-bottom: 0.5rem;
}

.feature-card p {
  color: #999999;
  margin: 0;
}

/* Pricing Section */
.pricing-section {
  padding: 6rem 0;
  background: #f8f9fa;
}

.pricing-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.pricing-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  position: relative;
  transition: all 0.3s ease;
}

.pricing-card.featured {
  border: 2px solid #ffa90a;
  transform: scale(1.05);
}

.popular-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: #ffa90a;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.plan-name {
  font-size: 1.5rem;
  font-weight: 600;
  color: #262626;
  margin-bottom: 1rem;
}

.plan-price {
  font-size: 3rem;
  font-weight: 800;
  color: #ffa90a;
  margin-bottom: 2rem;
}

.price-period {
  font-size: 1rem;
  color: #999999;
  font-weight: 400;
}

.plan-features {
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
}

.plan-features li {
  padding: 0.5rem 0;
  color: #262626;
  border-bottom: 1px solid #f0f0f0;
}

.plan-features li:last-child {
  border-bottom: none;
}

.plan-button {
  width: 100%;
  padding: 1rem !important;
  font-weight: 600 !important;
  border-radius: 8px !important;
}

.plan-button-pro {
  background: #ffa90a !important;
  border: none !important;
  color: white !important;
}

.plan-button-free,
.plan-button-team {
  color: #ffa90a !important;
  border: 2px solid #ffa90a !important;
  background: transparent !important;
}

.pricing-note {
  text-align: center;
  color: #999999;
  font-size: 0.9rem;
}

/* Social Proof Section */
.social-proof-section {
  padding: 6rem 0;
  background: white;
}

.testimonials {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.testimonial {
  background: #fff9e6;
  padding: 2rem;
  border-radius: 12px;
  border-left: 4px solid #ffa90a;
}

.testimonial-content {
  font-size: 1.1rem;
  color: #262626;
  margin-bottom: 1rem;
  font-style: italic;
}

.testimonial-author {
  color: #999999;
  font-size: 0.9rem;
}

/* Final CTA Section */
.final-cta-section {
  padding: 6rem 0;
  background: linear-gradient(135deg, #ffa90a 0%, #ffd793 100%);
  text-align: center;
  color: white;
}

.final-cta-section h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: white;
}

.final-cta-section p {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.final-cta-button {
  background: white !important;
  color: #ffa90a !important;
  border: none !important;
  padding: 1.5rem 3rem !important;
  font-size: 1.1rem !important;
  font-weight: 600 !important;
  border-radius: 12px !important;
  transition: all 0.3s ease !important;
}

.final-cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2) !important;
}

.final-note {
  margin-top: 1rem;
  font-size: 0.9rem;
  opacity: 0.8;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 2rem;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .cta-buttons {
    flex-direction: column;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .pricing-cards {
    grid-template-columns: 1fr;
  }
  
  .pricing-card.featured {
    transform: none;
  }
  
  .testimonials {
    grid-template-columns: 1fr;
  }
  
  .container {
    padding: 0 1rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
  }
  
  .stat-number {
    font-size: 2rem;
  }
  
  .final-cta-section h2 {
    font-size: 2rem;
  }
}
</style>