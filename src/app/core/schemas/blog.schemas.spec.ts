import {
  BlogPostSchema,
  BlogPostArraySchema,
  CategoriesArraySchema,
  BlogPost,
  BlogPostArray,
  CategoriesArray,
  validateBlogPost,
  validateBlogPosts,
  safeParseBlogPost,
  safeParseBlogPosts,
} from './blog.schemas';

describe('Blog Schemas (ZOD Validation)', () => {
  describe('BlogPostSchema', () => {
    const validBlogPost = {
      id: 1,
      title: 'Test Blog Post',
      content: 'This is test content',
      author: 'Test Author',
      publishDate: '2024-01-15',
      category: 'Test',
      tags: ['test', 'blog'],
      featured: true,
      imageUrl: 'https://example.com/image.jpg',
      likedByMe: false,
      likes: 0,
    };

    it('should validate a valid blog post', () => {
      const result = BlogPostSchema.safeParse(validBlogPost);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validBlogPost);
      }
    });

    it('should reject blog post with invalid id', () => {
      const invalidPost = { ...validBlogPost, id: 'invalid' };
      const result = BlogPostSchema.safeParse(invalidPost);
      expect(result.success).toBe(false);
    });

    it('should reject blog post with empty title', () => {
      const invalidPost = { ...validBlogPost, title: '' };
      const result = BlogPostSchema.safeParse(invalidPost);
      expect(result.success).toBe(false);
    });

    it('should reject blog post with invalid date format', () => {
      const invalidPost = { ...validBlogPost, publishDate: '2024/01/15' };
      const result = BlogPostSchema.safeParse(invalidPost);
      expect(result.success).toBe(false);
    });

    it('should reject blog post with invalid image URL', () => {
      const invalidPost = { ...validBlogPost, imageUrl: 'not-a-url' };
      const result = BlogPostSchema.safeParse(invalidPost);
      expect(result.success).toBe(false);
    });

    it('should reject blog post without tags (required field)', () => {
      const postWithoutTags = { ...validBlogPost };
      delete (postWithoutTags as any).tags;
      const result = BlogPostSchema.safeParse(postWithoutTags);
      expect(result.success).toBe(false);
    });
  });

  describe('BlogPostArraySchema', () => {
    const validBlogPosts = [
      {
        id: 1,
        title: 'Post 1',
        content: 'Content 1',
        author: 'Author 1',
        publishDate: '2024-01-15',
        category: 'Test',
        featured: false,
        imageUrl: 'https://example.com/image1.jpg',
      },
      {
        id: 2,
        title: 'Post 2',
        content: 'Content 2',
        author: 'Author 2',
        publishDate: '2024-01-16',
        category: 'Test',
        featured: true,
        imageUrl: 'https://example.com/image2.jpg',
      },
    ];

    it('should validate an array of valid blog posts', () => {
      const result = BlogPostArraySchema.safeParse(validBlogPosts);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.length).toBe(2);
      }
    });

    it('should reject array with invalid blog post', () => {
      const invalidArray = [...validBlogPosts, { id: 'invalid' }];
      const result = BlogPostArraySchema.safeParse(invalidArray);
      expect(result.success).toBe(false);
    });

    it('should accept empty array', () => {
      const result = BlogPostArraySchema.safeParse([]);
      expect(result.success).toBe(true);
    });
  });

  describe('CategoriesArraySchema', () => {
    it('should validate an array of category strings', () => {
      const categories = ['Angular', 'TypeScript', 'CSS'];
      const result = CategoriesArraySchema.safeParse(categories);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(categories);
      }
    });

    it('should reject array with empty string', () => {
      const invalidCategories = ['Angular', '', 'CSS'];
      const result = CategoriesArraySchema.safeParse(invalidCategories);
      expect(result.success).toBe(false);
    });

    it('should accept empty array', () => {
      const result = CategoriesArraySchema.safeParse([]);
      expect(result.success).toBe(true);
    });
  });

  describe('Type exports', () => {
    it('should export correct TypeScript types', () => {
      // This test ensures the types are correctly derived from schemas
      const blogPost: BlogPost = {
        id: 1,
        title: 'Test',
        content: 'Content',
        author: 'Author',
        publishDate: '2024-01-15',
        category: 'Test',
        tags: ['test'],
        featured: false,
        imageUrl: 'https://example.com/test.jpg',
        likedByMe: false,
        likes: 0,
      };

      const blogPosts: BlogPostArray = [blogPost];
      const categories: CategoriesArray = ['Test', 'Angular'];

      // Type assertions to ensure the types work correctly
      expect(typeof blogPost.id).toBe('number');
      expect(typeof blogPost.featured).toBe('boolean');
      expect(Array.isArray(blogPosts)).toBe(true);
      expect(Array.isArray(categories)).toBe(true);
    });
  });

  describe('Utility functions', () => {
    const validPost = {
      id: 1,
      title: 'Test',
      content: 'Content',
      author: 'Author',
      publishDate: '2024-01-15',
      category: 'Test',
      tags: ['test'],
      featured: false,
      imageUrl: 'https://example.com/test.jpg',
      likedByMe: false,
      likes: 0,
    };

    it('validateBlogPost should parse valid data', () => {
      expect(() => validateBlogPost(validPost)).not.toThrow();
      const result = validateBlogPost(validPost);
      expect(result).toEqual(validPost);
    });

    it('validateBlogPost should throw on invalid data', () => {
      const invalidPost = { ...validPost, id: 'invalid' };
      expect(() => validateBlogPost(invalidPost)).toThrow();
    });

    it('safeParseBlogPost should return success for valid data', () => {
      const result = safeParseBlogPost(validPost);
      expect(result.success).toBe(true);
    });

    it('safeParseBlogPost should return error for invalid data', () => {
      const invalidPost = { ...validPost, id: 'invalid' };
      const result = safeParseBlogPost(invalidPost);
      expect(result.success).toBe(false);
    });

    it('validateBlogPosts should parse valid array', () => {
      const validArray = [validPost];
      expect(() => validateBlogPosts(validArray)).not.toThrow();
      const result = validateBlogPosts(validArray);
      expect(result.length).toBe(1);
    });

    it('safeParseBlogPosts should handle invalid array', () => {
      const invalidArray = [{ ...validPost, id: 'invalid' }];
      const result = safeParseBlogPosts(invalidArray);
      expect(result.success).toBe(false);
    });
  });
});
