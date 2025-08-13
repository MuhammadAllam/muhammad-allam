// DOM Elements
const themeToggle = document.getElementById("themeToggle")
const mobileMenuToggle = document.getElementById("mobileMenuToggle")
const navMenu = document.getElementById("navMenu")
const toast = document.getElementById("toast")
const toastMessage = document.getElementById("toastMessage")

// Theme Management
class ThemeManager {
  constructor() {
    this.systemPreference = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    this.currentTheme = localStorage.getItem("theme") || this.systemPreference
    this.init()
  }

  init() {
    this.applyTheme(this.currentTheme)
    this.bindEvents()
    this.watchSystemPreference()
  }

  applyTheme(theme) {
    // Add transition class to prevent flash
    document.body.classList.add("theme-transitioning")

    setTimeout(() => {
      document.body.className = theme === "dark" ? "dark-theme" : ""
      localStorage.setItem("theme", theme)
      this.currentTheme = theme

      // Remove transition class after theme is applied
      setTimeout(() => {
        document.body.classList.remove("theme-transitioning")
      }, 50)
    }, 10)
  }

  toggleTheme() {
    const newTheme = this.currentTheme === "dark" ? "light" : "dark"
    this.applyTheme(newTheme)

    // Add visual feedback
    const themeToggle = document.getElementById("themeToggle")
    if (themeToggle) {
      themeToggle.style.transform = "scale(0.9)"
      setTimeout(() => {
        themeToggle.style.transform = "scale(1)"
      }, 150)
    }
  }

  watchSystemPreference() {
    // Listen for system theme changes
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
      // Only auto-switch if user hasn't manually set a preference
      if (!localStorage.getItem("theme")) {
        this.applyTheme(e.matches ? "dark" : "light")
      }
    })
  }

  bindEvents() {
    const themeToggle = document.getElementById("themeToggle")
    if (themeToggle) {
      themeToggle.addEventListener("click", () => this.toggleTheme())

      // Add keyboard support
      themeToggle.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          this.toggleTheme()
        }
      })
    }
  }
}

// Navigation Management
class NavigationManager {
  constructor() {
    this.isMenuOpen = false
    this.init()
  }

  init() {
    this.bindEvents()
    this.handleScroll()
  }

  toggleMobileMenu() {
    this.isMenuOpen = !this.isMenuOpen
    navMenu?.classList.toggle("active", this.isMenuOpen)

    // Animate hamburger menu
    const spans = mobileMenuToggle?.querySelectorAll("span")
    if (spans) {
      if (this.isMenuOpen) {
        spans[0].style.transform = "rotate(45deg) translate(5px, 5px)"
        spans[1].style.opacity = "0"
        spans[2].style.transform = "rotate(-45deg) translate(7px, -6px)"
      } else {
        spans[0].style.transform = "none"
        spans[1].style.opacity = "1"
        spans[2].style.transform = "none"
      }
    }
  }

  closeMobileMenu() {
    this.isMenuOpen = false
    navMenu?.classList.remove("active")

    const spans = mobileMenuToggle?.querySelectorAll("span")
    if (spans) {
      spans[0].style.transform = "none"
      spans[1].style.opacity = "1"
      spans[2].style.transform = "none"
    }
  }

  handleScroll() {
    let lastScrollY = window.scrollY
    const header = document.querySelector(".header")

    window.addEventListener("scroll", () => {
      const currentScrollY = window.scrollY

      // Hide/show header on scroll
      if (header) {
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          header.style.transform = "translateY(-100%)"
        } else {
          header.style.transform = "translateY(0)"
        }
      }

      // Update active nav link
      this.updateActiveNavLink()

      lastScrollY = currentScrollY
    })
  }

  updateActiveNavLink() {
    const sections = document.querySelectorAll("section[id]")
    const navLinks = document.querySelectorAll(".nav-link")

    let currentSection = ""

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100
      const sectionHeight = section.offsetHeight

      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute("id")
      }
    })

    navLinks.forEach((link) => {
      link.classList.remove("active")
      if (link.getAttribute("href") === `#${currentSection}`) {
        link.classList.add("active")
      }
    })
  }

  bindEvents() {
    // Mobile menu toggle
    mobileMenuToggle?.addEventListener("click", () => this.toggleMobileMenu())

    // Close mobile menu when clicking nav links
    const navLinks = document.querySelectorAll(".nav-link")
    navLinks.forEach((link) => {
      link.addEventListener("click", () => this.closeMobileMenu())
    })

    // Close mobile menu when clicking outside
    document.addEventListener("click", (e) => {
      if (this.isMenuOpen && !navMenu?.contains(e.target) && !mobileMenuToggle?.contains(e.target)) {
        this.closeMobileMenu()
      }
    })
  }
}

