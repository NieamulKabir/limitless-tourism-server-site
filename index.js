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

        app.get('/package', async (req, res) => {
            const query = {};
            const cursor = packagesCollection.find(query);
            const packages = await cursor.toArray();
            res.send(packages);
        })

        app.get('/package/:id', async(req,res)=>{
            const id = req.params.id;
            const query ={_id: ObjectId(id)};
            const package = await packagesCollection.findOne(query);
            res.send(package);
        })
    }
    finally {

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running My Node CURD Server')
})


app.listen(port, () => {
    console.log("Limitless-tourism Server is running");
})