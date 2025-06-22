#!/usr/bin/env node

// Create a proper favicon from the existing SVG icon
const fs = require('fs');
const path = require('path');

// Create a more detailed favicon SVG
function createFaviconSVG() {
  return `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#a78bfa;stop-opacity:1" />
    </linearGradient>
  </defs>
  <!-- Background with rounded corners -->
  <rect width="32" height="32" rx="6" fill="url(#grad)"/>
  
  <!-- Neural network nodes -->
  <circle cx="10" cy="10" r="2.5" fill="white" opacity="0.9"/>
  <circle cx="22" cy="10" r="2.5" fill="white" opacity="0.9"/>
  <circle cx="16" cy="22" r="2.5" fill="white" opacity="0.9"/>
  <circle cx="16" cy="16" r="1.5" fill="white" opacity="0.7"/>
  
  <!-- Neural network connections -->
  <line x1="10" y1="10" x2="22" y2="10" stroke="white" stroke-width="1" opacity="0.6"/>
  <line x1="10" y1="10" x2="16" y2="22" stroke="white" stroke-width="1" opacity="0.6"/>
  <line x1="22" y1="10" x2="16" y2="22" stroke="white" stroke-width="1" opacity="0.6"/>
  <line x1="10" y1="10" x2="16" y2="16" stroke="white" stroke-width="1" opacity="0.6"/>
  <line x1="22" y1="10" x2="16" y2="16" stroke="white" stroke-width="1" opacity="0.6"/>
  <line x1="16" y1="16" x2="16" y2="22" stroke="white" stroke-width="1" opacity="0.6"/>
  
  <!-- AI text -->
  <text x="16" y="28" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="6" font-weight="bold">AI</text>
</svg>`;
}

// Create different sizes of favicon
const sizes = [16, 32, 48];
const publicDir = path.join(__dirname, '../public');

// Create favicon.svg
const faviconSVG = createFaviconSVG();
fs.writeFileSync(path.join(publicDir, 'favicon.svg'), faviconSVG);
console.log('Created favicon.svg');

// Create apple-touch-icon (180x180)
function createAppleTouchIcon() {
  return `<svg width="180" height="180" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#a78bfa;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="180" height="180" rx="30" fill="url(#grad)"/>
  <circle cx="54" cy="54" r="14" fill="white" opacity="0.9"/>
  <circle cx="126" cy="54" r="14" fill="white" opacity="0.9"/>
  <circle cx="90" cy="126" r="14" fill="white" opacity="0.9"/>
  <circle cx="90" cy="90" r="8" fill="white" opacity="0.7"/>
  <line x1="54" y1="54" x2="126" y2="54" stroke="white" stroke-width="6" opacity="0.6"/>
  <line x1="54" y1="54" x2="90" y2="126" stroke="white" stroke-width="6" opacity="0.6"/>
  <line x1="126" y1="54" x2="90" y2="126" stroke="white" stroke-width="6" opacity="0.6"/>
  <line x1="54" y1="54" x2="90" y2="90" stroke="white" stroke-width="4" opacity="0.6"/>
  <line x1="126" y1="54" x2="90" y2="90" stroke="white" stroke-width="4" opacity="0.6"/>
  <line x1="90" y1="90" x2="90" y2="126" stroke="white" stroke-width="4" opacity="0.6"/>
  <text x="90" y="160" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="24" font-weight="bold">AI</text>
</svg>`;
}

fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.svg'), createAppleTouchIcon());
console.log('Created apple-touch-icon.svg');

console.log('✅ All favicon files created successfully!');
