import Product from "../types.ts";
import { v4 } from "https://deno.land/std/uuid/mod.ts";
import { Client } from "https://deno.land/x/postgres/mod.ts";
import { dbCreds } from "../config.ts";

// Init Postgres Client
const client = new Client(dbCreds);

let products: Product[] = [
    {
        id: "1",
        name: "Product One",
        description: "This is product one",
        price: 29.99,
    },
    {
        id: "2",
        name: "Product Two",
        description: "This is product two",
        price: 39.99,
    },
    {
        id: "3",
        name: "Product Three",
        description: "This is product three",
        price: 59.99,
    },
];

// @desc    Get all products
// @route   GET /api/v0/products
const getProducts = async ({ response }: { response: any }) => {
    try {
        await client.connect();
        const result = await client.query("SELECT * FROM products");

        const products = new Array();

        result.rows.map((row) => {
            let obj: any = new Object();
            result.rowDescription.columns.map((col, i) => {
                obj[col.name] = row[i];
            });

            products.push(obj);
        });

        response.body = {
            success: true,
            data: products,
        };
    } catch (err) {
        response.status = 500;
        response.body = {
            success: false,
            message: err.toString(),
        };
    } finally {
        await client.end();
    }
};

// @desc    Get single product
// @route   GET /api/v0/products/:id
const getProduct = async ({
    params,
    response,
}: {
    params: { id: string };
    response: any;
}) => {
    try {
        await client.connect();
        const result = await client.query(
            "SELECT * FROM products WHERE id = $1",
            params.id
        );

        if (result.rows.toString() === "") {
            response.status = 404;
            response.body = {
                success: false,
                message: `No product with the id of ${params.id}`,
            };

            return;
        } else {
            const product: any = new Object();
            result.rows.map((row) => {
                result.rowDescription.columns.map((col, i) => {
                    product[col.name] = row[i];
                });
            });

            response.body = {
                success: true,
                data: product,
            };
        }
    } catch (err) {
        response.status = 500;
        response.body = {
            success: false,
            message: err.toString(),
        };
    } finally {
        await client.end();
    }
};

// @desc    Add product
// @route   POST /api/v0/products
const addProduct = async ({
    request,
    response,
}: {
    request: any;
    response: any;
}) => {
    const body = await request.body();
    const product = body.value;

    if (!request.hasBody) {
        response.status = 400;
        response.body = {
            success: false,
            message: "No data",
        };
    } else {
        try {
            await client.connect();
            const result = await client.query(
                "INSERT INTO products(name, description, price) VALUES($1,$2,$3)",
                product.name,
                product.description,
                product.price
            );
            response.status = 201;
            response.body = {
                success: true,
                data: product,
            };
        } catch (err) {
            response.status = 500;
            response.body = {
                success: false,
                message: err.toString(),
            };
        } finally {
            await client.end();
        }
    }
};

// @desc    Update product
// @route   PUT /api/v0/products/:id
const updateProduct = async ({
    params,
    request,
    response,
}: {
    params: { id: string };
    request: any;
    response: any;
}) => {
    const product: Product | undefined = products.find(
        (p) => p.id === params.id
    );
    if (product) {
        // parse request body
        const body = await request.body();
        const updateData: {
            name?: string;
            description?: string;
            price?: number;
        } = body.value;

        // update the product
        products = products.map((p) =>
            p.id === params.id ? { ...p, ...updateData } : p
        );

        response.status = 200;
        response.body = {
            success: true,
            data: products,
        };
    } else {
        response.status = 404;
        response.body = {
            success: false,
            message: "No Product Found.",
        };
    }
};

// @desc    Delete product
// @route   DELETE /api/v0/products/:id
const deleteProduct = ({
    params,
    response,
}: {
    params: { id: string };
    response: any;
}) => {
    // filter out the product to be deleted by id
    products = products.filter((p) => p.id !== params.id);
    response.body = {
        success: true,
        message: "Product deleted.",
    };
};

export { getProducts, getProduct, addProduct, updateProduct, deleteProduct };
