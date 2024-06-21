import express from "express";
import initKnex from "knex";
import configuration from "../knexfile.js";
const router = express.Router();
const knex = initKnex(configuration);
//check to see if all fields are filled
const validateFields = async (req, res, next) => {
  const { warehouse_id, item_name, description, category, status, quantity } =
    req.body;
  if (
    !warehouse_id ||
    !item_name ||
    !description ||
    !category ||
    !status ||
    quantity === undefined ||
    isNaN(quantity)
  ) {
    return res.status(400).json({ message: "Invalid input data." });
  }
  try {
    const warehouseExists = await knex("warehouses")
      .where({ id: warehouse_id })
      .first();
    if (!warehouseExists) {
      return res.status(400).json({ message: "Invalid warehouse_id." });
    }
    next();
  } catch (error) {
    console.error("Error validating warehouse_id:", error);
    res.status(500).json({ message: "Error validating warehouse_id." });
  }
};
router
  //get all item
  .route("/")
  .get(async (_req, res) => {
    try {
      const listInventories = await knex("inventories");
      res.json(listInventories);
    } catch {
      return res.status(500).send("Error getting inventories");
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
      } = req.body;
      const newItem = {
        warehouse_id,
        item_name,
        description,
        category,
        status,
        quantity: parseInt(quantity),
      };
      await knex("inventories").insert(newItem);
      res
        .status(201)
        .json({ message: "Item added successfully ", item: newItem });
    } catch (error) {
      res.status(500).json({ message: "Error creating item" });
    }
  });
//get single item
router.route("/:id").get(async (req, res) => {
  try {
    const data = await knex("inventories");
    const findInventories = data.find((e) => {
      return e.id === parseInt(req.params.id);
    });
    res.status(200).json(findInventories);
  } catch (error) {
    res.status(400).send(`error fetching inventory`);
  }
});
router.route("/edit/:id").put(validateFields, async (req, res) => {
  const { id } = req.params;
  const { item_name, description, category, status, quantity } = req.body;
  try {
    const inventoryItem = await knex("inventories").where({ id }).first();
    if (!inventoryItem) {
      return res.status(404).json({ message: "Inventory ID not found." });
    }
    const updatedItem = {
      item_name,
      description,
      category,
      status,
      quantity: parseInt(quantity),
    };
    await knex("inventories").where({ id }).update(updatedItem);
    res.status(200).json({ id, ...updatedItem });
  } catch (error) {
    res.status(500).json({ message: "Error updating inventory item" });
  }
});
export default router;
