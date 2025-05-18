<template>
  <nav class="main-navigation">
    <a href="welcome.html" class="nav-link">Home</a>
    <router-link to="/how-it-works" class="nav-link">How It Works</router-link>
    <router-link to="/" class="nav-link simulator-link">Try the Tax Calculator</router-link>
    <a href="https://www.canada.ca/en/revenue-agency.html" target="_blank" rel="noopener noreferrer" class="nav-link">CRA</a>
  </nav>
</template>

<script setup>
// No script logic needed for this navigation bar
</script>

<style scoped>
.main-navigation {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 15px 0;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.nav-link {
  color: #3498db;
  text-decoration: none;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 4px;
  transition: all 0.2s ease;
  font-size: 1rem;
}

.nav-link:hover {
  background-color: #3498db;
  color: white;
}

.simulator-link {
  background-color: #27ae60;
  color: white;
}

.simulator-link:hover {
  background-color: #219a52;
  color: white;
}

@media (max-width: 768px) {
  .main-navigation {
    flex-wrap: wrap;
    gap: 10px;
    padding: 8px;
  }
  
  .nav-link {
    font-size: 0.9rem;
    padding: 6px 12px;
  }
}
</style> 