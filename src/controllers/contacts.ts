import { Request, Response } from "express";
const Contact = require("../models/contacts");
import { validateInput } from "../middleware/validate";

// Add a new contact
export const addContact = async (req: Request, res: Response) => {
  const { error, value } = validateInput(req.body);
  if (error) {
    res.status(400).json({
      error: error.message
    });
    return;
  }
  try {
    const values = { ...value, status: "available", deleted: false };
    const contact = new Contact(values);
    const data = await contact.save();
    res.status(201).json({
      statusCode: 201,
      data
    });
  } catch (error) {
    res.json({
      statusCode: 400,
      error: error.message
    });
  }
};

// Get all contacts
export const getAll = async (_req: Request, res: Response) => {
  try {
    const data = await Contact.find();
    const contacts = data.filter(
      (contact: { status: string; deleted: boolean }) =>
        contact.status === "available" && !contact.deleted
    );
    if (contacts.length) {
      res.status(200).json({
        statusCode: 200,
        contacts
      });
      return;
    }
    res.status(404).json({
      statusCode: 404,
      message: "No contacts found"
    });
    return;
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      error
    });
  }
};

// Get blocked contacts
export const getBlocked = async (_req: Request, res: Response) => {
  try {
    const data = await Contact.find();
    const contacts = data.filter(
      (contact: { status: string; deleted: boolean }) =>
        contact.status === "blocked" || contact.deleted
    );
    if (contacts.length) {
      res.status(200).json({
        statusCode: 200,
        contacts
      });
      return;
    }
    res.status(404).json({
      statusCode: 404,
      message: "No blocked contacts"
    });
    return;
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      error
    });
  }
};

// Get a single contact
export const getOne = async (req: Request, res: Response) => {
  try {
    const data = await Contact.findById({ _id: req.params.id });
    if (data.status === "available" && !data.deleted) {
      res.status(200).json({
        statusCode: 200,
        data
      });
      return;
    }
    res.status(404).json({
      statusCode: 404,
      message: "contact not found"
    });
    return;
  } catch (error) {
    res.status(400).json({
      statusCode: 400,
      error: error.message
    });
  }
};

// update a contact status
export const update = async (req: Request, res: Response) => {
  const input = { ...req.body, status: "available", isDeleted: false };
  try {
    // check if contact exists
    const data = await Contact.findById({ _id: req.params.id });
    if (!data) {
      res.status(404).json({
        statusCode: 404,
        message: "contact not found"
      });
      return;
    }

    // update contact details
    if (req.route.path === "/:id/details") {
      const data = await Contact.findByIdAndUpdate(req.params.id, input, {
        new: true
      });
      res.status(200).json({
        statusCode: 200,
        data
      });
      return;
    }
    // update contact status
    if (req.route.path === "/:id/status") {
      const data = await Contact.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true }
      );
      res.status(200).json({
        statusCode: 200,
        data
      });
    }

    // update deleted status
    if (req.route.path === "/:id/delete") {
      const data = await Contact.findByIdAndUpdate(
        req.params.id,
        { deleted: req.body.deleted },
        { new: true }
      );
      res.status(200).json({
        statusCode: 200,
        data
      });
    }
  } catch (err) {
    res.status(400).json({
      statusCode: 400,
      error: err.message
    });
  }
};

export const deleteOne = async (req: Request, res: Response) => {
  try {
    // check if contact exists
    const data = await Contact.findById({ _id: req.params.id });
    if (!data) {
      res.status(404).json({
        statusCode: 404,
        message: "contact not found"
      });
      return;
    }
    const deleted = await Contact.findByIdAndDelete({ _id: req.params.id });
    res.status(200).json({
      statusCode: 200,
      data: `contact with id ${deleted._id} was successfully deleted`
    });
  } catch (error) {
    res.status(400).json({
      statusCode: 400,
      error: error.message
    });
  }
};