// Smooth Scrolling
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId)
  if (element) {
    const headerHeight = document.querySelector(".header")?.offsetHeight || 0
    const targetPosition = element.offsetTop - headerHeight - 20

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    })
  }
}

// Copy to Clipboard with Toast
function copyToClipboard(text, type) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        showToast(`${type} copied to clipboard!`)
      })
      .catch(() => {
        fallbackCopyToClipboard(text, type)
      })
  } else {
    fallbackCopyToClipboard(text, type)
  }
}

function fallbackCopyToClipboard(text, type) {
  const textArea = document.createElement("textarea")
  textArea.value = text
  textArea.style.position = "fixed"
  textArea.style.left = "-999999px"
  textArea.style.top = "-999999px"
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    document.execCommand("copy")
    showToast(`${type} copied to clipboard!`)
  } catch (err) {
    showToast(`Failed to copy ${type.toLowerCase()}`)
  }

  document.body.removeChild(textArea)
}

// Toast Notification
function showToast(message) {
  if (toast && toastMessage) {
    toastMessage.textContent = message
    toast.classList.add("show")

    setTimeout(() => {
      toast.classList.remove("show")
    }, 3000)
  }
}

// CV Download
function downloadCV() {
  try {
    const link = document.createElement("a")
    link.href = "Muhammad Allam - Flutter CV.pdf"
    link.download = "Muhammad Allam - Flutter CV.pdf"
    link.target = "_blank"
    link.style.display = "none"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast("CV download started!")
  } catch (error) {
    showToast("CV download failed. Please try again.")
  }
}

// Intersection Observer for Animations
class AnimationManager {
  constructor() {
    this.init()
  }

  init() {
    if ("IntersectionObserver" in window) {
      this.setupObserver()
    }
  }

  setupObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1"
          entry.target.style.transform = "translateY(0)"
        }
      })
    }, observerOptions)

    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
      ".project-card, .skill-category, .experience-item, .contact-item",
    )
    animatedElements.forEach((el) => {
      el.style.opacity = "0"
      el.style.transform = "translateY(30px)"
      el.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out"
      observer.observe(el)
    })
  }
}

// Performance Optimization
class PerformanceManager {
  constructor() {
    this.init()
  }

  init() {
    this.optimizeImages()
    this.preloadCriticalResources()
  }

  optimizeImages() {
    // Lazy load images if any are added later
    if ("loading" in HTMLImageElement.prototype) {
      const images = document.querySelectorAll("img[data-src]")
      images.forEach((img) => {
        img.src = img.dataset.src
        img.removeAttribute("data-src")
      })
    }
  }

  preloadCriticalResources() {
    // Preload CV file
    const link = document.createElement("link")
    link.rel = "prefetch"
    link.href = "/muhammad-allam-cv.pdf"
    document.head.appendChild(link)
  }
}

// Accessibility Enhancements
class AccessibilityManager {
  constructor() {
    this.init()
  }

  init() {
    this.setupKeyboardNavigation()
    this.setupFocusManagement()
  }

  setupKeyboardNavigation() {
    // Handle keyboard navigation for custom buttons
    document.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        const target = e.target

        if (target.classList.contains("contact-item") && target.onclick) {
          e.preventDefault()
          target.click()
        }

        if (target.classList.contains("scroll-down")) {
          e.preventDefault()
          target.click()
        }
      }

      // Escape key to close mobile menu
      if (e.key === "Escape" && navMenu?.classList.contains("active")) {
        window.navigationManager.closeMobileMenu()
      }
    })
  }

  setupFocusManagement() {
    // Ensure focus is visible for keyboard users
    document.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        document.body.classList.add("keyboard-navigation")
      }
    })

    document.addEventListener("mousedown", () => {
      document.body.classList.remove("keyboard-navigation")
    })
  }
}

// Error Handling
window.addEventListener("error", (e) => {
  console.error("JavaScript error:", e.error)
})

window.addEventListener("unhandledrejection", (e) => {
  console.error("Unhandled promise rejection:", e.reason)
})

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  // Initialize managers
  const themeManager = new ThemeManager()
  const navigationManager = new NavigationManager()
  const animationManager = new AnimationManager()
  const performanceManager = new PerformanceManager()
  const accessibilityManager = new AccessibilityManager()

  // Make navigation manager globally accessible
  window.navigationManager = navigationManager

  // Add smooth scroll behavior to all anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const targetId = this.getAttribute("href").substring(1)
      scrollToSection(targetId)
    })
  })

  // Add loading class removal after page load
  window.addEventListener("load", () => {
    document.body.classList.add("loaded")
  })

  console.log("Muhammad Allam Portfolio - Initialized successfully")
})

// Service Worker Registration (for future PWA capabilities)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // Uncomment when service worker is implemented
    // navigator.serviceWorker.register('/sw.js')
    //   .then(registration => console.log('SW registered'))
    //   .catch(error => console.log('SW registration failed'));
  })
}
