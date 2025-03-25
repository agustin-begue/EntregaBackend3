// ENTREGABLE 1 BACKEND3
import { Router } from 'express'
import { faker } from '@faker-js/faker'
import { createHash } from '../utils/index.js'
import { usersService, petsService } from '../services/index.js';
import PetDTO from '../dto/Pet.dto.js';

export const mocksRouter = Router()
console.log("Ruta Mocks: Activa")


const generatePets = (userId) => {
    return {
        id:         faker.database.mongodbObjectId(),
        name:       faker.animal.dog(),
        specie:     faker.animal.type(),
        birthDate:  faker.date.past({ years: 5 }),
        adopted:    faker.datatype.boolean(),
        owner:      userId,
        image:      faker.image.url()
    }
}

const generateUser = async () => {
    let userId = faker.database.mongodbObjectId();
    let numberOfPetsToAdoptions = parseInt(faker.string.numeric(1, {bannedDigits: ['0']}))
    let adoptions = []
    for (let i = 0; i < numberOfPetsToAdoptions; i++) {
        adoptions.push(generatePets(userId))
    }
    return {
        id:         userId,
        first_name: faker.person.firstName(),
        last_name:  faker.person.lastName(),
        email:      faker.internet.email(),
        password: await createHash("coder123"), 
        role: faker.helpers.arrayElement(["user", "admin"]),
        adoptions,
    }
}

// Get /mockingusers
mocksRouter.get('/mockingusers', async (req, res) => {
    try {
        let users = await Promise.all(
            Array.from({ length: 50 }, () => generateUser())
        );

        res.send({ status: 'success', payload: users });
    } catch (error) {
        console.error("Error generando usuarios mock:", error);
        res.status(500).send({ status: 'error', message: 'Hubo un problema generando los usuarios mock.' });
    }
});


// Post /generateData
mocksRouter.post('/generateData', async (req, res) => {
    try {
        const { users, pets } = req.body;

        if (!users || !pets || users <= 0 || pets <= 0) {
            return res.status(400).send({
                status: "error",
                message: 'Parámetros "users" y "pets" son requeridos.'
            });
        }

        for (let i = 0; i < users; i++) {
            const userData = {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: await createHash("coder123"),
                role: faker.helpers.arrayElement(["user", "admin"])
            };
            await usersService.create(userData);
        }

        for (let i = 0; i < pets; i++) {
            const petData = {
                name: faker.animal.dog(),
                specie: faker.animal.type(),
                birthDate: faker.date.past({ years: 5 }),
                owner: null, // Mascotas independientes
                image:      faker.image.url()
            };
            const petDTO = PetDTO.getPetInputFrom(petData);
            await petsService.create(petDTO);
        }

        res.send({
            status: "success",
            message: `${users} usuarios y ${pets} mascotas generados e insertados correctamente en la base de datos.`
        });

    } catch (error) {
        console.error("Error al generar datos:", error);
        res.status(500).send({ status: "error", message: "Ocurrió un problema al generar los datos." });
    }
});

