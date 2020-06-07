import Product from "../types.ts";
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
    // first check if product exists in DB
    await getProduct({ params: { id: params.id }, response });
    if (response.status === 404) {
        response.body = {
            success: false,
            message: response.body.message,
        };
        response.status = 404;
        return;
    } else {
        const body = await request.body(); // request.body = {type: ____, value: product_data}
        const product = body.value;

        try {
            await client.connect();

            const result = await client.query(
                "UPDATE products SET name=$1, description=$2, price=$3 WHERE id=$4",
                product.name,
                product.description,
                product.price,
                params.id
            );
            response.status = 200;
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

// @desc    Delete product
// @route   DELETE /api/v0/products/:id
const deleteProduct = async ({
    params,
    response,
}: {
    params: { id: string };
    response: any;
}) => {
    // first check if product exists in DB
    await getProduct({ params: { id: params.id }, response });
    if (response.status === 404) {
        response.body = {
            success: false,
            message: response.body.message,
        };
        response.status = 404;
        return;
    } else {
        try {
            await client.connect();
            const result = await client.query(
                "DELETE FROM products WHERE id=$1",
                params.id
            );

            response.body = {
                success: true,
                message: `Product with id ${params.id} has been deleted.`,
            };
            response.status = 204; // No content
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

export { getProducts, getProduct, addProduct, updateProduct, deleteProduct };
