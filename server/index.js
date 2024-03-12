const {
    client,
    createTables,
    createCustomer,
    createRestaurant,
    fetchCustomers,
    fetchRestaurants,
    createReservation,
    fetchReservations,
    destroyReservation
} = require('./db');

const express = require('express');
const app = express();
app.use(express.json());

app.get('/api/customers', async (req, res, next) => {
    try {
        res.send(await fetchCustomers());
    }
    catch (ex) {
        next(ex);
    }
});

app.get('/api/restaurants', async (req, res, next) => {
    try {
        res.send(await fetchRestaurants());
    }
    catch (ex) {
        next(ex);
    }
});

app.get('/api/reservations', async (req, res, next) => {
    try {
        res.send(await fetchReservations());
    }
    catch (ex) {
        next(ex);
    }
});

app.delete('/api/customers/:customer_id/reservations/:id ', async (req, res, next) => {
    try {
        await destroyReservation(req.params.id);
        res.sendStatus(204);
    }
    catch (ex) {
        next(ex);
    }
});

app.post('/api/customers/:id/reservations', async (req, res, next) => {
    try {
        res.status(201).send(await createVacation(req.body.date, req.body.party_count, req.body.customer_name, req.body.restaurant_name));
    }
    catch (ex) {
        next(ex);
    }
});


const init = async () => {
    await client.connect();
    console.log('connected to database');
    await createTables();
    console.log('tables created');
    const [moe, lucy, ethyl, sushi, jelly, BBQ, vegan] = await Promise.all([
        createCustomer('moe'),
        createCustomer('lucy'),
        createCustomer('ethyl'),
        createRestaurant('sushi'),
        createRestaurant('jelly'),
        createRestaurant('BBQ'),
        createRestaurant('vegan')
    ]);
    console.log(`moe has an id of ${moe.id}`);
    console.log(`sushi has an id of ${sushi.id}`);
    console.log(await fetchCustomers());
    console.log(await fetchRestaurants());
    await Promise.all([
        createReservation({ date: '04/01/2024', party_count: 1, customer_name: moe.name, restaurant_name: sushi.name }),
        createReservation({ date: '04/15/2024', party_count: 15, customer_name: moe.name, restaurant_name: sushi.name }),
        createReservation({ date: '12/06/2025', party_count: 3, customer_name: ethyl.name, restaurant_name: vegan.name })
    ]);
    const reservations = await fetchReservations();
    console.log(reservations);
    await destroyReservation(reservations[0].id);
    // console.log(await fetchReservations())

    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`listening on port ${port}`));

};

init();