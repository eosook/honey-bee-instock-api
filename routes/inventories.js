import express from 'express'
import initKnex from 'knex'
import configuration from '../knexfile.js'
const router = express.Router()
const knex = initKnex(configuration)
//check to see if all fields are filled
const validateFields = (req, res, next) => {
  const { warehouse_id, item_name, description, category, status, quantity } =
    req.body
  if (
    !warehouse_id ||
    !item_name ||
    !description ||
    !category ||
    !status ||
    quantity === undefined
  ) {
    return res.status(400).json({ message: 'All fields are required.' })
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
  next()
}
router
  //get all item
  .route('/inventories')
  .get(async (_req, res) => {
    try {
      const listInventories = await knex('inventories')
      res.json(listInventories)
    } catch {
      return res.status(500).send('Error getting inventories')
    }
  })
  //create new item and check
  .post(validateFields, async (req, res) => {
    try {
      const {
        warehouse_id,
        item_name,
        description,
        category,
        status,
        quantity,
      } = req.body
      const newItem = {
        warehouse_id,
        item_name,
        description,
        category,
        status,
        quantity: parseInt(quantity),
      }
      await knex('inventories').insert(newItem)
      res
        .status(201)
        .json({ message: 'Item added successfully ', item: newItem })
    } catch (error) {
      res.status(500).json({ message: 'Error creating item' })
    }
  })
//get single item
router.route('/inventories/:id').get(async (req, res) => {
  try {
    const data = await knex('inventories')
    const findInventories = data.find((e) => {
      return e.id === parseInt(req.params.id)
    })
    res.status(200).json(findInventories)
  } catch (error) {
    res.status(400).send(`error fetching inventory`)

export default router
