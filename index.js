const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

// Middlewares

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ikmm0oq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection

    const testCollection = client
      .db("diagnosticCenterDB")
      .collection("allTests");
    const userCollection = client
      .db("diagnosticCenterDB")
      .collection("users");
    const appointmentCollection = client
      .db("diagnosticCenterDB")
      .collection("myAppointments");
    const bannerCollection = client
      .db("diagnosticCenterDB")
      .collection("banners");

      app.get("/banners", async (req, res) => {
        // console.log(req.headers)
        const cursor = bannerCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      });

      app.get("/users", async (req, res) => {
        // console.log(req.headers)
        const cursor = userCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      });

    app.post('/users', async(req, res)=> {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    })

    app.get("/allTests", async (req, res) => {
      const result = await testCollection.find().toArray();
      res.send(result);
    });

    app.get('/allTests/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await testCollection.findOne(query)
      res.send(result);
  });

  app.post('/myAppointments', async(req, res)=> {
    const appointment = req.body;
    const result = await appointmentCollection.insertOne(appointment);
    res.send(result);
  });

  app.get("/myAppointments", async (req, res) => {
    const result = await appointmentCollection.find().toArray();
    res.send(result);
  });

  app.get('/myAppointments/:email', async (req, res) => {
    const email = req.params.email;
    const query = {email: email}
    const result = await appointmentCollection.findOne(query)
    res.send(result);
});

app.get('/myAppointments/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) }
  const result = await appointmentCollection.findOne(query)
  res.send(result);
});


app.delete('/myAppointments/:id', async(req, res)=> {
  const id = req.params.id;
  const query = {_id: new ObjectId(id)}
  const result = await appointmentCollection.deleteOne(query);
  res.send(result);
});

    
app.post('/allTests', async(req, res)=> {
  const newTest = req.body;
  console.log(newTest)
  const result = await testCollection.insertOne(newTest);
  res.send(result);
});
app.post('/banners', async(req, res)=> {
  const newBanner = req.body;
  console.log(newBanner)
  const result = await bannerCollection.insertOne(newBanner);
  res.send(result);
});

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Diagnostic Server is Running");
});

app.listen(port, () => {
  console.log(`Diagnostic Server is running on port ${port}`);
});
