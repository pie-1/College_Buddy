import { z } from 'zod';

export const createItemSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(80, 'Title cannot exceed 80 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description cannot exceed 500 characters'),
  category: z.enum(['BOOKS', 'TOOLS', 'NOTES', 'GAMES', 'ELECTRONICS', 'OTHER']),
  condition: z.enum(['NEW', 'GOOD', 'FAIR', 'WORN']),
  images: z.array(z.string()).max(3, 'Maximum 3 images allowed').optional(),
  tags: z.array(z.string()).optional(),
  
  // ✅ New Fields
  listingType: z.enum(['borrow', 'sell', 'buy']).default('borrow'),
  price: z.number().positive('Price must be a positive number').optional(),
  wantedTags: z.array(z.string()).optional(),
})
// ✅ Conditional Validation using Zod refine
.refine((data) => {
  if (data.listingType === 'sell' || data.listingType === 'buy') {
    return data.price !== undefined;
  }
  return true;
}, {
  message: "Price is required when listing type is 'sell' or 'buy'",
  path: ['price']
})
.refine((data) => {
  if (data.listingType === 'buy') {
    return data.wantedTags && data.wantedTags.length > 0;
  }
  return true;
}, {
  message: "wantedTags is required when listing type is 'buy'",
  path: ['wantedTags']
});

export const validateCreateItem = (req, res, next) => {
  // Convert tags and wantedTags from string to array if they come from form-data
  if (typeof req.body.tags === 'string') {
    req.body.tags = req.body.tags.split(',').map((tag) => tag.trim());
  }
  if (typeof req.body.wantedTags === 'string') {
    req.body.wantedTags = req.body.wantedTags.split(',').map((tag) => tag.trim());
  }

  // Convert price to number if it comes as a string from form-data
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