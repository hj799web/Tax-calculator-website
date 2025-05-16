<template>
  <div class="fiscal-chaos-alert">
    <span class="chaos-emoji" aria-label="Fiscal Chaos">🚨</span>
    <div class="chaos-message">
      <strong>Public Confidence Crisis:</strong> Extreme tax rates have triggered negative public sentiment
    </div>
  </div>
</template>

<script setup>
// No props needed, this is a visual alert only
</script>

<style scoped>
.fiscal-chaos-alert {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 40px;
  background: rgba(255, 45, 45, 0.9);
  color: #fff;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  font-size: 0.95rem;
  padding: 0.5em 1em;
  border-bottom: 2px solid #b80000;
}
.chaos-emoji {
  font-size: 1.2em;
  margin-right: 0.8em;
}
.chaos-message {
  text-align: center;
  line-height: 1.2;
}
</style>
