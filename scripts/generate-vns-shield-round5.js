import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputDir = path.join(__dirname, '../public/vns-logos/round5');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Provided Shield Path (512x512)
const shieldPathData = "M415.604,95.634c-53.25-2.957-99.414-23.406-126.661-56.103L256.001,0l-32.943,39.531c-27.246,32.698-73.41,53.146-126.661,56.103l-40.503,2.249v187.069c0,119.014,161.8,207.019,180.245,216.662L256.001,512l19.862-10.386c18.444-9.642,180.244-97.648,180.244-216.662V97.883L415.604,95.634z";

// Inner shield for detailing (roughly scaled down or just a cutout shape)
// Simplified from the main shape for decorative purposes
const shieldInnerPath = "M 256 70 L 370 120 V 270 C 370 350 256 420 256 420 C 256 420 142 350 142 270 V 120 L 256 70 Z";

const textElement = `<text x="256" y="320" font-family="Arial, sans-serif" font-weight="bold" font-size="140" text-anchor="middle" letter-spacing="10" fill="#FFFFFF">VNS</text>`;

const c = {
    cyan: '#00BCD4',
    darkCyan: '#006064',
    lightCyan: '#80DEEA',
    teal: '#009688',
    darkTeal: '#004D40',
    blue: '#2196F3',
    darkBlue: '#0D47A1',
    white: '#FFFFFF',
    neonBlue: '#00E5FF',
    gold: '#FFD700',
    silver: '#C0C0C0',
    black: '#121212',
    accentRed: '#FF5252'
};

