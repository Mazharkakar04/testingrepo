// Iqra Public High School - Main JavaScript File

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    console.log('Iqra Public High School website loaded successfully!');
    
    // Load notices if on the notice page
    if (document.getElementById('notices')) {
        loadNotices();
    }

    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function () {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Navbar background change on scroll
    window.addEventListener('scroll', function () {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = '#155a94';
            navbar.style.boxShadow = '0 2px 20px rgba(30, 115, 190, 0.3)';
        } else {
            navbar.style.background = '#1E73BE';
            navbar.style.boxShadow = '0 2px 10px rgba(30, 115, 190, 0.2)';
        }
    });

    // Add animation on scroll for stats
    const stats = document.querySelectorAll('.stat h3');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'countUp 2s ease-out forwards';
            }
        });
    }, observerOptions);

    stats.forEach(stat => {
        observer.observe(stat);
    });

    // Add hover effects for section cards
    const sectionCards = document.querySelectorAll('.section-card');
    sectionCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Function to load notices from JSON file
    function loadNotices() {
        fetch('notices.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(notices => {
                displayNotices(notices);
            })
            .catch(error => {
                console.error('Error loading notices:', error);
                document.getElementById('notices').innerHTML = `
                    <div class="notice-error">
                        <p>Unable to load notices. Please try again later.</p>
                    </div>
                `;
            });
    }
    
    // Function to display notices
    function displayNotices(notices) {
        const noticesContainer = document.getElementById('notices');
        
        if (notices.length === 0) {
            noticesContainer.innerHTML = `
                <div class="notice-empty">
                    <p>No notices available at this time.</p>
                </div>
            `;
            return;
        }
        
        let noticesHTML = '';
        
        notices.forEach(notice => {
            // Parse the date
            const noticeDate = new Date(notice.date);
            const day = noticeDate.getDate();
            const month = noticeDate.toLocaleString('default', { month: 'short' });
            const formattedDate = noticeDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            
            noticesHTML += `
                <div class="notice-item">
                    <div class="notice-header">
                        <div class="notice-date">
                            <div class="date-day">${day}</div>
                            <div class="date-month">${month}</div>
                        </div>
                    </div>
                    <div class="notice-content">
                        <h3>${notice.title}</h3>
                        <p>${notice.description}</p>
                        <div class="notice-meta">
                            <span><i class="fas fa-clock"></i> Posted: ${formattedDate}</span>
                        </div>
                        <div class="notice-actions">
                            ${notice.pdfLink ? `<a href="${notice.pdfLink}" class="btn btn-secondary" target="_blank">Download PDF</a>` : ''}
                        </div>
                    </div>
                </div>
            `;
        });
        
        noticesContainer.innerHTML = noticesHTML;
    }

    // Gallery filtering functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');

            galleryItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeIn 0.5s ease-in-out';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Lightbox functionality
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    let currentImageIndex = 0;
    let galleryImages = [];

    // Initialize gallery images array
    const galleryImagesElements = document.querySelectorAll('.gallery-image img');
    galleryImagesElements.forEach((img, index) => {
        galleryImages.push({
            src: img.src,
            alt: img.alt,
            title: img.closest('.gallery-item').querySelector('.overlay-content h3').textContent,
            description: img.closest('.gallery-item').querySelector('.overlay-content p').textContent
        });
    });

    // Open lightbox
    galleryImagesElements.forEach((img, index) => {
        img.addEventListener('click', function () {
            currentImageIndex = index;
            openLightbox();
        });
    });

    // Close lightbox
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    if (lightboxModal) {
        lightboxModal.addEventListener('click', function (e) {
            if (e.target === lightboxModal) {
                closeLightbox();
            }
        });
    }

    // Navigation
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', showPreviousImage);
    }
    if (lightboxNext) {
        lightboxNext.addEventListener('click', showNextImage);
    }

    // Keyboard navigation
    document.addEventListener('keydown', function (e) {
        if (lightboxModal && lightboxModal.style.display === 'block') {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                showPreviousImage();
            } else if (e.key === 'ArrowRight') {
                showNextImage();
            }
        }
    });

    function openLightbox() {
        if (lightboxModal) {
            lightboxModal.style.display = 'block';
            updateLightboxImage();
            document.body.style.overflow = 'hidden';
        }
    }

    function closeLightbox() {
        if (lightboxModal) {
            lightboxModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    function updateLightboxImage() {
        if (galleryImages[currentImageIndex]) {
            const currentImage = galleryImages[currentImageIndex];
            if (lightboxImage) lightboxImage.src = currentImage.src;
            if (lightboxImage) lightboxImage.alt = currentImage.alt;
            if (lightboxCaption) {
                lightboxCaption.innerHTML = `<h3>${currentImage.title}</h3><p>${currentImage.description}</p>`;
            }
        }
    }

    function showPreviousImage() {
        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        updateLightboxImage();
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        updateLightboxImage();
    }

    // Contact form functionality
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const phone = formData.get('phone');
            const subject = formData.get('subject');
            const message = formData.get('message');

            // Basic validation
            if (!name || !email || !subject || !message) {
                alert('Please fill in all required fields.');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }

            // Simulate form submission
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;

            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                alert('Thank you for your message! We will get back to you soon.');
                this.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }

    // FAQ Accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', function () {
            const isActive = item.classList.contains('active');

            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });

            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Form field animations
    const formInputs = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', function () {
            this.parentElement.style.transform = 'translateY(-2px)';
        });

        input.addEventListener('blur', function () {
            this.parentElement.style.transform = 'translateY(0)';
        });
    });

    // Hero Slider Functionality
    const heroSlider = document.querySelector('.hero-slider');
    if (heroSlider) {
        const slides = document.querySelectorAll('.hero-slide');
        const indicators = document.querySelectorAll('.indicator');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');

        let currentSlide = 0;
        let slideInterval;
        const slideDelay = 5000; // 5 seconds between slides

        // Function to show a specific slide
        function showSlide(index) {
            // Remove active class from all slides and indicators
            slides.forEach(slide => slide.classList.remove('active'));
            indicators.forEach(indicator => indicator.classList.remove('active'));

            // Add active class to current slide and indicator
            slides[index].classList.add('active');
            indicators[index].classList.add('active');

            currentSlide = index;
        }

        // Function to show next slide
        function nextSlide() {
            const nextIndex = (currentSlide + 1) % slides.length;
            showSlide(nextIndex);
        }

        // Function to show previous slide
        function prevSlide() {
            const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(prevIndex);
        }

        // Start automatic sliding
        function startSlideShow() {
            slideInterval = setInterval(nextSlide, slideDelay);
        }

        // Stop automatic sliding
        function stopSlideShow() {
            clearInterval(slideInterval);
        }

        // Event listeners for navigation buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', function () {
                stopSlideShow();
                prevSlide();
                startSlideShow();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', function () {
                stopSlideShow();
                nextSlide();
                startSlideShow();
            });
        }

        // Event listeners for indicators
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', function () {
                stopSlideShow();
                showSlide(index);
                startSlideShow();
            });
        });

        // Pause slideshow on hover
        heroSlider.addEventListener('mouseenter', stopSlideShow);
        heroSlider.addEventListener('mouseleave', startSlideShow);

        // Keyboard navigation
        document.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowLeft') {
                stopSlideShow();
                prevSlide();
                startSlideShow();
            } else if (e.key === 'ArrowRight') {
                stopSlideShow();
                nextSlide();
                startSlideShow();
            }
        });

        // Touch/swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;

        heroSlider.addEventListener('touchstart', function (e) {
            touchStartX = e.changedTouches[0].screenX;
        });

        heroSlider.addEventListener('touchend', function (e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swipe left - next slide
                    stopSlideShow();
                    nextSlide();
                    startSlideShow();
                } else {
                    // Swipe right - previous slide
                    stopSlideShow();
                    prevSlide();
                    startSlideShow();
                }
            }
        }

        // Start the slideshow
        startSlideShow();
    }
});

// Add CSS animation for counting up effect
const style = document.createElement('style');
style.textContent = `
    @keyframes countUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fadeIn {
        from { 
            opacity: 0; 
            transform: translateY(20px); 
        }
        to { 
            opacity: 1; 
            transform: translateY(0); 
        }
    }
    
    @keyframes slideInFromRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideInFromLeft {
        from {
            opacity: 0;
            transform: translateX(-100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
