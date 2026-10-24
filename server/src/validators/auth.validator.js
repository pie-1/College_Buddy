import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    // Ensure the enum matches exactly what the frontend sends
    dept: z.enum(['COMPUTER', 'CIVIL', 'ARCHI', 'BIT'], {
      errorMap: () => ({ message: "Department must be COMPUTER, CIVIL, ARCHI, or BIT" })
    }),
    // Coerce ensures that if React accidentally sends "1", Zod converts it to 1
    year: z.coerce.number().min(1).max(4, "Year must be between 1 and 4"),
  })
});

export const validateRegister = (req, res, next) => {
  const result = registerSchema.safeParse({ body: req.body });
  
  if (!result.success) {
    // Log the exact error to your backend terminal so you can see it
    console.log("Zod Validation Error:", result.error.issues[0]); 
    return res.status(400).json({ 
      error: result.error.issues[0]?.message || "Validation failed",
      details: result.error.issues.map(i => i.message) // Send all errors to frontend
    });
  }
  
  next();
};