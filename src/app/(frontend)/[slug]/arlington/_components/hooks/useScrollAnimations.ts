'use client';

import { useEffect } from 'react';

export function useScrollAnimations() {
  useEffect(() => {

    // Header scroll effect with enhanced animations and hide/show behavior
    const header = document.querySelector('header');
    let lastScrollY = 0;
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const scrollDirection = scrollY > lastScrollY ? 'down' : 'up';
          const scrollDelta = Math.abs(scrollY - lastScrollY);
          
          // Header size states - bigger at top, smaller when scrolled
          if (scrollY < 20) {
            header?.classList.add('header-at-top');
            header?.classList.remove('header-scrolled');
          } else if (scrollY > 100) {
            header?.classList.remove('header-at-top');
            header?.classList.add('header-scrolled');
          } else {
            header?.classList.remove('header-at-top');
            header?.classList.remove('header-scrolled');
          }
          
          // Header hide/show behavior
          if (scrollY > 150 && scrollDelta > 10) {
            if (scrollDirection === 'down') {
              // Hide header when scrolling down
              header?.classList.add('header-hidden');
              header?.classList.remove('header-visible');
            } else if (scrollDirection === 'up') {
              // Show header when scrolling up
              header?.classList.remove('header-hidden');
              header?.classList.add('header-visible');
            }
          } else if (scrollY < 150) {
            // Always show header near top
            header?.classList.remove('header-hidden');
            header?.classList.add('header-visible');
          }
          
          // Clean scroll behavior - removed complex shadow effects
          
          // Parallax effects
          const parallaxSlow = scrollY * 0.3;
          const parallaxMedium = scrollY * 0.5;
          const parallaxFast = scrollY * 0.7;

          document.documentElement.style.setProperty('--scroll-offset-slow', `${parallaxSlow}px`);
          document.documentElement.style.setProperty('--scroll-offset-medium', `${parallaxMedium}px`);
          document.documentElement.style.setProperty('--scroll-offset-fast', `${parallaxFast}px`);
          
          lastScrollY = scrollY;
          ticking = false;
        });
        ticking = true;
      }
    };


    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check
    handleScroll();

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
}