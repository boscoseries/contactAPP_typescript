import joi from "@hapi/joi";

export const validateInput = (input: any) => {
  const createSchema = {
    firstname: joi
      .string()
      .min(2)
      .required(),
    surname: joi
      .string()
      .min(2)
      .required(),
    phone: joi
      .string()
      .min(11)
      .required(),
    mobile: joi
      .string()
      .min(11)
      .optional(),
    home: joi
      .string()
      .min(11)
      .optional(),
    email: joi
      .string()
      .email()
      .optional(),
    address: joi.string().optional(),
    website: joi.string().optional(),
    status: joi.string().required(),
    deleted: joi.bool().required()
  };

  const { error, value } = joi.validate(input, createSchema, {
    abortEarly: false
  });
  return { error, value };
};
