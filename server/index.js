const {
    client,
    createTables,
    createCustomer,
    createRestaurant,
    fetchCustomers,
    fetchRestaurants
} = require('./db');

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
};

init();