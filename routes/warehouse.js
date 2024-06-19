import express from "express";
import knex from "knex";
const router = express.Router();

router.route("/").get(async (_req, res) => {
  try {
    const listOfWarehouses = await knex.select("*").from("warehouses");
    res.json(listOfWarehouses);
  } catch {
    return res.status(500).send("Error getting Warehouses");
  }
});

router.route("/:id").get(async (req, res) => {
  try {
    const id = req.params.id;
    const warehouse = await knex.select(id).from("warehouses");
    res.json(warehouse);
  } catch {
    return res.status(500).send("Error getting Warehouse");
  }
});

export default router;
