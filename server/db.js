const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_hr_db');
const uuid = require('uuid');

const createTables = async()=> {
    const SQL = `
  DROP TABLE IF EXISTS reservations;
  DROP TABLE IF EXISTS customers;
  DROP TABLE IF EXISTS restaurants;
  
  CREATE TABLE customers(
    id UUID PRIMARY KEY,
    name VARCHAR(100)
  );
  CREATE TABLE restaurants(
    id UUID PRIMARY KEY,
    name VARCHAR(100)
  );
  CREATE TABLE reservations(
    id UUID PRIMARY KEY,
    date DATE NOT NULL,
    party_count INTEGER NOT NULL,
    customer_id UUID REFERENCES customers(id) NOT NULL,
    restaurant_id UUID REFERENCES restaurants(id) NOT NULL
  );
    `;
    await client.query(SQL);
  };

const createCustomer = async(name)=> {
    const SQL = `
      INSERT INTO customers(id, name) VALUES($1, $2) RETURNING *
    `;
    const response = await client.query(SQL, [uuid.v4(), name]);
    return response.rows[0];
  };

  const createRestaurant = async(name)=> {
    const SQL = `
      INSERT INTO restaurant(id, name) VALUES($1, $2) RETURNING *
    `;
    const response = await client.query(SQL, [uuid.v4(), name]);
    return response.rows[0];
  };

  const createReservation = async({ date, party_count, customer_name, restaurant_name})=> {
    const SQL = `
      INSERT INTO reservations(id, date, party_count, customer_id, restaurant_id) VALUES($1, $2, $3, (SELECT id FROM customers WHERE name=$4), (SELECT id FROM restaurants WHERE name=$5)) RETURNING *
    `;
    const response = await client.query(SQL, [uuid.v4(), date, party_count, customer_name, restaurant_name]);
    return response.rows[0];
  };

  const fetchCustomers = async()=> {
    const SQL = `
  SELECT *
  FROM customers
    `;
    const response = await client.query(SQL);
    return response.rows;
  };

  const fetchRestaurants = async()=> {
    const SQL = `
  SELECT *
  FROM restaurants
    `;
    const response = await client.query(SQL);
    return response.rows;
  };

  const fetchReservations = async()=> {
    const SQL = `
  SELECT *
  FROM reservations
    `;
    const response = await client.query(SQL);
    return response.rows;
  };

  const destroyReservation = async(id)=> {
    const SQL = `
  DELETE FROM reservations
  where id = $1
    `;
    await client.query(SQL, [id]);
  };

module.exports = {
  client,
  createTables,
  createCustomer, 
  createRestaurant,
  fetchCustomers,
  fetchRestaurants,
  createReservation,
  fetchReservations,
  destroyReservation
};