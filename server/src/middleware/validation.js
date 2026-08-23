/**
 * Validation Middleware
 * Validates request data before reaching controllers
 */

// Validate registration
export const validateRegister = (req, res, next) => {
  const { name, email, password, phone_num, faculty, studentStatus, semester } = req.body;
  const errors = [];

  // Name validation
  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push('Please provide a valid email address');
  }

  // Check for .edu.np email (college email)
  if (email && !email.toLowerCase().endsWith('.edu.np')) {
    errors.push('Please use your college email (.edu.np)');
  }

  // Password validation
  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  // Phone validation (Nepal format - optional)
  if (phone_num && !/^98[0-9]{8}$/.test(phone_num)) {
    errors.push('Please provide a valid phone number (e.g., 9841234567)');
  }

  // Faculty validation
  const validFaculties = ['BE Computer', 'Architecture', 'Civil', 'BIT'];
  if (faculty && !validFaculties.includes(faculty)) {
    errors.push('Invalid faculty. Must be: BE Computer, Architecture, Civil, BIT');
  }

  // Student status validation
  const validStatuses = ['current', 'passed_out'];
  if (studentStatus && !validStatuses.includes(studentStatus)) {
    errors.push('Invalid student status. Must be: current or passed_out');
  }

  // Semester validation
  if (semester && (semester < 1 || semester > 8)) {
    errors.push('Semester must be between 1 and 8');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation Error',
      details: errors
    });
  }

  next();
};

// Validate login
export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push('Please provide a valid email address');
  }

  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation Error',
      details: errors
    });
  }

  next();
};

// Validate item creation/update
export const validateItem = (req, res, next) => {
  const { title, category, description, condition, number_of_items } = req.body;
  const errors = [];

  // Title validation
  if (!title || title.trim().length < 3) {
    errors.push('Title must be at least 3 characters');
  }

  // Category validation
  const validCategories = ['books', 'tools', 'games', 'electronics', 'other'];
  if (!category || !validCategories.includes(category)) {
    errors.push('Invalid category. Must be: books, tools, games, electronics, other');
  }

  // Description validation
  if (!description || description.trim().length < 10) {
    errors.push('Description must be at least 10 characters');
  }

  // Condition validation
  const validConditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];
  if (condition && !validConditions.includes(condition)) {
    errors.push('Invalid condition. Must be: New, Like New, Good, Fair, Poor');
  }

  // Number of items validation
  if (number_of_items && (number_of_items < 1 || number_of_items > 100)) {
    errors.push('Number of items must be between 1 and 100');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation Error',
      details: errors
    });
  }

  next();
};

// Validate borrow request
export const validateBorrow = (req, res, next) => {
  const { itemId, expected_return_date, notes } = req.body;
  const errors = [];

  // Item ID validation
  if (!itemId) {
    errors.push('Item ID is required');
  } else if (!/^[0-9a-fA-F]{24}$/.test(itemId)) {
    errors.push('Invalid Item ID format');
  }

  // Expected return date validation
  if (!expected_return_date) {
    errors.push('Expected return date is required');
  } else {
    const date = new Date(expected_return_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (isNaN(date.getTime())) {
      errors.push('Invalid date format');
    } else if (date <= today) {
      errors.push('Expected return date must be in the future');
    }
  }

  // Notes validation (optional)
  if (notes && notes.length > 500) {
    errors.push('Notes cannot exceed 500 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation Error',
      details: errors
    });
  }

  next();
};

// Validate user update
export const validateUserUpdate = (req, res, next) => {
  const { name, phone_num, faculty, semester, skills, interests, bio } = req.body;
  const errors = [];

  // Name validation
  if (name && name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }

  // Phone validation
  if (phone_num && !/^98[0-9]{8}$/.test(phone_num)) {
    errors.push('Please provide a valid phone number (e.g., 9841234567)');
  }

  // Faculty validation
  const validFaculties = ['BE Computer', 'Architecture', 'Civil', 'BIT'];
  if (faculty && !validFaculties.includes(faculty)) {
    errors.push('Invalid faculty. Must be: BE Computer, Architecture, Civil, BIT');
  }

  // Semester validation
  if (semester && (semester < 1 || semester > 8)) {
    errors.push('Semester must be between 1 and 8');
  }

  // Skills validation
  if (skills && !Array.isArray(skills)) {
    errors.push('Skills must be an array');
  }

  // Interests validation
  if (interests && !Array.isArray(interests)) {
    errors.push('Interests must be an array');
  }

  // Bio validation
  if (bio && bio.length > 500) {
    errors.push('Bio cannot exceed 500 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation Error',
      details: errors
    });
  }

  next();
};