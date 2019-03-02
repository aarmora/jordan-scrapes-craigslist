import { ICategory, ICar } from '../index';
import { expect } from 'chai';
import nock from 'nock';
import { successCraigslistHtml } from './craigslist-page.stub';
import { scrapeCraigslist } from '../scrape-craigslist';
import { fail } from 'assert';


describe('scrapeCraigslist()', () => {
    
    describe('Successes', () => {

        nock('https://boise.craigslist.org').get('/search/cta?auto_make_model=toyota%20camry&auto_title_status=1&max_auto_miles=100000&max_price=11000&min_auto_year=2010&min_price=7000').reply(200, successCraigslistHtml).persist();


        after(() => {
            nock.cleanAll();
        });

        it('should return the same amount of categories passed in', async () => {
            const categories: ICategory[] = [
                {
                    name: 'Toyota Camrys',
                    url: 'https://boise.craigslist.org/search/cta?auto_make_model=toyota%20camry&auto_title_status=1&max_auto_miles=100000&max_price=11000&min_auto_year=2010&min_price=7000',
                    foundCars: [] as ICar[]
                }
            ];

            const categoriesResponse: any = await scrapeCraigslist(categories);

            expect(categoriesResponse.length).to.equal(categories.length);
        });

        it('should have a price of $8495 on the first car', async () => {
            const categories: ICategory[] = [
                {
                    name: 'Toyota Camrys',
                    url: 'https://boise.craigslist.org/search/cta?auto_make_model=toyota%20camry&auto_title_status=1&max_auto_miles=100000&max_price=11000&min_auto_year=2010&min_price=7000',
                    foundCars: [] as ICar[]
                }
            ];

            try {
                const categoriesResponse: ICategory[] = await scrapeCraigslist(categories);
                expect(categoriesResponse[0].foundCars[0].price).to.equal('$8495');
            }
            catch (e) {
                fail(`Shouldn't fail, ${e}`);
            }
        });

        it('should have a price of $10871 on the second car', async () => {
            const categories: ICategory[] = [
                {
                    name: 'Toyota Camrys',
                    url: 'https://boise.craigslist.org/search/cta?auto_make_model=toyota%20camry&auto_title_status=1&max_auto_miles=100000&max_price=11000&min_auto_year=2010&min_price=7000',
                    foundCars: [] as ICar[]
                }
            ];

            try {
                const categoriesResponse: ICategory[] = await scrapeCraigslist(categories);
                expect(categoriesResponse[0].foundCars[1].price).to.equal('$10871');
            }
            catch (e) {
                fail(`Shouldn't fail, ${e}`);
            }
        });

        it('should have a title of 2012 TOYOTA CAMRY SE on the first car', async () => {
            const categories: ICategory[] = [
                {
                    name: 'Toyota Camrys',
                    url: 'https://boise.craigslist.org/search/cta?auto_make_model=toyota%20camry&auto_title_status=1&max_auto_miles=100000&max_price=11000&min_auto_year=2010&min_price=7000',
                    foundCars: [] as ICar[]
                }
            ];

            try {
                const categoriesResponse: ICategory[] = await scrapeCraigslist(categories);
                expect(categoriesResponse[0].foundCars[0].title).to.equal('2012 TOYOTA CAMRY SE');
            }
            catch (e) {
                fail(`Shouldn't fail, ${e}`);
            }
        });

        it('should have a location of " (BOISE)" on the first car', async () => {
            const categories: ICategory[] = [
                {
                    name: 'Toyota Camrys',
                    url: 'https://boise.craigslist.org/search/cta?auto_make_model=toyota%20camry&auto_title_status=1&max_auto_miles=100000&max_price=11000&min_auto_year=2010&min_price=7000',
                    foundCars: [] as ICar[]
                }
            ];

            try {
                const categoriesResponse: ICategory[] = await scrapeCraigslist(categories);
                expect(categoriesResponse[0].foundCars[0].location).to.equal(' (BOISE)');
            }
            catch (e) {
                fail(`Shouldn't fail, ${e}`);
            }
        });

        it('should find four cars', async () => {
            const categories: ICategory[] = [
                {
                    name: 'Toyota Camrys',
                    url: 'https://boise.craigslist.org/search/cta?auto_make_model=toyota%20camry&auto_title_status=1&max_auto_miles=100000&max_price=11000&min_auto_year=2010&min_price=7000',
                    foundCars: [] as ICar[]
                }
            ];

            try {
                const categoriesResponse: ICategory[] = await scrapeCraigslist(categories);
                expect(categoriesResponse[0].foundCars.length).to.equal(4);
            }
            catch (e) {
                fail(`Shouldn't fail, ${e}`);
            }
        });

    });

    describe('Errors', () => {


        it('should handle a request error', async () => {
            nock('https://boise.craigslist.org').get('/search/cta?auto_make_model=toyota%20camry&auto_title_status=1&max_auto_miles=100000&max_price=11000&min_auto_year=2010&min_price=7000').replyWithError('Broken');
            const categories: ICategory[] = [
                {
                    name: 'Toyota Camrys',
                    url: 'https://boise.craigslist.org/search/cta?auto_make_model=toyota%20camry&auto_title_status=1&max_auto_miles=100000&max_price=11000&min_auto_year=2010&min_price=7000',
                    foundCars: [] as ICar[]
                }
            ];

            let error;
            try {
                await scrapeCraigslist(categories);
            }
            catch (e) {
                error = e;
            }

            expect(error).to.equal(`Failure while getting category url ${categories[0].url}, RequestError: Error: Broken`);

        });

    });

});