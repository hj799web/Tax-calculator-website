// howItWorksAnimations.js
// This file contains animations and 3D effects for the How It Works page

// Function to initialize animations when the page loads
export function initAnimations() {
  // Add scroll animation to sections
  const sections = document.querySelectorAll('.section');
  
  // Create an Intersection Observer to detect when sections come into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Add class when element is in view
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        // Unobserve after animation is triggered
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1 // Trigger when at least 10% of the item is visible
  });
  
  // Observe all sections
  sections.forEach(section => {
    observer.observe(section);
  });
  
  // Add 3D tilt effect to sections
  sections.forEach(section => {
    section.addEventListener('mousemove', handleTilt);
    section.addEventListener('mouseleave', resetTilt);
  });
  
  // Add 3D effect to TOC
  const toc = document.querySelector('.toc');
  if (toc) {
    toc.addEventListener('mousemove', handleTocTilt);
    toc.addEventListener('mouseleave', resetTilt);
  }
  
  // Add floating animation to headings
  animateHeadings();
  
  // Add interactive 3D card effects to content sections
  add3DCardEffects();
}

// Function to handle tilt effect on sections
function handleTilt(e) {
  const section = e.currentTarget;
  const rect = section.getBoundingClientRect();
  
  // Calculate mouse position relative to the section
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  // Calculate the tilt amount (maximum 5 degrees)
  const tiltX = ((y / rect.height) * 10) - 5;
  const tiltY = ((x / rect.width) * 10) - 5;
  
  // Apply the tilt effect
  section.style.transform = `perspective(1000px) rotateX(${-tiltX}deg) rotateY(${tiltY}deg) translateZ(10px)`;
  
  // Add dynamic shadow based on tilt
  const shadowX = tiltY * 2;
  const shadowY = tiltX * 2;
  section.style.boxShadow = `${shadowX}px ${shadowY}px 20px rgba(0, 0, 0, 0.2)`;
}

// Function to handle tilt effect on TOC
function handleTocTilt(e) {
  const toc = e.currentTarget;
  const rect = toc.getBoundingClientRect();
  
  // Calculate mouse position relative to the TOC
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  // Calculate the tilt amount (maximum 3 degrees)
  const tiltX = ((y / rect.height) * 6) - 3;
  const tiltY = ((x / rect.width) * 6) - 3;
  
  // Apply the tilt effect
  toc.style.transform = `perspective(1000px) rotateX(${-tiltX}deg) rotateY(${tiltY}deg) translateZ(5px)`;
  
  // Add dynamic shadow based on tilt
  const shadowX = tiltY * 1.5;
  const shadowY = tiltX * 1.5;
  toc.style.boxShadow = `${shadowX}px ${shadowY}px 15px rgba(0, 0, 0, 0.15)`;
}

// Function to reset tilt effect
function resetTilt(e) {
  const element = e.currentTarget;
  
  // Reset to original transform
  if (element.classList.contains('toc')) {
    element.style.transform = 'perspective(1000px) rotateX(2deg)';
  } else {
    element.style.transform = 'perspective(1000px) rotateY(0deg)';
  }
  
  // Reset shadow to original
  if (element.classList.contains('toc')) {
    element.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
  } else {
    element.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
  }
}

// Function to animate headings with a staggered effect - making them more static
function animateHeadings() {
  const headings = document.querySelectorAll('h2, h3');
  
  headings.forEach((heading) => {
    // Remove any existing animation classes
    heading.classList.remove('animate-heading');
    
    // Add a subtle highlight effect on hover
    heading.addEventListener('mouseenter', () => {
      heading.style.color = '#27ae60';
    });
    
    heading.addEventListener('mouseleave', () => {
      heading.style.color = '';
    });
  });
}

// Function to add parallax effect to background - reducing the movement
export function initParallax() {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const container = document.querySelector('.how-it-works-container');
    
    if (container) {
      // Create very subtle parallax effect on scroll (reduced from previous value)
      container.style.backgroundPosition = `0 ${scrollY * 0.02}px`;
    }
    
    // Add reduced parallax effect to decorative elements
    const shapes = document.querySelectorAll('.floating-shape');
    shapes.forEach((shape, index) => {
      const speed = 0.01 + (index * 0.005); // Reduced speed
      const yPos = scrollY * speed;
      shape.style.transform = `translate3d(0, ${yPos}px, 0) rotate(${scrollY * 0.01}deg)`;
    });
  });
}

// Function to add 3D depth to list items
export function enhanceListItems() {
  const listItems = document.querySelectorAll('ul li, ol li');
  
  listItems.forEach((item, index) => {
    // Add staggered animation delay
    const delay = (index % 5) * 0.1;
    item.style.transitionDelay = `${delay}s`;
    
    // Add depth effect on hover
    item.addEventListener('mouseenter', () => {
      item.style.transform = 'translateX(10px) translateZ(15px)';
      item.style.color = '#34495e';
    });
    
    item.addEventListener('mouseleave', () => {
      item.style.transform = 'translateX(0) translateZ(0)';
      item.style.color = '';
    });
  });
}

// Function to add interactive 3D card effects to content sections
function add3DCardEffects() {
  // Add interactive hover effects to FAQ items
  const faqItems = document.querySelectorAll('#faq h3');
  faqItems.forEach(item => {
    item.addEventListener('click', () => {
      // Toggle active class to show/hide answer
      const answer = item.nextElementSibling;
      if (answer && answer.tagName === 'P') {
        if (answer.style.maxHeight) {
          answer.style.maxHeight = null;
          answer.style.opacity = '0';
          item.classList.remove('active');
        } else {
          answer.style.maxHeight = answer.scrollHeight + 'px';
          answer.style.opacity = '1';
          item.classList.add('active');
        }
      }
    });
  });
  
  // Add glowing effect to important elements
  const importantElements = document.querySelectorAll('.main-title, h2, .back-link');
  importantElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
      element.classList.add('glow-effect');
    });
    
    element.addEventListener('mouseleave', () => {
      element.classList.remove('glow-effect');
    });
  });
  
  // Add 3D card flip effect to certain sections on click
  const methodologySection = document.querySelector('#calculator-methodology');
  if (methodologySection) {
    const flipCard = document.createElement('div');
    flipCard.className = 'flip-icon';
    flipCard.innerHTML = '↻';
    flipCard.title = 'Click to see more details';
    methodologySection.appendChild(flipCard);
    
    flipCard.addEventListener('click', () => {
      methodologySection.classList.toggle('flipped');
    });
  }
}

// Initialize all animations
export default function initAllAnimations() {
  // Wait for DOM to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initAnimations();
      initParallax();
      enhanceListItems();
    });
  } else {
    initAnimations();
    initParallax();
    enhanceListItems();
  }
}
