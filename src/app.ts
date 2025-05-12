import express from 'express';
import { globalErrorHandler } from './shared/middlewares/globalErrorHandler';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import { RootRouter } from './shared/rootRouter';
import { seeds } from './shared/config/seeds';
import { AppError } from './shared/utils/AppError';

seeds()
// Call the seeds function to seed the database
dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ 
    origin:'**', // allow all origins
    credentials: true, // allow credentials 
}));



// connect your routers
app.use('/api/v1', RootRouter);



// simple health check
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',                         // overall result
        timestamp: new Date().toISOString(),       // when this response was generated
        uptime: process.uptime(),                  // seconds since the app started
        version: process.env.nPM_PACKAGE_VERSION,  // your package.json version
        environment: process.env.NODE_ENV,         // e.g. “development” or “production”
        data: {                                    // reserved for any future payload
            message: 'API is up and running! 🚀'
        }
    });
});





// app.all('*', (req, res, next) => {
//     next(new AppError(404, `Cannot find ${req.originalUrl} on this server`));
// });





// global error handler
app.use(globalErrorHandler);



export default app;