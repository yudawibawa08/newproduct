 // Properties data
    const properties = [
      {
        name: "Orchid",
        description: "Spacious room with garden views and premium amenities",
        price: "$250",
        image: "img/insence.jpg"
      },
      {
        name: "Cempaka",
        description: "Private villa with direct beach access and infinity pool",
        price: "$450",
        image: "img/insence.jpg"
      },
      {
        name: "Sandat",
        description: "Intimate retreat surrounded by ancient trees and nature",
        price: "$350",
        image: "img/insence.jpg"
      },
      {
        name: "Meditation",
        description: "Romantic hideaway with private jacuzzi and sunset views",
        price: "$500",
        image: "img/insence.jpg"
      },
      {
        name: "Gaharu",
        description: "Ultimate luxury with personalized service and concierge",
        price: "$800",
        image: "img/insence.jpg"
      },
      {
        name: "Cendana",
        description: "Spa-focused accommodation with therapeutic facilities",
        price: "$400",
        image: "img/insence.jpg"
      }
    ];

    // Populate properties grid
    function populateProperties() {
      const grid = document.getElementById("propertiesGrid");
      grid.innerHTML = properties.map(property => `
        <div class="property-card">
          <div class="property-image"><img src="${property.image}"></div>
          <div class="property-content">
            <h3>${property.name}</h3>
            <p>${property.description}</p>
            <div class="property-footer">
              <span class="property-price">${property.price}</span>
              <button class="property-btn" onclick="openWhatsApp()">Inquire</button>
            </div>
          </div>
        </div>
      `).join("");
    }

    // Smooth scroll to section
    function scrollToSection(sectionId) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        closeNavMenu();
      }
    }

    // WhatsApp integration
    function openWhatsApp() {
      const phoneNumber = "089666266688"; // Replace with actual WhatsApp number
      const message = "Hi! I am interested in ordering products from Bali Dhupa.";
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }

    // Email integration
    function sendEmail() {
      const email = "admin@balidhupa.com"; // Replace with actual email
      const subject = "Order Inquiry - Bali Dhupa";
      const body = "Hi! I am interested in ordering products from Bali Dhupa. Please provide catalog and availability.";
      const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoUrl;
    }

    // Phone call
    function callNow() {
      const phoneNumber = "+1234567890"; // Replace with actual phone number
      window.location.href = `tel:${phoneNumber}`;
    }

    // Mobile menu toggle
    const navLinks = document.getElementById("navLinks");
    function toggleNavMenu() {
      navLinks.classList.toggle("active");
    }

    function closeNavMenu() {
      navLinks.classList.remove("active");
    }

    // Smooth header background transition after hero section
    function updateNavBackground() {
      const nav = document.querySelector('nav');
      const hero = document.getElementById('hero');

      if (!hero) return;

      const heroBottom = hero.offsetHeight;
      const scrollPos = window.scrollY;

      // Add scrolled class when user scrolls past the hero section
      if (scrollPos > heroBottom - 100) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }

    // Add scroll listener with passive flag for better performance
    window.addEventListener('scroll', updateNavBackground, { passive: true });

    // Initialize
    document.addEventListener('DOMContentLoaded', function() {
      populateProperties();
      updateNavBackground();

      // Optimize video looping for seamless playback
      const videos = document.querySelectorAll('video');
      videos.forEach(video => {
        // Ensure videos are set to loop properly
        video.muted = true;
        video.autoplay = true;
        video.loop = true;
        video.playsInline = true;

        // Preload video for smooth looping
        video.preload = 'metadata';

        // Handle playback to ensure smooth looping
        video.addEventListener('ended', function() {
          this.currentTime = 0;
          this.play();
        });
      });

      // Close mobile menu when clicking on a link
      document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', closeNavMenu);
      });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });