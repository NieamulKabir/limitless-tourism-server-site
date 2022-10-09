const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9sbaw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const packagesCollection = client.db('limitlessTourism').collection('package');
        const bookingCollection = client.db('limitlessTourism').collection('bookings');

        //  GET API
        app.get('/package', async (req, res) => {
            const query = {};
            // RUN FIND OPERATION FOR ALL DATA FROM DATABASE COLLECTION 
            const cursor = packagesCollection.find(query);
            // CONVERT DATA TO AN ARRAY
            const packages = await cursor.toArray();
            res.send(packages);
        })
        //  GET SINGLE PACKAGE (READ SPECIFIC DATA FROM SERVER DATABASE)
        app.get('/package/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const package = await packagesCollection.findOne(query);
            res.send(package);
        })

        //GET BOOKING information
        app.get('/bookings', async (req, res) => {
            const query = {};
            const cursor = bookingCollection.find(query);
            const bookings = await cursor.toArray();
            res.send(bookings)
        })

        //  GET SINGLE BOOKING (READ SPECIFIC DATA FROM SERVER DATABASE)
        app.get('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const package = await bookingCollection.findOne(query);
            res.send(package);
        })


        //POST
        //Add Single package
        app.post('/package', async (req, res) => {
            const newPackage = req.body;
            const result = await packagesCollection.insertOne(newPackage);
            res.send(result);
        })

        //add booking
        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            const result = await bookingCollection.insertOne(booking);
            res.send(result);
        })


        //DELETE
        app.delete('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookingCollection.deleteOne(query);
            res.send(result);
        })

        //PUT
        app.put('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const updateStatus = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: updateStatus.status,
                },
            };
            const result = await bookingCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })
    }
    finally {

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Well come to Limitless-Tourism Server')
})


app.listen(port, () => {
    console.log("Limitless-tourism Server is running");
})