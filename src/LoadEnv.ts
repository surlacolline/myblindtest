import commandLineArgs from 'command-line-args';
import dotenv from 'dotenv';

// Setup command line options
const options = commandLineArgs([
    {
        name: 'env',
        alias: 'e',
        defaultValue: 'production',
        type: String,
    },
]);

// Set the env file
let envConfigResult;
if (options.env === 'development') {
    envConfigResult = dotenv.config({
        path: `./env/development.env`,
    });
} else {
    envConfigResult = dotenv.config();
}

if (envConfigResult.error) {
    throw envConfigResult.error;
}
