import * as requestPromise from 'request-promise';
import * as cheerio from 'cheerio';
import * as nodemailer from 'nodemailer';
import { credentials } from './gmail-credentials';

interface ICategory {
    name: string;
    url: string;
    foundCars: ICar[]
};

interface ICar {
    title: string;
    price: string;
    location: string;
    url: string;
};


(async () => {

    const categories: ICategory[] = [
        {
            name: 'Toyota Camrys',
            url: 'https://boise.craigslist.org/search/cta?auto_make_model=toyota%20camry&auto_title_status=1&max_auto_miles=100000&max_price=11000&min_auto_year=2010&min_price=7000',
            foundCars: [] as ICar[]
        },
        {
            name: 'Mazda 3s',
            url: 'https://boise.craigslist.org/search/cta?min_price=7000&max_price=12000&auto_make_model=mazda&min_auto_year=2014&max_auto_year=2016&max_auto_miles=100000&auto_title_status=1',
            foundCars: [] as ICar[]
        }
    ];


    for (let category of categories) {

        const html = await requestPromise.get(category.url);

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

    try {
        await sendMail(categories);
    }
    catch (e) {
        console.log('An error occured while sending the mail', e);
    }

})();


async function sendMail(categories: ICategory[]) {

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