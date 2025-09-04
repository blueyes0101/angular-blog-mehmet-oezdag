import { z } from 'zod';

/**
 * ZOD Schema for BlogPost validation
 */
export const BlogPostSchema = z.object({
  id: z.number().int().positive('ID must be a positive integer'),
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  content: z
    .string()
    .min(1, 'Content is required')
    .max(10000, 'Content must be less than 10,000 characters'),
  author: z
    .string()
    .min(1, 'Author is required')
    .max(100, 'Author name must be less than 100 characters'),
  publishDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Publish date must be in YYYY-MM-DD format'),
  category: z
    .string()
    .min(1, 'Category is required')
    .max(50, 'Category must be less than 50 characters'),
  tags: z
    .array(z.string().min(1).max(30))
    .min(1, 'At least one tag is required')
    .max(10, 'Maximum 10 tags allowed'),
  featured: z.boolean(),
  imageUrl: z.string().url('Image URL must be a valid URL'),
  likedByMe: z.boolean().optional().default(false),
  likes: z.number().int().nonnegative().optional().default(0),
});

/**
 * ZOD Schema for array of BlogPosts
 */
export const BlogPostArraySchema = z.array(BlogPostSchema);

/**
 * ZOD Schema for Categories
 */
export const CategorySchema = z
  .string()
  .min(1, 'Category name is required')
  .max(50, 'Category name must be less than 50 characters');

/**
 * ZOD Schema for Categories Array
 */
export const CategoriesArraySchema = z.array(CategorySchema);

/**
 * ZOD Schema for Blog API Response
 */
export const BlogApiResponseSchema = z.object({
  posts: BlogPostArraySchema,
  categories: CategoriesArraySchema,
  total: z.number().int().nonnegative().optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
});

/**
 * ZOD Schema for Blog Filter Parameters
 */
export const BlogFilterSchema = z.object({
  category: z.string().optional(),
  featured: z.boolean().optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
  search: z.string().max(100).optional(),
});

// Type aliases derived from ZOD schemas
export type BlogPost = z.infer<typeof BlogPostSchema>;
export type BlogPostArray = z.infer<typeof BlogPostArraySchema>;
export type Category = z.infer<typeof CategorySchema>;
export type CategoriesArray = z.infer<typeof CategoriesArraySchema>;
export type BlogApiResponse = z.infer<typeof BlogApiResponseSchema>;
export type BlogFilter = z.infer<typeof BlogFilterSchema>;

// Export schemas and types as aliases for easy import
export {
  BlogPostSchema as BlogPostValidator,
  BlogPostArraySchema as BlogPostArrayValidator,
  CategorySchema as CategoryValidator,
  CategoriesArraySchema as CategoriesArrayValidator,
  BlogApiResponseSchema as BlogApiResponseValidator,
  BlogFilterSchema as BlogFilterValidator,
};

/**
 * Utility function to validate blog post data
 */
export function validateBlogPost(data: unknown): BlogPost {
  return BlogPostSchema.parse(data);
}

/**
 * Utility function to safely validate blog post data
 */
export function safeParseBlogPost(
  data: unknown,
): { success: true; data: BlogPost } | { success: false; error: z.ZodError } {
  const result = BlogPostSchema.safeParse(data);
  return result;
}

/**
 * Utility function to validate blog posts array
 */
export function validateBlogPosts(data: unknown): BlogPost[] {
  return BlogPostArraySchema.parse(data);
}

/**
 * Utility function to safely validate blog posts array
 */
export function safeParseBlogPosts(
  data: unknown,
): { success: true; data: BlogPost[] } | { success: false; error: z.ZodError } {
  const result = BlogPostArraySchema.safeParse(data);
  return result;
}