const variations = [
    // 1. Solid Base
    {
        name: 'r5-01-solid-base',
        svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <path d="${shieldPathData}" fill="${c.cyan}"/>
  ${textElement}
</svg>`
    },
    // 2. Outlined Tech
    {
        name: 'r5-02-outlined-tech',
        svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <path d="${shieldPathData}" fill="${c.darkTeal}" stroke="${c.neonBlue}" stroke-width="15"/>
  ${textElement}
</svg>`
    },
    // 3. Gradient Depth
    {
        name: 'r5-03-gradient-depth',
        svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="g03" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${c.cyan}"/><stop offset="100%" stop-color="${c.darkBlue}"/></linearGradient></defs>
  <path d="${shieldPathData}" fill="url(#g03)"/>
  <path d="${shieldInnerPath}" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="5"/>
  ${textElement}
</svg>`
    },
    // 4. Glassmorphism
    {
        name: 'r5-04-glassmorphism',
        svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="g04" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="rgba(255,255,255,0.4)"/><stop offset="100%" stop-color="rgba(255,255,255,0.1)"/></linearGradient></defs>
  <path d="${shieldPathData}" fill="${c.blue}"/>
  <circle cx="150" cy="150" r="100" fill="${c.cyan}" opacity="0.5"/>
  <path d="${shieldPathData}" fill="url(#g04)" stroke="rgba(255,255,255,0.5)" stroke-width="2"/>
  ${textElement}
</svg>`
    },
    // 5. Cyber Circuit
    {
        name: 'r5-05-cyber-circuit',
        svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <path d="${shieldPathData}" fill="${c.darkBlue}"/>
  <path d="M 256 50 V 450 M 100 200 H 400" stroke="${c.cyan}" stroke-width="5" stroke-opacity="0.5"/>
  <circle cx="256" cy="256" r="50" fill="none" stroke="${c.neonBlue}" stroke-width="5"/>
  ${textElement}
</svg>`
    },
    // 6. Neon Frame
    {
        name: 'r5-06-neon-frame',
        svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" style="background:${c.black}">
  <defs><filter id="neon6"><feGaussianBlur stdDeviation="8" result="glow"/><feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
  <path d="${shieldPathData}" fill="none" stroke="${c.neonBlue}" stroke-width="12" filter="url(#neon6)"/>
  ${textElement}
</svg>`
    },
    // 7. Gold Plated
    {
        name: 'r5-07-gold-plated',
        svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="g07" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#FFD700"/><stop offset="50%" stop-color="#B8860B"/><stop offset="100%" stop-color="#FFD700"/></linearGradient></defs>
  <path d="${shieldPathData}" fill="url(#g07)"/>
  <path d="${shieldPathData}" fill="none" stroke="#FFF" stroke-width="5" opacity="0.5"/>
  ${textElement.replace('#FFFFFF', '#000000')}
</svg>`
    },
    // 8. Dark Matter
    {
        name: 'r5-08-dark-matter',
        svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <path d="${shieldPathData}" fill="${c.black}"/>
  <path d="${shieldPathData}" fill="none" stroke="${c.darkTeal}" stroke-width="10"/>
  ${textElement.replace('#FFFFFF', c.cyan)}
</svg>`
    },
    // 9. Split Dual
    {
        name: 'r5-09-split-dual',
        svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs><mask id="half"><rect x="0" y="0" width="256" height="512" fill="white"/></mask></defs>
  <path d="${shieldPathData}" fill="${c.darkBlue}"/>
  <path d="${shieldPathData}" fill="${c.cyan}" mask="url(#half)"/>
  ${textElement}
</svg>`
    },
    // 10. Futuristic Hex
    {
        name: 'r5-10-futuristic-hex',
        svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs><pattern id="hex" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 20 0 L 40 10 L 40 30 L 20 40 L 0 30 L 0 10 Z" fill="none" stroke="${c.cyan}" opacity="0.3"/></pattern></defs>
  <path d="${shieldPathData}" fill="${c.darkBlue}"/>
  <path d="${shieldPathData}" fill="url(#hex)"/>
  ${textElement}
</svg>`
    },
    // 11. Core Energy
    {
        name: 'r5-11-core-energy',
        svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <path d="${shieldPathData}" fill="${c.darkTeal}"/>
  <circle cx="256" cy="256" r="120" fill="${c.neonBlue}" opacity="0.4" filter="blur(20px)"/>
  ${textElement}
</svg>`
    },
    // 12. Heavy Armor
    {
        name: 'r5-12-heavy-armor',
        svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <path d="${shieldPathData}" fill="${c.silver}"/>
  <path d="${shieldInnerPath}" fill="${c.darkCyan}"/>
  <circle cx="100" cy="150" r="10" fill="${c.black}" opacity="0.3"/>
  <circle cx="412" cy="150" r="10" fill="${c.black}" opacity="0.3"/>
  <circle cx="256" cy="450" r="10" fill="${c.black}" opacity="0.3"/>
  ${textElement}
</svg>`
    },
    // 13. Digital Rain
    {
        name: 'r5-13-digital-rain',
        svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <path d="${shieldPathData}" fill="${c.black}"/>
  <path d="${shieldPathData}" fill="none" stroke="${c.neonBlue}" stroke-width="2"/>
  <path d="M 150 50 V 150 M 200 100 V 300 M 300 50 V 250 M 350 150 V 350" stroke="${c.neonBlue}" stroke-width="4" stroke-linecap="round" opacity="0.7"/>
  ${textElement}
</svg>`
    },
    // 14. Royal Emblem
    {
        name: 'r5-14-royal-emblem',
        svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <path d="${shieldPathData}" fill="${c.darkBlue}"/>
  <path d="${shieldPathData}" fill="none" stroke="${c.gold}" stroke-width="15"/>
  <path d="M 256 100 L 300 180 L 212 180 Z" fill="${c.gold}" opacity="0.8"/>
  ${textElement}
</svg>`
    },
    // 15. Stealth
    {
        name: 'r5-15-stealth',
        svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <path d="${shieldPathData}" fill="#222"/>
  <path d="${shieldInnerPath}" fill="#333"/>
  ${textElement.replace('#FFFFFF', '#555')}
</svg>`
    },
    // 16. Warning
    {
        name: 'r5-16-warning',
        svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <path d="${shieldPathData}" fill="${c.black}"/>
  <path d="${shieldPathData}" fill="none" stroke="${c.accentRed}" stroke-width="15" stroke-dasharray="40 20"/>
  ${textElement.replace('#FFFFFF', c.accentRed)}
</svg>`
    },
    // 17. Ice Shield
    {
        name: 'r5-17-ice-shield',
        svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <path d="${shieldPathData}" fill="${c.lightCyan}" opacity="0.8"/>
  <path d="M 256 0 L 512 512 H 0 Z" fill="white" opacity="0.2"/>
  ${textElement.replace('#FFFFFF', c.darkBlue)}
</svg>`
    },
    // 18. Nature Guardian
    {
        name: 'r5-18-nature-guardian',
        svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <path d="${shieldPathData}" fill="${c.teal}"/>
  <path d="M 256 512 C 100 400 50 200 100 100" fill="none" stroke="${c.lightCyan}" stroke-width="10" opacity="0.5"/>
  ${textElement}
</svg>`
    },
    // 19. Void
    {
        name: 'r5-19-void',
        svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <path d="${shieldPathData}" fill="none" stroke="${c.white}" stroke-width="2"/>
  <circle cx="256" cy="256" r="50" fill="${c.white}"/>
  ${textElement.replace('#FFFFFF', c.black)}
</svg>`
    },
    // 20. Final Polish
    {
        name: 'r5-20-final-polish',
        svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs><radialGradient id="g20" cx="50%" cy="0%" r="100%"><stop offset="0%" stop-color="${c.white}" opacity="0.8"/><stop offset="100%" stop-color="${c.cyan}" opacity="0"/></radialGradient></defs>
  <path d="${shieldPathData}" fill="${c.darkCyan}"/>
  <path d="${shieldPathData}" fill="url(#g20)"/>
  <path d="${shieldPathData}" fill="none" stroke="${c.white}" stroke-width="5"/>
  ${textElement}
</svg>`
    }
];

// Generate index.html content
let htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VNS Shield Round 5</title>
    <style>
        body { background: #E0E0E0; font-family: sans-serif; padding: 20px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; }
        .card { background: white; padding: 10px; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        img { max-width: 100%; height: auto; }
        h3 { font-size: 14px; margin: 10px 0 0; color: #333; }
        /* Dark mode toggle for viewing neon/white designs */
        .dark-mode { background: #1a1a1a; color: #fff; }
        .dark-mode .card { background: #333; }
        .dark-mode h3 { color: #fff; }
    </style>
</head>
<body>
    <h1>VNS Shield Round 5 (Using Provided Icon)</h1>
    <button onclick="document.body.classList.toggle('dark-mode')">Toggle Dark Mode</button>
    <br><br>
    <div class="grid">
`;

variations.forEach(v => {
    fs.writeFileSync(path.join(outputDir, `${v.name}.svg`), v.svg);
    console.log(`Generated ${v.name}.svg`);
    htmlContent += `
        <div class="card">
            <img src="${v.name}.svg" alt="${v.name}">
            <h3>${v.name}</h3>
        </div>
    `;
});

htmlContent += `
    </div>
</body>
</html>
`;

fs.writeFileSync(path.join(outputDir, 'index.html'), htmlContent);
console.log('Generated index.html');
console.log(`Completed generating ${variations.length} Round 5 variations.`);
