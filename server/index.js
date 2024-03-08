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

app.get('/api/customers', async(req, res, next)=> {
    try {
      res.send(await fetchCustomers());
    }
    catch(ex){
      next(ex);
    }
  });
  
  app.get('/api/restaurants', async(req, res, next)=> {
    try {
      res.send(await fetchRestaurants());
    }
    catch(ex){
      next(ex);
    }
  });
  
  app.get('/api/reservations', async(req, res, next)=> {
    try {
      res.send(await fetchReservations());
    }
    catch(ex){
      next(ex);
    }
  });

  app.delete('/api/reservations/:id', async(req, res, next)=> {
    try {
      await destroyReservation(req.params.id);
      res.sendStatus(204);
    }
    catch(ex){
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
    // await Promise.all([
    //     createReservation({ date: '04/01/2024', party_count: 1, customer_name: moe.name, restaurant_name: sushi.name}),
    //     createReservation({ date: '04/15/2024', party_count: 15, customer_name: moe.name, restaurant_name: sushi.name})
    //   ]);
    console.log(await fetchReservations());
    //   console.log(reservations);
    // await destroyReservation(reservation[0].id);
    // console.log(await fetchReservations())
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`listening on port ${port}`));

};

init();