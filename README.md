# Jordan Scrapes Craigslist

Searches Craigslist by url (with proper filters) and then sends an email.

## Getting Started

Clone the repository and run `npm i`. 

You will need to rename `src/sample-gmail-credentials.ts` to `src/gmail-credentials.ts` and replace the username and email with correct ones.

You will need to go to craigslist and get the url(s) you are wanting to scrape and replace them in the `src/index.ts` file.

After that, you just need to run `npm start` and it'll scrape the categories and email the results to you.

[Full Guide](https://javascriptwebscrapingguy.com/blog/jordan-scrapes-amazon-looking-for-products-to-sell/)

### Prerequisites

Tested on Node v8.11.2 and NPM v5.6.0.

### Installing

After installing [NodeJS](https://nodejs.org/en/) you should be able to just run the following in the terminal.

```
npm i
```

## Built With

* [Request-Promise](https://github.com/request/request-promise) - Promise based HTTP request library
* [Nodemailer](https://github.com/nodemailer/nodemailer) - Simple SMTP email library
* [Cheerio](https://github.com/cheeriojs/cheerio) - Simple JQuery API based html parser
* [NodeJS](https://nodejs.org/en/) - NodeJS

## Authors

* **Jordan Hansen** - *Initial work* - [Jordan Hansen](https://github.com/aarmora)


## License

This project is licensed under the ISC License