/**
 * Constants
 * Shared constants across the application
 */

// User roles
export const USER_ROLES = {
  STUDENT: 'student',
  ADMIN: 'admin',
};

// Item categories
export const ITEM_CATEGORIES = [
  'books',
  'tools',
  'games',
  'electronics',
  'other',
];

// Item conditions
export const ITEM_CONDITIONS = [
  'New',
  'Like New',
  'Good',
  'Fair',
  'Poor',
];

// Faculty options
export const FACULTIES = [
  'BE Computer',
  'Architecture',
  'Civil',
  'BIT',
];

// Student statuses
export const STUDENT_STATUSES = [
  'current',
  'passed_out',
];

// Borrow request statuses
export const BORROW_STATUSES = [
  'pending',
  'accepted',
  'declined',
  'returned',
  'overdue',
];

// Event categories
export const EVENT_CATEGORIES = [
  'workshop',
  'hackathon',
  'seminar',
  'social',
  'project_showcase',
  'other',
];

// Event statuses
export const EVENT_STATUSES = [
  'upcoming',
  'ongoing',
  'completed',
  'cancelled',
];

// Project categories
export const PROJECT_CATEGORIES = [
  'academic',
  'personal',
  'startup',
  'research',
];

// Project statuses
export const PROJECT_STATUSES = [
  'idea',
  'development',
  'completed',
  'published',
];

// Message types
export const MESSAGE_TYPES = [
  'text',
  'image',
  'file',
];

// File upload limits
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
];

// Pagination defaults
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;

// Regex patterns
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_REGEX = /^98[0-9]{8}$/;
export const MONGO_ID_REGEX = /^[0-9a-fA-F]{24}$/;

// API response messages
export const MESSAGES = {
  // Auth
  REGISTER_SUCCESS: 'User registered. Please verify your email.',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logged out successfully',
  EMAIL_VERIFIED: 'Email verified successfully',
  EMAIL_NOT_VERIFIED: 'Please verify your email first',
  INVALID_CREDENTIALS: 'Invalid credentials',
  USER_NOT_FOUND: 'User not found',
  TOKEN_EXPIRED: 'Token expired',
  TOKEN_INVALID: 'Invalid token',

  // Item
  ITEM_CREATED: 'Item created successfully',
  ITEM_UPDATED: 'Item updated successfully',
  ITEM_DELETED: 'Item deleted successfully',
  ITEM_NOT_FOUND: 'Item not found',
  ITEM_NOT_AVAILABLE: 'Item is not available',

  // Borrow
  REQUEST_CREATED: 'Borrow request created',
  REQUEST_ACCEPTED: 'Request accepted',
  REQUEST_DECLINED: 'Request declined',
  REQUEST_RETURNED: 'Item returned successfully',
  REQUEST_NOT_FOUND: 'Request not found',

  // General
  SERVER_ERROR: 'Internal Server Error',
  VALIDATION_ERROR: 'Validation Error',
  UNAUTHORIZED: 'Not authorized',
  FORBIDDEN: 'Access forbidden',
};