import { baseDir } from "./index.js"

export const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'API documentation for the project'
        },
    },
    apis: [`${baseDir}/src/docs/**/*.yaml`], //(** - todas las subcarpetas dentro de "docs" / * - todos los archivos ".yaml"
}

