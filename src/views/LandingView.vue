<template>
  <div class="landing-layout">
    <main class="landing-content">
      <div class="content-wrapper">
        <div class="hero-section">
          <div class="hero-card">
            <div class="hero-content">
              <h1>One Thing at a Time</h1>
              <p>Focus on what matters. Stop task switching and start accomplishing.</p>
              <div class="cta-buttons">
                <router-link to="/register" class="btn btn-primary">Get Started</router-link>
                <router-link to="/login" class="btn btn-secondary">Login</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
// Simple landing page - no logic needed
</script>

<style scoped>
.landing-layout {
  min-height: 100vh;
  background-color: #fafafa;
}

.landing-content {
  padding: 2rem;
  min-width: 1200px;
  max-width: 1400px;
  margin: 0 auto;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.hero-section {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.hero-card {
  max-width: 650px;
  width: 100%;
  margin: 0 auto;
  text-align: center;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.hero-content {
  padding: 3rem 2rem;
}

.hero-content h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1rem;
  font-weight: 700;
}

.hero-content p {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.5;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 0.75rem 2rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s ease;
  display: inline-block;
}

.btn-primary {
  background-color: #007bff;
  color: white;
  border: 2px solid #007bff;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #0056b3;
  transform: translateY(-1px);
}

.btn-secondary {
  background-color: transparent;
  color: #007bff;
  border: 2px solid #007bff;
}

.btn-secondary:hover {
  background-color: #007bff;
  color: white;
  transform: translateY(-1px);
}

@media (max-width: 1024px) {
  .landing-content {
    min-width: auto;
    padding: 1rem;
  }
}

@media (max-width: 768px) {
  .hero-content {
    padding: 2rem 1rem;
  }
  
  .hero-content h1 {
    font-size: 2rem;
  }
  
  .hero-content p {
    font-size: 1.1rem;
  }
  
  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .btn {
    width: 200px;
  }
}
</style>