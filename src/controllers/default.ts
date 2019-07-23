import { Request, Response } from "express";
import { contacts } from "../models/default";
import { validateInput } from "../middleware/validate";

export const create = (req: Request, res: Response) => {
  const { error, value } = validateInput(req.body);
  const contact = { ...value, status: "available", deleted: false, id: contacts.length + 1 };

  if (error) {
    res.status(400).json(error.message);
    return;
  }
  contacts.push(contact);
  res.status(201).json({
    status: "201",
    data: contact
  });
};

export const getAll = (_req: Request, res: Response) => {
  if (!contacts.length) {
    res.status(204).json({
      status: 204,
      error: "No contacts found"
    });
    return;
  }
  const validContacts = contacts.filter(contact => contact.status !== "blocked" && contact.deleted === false);
  res.status(200).json({
    status: 200,
    data: validContacts
  });
};

export const getBlockedOrDeleted = (_req: Request, res: Response) => {
  const blockedOrDeleted = contacts.filter(contact => contact.status === "blocked" || contact.deleted === true);
  if (!blockedOrDeleted.length) {
    res.status(204).json({
      status: 204,
      error: "No blocked contacts found"
    });
    return;
  }
  res.status(200).json({
    status: 200,
    data: blockedOrDeleted
  });
};

export const getOne = (req: Request, res: Response) => {
  const contact: any = contacts.find(
    contact => contact.id === parseFloat(req.params.id) && contact.status === "available" && contact.deleted === false);
  if (!contact) {
    res.status(404).json({
      status: 404,
      message: "contact not found"
    });
    return;
  }
  res.status(200).json({
    status: 200,
    data: contact
  });
};

export const update = (req: Request, res: Response) => {
  const contact: any = contacts.find(contact => contact.id === parseFloat(req.params.id) && contact.deleted === false);
  if (!contact) {
    res.status(404).json({
      status: 404,
      message: "contact not found"
    });
    return;
  }
  if (req.route.path === "/:id/details") {
    contact.id = contact.id;
    contact.firstname = req.body.firstname;
    contact.surname = req.body.surname;
    contact.phone = req.body.phone;
    contact.mobile = req.body.mobile;
    contact.address = req.body.address;
    contact.website = req.body.website;
    contact.email = req.body.email;

    res.status(200).json({
      status: 200,
      data: contact
    });
    return;
  }
  if (req.route.path === "/:id/status") {
    contact.status = req.body.status || "blocked";
    res.status(200).json({
      status: 200,
      data: contact
    });
  };

  if (req.route.path === "/:id/delete") {
    contact.deleted = req.body.deleted || true;
    res.status(200).json({
      status: 200,
      data: contact
    });
  }
};

export const deleteOne = (req: Request, res: Response) => {
  const contact: any = contacts.find(contact => contact.id === parseFloat(req.params.id) && contact.deleted === false);
  if (!contact) {
    res.status(404).json({
      status: 404,
      message: "contact not found"
    });
    return;
  }
  const index = contacts.indexOf(contact);
  contacts.splice(index, 1);
  res.status(200).json({
    status: 200,
    message: `contact ${contact.id} deleted from database`
  });
};
