import { z } from "zod";

export const allowedSpecialChars = "!@#$%^&*()_+";

export const regex = {
  oneUpperCase: /^(?=.*[A-Z])/, // at least one uppercase letter
  oneLowerCase: /^(?=.*[a-z])/, // at least one lowercase letter
  oneNumber: /^(?=.*[0-9])/, //   at least one number
  oneSpecialChar: new RegExp(`(?=.*[${allowedSpecialChars}])`), // at least one special character
  noSpaces: /^(?=\S+$)/, // no white spaces
};

export const SignupSchema = z.object({
  email: z
    .string({
      message: "Invalid email address",
    })
    .trim()
    .toLowerCase()
    .email("Invalid email address")
    .min(1, "Email is required")
    .max(255, "Email is too long"),

  password: z
    .string({
      message: "Password is required",
    })
    .trim()
    .min(8, "Password must be at least 8 characters long")
    .max(20, "Password must be at most 20 characters long")
    .regex(
      regex.oneLowerCase,
      "Password must contain at least one lowercase letter"
    )
    .regex(
      regex.oneUpperCase,
      "Password must contain at least one uppercase letter"
    )
    .regex(regex.oneNumber, "Password must contain at least one number")
    .regex(
      regex.oneSpecialChar,
      `Password must contain at least one special character: ${allowedSpecialChars}`
    )
    .regex(regex.noSpaces, "Password must not contain any spaces"),
});

export type SignupValues = z.infer<typeof SignupSchema>;

export const SigninSchema = z.object({
  email: z
    .string({
      message: "Invalid email address",
    })
    .trim()
    .toLowerCase()
    .email("Invalid email address")
    .min(1, "Email is required")
    .max(255, "Email is too long"),

  password: z.string({
    message: "Password is required",
  }),
});

export type SigninValues = z.infer<typeof SigninSchema>;
