// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initMobileMenu();
    initSlideshow();
    initFormValidation();
    loadPrograms();
});

// MOBILE MENU TOGGLE
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Animate hamburger menu
            const spans = menuToggle.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                const spans = menuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Close menu when clicking a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                const spans = menuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }
}

// IMAGE SLIDESHOW (Gallery)
function initSlideshow() {
    const slideshow = document.querySelector('.slideshow-container');
    const dotscontainer = document.querySelector('.slideshow-dots');
    
    if (!slideshow) return;
    
    const slides = slideshow.querySelectorAll('.slide');
    const dots = dotscontainer.querySelectorAll('.dot');
    const prevBtn = slideshow.querySelector('.slideshow-nav.prev');
    const nextBtn = slideshow.querySelector('.slideshow-nav.next');
    console.log('Dots found:', dots.length);
    console.log('Slides found:', slides.length);
    
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    let slideInterval;
    
    // Function to show specific slide
    function showSlide(index) {
        // Remove active class from all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Handle index bounds
        if (index >= slides.length) currentSlide = 0;
        else if (index < 0) currentSlide = slides.length - 1;
        else currentSlide = index;
        
        // Add active class to current slide and dot
        slides[currentSlide].classList.add('active');
        if (dots[currentSlide]) {
            dots[currentSlide].classList.add('active');
        }
    }
    
    // Next slide function
    function nextSlide() {
        showSlide(currentSlide + 1);
    }
    
    // Previous slide function
    function prevSlide() {
        showSlide(currentSlide - 1);
    }
    
    // Auto-advance slides
    function startSlideshow() {
        slideInterval = setInterval(nextSlide, 5000);
    }
    
    function stopSlideshow() {
        clearInterval(slideInterval);
    }
    
    // Event listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            prevSlide();
            stopSlideshow();
            startSlideshow();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            nextSlide();
            stopSlideshow();
            startSlideshow();
        });
    }
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            showSlide(index);
            stopSlideshow();
            startSlideshow();
        });
    });
    
    // Pause on hover
    slideshow.addEventListener('mouseenter', stopSlideshow);
    slideshow.addEventListener('mouseleave', startSlideshow);
    
    // Start the slideshow
    showSlide(0);
    startSlideshow();
}

// FORM VALIDATION (Contact/Registration)
function initFormValidation() {
    const form = document.getElementById('contactForm');
    
    if (!form) return;
    
    const formGroups = form.querySelectorAll('.form-group');
    const submitBtn = form.querySelector('.form-submit');
    const successMessage = document.querySelector('.form-success');
    
    // Validation rules
    const validators = {
        firstName: {
            validate: function(value) {
                return value.trim().length >= 2;
            },
            message: 'First name must be at least 2 characters'
        },
        lastName: {
            validate: function(value) {
                return value.trim().length >= 2;
            },
            message: 'Last name must be at least 2 characters'
        },
        email: {
            validate: function(value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value);
            },
            message: 'Please enter a valid email address'
        },
        phone: {
            validate: function(value) {
                const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
                return phoneRegex.test(value);
            },
            message: 'Please enter a valid phone number'
        },
        grade: {
            validate: function(value) {
                return value !== '';
            },
            message: 'Please select a grade'
        },
        message: {
            validate: function(value) {
                return value.trim().length >= 10;
            },
            message: 'Message must be at least 10 characters'
        }
    };
    
    // Validate single field
    function validateField(fieldName) {
        const input = form.querySelector(`[name="${fieldName}"]`);
        const formGroup = input.closest('.form-group');
        
        if (!input || !formGroup) return true;
        
        const value = input.value;
        const validator = validators[fieldName];
        
        if (validator && !validator.validate(value)) {
            formGroup.classList.add('has-error');
            input.classList.add('error');
            const errorEl = formGroup.querySelector('.form-error');
            if (errorEl) errorEl.textContent = validator.message;
            return false;
        } else {
            formGroup.classList.remove('has-error');
            input.classList.remove('error');
            return true;
        }
    }
    
    // Real-time validation on blur
    formGroups.forEach(group => {
        const input = group.querySelector('input, select, textarea');
        if (input) {
            input.addEventListener('blur', function() {
                const fieldName = this.name;
                if (validators[fieldName]) {
                    validateField(fieldName);
                }
            });
            
            // Clear error on input
            input.addEventListener('input', function() {
                group.classList.remove('has-error');
                this.classList.remove('error');
            });
        }
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        
        // Validate all fields
        for (const fieldName in validators) {
            if (!validateField(fieldName)) {
                isValid = false;
            }
        }
        
        // Check checkbox
        const termsCheckbox = form.querySelector('[name="terms"]');
        if (termsCheckbox && !termsCheckbox.checked) {
            isValid = false;
            const formGroup = termsCheckbox.closest('.form-group');
            if (formGroup) formGroup.classList.add('has-error');
        }
        
        if (isValid) {
            // Simulate form submission
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            setTimeout(function() {
                // Show success message
                form.reset();
                submitBtn.textContent = 'Send Message';
                submitBtn.disabled = false;
                
                if (successMessage) {
                    successMessage.classList.add('show');
                    
                    // Hide success message after 5 seconds
                    setTimeout(function() {
                        successMessage.classList.remove('show');
                    }, 5000);
                }
                
                // Show thank you message
                alert('Thank you for your message! We will get back to you soon.');
            }, 1500);
        } else {
            // Scroll to first error
            const firstError = form.querySelector('.has-error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
}


//  DYNAMIC CONTENT - Program Cards
function loadPrograms() {
    const programs = [
        {
            title: 'Science & Technology',
            description: 'Comprehensive science curriculum with modern laboratories and technology integration.',
            features: ['Physics, Chemistry, Biology', 'Computer Science', 'Robotics Lab', 'Science Fair'],
            tag: 'Popular',
            image: '/assets/images/smiles.jpeg'
        },
        {
            title: 'Arts & Humanities',
            description: 'Nurturing creativity and critical thinking through arts and social sciences.',
            features: ['Visual Arts', 'Music & Drama', 'History & Geography', 'Languages'],
            tag: 'Featured',
            image: '/assets/images/cultural-dance.jpeg'
        },
        {
            title: 'Business & Commerce',
            description: 'Preparing students for the global business environment with practical skills.',
            features: ['Accounting', 'Economics', 'Business Studies', 'Entrepreneurship'],
            tag: 'New',
            image: '/assets/images/business.jpg'
        }
    ];
    
    const container = document.getElementById('programsContainer');
    if (!container) {console.error('Programs container not found');return;}
    
    programs.forEach((program, index) => {
        const card = document.createElement('div');
        card.className = 'program-card';
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.innerHTML = `
            <img src="${program.image}" alt="${program.title}" class="program-image">
            <div class="program-content">
                <span class="program-tag">${program.tag}</span>
                <h3>${program.title}</h3>
                <p>${program.description}</p>
                <ul class="program-features">
                    ${program.features.map(f => `<li>${f}</li>`).join('')}
                </ul>
                <a href="academics.html" class="card-link">Learn More →</a>
            </div>
        `;
        
        container.appendChild(card);
    });
}
