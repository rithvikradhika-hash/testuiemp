const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1080 });
  
  console.log('Navigating to Figma site...');
  await page.goto('https://thorn-clap-14330096.figma.site/', { waitUntil: 'networkidle2', timeout: 60000 });
  
  // Wait 5 seconds for visual stability
  await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 5000)));

  // Let's find all text elements or interactive elements
  const textElements = await page.evaluate(() => {
    const results = [];
    const elements = document.querySelectorAll('*');
    for (let el of elements) {
      const text = el.textContent ? el.textContent.trim() : '';
      if (text && el.children.length === 0) { // Leaf nodes with text
        results.push({
          text: text,
          tagName: el.tagName,
          className: el.className,
          rect: el.getBoundingClientRect().toJSON()
        });
      }
    }
    return results;
  });
  
  console.log('FOUND LEAF TEXT ELEMENTS:');
  console.log(JSON.stringify(textElements, null, 2));
  
  await browser.close();
})();
