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
  listingType: z.enum(['borrow', 'sell', 'buy'], {
    errorMap: () => ({ message: 'Listing type must be borrow, sell, or buy' }),
  }).default('borrow'), // Default to borrow
  price: z.coerce.number().min(0, 'Price cannot be negative').optional(),
  wantedTags: z.array(z.string()).optional(),
  images: z.array(z.string()).max(3, 'Maximum 3 images allowed').optional(),
  tags: z.array(z.string()).optional(),
}).refine((data) => {
  if ((data.listingType === 'sell' || data.listingType === 'buy') && data.price === undefined) {
    return false;
  }
  return true;
}, {
  message: "Price is required for Sell or Buy listings",
  path: ["price"],
}).refine((data) => {
  if (data.listingType === 'buy' && (!data.wantedTags || data.wantedTags.length === 0)) {
    return false;
  }
  return true;
}, {
  message: "wantedTags is required when listing type is buy",
  path: ["wantedTags"],
});

export const validateCreateItem = (req, res, next) => {
  // Pre-process tags and wantedTags
  if (typeof req.body.tags === 'string') {
    req.body.tags = req.body.tags.split(',').map((tag) => tag.trim());
  }
  if (typeof req.body.wantedTags === 'string') {
    req.body.wantedTags = req.body.wantedTags.split(',').map((tag) => tag.trim());
  }

  // Convert price to number if it comes as a string from FormData
  if (req.body.price) {
    req.body.price = Number(req.body.price);
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