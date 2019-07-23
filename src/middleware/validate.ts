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
      .number()
      .min(11)
      .required(),
    mobile: joi
      .number()
      .min(11)
      .optional(),
    home: joi
      .number()
      .min(11)
      .optional(),
    email: joi
      .string()
      .email()
      .optional(),
    address: joi.string().optional(),
    website: joi.string().optional(),
  };

  const { error, value } = joi.validate(input, createSchema, {
    abortEarly: false
  });
  return { error, value };
};
