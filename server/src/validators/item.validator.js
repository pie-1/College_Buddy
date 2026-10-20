import { z } from 'zod';

export const createItemSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(80, 'Title cannot exceed 80 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description cannot exceed 500 characters'),
  category: z.enum(['BOOKS', 'TOOLS', 'NOTES', 'GAMES', 'ELECTRONICS', 'OTHER'], {
    errorMap: () => ({ message: 'Invalid category' }),
  }),
  condition: z.enum(['NEW', 'GOOD', 'FAIR', 'WORN'], {
    errorMap: () => ({ message: 'Invalid condition' }),
  }),
  images: z.array(z.string()).max(3, 'Maximum 3 images allowed').optional(),
  tags: z.array(z.string()).optional(),
});

export const validateCreateItem = (req, res, next) => {
  if (typeof req.body.tags === 'string') {
    req.body.tags = req.body.tags.split(',').map((tag) => tag.trim());
  }

  const result = createItemSchema.safeParse(req.body);

  if (!result.success) {
    const errorMessages = result.error.issues.map((issue) => issue.message);
    return res.status(400).json({
      error: 'Validation Error',
      details: errorMessages,
    });
  }

  req.body = result.data;
  next();
};