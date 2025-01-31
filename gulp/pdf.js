import tap from "gulp-tap";
import puppeteer from "puppeteer";
import gulp from "gulp";
import path from "path";

export const htmlToPdf = async () =>
  new Promise((resolve, reject) => gulp.src("public/resume.html")
    .pipe(tap(async (file) => {
      const browser = await puppeteer.launch({headless: "new"});
      const page = await browser.newPage();
      await page.goto("file://" + file.path);
      await page._client().send('Animation.setPlaybackRate', { playbackRate: 1000 });
      await page.waitForTimeout(1000);
      // https://pptr.dev/api/puppeteer.pdfoptions
      await page.pdf({
        path: 'public/' + path.basename(file.basename, ".html") + ".pdf",
        // printBackground: true,
        // omitBackground: true,
        format: 'Letter'
      });

      await page.screenshot({ path: 'public/' + path.basename(file.basename, ".html") + ".png", fullPage: true});

      await browser.close();
      resolve();
    }))
    .on('error', reject))


//
gulp.task('pdf', htmlToPdf);

export default htmlToPdf;
