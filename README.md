# Deno REST API

> This is a REST API using Deno, Oak and PostgreSQL

### Run (with Denon Dev Tool)

- Make sure you have PostgreSQL server installed & started
- Edit the "config.ts" file with your own PostgreSQL credentials

```
denon start
```

### Routes

```
GET      /api/v1/products
GET      /api/v1/products/:id
POST     /api/v1/products
PUT      /api/v1/products/:id
DELETE   /api/v1/products/:id
```
