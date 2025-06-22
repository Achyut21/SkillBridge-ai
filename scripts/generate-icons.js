#!/usr/bin/env node

// Simple script to create placeholder PWA icons
const fs = require('fs');
const path = require('path');

const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, '../public/icons');

// Ensure icons directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate SVG icon template
function generateSVGIcon(size) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#a78bfa;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.1}" fill="url(#grad)"/>
  <circle cx="${size * 0.3}" cy="${size * 0.3}" r="${size * 0.08}" fill="white" opacity="0.8"/>
  <circle cx="${size * 0.7}" cy="${size * 0.3}" r="${size * 0.08}" fill="white" opacity="0.8"/>
  <circle cx="${size * 0.5}" cy="${size * 0.7}" r="${size * 0.08}" fill="white" opacity="0.8"/>
  <line x1="${size * 0.3}" y1="${size * 0.3}" x2="${size * 0.7}" y2="${size * 0.3}" stroke="white" stroke-width="${size * 0.02}" opacity="0.6"/>
  <line x1="${size * 0.3}" y1="${size * 0.3}" x2="${size * 0.5}" y2="${size * 0.7}" stroke="white" stroke-width="${size * 0.02}" opacity="0.6"/>
  <line x1="${size * 0.7}" y1="${size * 0.3}" x2="${size * 0.5}" y2="${size * 0.7}" stroke="white" stroke-width="${size * 0.02}" opacity="0.6"/>
  <text x="${size * 0.5}" y="${size * 0.9}" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="${size * 0.08}" font-weight="bold">AI</text>
</svg>`;
}

// Create icons
iconSizes.forEach(size => {
  const svgContent = generateSVGIcon(size);
  const filename = `icon-${size}x${size}.svg`;
  const filepath = path.join(iconsDir, filename);
  
  fs.writeFileSync(filepath, svgContent);
  console.log(`Created ${filename}`);
});

// Create additional icons
const additionalIcons = [
  { name: 'badge-72x72.svg', size: 72 },
  { name: 'dashboard-96x96.svg', size: 96 },
  { name: 'voice-96x96.svg', size: 96 },
  { name: 'learning-96x96.svg', size: 96 },
  { name: 'analytics-96x96.svg', size: 96 },
  { name: 'play-24x24.svg', size: 24 },
  { name: 'close-24x24.svg', size: 24 }
];

additionalIcons.forEach(({ name, size }) => {
  const svgContent = generateSVGIcon(size);
  const filepath = path.join(iconsDir, name);
  
  fs.writeFileSync(filepath, svgContent);
  console.log(`Created ${name}`);
});

console.log('✅ All PWA icons created successfully!');
