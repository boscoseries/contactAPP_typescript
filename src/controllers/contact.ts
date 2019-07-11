import { Request, Response } from "express";
import { contacts } from "../models/contacts";
import { validateInput } from "../middleware/validate";

export const create = (req: Request, res: Response) => {
  const { error, value } = validateInput(req.body);
  const contact = { ...value, status: "available", id: contacts.length + 1 };

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
  const validContacts = contacts.filter(
    contact => contact.status !== "blocked"
  );
  res.status(200).json({
    status: 200,
    data: validContacts
  });
};

export const getBlocked = (_req: Request, res: Response) => {
  const blockedContacts = contacts.filter(
    contact => contact.status === "blocked"
  );
  if (!blockedContacts.length) {
    res.status(204).json({
      status: 204,
      error: "No blocked contacts found"
    });
    return;
  }
  res.status(200).json({
    status: 200,
    data: blockedContacts
  });
};

export const getOne = (req: Request, res: Response) => {
  const contact: any = contacts.find(
    contact =>
      contact.id === parseFloat(req.params.id) && contact.status === "available"
  );
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
  const contact: any = contacts.find(
    contact => contact.id === parseFloat(req.params.id)
  );
  if (!contact) {
    res.status(404).json({
      status: 404,
      message: "contact not found"
    });
    return;
  }
  if (req.route.path === "/:id/details") {
    const newDetails: any = {
      id: contact.id,
      firstname: req.body.firstname || null,
      surname: req.body.surname || null,
      phone: req.body.phone || null,
      mobile: req.body.mobile || null,
      home: req.body.home || null,
      address: req.body.address || null,
      website: req.body.website || null,
      email: req.body.email || null,
      status: req.body.status || "available"
    };
    const index = contacts.indexOf(contact);
    contacts.splice(index, 1, newDetails);
    res.status(200).json({
      status: 200,
      data: newDetails
    });
    return;
  }
  if (req.route.path === "/:id/status") {
    const newStatus = req.body.status || "blocked";
    contact.status = newStatus;
    res.status(200).json({
      status: 200,
      data: contact
    });
  }
};

export const deleteOne = (req: Request, res: Response) => {
  const contact: any = contacts.find(
    contact => contact.id === parseFloat(req.params.id)
  );
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
    message: `contact ${contact.id} deleted`
  });
};
