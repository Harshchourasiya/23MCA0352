const express = require('express');
const app = express();
require('dotenv').config()
const registeredCompanies = ["AMZ", 'FLP','SNP', 'MYN', 'AZO'];
const registeredCats = ['Phone', "Computer", 'TV', 'Earphone', 'Tablet', 'Charger', 'Mouse', 'Keypad', 'Bluetooth', 'Pendrive', 'Remote', 'Speaker', 'Headset', 'Laptop', 'PC'];

const getCostumURL = (company, product, n) => {
    return `http://20.244.56.144/test/companies/${company}/categories/${product}/products?top=${n}&minPrice=10&maxPrice=10000`
}
const bearer = 'Bearer ' + process.env.ACCESS_TOKEN;

app.get('/categories/:categoryname/product', async(req, res) => {
    res.contentType('json');
    const category = req.params.categoryname;
    const n = req.query.n;
    const sortBy = req.query.sortBy.split(","); 
    const des = req.query.orderBy == "DES";
    const page = req.query.page;
   if (registeredCats.indexOf(category) >= 0) {
        // code for getting the n top products
        const dataToSend = [];

        for (let comp of registeredCompanies) {
            const url = getCostumURL(comp, category, n);
            const data = await fetch(url, {
                headers: {
                    'Authorization': bearer,
                }
            });
            const jData = await data.json();
            for (let d of jData) {
                dataToSend.push({...d, id: parseInt(Math.random()*10000000)});
            }
        }


        // sorting
        
        for (let s of sortBy) {
            switch(s) {
                case 'price': 
                  dataToSend.sort((a, b)=> des ? b.price-a.price : a.price-b.price);
                  break;
                case 'discount':
                    dataToSend.sort((a,b)=> des ? b.discount - a.discount : a.discount-b.discount);
                    break;
            }
        }   

        
        // paging

        const pages = [];
        const size = parseInt(n*registeredCompanies.length/10);
        let idx = 0;
        for (let i = 0; i < size && idx < dataToSend.length; i++) {
            const pageData = [];
            for (let i = 0; i < 10 && idx < dataToSend.length; i++) {
                pageData.push(dataToSend[idx++]);
            }
            pages.push(pageData);
        }

        if (page && page < pages.length) {
            res.status(200).json(pages[page]);
        } else {
            res.status(200).json(dataToSend);
        }


    } else {
        res.status(404).json({message:'Product is Not present!'});
    }
});


app.listen(3000);

