const request = require("supertest");

const app = require("../src/index");
const mongoose = require("mongoose");


describe("Endpoints de Libros", () => {
    test("Deberia obtener una lista de libros", async () => {
        const res = await request(app)
        .get("/libros")
        .set("Authorization", "miTokenSecreto123");

        expect(res.statusCode).toEqual(200);

        expect(Array.isArray(res.body)).toBe(true);
    })

    test("Deberia crear un nuevo Libro", async () => {
        const res = await request(app)
        .post("/libros")
        .send({
            titulo: "Libro test",
            autor: "Autor test"
        })
        .set("Authorization", "miTokenSecreto123");

        expect(res.statusCode).toEqual(200);

        expect(res.body.titulo).toEqual("Libro test");
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});