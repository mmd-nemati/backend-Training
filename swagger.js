import swaggerAutogen from 'swagger-autogen';
import m2s from 'mongoose-to-swagger';
import { User } from './models/user/user.js';

const UserDoc = m2s(User, {
    omitFields: ['_id']
});
const outputFile = './swagger_output.json'
const endpointsFiles = ['./app.js']

const doc = {
    info: {
        version: "1.0.0",
        title: "Moria OpenAPI",
        description: "OpenAPI documentation of <b>Moria</b> social media."
    },
    host: "localhost:5000",
    basePath: "/",
    paths: {
        "folan": "sasas"
    },
    securityDefinitions: {
        jwtAuth: {
            type: 'http',
            scheme: 'bearer',
            name: 'x-auth-token',
            in: 'header',
            description: 'JWT token for authentication and authentication.'
        }
    },
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
        {
            "name": "User",
            "description": "Endpoints"
        },
        {
            "name": "Post",
            "description": "Endpoints"
        }
    ],
    
    properties: {
        createdAt: {
            type: 'string',
            format: 'date-time'
        }
    },
    myParameters: {
        jwtToken: {
            name: 'x-auth-token',
            in: 'header',
            type: 'string',
            required: true
        },
        listQuery: {
            page: {
                name: 'page',
                in: 'query',
                type: 'number',
                required: false
            },
            limit: {
                name: 'limit',
                description: 'Number of results in every page.',
                in: 'query',
                type: 'number',
                required: false
            }
        },
        newEntity: {
            user: {
                name: {
                    name: 'name',
                    type: 'string',
                    required: true,
                    example: 'Frodo Baggins'
                },
                username: {
                    name: 'username',
                    type: 'string',
                    required: true,
                    example: 'Frodo_Baggins'
                },
                email: {
                    name: 'email',
                    type: 'string',
                    required: true,
                    example: 'frodo@baggins.com'
                }
            }
        }
    },

    definitions: {
        User: {
            name: "Frodo Baggins",
            username: "frodoBagg",
            age: 51,
            createdAt: "2022-08-12T17:35:23.017Z",
            updatedAt: "2022-09-11T20:11:56.017Z"
        },
        NewUser: {
            name: "Frodo Baggins",
            username: "Frodo_Baggins",
            email: 'frodo@baggins.com',
            age: 51,
            phoneNumber: '09190000000',
            password: 'Frodo@123'
        },
        EditUser: {
            name: "Frodo Baggins",
            username: "frodoBagg",
            age: 51
        },
        LoginUser: {
            username: "Frodo_Baggins",
            email: "Frodo@baggins.com",
            password: "Frodo@123",
        },
        Post: {
            title: "New post from Shire!",
            text: "Todat is a nice day! Hope to enjoy it.",
            user: "Frodo_Baggins",
            createdAt: "2022-08-12T17:35:23.017Z",
            updatedAt: "2022-09-11T20:11:56.017Z"
        }
    }
}

await swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc);