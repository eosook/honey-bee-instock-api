import express from 'express'
import "dotenv/config"
import cors from "cors"
import warehouse from './routes/warehouse.js'
const app = express();
const PORT = process.env.PORT || 8080;


app.use(cors());
app.use(express.json());


app.use("/", warehouse);
app.use("/warehouse/:id", warehouse);

// start Express on port 8080
app.listen(PORT, () => {
    console.log('Server Started on http://localhost:8080');
    console.log('Press CTRL + C to stop server');
});