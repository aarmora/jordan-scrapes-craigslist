import * as requestPromise from 'request-promise';
import * as cheerio from 'cheerio';
import * as nodemailer from 'nodemailer';
import { credentials } from './gmail-credentials';
import { ICategory } from '.';

export async function scrapeCraigslist(categories: ICategory[]) {

    for (let category of categories) {

        let html;
        try {
            html = await requestPromise.get(category.url);
        }
        catch (e) {
            return Promise.reject(`Failure while getting category url ${category.url}, ${e}`);
        }

        const $ = cheerio.load(html);

        $('.result-row').each((index, element) => {
            const car = {
                title: $(element).find('p .result-title').text(),
                price: $(element).find('a .result-price').text(),
                location: $(element).find('.result-meta .result-hood').text(),
                url: $(element).find('a').attr('href')
            };
            category.foundCars.push(car);
        });
    }

    return Promise.resolve(categories);

}


export async function sendMail(categories: ICategory[]) {

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: credentials.email,
            pass: credentials.password
        }
    });
    let html = `Here's some cars that may be of general interest <br><br>`;

    for (let category of categories) {
        html += `${category.name} <br><br>`

        for (let car of category.foundCars) {
            html += `<a href="${car.url}">${car.title}</a>, ${car.price}, ${car.location}<br>`;
        }

        html += `<br><br>`;
    }


    const mailOptions = {
        from: credentials.email,
        to: credentials.email,
        subject: 'Craigslist updater',
        html: html
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log('Err', err);
            return Promise.reject(err);
        }
        else {
            return Promise.resolve(info);
        }
    });
}