import puppeteer from "puppeteer";

export async function getWebsiteLogo(website: string): Promise<string | null> {
  console.log("Getting logo for website:", website);
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(website);

  const logo: string | null = await page.evaluate(() => {
    let logo: HTMLLinkElement | HTMLImageElement | null =
      document.querySelector('link[rel="icon"]');
    if (!logo) logo = document.querySelector('link[rel="shortcut icon"]');
    if (!logo) logo = document.querySelector('img[alt*="logo"]');
    return logo
      ? (logo as HTMLLinkElement).href || (logo as HTMLImageElement).src
      : null;
  });

  console.log(`Logo URL: ${logo}`);
  console.log("Closing browser");

  await browser.close();
  return logo;
}
