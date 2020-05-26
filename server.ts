import { Application, Router } from "https://deno.land/x/oak/mod.ts";

const port = 5000;

const app = new Application();

const router = new Router();

// middleware
app.use(router.routes());
app.use(router.allowedMethods());

router.get("/api/v0/products", ({ response }: { response: any }) => {
  response.body = "Hello World";
});

console.log(`Server running on port ${port}`);

await app.listen({ port });
