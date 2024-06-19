import express from 'express'
import initKnex from 'knex'
import configuration from '../knexfile.js'
const router = express.Router()
const knex = initKnex(configuration)

router.route('/inventories').get(async (_req, res) => {
  try {
    const listInventories = await knex.select('*').from('inventories')
    res.json(listInventories)
  } catch {
    return res.status(500).send('Error getting Inventory')
  }
})
export default router
