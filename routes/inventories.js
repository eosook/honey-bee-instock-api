import express from 'express'
import initKnex from 'knex'
import configuration from '../knexfile.js'
const router = express.Router()
const knex = initKnex(configuration)

router.route('/inventories').get(async (_req, res) => {
  try {
    const listInventories = await knex('inventories')
    res.json(listInventories)
  } catch {
    return res.status(500).send('Error getting inventories')
  }
})
router.route('/inventories/:id').get(async (req, res) => {
  try {
    const data = await knex('inventories')
    const findInventories = data.find((e) => {
      return e.id === parseInt(req.params.id)
    })
    res.status(200).json(findInventories)
  } catch (error) {
    res.status(400).send(`error fetching inventory`)
  }
})
export default router
