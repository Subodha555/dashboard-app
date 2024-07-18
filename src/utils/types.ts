// Common types
export type Category = {
    slug: string;
    name: string;
    url: string;
};

export type Product = {
    id: string,
    title: string;
    category: string;
    price: string;
}

export type Option = {
    id: string;
    name: string;
};