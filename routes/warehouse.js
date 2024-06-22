import express from "express";
import initKnex from "knex";
import configuration from "../knexfile.js";
import { validationResult, checkSchema } from "express-validator";
import e from "express";
const router = express.Router();

const knex = initKnex(configuration);

router
  .route("/")
  .get(async (_req, res) => {
    try {
      const listOfWarehouses = await knex.select("*").from("warehouses");
      res.json(listOfWarehouses);
    } catch {
      return res.status(500).send("Error getting Warehouses");
    }
  })
  .post(
    checkSchema(
      {
        warehouse_name: {
          trim: true,
          notEmpty: { bail: true },
          errorMessage: "This is a required field",
        },
        address: {
          trim: true,
          notEmpty: { bail: true },
          errorMessage: "This is a required field",
        },
        city: {
          trim: true,
          notEmpty: { bail: true },
          errorMessage: "This is a required field",
        },
        country: {
          trim: true,
          notEmpty: { bail: true },
          errorMessage: "This is a required field",
        },
        contact_name: {
          trim: true,
          notEmpty: { bail: true },
          errorMessage: "This is a required field",
        },
        contact_position: {
          trim: true,
          notEmpty: { bail: true },
          errorMessage: "This is a required field",
        },
        contact_phone: {
          trim: true,
          matches: {
            options: /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
          },
          errorMessage: "Please enter a valid phone number",
        },
        contact_email: {
          trim: true,
          isEmail: { bail: true },
          errorMessage: "Please enter a valid email address",
        },
      },
      ["body"]
    ),
    async (req, res) => {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
      }
      try {
        const {
          warehouse_name,
          address,
          city,
          country,
          contact_name,
          contact_position,
          contact_phone,
          contact_email,
        } = req.body;
        const newWarehouse = {
          warehouse_name,
          address,
          city,
          country,
          contact_name,
          contact_position,
          contact_phone,
          contact_email,
        };
        await knex("warehouses").insert(newWarehouse);
        return res.status(201).json({
          message: "Warehouse added successfully ",
          warehouse: newWarehouse,
        });
      } catch {
        return res.status(500).send("Error adding warehouse");
      }
    }
  );

router
  .route("/:id")
  .get(async (req, res) => {
    const id = req.params.id;
    try {
      const warehouse = await knex
        .select("*")
        .from("warehouses")
        .where("id", id);
      res.json(warehouse);
    } catch {
      return res.status(500).send("Error getting Warehouse");
    }
  })
  .delete(async (req, res) => {
    const id = req.params.id;
    try {
      const warehouse = await knex
        .select("*")
        .from("warehouses")
        .where("id", id);
      res.status(204).json(warehouse).send("delete succesfull");
    } catch {
      return res.status(404).send("Warehouse ID not found");
    }
  })
  .put(
    checkSchema(
      {
        warehouse_name: {
          trim: true,
          notEmpty: { bail: true },
          errorMessage: "This is a required field",
        },
        address: {
          trim: true,
          notEmpty: { bail: true },
          errorMessage: "This is a required field",
        },
        city: {
          trim: true,
          notEmpty: { bail: true },
          errorMessage: "This is a required field",
        },
        country: {
          trim: true,
          notEmpty: { bail: true },
          errorMessage: "This is a required field",
        },
        contact_name: {
          trim: true,
          notEmpty: { bail: true },
          errorMessage: "This is a required field",
        },
        contact_position: {
          trim: true,
          notEmpty: { bail: true },
          errorMessage: "This is a required field",
        },
        contact_phone: {
          trim: true,
          matches: {
            options: /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
          },
          errorMessage: "Please enter a valid phone number",
        },
        contact_email: {
          trim: true,
          isEmail: { bail: true },
          errorMessage: "Please enter a valid email address",
        },
      },
      ["body"]
    ),
    async (req, res) => {
      const idParam = req.params.id;
      const {
        warehouse_name,
        address,
        city,
        country,
        contact_name,
        contact_position,
        contact_phone,
        contact_email,
      } = req.body;
      const editResult = validationResult(req);
      if (!editResult.isEmpty()) {
        return res.status(400).json({ errors: editResult.array() });
      }
      try {
        const foundWarehouse = await knex
          .select("*")
          .from("warehouses")
          .where("id", idParam);
        if (foundWarehouse.length < 1) {
          return res.status(404).send("Warehouse not found");
        }
        const id = foundWarehouse[0].id;
        const editedWarehouse = {
          id,
          warehouse_name,
          address,
          city,
          country,
          contact_name,
          contact_position,
          contact_phone,
          contact_email,
        };
        await knex
          .select("*")
          .from("warehouses")
          .where("id", idParam)
          .update(editedWarehouse);
        return res.status(200).json({
          message: "Warehouse updated successfully",
          warehouse: { ...editedWarehouse },
        });
      } catch (error) {
        console.log(error);
        res.status(500).send("Error updating warehouse");
      }
    }
  );

  router.route('/:id/inventories')
  .get(async (req, res) => {
      const id = req.params.id
      try {
          const inventory = await knex.select('*').from('inventories').where('warehouse_id', id)
          res.json(inventory)
      } catch {
          return res.status(500).send('Error getting Warehouse inventory')
      }
  })

export default router;
