import mongoose from "mongoose";
import Users from "../src/dao/Users.dao.js";
import Assert from "assert";

mongoose.connect("mongodb+srv://agusbegue96:CoderCoder@cluster0.mnv0x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

const assert = Assert.strict;

describe("Users DAO", () => {
    before(function (){
        this.usersDao = new Users()
    })
    beforeEach(function (){
        this.timeout(5000);
    })
    it("El Dao debe poder obtener los usuarios en formato de arreglo", async function () {
        const result = await this.usersDao.get();
        assert.strictEqual(Array.isArray(result), true);
    })
});

//entre cada prueba pone 5 segundos entre una y otra.
//Y antes de todas las pruebas instancia una propiedad users para hacer las pruebas
// El it solo chequea que lo que devuelve la prueba sea un array.