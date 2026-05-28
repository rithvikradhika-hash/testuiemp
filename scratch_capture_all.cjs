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
  await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 5000)));

  const clickTab = async (name) => {
    console.log(`Clicking tab: ${name}`);
    await page.evaluate((tabName) => {
      // Find element containing tabName
      const xpath = `//span[text()='${tabName}'] | //div[text()='${tabName}'] | //p[text()='${tabName}'] | //a[text()='${tabName}']`;
      const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      const element = result.singleNodeValue;
      if (element) {
        element.click();
        return true;
      }
      return false;
    }, name);
    // Wait for transition
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 3000)));
    await page.screenshot({ path: `screenshot_${name.toLowerCase().replace(' ', '_')}.png` });
    console.log(`Saved screenshot_${name.toLowerCase().replace(' ', '_')}.png`);
  };

  await clickTab('Timesheet');
  await clickTab('Projects');
  await clickTab('Task Board');
  await clickTab('Reports');
  await clickTab('Approvals');
  await clickTab('Team');

  await browser.close();
  console.log('All tabs captured!');
})();
