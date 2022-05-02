import express from "express"
import { MongoClient, ServerApiVersion } from "mongodb"

import cors from "cors"
import "dotenv/config"
// import res from "express/lib/response"

const app = express()

app.use(cors())
app.use(express.json())
const PORT = process.env.PORT || 5000

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@laptopstock.xnbrc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1,
})

async function run() {
	try {
		await client.connect()
		const laptopCollection = client.db("laptop_stock").collection("laptops")
		const laptop = {
			name: "lanevo 12b",
			description: "something is better then nothing",
		}
		// const result = await laptopCollection.insertOne(laptop)

		app.post("/product", async (req, res) => {
			const products = req.body
			console.log(products)
			const NewProducts = await laptopCollection.insertOne(products)
			res.send(products)
		})
		// get products
		app.get("/product", async (req, res) => {
			const query = {}
			const cursor = laptopCollection.find(query)
			const loadData = await cursor.toArray()
			// console.log(loadData)
			res.send(loadData)
		})
	} catch (error) {
		res.send({ massage: error.massage })
	}
}

app.get("/", (req, res) => {
	res.send({ message: "success" })
})
run()
app.listen(PORT, () => {
	console.log("server is running port", PORT)
})
