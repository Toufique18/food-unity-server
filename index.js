const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json());

//mongodb connection

//console.log(process.env.DB_USER)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mhvsuxa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const foodCollection = client.db('food_unity').collection('food_info');
        const availableFood = client.db('food_unity').collection('available_food');


        app.post("/food_info", async (req, res) => {

            const newInformation = req.body;
            console.log(newInformation)
            // Generate a new ObjectId
            const objectId = new ObjectId();

            // Include the ObjectId in the document
            const result = await foodCollection.insertOne({ ...newInformation, _id: objectId });
            res.send(result)
        })
        app.post("/available_food", async (req, res) => {

            const newInformations = req.body;
            console.log(newInformations)
            // Use the same ObjectId for consistency
            const objectId = newInformations._id;

            // Include the ObjectId in the document
            const result = await availableFood.insertOne({ ...newInformations, _id: objectId });
            res.send(result)
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Food Unity serever is running')
})

app.listen(port, () => {
    console.log(`Food Unity server is running on port: ${port}`)
})
