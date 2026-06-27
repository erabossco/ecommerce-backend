
// ================
// FORMAT SLUG
// ================

/**
 * Makes slug URL friendly
 * Turns into lower case
 * Removes special characters
 * Removes extra white spaces
 * Removes extra hyphens
 * 
 */
export const generateCategorySlug = (name: string): string => {
    return name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
};