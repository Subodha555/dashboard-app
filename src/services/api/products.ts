import type {Category, Product} from "../../utils/types";

export let productNamesBySlug: Record<string, string> = {};

const url = "https://dummyjson.com";
let cachedCategories: Category[] = [];
let cachedProductsByCategory: Record<string, Product[]> = {};

export const getCategories = async () => {
    if (cachedCategories.length > 0) {
        return {
            categories: cachedCategories,
            productsByCategory: cachedProductsByCategory,
        };
    }

    try {
        type Response = {
            categories: [],
            productsByCategory: Record<string, []>
        };
        const respObject: Response = {
            categories: [],
            productsByCategory: {},
        };

        const categoriesResponse = await fetch(`${url}/products/categories`, { cache: 'force-cache' });
        const categories = await categoriesResponse.json();
        respObject.categories = categories;

        if (categories) {
            const productPromises = categories.map(async (category: Category) => {
                const productsResponse = await getProducts(category.slug);
                respObject.productsByCategory[category.slug] = productsResponse.products;
                productNamesBySlug[category.slug] = category.name;
            });

            await Promise.all(productPromises);
        }

        cachedCategories = respObject.categories;
        cachedProductsByCategory = respObject.productsByCategory;

        return respObject;
    } catch (e) {
        console.error("Error in fetching categories:", e);
        return null;
    }
};

export const getProducts = async (category: string) => {
    if (cachedProductsByCategory[category]) {
        return { products: cachedProductsByCategory[category] };
    }

    try {
        const response = await fetch(`${url}/products/category/${category}`, { cache: 'force-cache' });
        const products = await response.json();
        cachedProductsByCategory[category] = products.products;
        return products;
    } catch (e) {
        console.error("Error in fetching products:", e);
        return null;
    }
};
