<template>
  <div class="hourglass-container">
    <svg 
      class="hourglass-svg"
      viewBox="0 0 100 150"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- Hourglass frame -->
      <defs>
        <clipPath id="hourglass-clip">
          <path d="
            M 20 10
            L 80 10
            L 80 40
            L 50 70
            L 80 100
            L 80 130
            L 20 130
            L 20 100
            L 50 70
            L 20 40
            Z
          " />
        </clipPath>
        
        <mask id="sand-mask">
          <rect x="0" y="0" width="100" height="150" fill="white" />
          <rect :x="20" :y="sandLevelTop" :width="60" :height="sandHeightTop" fill="black" />
          <rect :x="20" :y="130 - sandHeightBottom" :width="60" :height="sandHeightBottom" fill="black" />
        </mask>
      </defs>
      
      <!-- Glass outline -->
      <path
        class="hourglass-outline"
        d="
          M 20 10
          L 80 10
          L 80 40
          L 50 70
          L 80 100
          L 80 130
          L 20 130
          L 20 100
          L 50 70
          L 20 40
          Z
        "
        fill="none"
        stroke="#8B7355"
        stroke-width="3"
      />
      
      <!-- Top and bottom caps -->
      <rect x="15" y="5" width="70" height="8" fill="#8B7355" rx="2" />
      <rect x="15" y="127" width="70" height="8" fill="#8B7355" rx="2" />
      
      <!-- Static sand in bottom -->
      <path
        class="sand-bottom"
        :d="bottomSandPath"
        fill="#F4E4B4"
        clip-path="url(#hourglass-clip)"
      />
      
      <!-- Static sand in top -->
      <path
        class="sand-top"
        :d="topSandPath"
        fill="#F4E4B4"
        clip-path="url(#hourglass-clip)"
      />
      
      <!-- Sand stream -->
      <line
        v-if="isRunning && sandHeightTop > 0"
        class="sand-stream"
        x1="50"
        y1="70"
        x2="50"
        y2="100"
        stroke="#F4E4B4"
        stroke-width="1"
        opacity="0.8"
      />
      
      <!-- Falling sand particles -->
      <g clip-path="url(#hourglass-clip)">
        <circle
          v-for="particle in sandParticles"
          :key="particle.id"
          :cx="particle.x"
          :cy="particle.y"
          r="0.8"
          fill="#F4E4B4"
          :opacity="particle.opacity"
          :style="{
            animationPlayState: isRunning ? 'running' : 'paused'
          }"
        />
      </g>
    </svg>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  isRunning: {
    type: Boolean,
    default: false
  },
  progress: {
    type: Number,
    default: 0
  }
})

const sandParticles = ref([])
const particleId = ref(0)
const animationFrame = ref(null)

const sandHeightTop = computed(() => {
  return 60 * (1 - props.progress)
})

const sandHeightBottom = computed(() => {
  return 30 * props.progress
})

const sandLevelTop = computed(() => {
  return 10
})

const topSandPath = computed(() => {
  const height = sandHeightTop.value
  const y = 70 - height
  return `
    M 20 ${y}
    L 80 ${y}
    L 80 70
    L 50 70
    L 20 70
    Z
  `
})

const bottomSandPath = computed(() => {
  const height = sandHeightBottom.value
  const y = 130 - height
  const curveHeight = Math.min(height * 0.3, 5)
  
  return `
    M 20 130
    L 80 130
    L 80 ${y}
    Q 50 ${y - curveHeight} 20 ${y}
    Z
  `
})

function createParticle() {
  const id = particleId.value++
  const spread = 15
  const x = 50 + (Math.random() - 0.5) * spread
  const startY = 70
  
  return {
    id,
    x,
    y: startY,
    velocity: 0.5 + Math.random() * 0.5,
    opacity: 0.6 + Math.random() * 0.4,
    targetX: 50 + (Math.random() - 0.5) * 20
  }
}

function animateParticles() {
  if (!props.isRunning || sandHeightTop.value <= 0) {
    return
  }
  
  // Update existing particles
  sandParticles.value = sandParticles.value
    .map(particle => {
      const newY = particle.y + particle.velocity
      const progress = (newY - 70) / 30
      const newX = particle.x + (particle.targetX - particle.x) * progress * 0.1
      
      return {
        ...particle,
        y: newY,
        x: newX
      }
    })
    .filter(particle => particle.y < 100)
  
  // Add new particles
  if (Math.random() < 0.3) {
    sandParticles.value.push(createParticle())
  }
  
  // Limit particle count
  if (sandParticles.value.length > 50) {
    sandParticles.value = sandParticles.value.slice(-50)
  }
  
  animationFrame.value = requestAnimationFrame(animateParticles)
}

watch(() => props.isRunning, (running) => {
  if (running) {
    animateParticles()
  } else {
    if (animationFrame.value) {
      cancelAnimationFrame(animationFrame.value)
    }
  }
})

onMounted(() => {
  if (props.isRunning) {
    animateParticles()
  }
})

onUnmounted(() => {
  if (animationFrame.value) {
    cancelAnimationFrame(animationFrame.value)
  }
})
</script>

<style scoped>
.hourglass-container {
  width: 100px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hourglass-svg {
  width: 100%;
  height: 100%;
}

.hourglass-outline {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.sand-stream {
  animation: stream 0.5s linear infinite;
}

@keyframes stream {
  0% {
    stroke-dasharray: 2 3;
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dasharray: 2 3;
    stroke-dashoffset: 5;
  }
}

@media (max-width: 768px) {
  .hourglass-container {
    width: 80px;
    height: 120px;
  }
}
</style>