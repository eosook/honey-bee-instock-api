import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import warehouse from './routes/warehouse.js'
import inventories from './routes/inventories.js'
const app = express()
const PORT = process.env.PORT || 8080
app.use(cors())
app.use(express.json())
app.use('/', warehouse)
app.use('/warehouse', warehouse)
app.use('/inventories', inventories)
// start Express on port 8080
app.listen(PORT, () => {
  console.log(`Server Started on port ${PORT} `)
  console.log('Press CTRL + C to stop server')
})
