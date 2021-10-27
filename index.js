const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const express = require('express');
const app = express();
const cors = require('cors');
const port = 5000;
app.use(cors());
app.use(express.json());


const uri = "mongodb+srv://robinMongoDB:HJHgQi7WLkp14GS9@cluster0.ywsqr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function insertData()
{
    try {
        // Database information
        await client.connect();
        const database = client.db('MobileUser');
        const databaseCollection = database.collection('allUsers');

        // Post API
        app.post('/api/users/', async (req, res) =>
        {
            const newUser = req.body;
            console.log(newUser);
            const addUser = await databaseCollection.insertOne(newUser);
            res.send(addUser);
        });

        // GET API
        app.get('/api/users', async (req, res) =>
        {
            const cursor = databaseCollection.find({});
            const users = await cursor.toArray();
            const count = await cursor.count();
            res.send({ count, users });
        });
        app.get('/api/users/:id', async (req, res) =>
        {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await databaseCollection.findOne(filter);
            res.send(result);
        });

        // Delete user
        app.delete('/api/users/:id', async (req, res) =>
        {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await databaseCollection.deleteOne(filter);
            res.send(result);
        });

        // Update user
        app.put('/api/users/:id', async (req, res) =>
        {
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = { _id: ObjectId(id) };
            const updateDoc = {
                $set: {
                    name: updatedUser.name,
                    email: updatedUser.email
                },
            };
            const result = await databaseCollection.updateOne(filter, updateDoc);
            console.log(result);
            res.send(result);
        });

        // App Listen
        app.listen(port, () =>
        {
            console.log('node server running');
        });
    } finally {

    }
}
insertData();
