/**
 * Utility functions and schemas for form validation using Zod.
 *
 * @packageDocumentation
 */

import { z } from "zod";

/**
 * A string containing allowed special characters for password validation.
 */
export const allowedSpecialChars = "!@#$%^&*()_+";

/**
 * Regular expressions for various password validation rules.
 */
export const regex = {
  /**
   * At least one uppercase letter.
   */
  oneUpperCase: /^(?=.*[A-Z])/,

  /**
   * At least one lowercase letter.
   */
  oneLowerCase: /^(?=.*[a-z])/,

  /**
   * At least one number.
   */
  oneNumber: /^(?=.*[0-9])/,

  /**
   * At least one special character from the allowed special characters.
   */
  oneSpecialChar: new RegExp(`(?=.*[${allowedSpecialChars}])`),

  /**
   * No white spaces.
   */
  noSpaces: /^(?=\S+$)/,
};

/**
 * Schema for validating signup form values.
 */
export const SignupSchema = z.object({
  /**
   * Email address of the user.
   * - Must be a valid email address.
   * - Must be between 1 and 255 characters long.
   */
  email: z
    .string({
      message: "Invalid email address",
    })
    .trim()
    .toLowerCase()
    .email("Invalid email address")
    .min(1, "Email is required")
    .max(255, "Email is too long"),

  /**
   * Password of the user.
   * - Must be between 8 and 20 characters long.
   * - Must contain at least one lowercase letter.
   * - Must contain at least one uppercase letter.
   * - Must contain at least one number.
   * - Must contain at least one special character from the allowed special characters.
   * - Must not contain any spaces.
   */
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

/**
 * Type representing the values of the signup form.
 */
export type SignupValues = z.infer<typeof SignupSchema>;

/**
 * Schema for validating signin form values.
 */
export const SigninSchema = z.object({
  /**
   * Email address of the user.
   * - Must be a valid email address.
   * - Must be between 1 and 255 characters long.
   */
  email: z
    .string({
      message: "Invalid email address",
    })
    .trim()
    .toLowerCase()
    .email("Invalid email address")
    .min(1, "Email is required")
    .max(255, "Email is too long"),

  /**
   * Password of the user.
   * - Required field.
   */
  password: z.string({
    message: "Password is required",
  }),
});

/**
 * Type representing the values of the signin form.
 */
export type SigninValues = z.infer<typeof SigninSchema>;
