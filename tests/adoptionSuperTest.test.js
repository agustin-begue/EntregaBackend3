// TESTS funcionales para todos los endpoints de "adoption.router.js"
import supertest from "supertest";
import chai from "chai";

const expect = chai.expect
const requester = supertest("http://localhost:8080");

describe("Adoptme Tests", () => {
    describe("Adoptions Test", () => {
        //AID HARDCODEADO PARA EL TEST GET BY ID
        let adoptionId = "681124b8b7e864d7a0a18467"
        //UID PARA EL TEST POST con uid y pid (ÚLTIMO ENDPOINT)
        let userId;
        //PID PARA EL TEST POST con uid y pid (ÚLTIMO ENDPOINT)
        let petId;

        it("Debe devolver todas las adopciones existentes", async () => {
            const response = await requester.get("/api/adoptions");

            expect(response.status).to.equal(200);
            expect(response.ok).to.equal(true);
            expect(response.body).to.have.property("status").that.equals("success");
            expect(response.body).to.have.property("payload").that.is.an("array");
        })

        it("Debe obtener un ID de adopción para el test", async () => {
            const response = await requester.get("/api/adoptions/");

            expect(response.status).to.equal(200);
            expect(response.ok).to.equal(true);
            expect(response.body).to.have.property("status").that.equals("success");
            expect(response.body).to.have.property("payload").that.is.an("array");

            if (!response.body.payload.length) {
                console.warn("No hay adopciones en la base de datos, se omite el test de adopción específica.");
                return this.skip();
            }

            adoptionId = response.body.payload[0]._id;
        });

        it("Debe devolver una adopción específica existente", async () => {
            if (!adoptionId) {
                console.warn("No hay adopciones en la base de datos, se omite este test.");
                return this.skip();
            }
            const adoptionResponse = await requester.get(`/api/adoptions/${adoptionId}`);

            expect(adoptionResponse.status).to.equal(200);
            expect(adoptionResponse.ok).to.equal(true);
            expect(adoptionResponse.body).to.have.property("status").that.equals("success");
            expect(adoptionResponse.body).to.have.property("payload").that.is.an("object");
        })

        //USUARIO DE PRUEBA (siempre distinto) PARA EL POST ADOPTION con UID y PID
        it("Debe crear un usuario de prueba", async () => {
            const userResponse = await requester.post("/api/sessions/register").send({
                first_name: `Test User ${Date.now()}`,
                last_name: `Last Name ${Date.now()}`,
                email: `test${Date.now()}@mail.com`,
                password: "password123"
            });

            expect(userResponse.status).to.equal(201);
            expect(userResponse.body).to.have.property("status").that.equals("success");
            expect(userResponse.body).to.have.property("payload").that.is.a("string");

            userId = userResponse.body.payload;
            console.log("Usuario creado con ID:", userId);
        });

        //MASCOTA DE PRUEBA (siempre distinta) PARA EL POST ADOPTION con UID y PID
        it("Debe crear una mascota de prueba", async () => {
            const petResponse = await requester.post("/api/pets").send({
                name: `Test Pet ${Date.now()}`,
                specie: "Dog",
                birthDate: `${Date.now()}`
            });

            expect(petResponse.status).to.equal(200);
            expect(petResponse.body).to.have.property("status").that.equals("success");
            expect(petResponse.body).to.have.property("payload").that.is.an("object");

            petId = petResponse.body.payload._id;
            console.log("Mascota creada con ID:", petId);
        });

        //EL NUEVO USUARIO DE PRUEBA ADOPTA A LA NUEVA MASCOTA DE PRUEBA.
        it("Debe permitir la adopción de una mascota por un usuario", async () => {
            const response = await requester.post(`/api/adoptions/${userId}/${petId}`);

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property("status").that.equals("success");
            expect(response.body).to.have.property("message").that.equals("Pet adopted");
        });
    })
})