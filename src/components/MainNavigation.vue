<template>
  <nav class="main-navigation">
    <a
      href="welcome.html"
      class="nav-link"
    >Home</a>
    <router-link 
      to="/how-it-works" 
      class="nav-link"
    >
      How It Works
    </router-link>
    <router-link 
      to="/" 
      class="nav-link"
    >
      Tax Calculator
    </router-link>
    <router-link 
      to="/simulator" 
      class="nav-link simulator-link"
    >
      Budget Simulator
    </router-link>
    <a
      href="https://www.canada.ca/en/revenue-agency.html"
      target="_blank"
      rel="noopener noreferrer"
      class="nav-link"
    >CRA</a>
  </nav>
</template>

<script setup>
// Component is now simplified without overengineered preloading
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
  flex-wrap: wrap;
}

.nav-link {
  color: #3498db;
  text-decoration: none;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 4px;
  transition: all 0.3s ease;
  font-size: 1rem;
  position: relative;
  overflow: hidden;
}

.nav-link:hover {
  background-color: #3498db;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.nav-link:active {
  transform: translateY(0);
  box-shadow: none;
}

.simulator-link {
  background-color: #3498db;
  color: white;
}

.simulator-link:hover {
  background-color: #2980b9;
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
    width: calc(50% - 5px);
    text-align: center;
  }
}
</style> 