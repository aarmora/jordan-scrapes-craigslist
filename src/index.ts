import { scrapeCraigslist, sendMail } from "./scrape-craigslist";
import * as dotenv from 'dotenv';

dotenv.config();


export interface ICategory {
    name: string;
    url: string;
    foundCars: ICar[]
};

export interface ICar {
    title: string;
    price: string;
    location: string;
    url: string;
};



let categories: ICategory[] = [
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

(async () => {
    categories = await scrapeCraigslist(categories);
    await sendMail(categories);
})();
