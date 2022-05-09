import express from "express"
import { MongoClient, ServerApiVersion } from "mongodb"
import { ObjectId } from "mongodb"
import cors from "cors"
import "dotenv/config"
// import res from "express/lib/response"

const app = express()

app.use(cors())
app.use(express.json())
const PORT = process.env.PORT || 5000

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@laptopstock.xnbrc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority&ssl=true`
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1,
})

async function run() {
	try {
		await client.connect()
		const laptopCollection = client.db("laptop_stock").collection("laptops")

		app.post("/product", async (req, res) => {
			const products = req.body
			// console.log(products)
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

		app.get("/myItem", async (req, res) => {
			const email = req.query.email

			const query = { userEmail: email }
			const cursor = laptopCollection.find(query)
			const myItem = await cursor.toArray()
			res.send(myItem)
		})
		app.get("/product/:id", async (req, res) => {
			const id = req.params.id
			const query = { _id: ObjectId(id) }
			const service = await laptopCollection.findOne(query)

			res.send(service)
		})

		app.put("/update/:id", async (req, res) => {
			const id = req.params.id

			const data = req.body

			const filter = { _id: ObjectId(id) }
			const options = { upsert: true }

			const updateDoc = {
				$set: {
					productName: data.productName,
					userEmail: data.userEmail,
					productQuantity: data.productQuantity,
					productImg: data.productImg,
					productDescription: data.productDescription,
					productSeller: data.productSeller,
				},
			}

			const updateProduct = await laptopCollection.updateOne(
				filter,
				updateDoc,
				options,
			)

			res.send(updateProduct)
		})
		app.delete("/product/:id", async (req, res) => {
			const id = req.params.id
			const query = { _id: ObjectId(id) }
			const deleteLaptop = await laptopCollection.deleteOne(query)
			res.send(deleteLaptop)
		})
	} catch (error) {
		console.log({ massage: error })
	}
}

app.get("/", (req, res) => {
	res.send({ message: "success" })
})
run()
app.listen(PORT, () => {
	console.log("server is running port", PORT)
})
