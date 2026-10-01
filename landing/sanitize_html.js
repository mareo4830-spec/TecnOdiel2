import fs from 'fs';

let html = fs.readFileSync('dist/index.html', 'utf8');

// Find the bundled JS script tag
const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/g;
let match;
let bundleScript = null;

while ((match = scriptRegex.exec(html)) !== null) {
  if (match[0].includes('createRoot') || match[0].includes('createElement') || match[0].includes('relList')) {
    bundleScript = match[0];
    break;
  }
}

if (bundleScript) {
  // Remove bundle script from its original position (head)
  const scriptIndex = html.indexOf(bundleScript);
  if (scriptIndex !== -1) {
    html = html.substring(0, scriptIndex) + html.substring(scriptIndex + bundleScript.length);
  }

  // Ensure it's a standard script tag, not module
  let cleanScript = bundleScript
    .replace(/<script\s+type=["']module["']\s+crossorigin>/i, '<script>')
    .replace(/<script\s+type=["']module["']>/i, '<script>')
    .replace(/<script\s+defer>/i, '<script>');

  // Insert right before </body>, after <div id="root"></div> safely
  const bodyCloseIndex = html.indexOf('</body>');
  if (bodyCloseIndex !== -1) {
    html = html.substring(0, bodyCloseIndex) + '\n    ' + cleanScript + '\n  ' + html.substring(bodyCloseIndex);
  } else {
    html = html + '\n' + cleanScript;
  }
}

fs.writeFileSync('dist/index.html', html);
fs.writeFileSync('TecnOdiel.html', html);
console.log('Successfully positioned script before </body> safely without replacement bugs');

