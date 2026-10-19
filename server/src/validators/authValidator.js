import { z } from 'zod';

const getAllowedDomains = () =>
  (process.env.ALLOWED_EMAIL_DOMAINS || '')
    .split(',')
    .map((d) => d.trim().toLowerCase().replace(/^@/, ''))
    .filter(Boolean);

const DEPARTMENTS = ['computer', 'civil', 'architecture', 'common'];

export const signupSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(60),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Invalid email address')
    .refine(
      (email) => getAllowedDomains().some((domain) => email.endsWith(`@${domain}`)),
      'Please use your college email address'
    ),
  password: z.string().min(8, 'Password must be at least 8 characters').max(72),
  dept: z.enum(DEPARTMENTS, { message: 'Invalid department' }),
  year: z.coerce.number().int().min(1).max(5),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const details = result.error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
    return res.status(400).json({ error: details[0].message, details });
  }

  req.body = result.data;
  next();
};