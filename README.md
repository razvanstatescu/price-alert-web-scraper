# Price Alert Web Scraper

This repository is associated with [this YouTube video](https://youtu.be/VED8-QgOQ2U).

In [this](https://youtu.be/bCFtoUm5uH4) we made a Node JS price alert web scraper that will go on different stores and send an email if a price goes below a certain threshold. This kind of script saved me a lot of time and effort when I was shopping for a laptop. You can also combine this with a cron job to run the script automatically and email you the products. 

We ueed [Puppeteer](https://github.com/puppeteer/puppeteer) for web scraping and  [Sendgrid](https://sendgrid.com) for send emails.

## Install 

In order to install the application you just have to clone the repository and run `npm install` in the project root folder.

## Use script

To use the script you have to edit the `products.json` and `credentials.js` (and optionally update the price element selector in app.js if you're not using this for Amazon) and run `npm start`.

You can find me on [Instagram](https://www.instagram.com/the.dev.guy/) or [YouTube](https://www.youtube.com/thedevguy).
I also have a [Podcast](https://anchor.fm/thedevguy) called [The Dev Chat](https://anchor.fm/thedevguy) where I bring people from the industry and talk about different IT related subjects.

