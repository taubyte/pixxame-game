// Modern Minimalist JavaScript for Pixxame

// Play Game Function
function playGame() {
  const button = document.querySelector("button[onclick='playGame()']");
  const originalText = button.textContent;

  // Smooth button animation
  button.style.transform = "scale(0.98)";
  button.textContent = "Starting...";
  button.disabled = true;

  setTimeout(() => {
    button.style.transform = "";
    button.textContent = originalText;
    button.disabled = false;

    // Show success notification
    showNotification("Game initialized successfully!", "success");
  }, 800);
}

// Mobile Menu Toggle
function toggleMobileMenu() {
  const menu = document.getElementById("mobile-menu");
  const hamburger = document.getElementById("hamburger");

  if (menu.classList.contains("hidden")) {
    // Show menu
    menu.classList.remove("hidden");
    menu.classList.add(
      "md:flex",
      "flex-col",
      "absolute",
      "top-16",
      "left-0",
      "right-0",
      "bg-background",
      "border-b",
      "border-border",
      "p-4",
      "space-y-4"
    );
    hamburger.innerHTML = `
      <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    `;
  } else {
    // Hide menu
    menu.classList.add("hidden");
    menu.classList.remove(
      "md:flex",
      "flex-col",
      "absolute",
      "top-16",
      "left-0",
      "right-0",
      "bg-background",
      "border-b",
      "border-border",
      "p-4",
      "space-y-4"
    );
    hamburger.innerHTML = `
      <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
      </svg>
    `;
  }
}

// Smooth Scroll to Section
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Handle navigation links
  const navLinks = document.querySelectorAll("a[href^='#']");
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      scrollToSection(targetId);
    });
  });

  // Initialize pixel board and animations
  initializePixelBoard();
  createCursor();
  simulatePixelPlacing();

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe sections for scroll animations
  const sections = document.querySelectorAll("section");
  sections.forEach((section) => {
    section.style.opacity = "0";
    section.style.transform = "translateY(20px)";
    section.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(section);
  });
});

// Initialize Pixel Board
function initializePixelBoard() {
  const pixelBoard = document.getElementById("pixelBoard");
  if (!pixelBoard) return;

  // Clear existing pixels
  pixelBoard.innerHTML = "";

  // Create 16x16 grid (256 pixels) using absolute positioning
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      const pixel = document.createElement("div");
      pixel.className = "board-pixel";
      pixel.dataset.index = y * 16 + x;
      pixel.dataset.x = x;
      pixel.dataset.y = y;

      // Set absolute position (384px board / 16 = 24px per pixel)
      pixel.style.left = x * 24 + "px";
      pixel.style.top = y * 24 + "px";

      pixelBoard.appendChild(pixel);
    }
  }
}

// Create Cursors
function createCursor() {
  const pixelBoard = document.getElementById("pixelBoard");
  if (!pixelBoard) return;

  // Create first cursor
  const cursor1 = document.createElement("div");
  cursor1.className = "cursor";
  cursor1.id = "cursor1";
  cursor1.style.display = "none";
  pixelBoard.appendChild(cursor1);

  // Create second cursor with slight color variation
  const cursor2 = document.createElement("div");
  cursor2.className = "cursor cursor2";
  cursor2.id = "cursor2";
  cursor2.style.display = "none";
  pixelBoard.appendChild(cursor2);
}

// Simulate Pixel Placing
function simulatePixelPlacing() {
  const cursor1 = document.getElementById("cursor1");
  const cursor2 = document.getElementById("cursor2");
  const pixels = document.querySelectorAll(".board-pixel");

  if (!cursor1 || !cursor2 || pixels.length === 0) return;

  const colors = [
    "#22c55e", // Green
    "#06b6d4", // Cyan
    "#f59e0b", // Amber
    "#ef4444", // Red
    "#8b5cf6", // Violet
    "#f97316", // Orange
  ];
  let colorIndex = 0;

  // Simple cursor positioning function
  function moveCursorToPixel(cursor, pixel) {
    const x = parseInt(pixel.dataset.x);
    const y = parseInt(pixel.dataset.y);

    // Match pixel positioning exactly (384px board with 32px padding)
    const pixelX = 32 + x * 24;
    const pixelY = 32 + y * 24;

    // Position cursor at pixel position (adjusted 20px up and 20px left)
    cursor.style.left = pixelX - 20 + "px";
    cursor.style.top = pixelY - 20 + "px";
  }

  // Function to handle individual cursor movement and pixel placement
  function animateCursor(cursor, delay) {
    setTimeout(() => {
      // Find a random empty pixel
      const emptyPixels = Array.from(pixels).filter(
        (pixel) => !pixel.classList.contains("colored")
      );

      if (emptyPixels.length > 0) {
        const randomPixel =
          emptyPixels[Math.floor(Math.random() * emptyPixels.length)];

        // Show cursor and move to pixel
        cursor.style.display = "block";
        moveCursorToPixel(cursor, randomPixel);

        // Cycle through colors
        const currentColor = colors[colorIndex];
        colorIndex = (colorIndex + 1) % colors.length;

        // Simulate hover and click
        setTimeout(() => {
          // Add clicking animation
          cursor.classList.add("cursor-clicking");

          setTimeout(() => {
            // Place pixel
            placePixel(randomPixel, currentColor);

            // Remove clicking animation
            cursor.classList.remove("cursor-clicking");

            // Hide cursor after a moment
            setTimeout(() => {
              cursor.style.display = "none";
            }, 500);
          }, 200);
        }, 800);
      }
    }, delay);
  }

  // Start both cursors with different intervals
  setInterval(() => animateCursor(cursor1, 0), 2500);
  setInterval(() => animateCursor(cursor2, 1000), 3000);
}

// Place Pixel Function
function placePixel(pixel, color) {
  pixel.classList.add("colored");
  pixel.style.background = color;
  pixel.style.boxShadow = `0 0 8px ${color}40`;

  // Add color-specific class for additional styling
  const colorName = getColorName(color);
  pixel.classList.add(`color-${colorName}`);
}

// Get color name for CSS class
function getColorName(hexColor) {
  const colorMap = {
    "#22c55e": "green",
    "#06b6d4": "cyan",
    "#f59e0b": "amber",
    "#ef4444": "red",
    "#8b5cf6": "violet",
    "#f97316": "orange",
  };
  return colorMap[hexColor] || "default";
}

// Update Stats

// Notification System
function showNotification(message, type = "info") {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll(".notification");
  existingNotifications.forEach((notification) => notification.remove());

  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full max-w-sm`;

  // Set colors based on type
  switch (type) {
    case "success":
      notification.className += " bg-green-500 text-white";
      break;
    case "error":
      notification.className += " bg-red-500 text-white";
      break;
    case "warning":
      notification.className += " bg-yellow-500 text-black";
      break;
    default:
      notification.className += " bg-blue-500 text-white";
  }

  notification.textContent = message;
  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 100);

  // Auto remove after 3 seconds
  setTimeout(() => {
    notification.style.transform = "translateX(full)";
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Keyboard shortcuts
document.addEventListener("keydown", function (e) {
  switch (e.key) {
    case "Enter":
      if (e.ctrlKey || e.metaKey) {
        playGame();
      }
      break;
    case "Escape":
      // Close any open modals or notifications
      const notifications = document.querySelectorAll(".notification");
      notifications.forEach((notification) => notification.remove());
      break;
  }
});

// Make functions globally available
window.playGame = playGame;
window.scrollToSection = scrollToSection;
window.toggleMobileMenu = toggleMobileMenu;
