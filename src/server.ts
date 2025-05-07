import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// import { ecommerceRouter } from './modules/ecommerce/module';
// import { blogRouter } from './modules/blog/module';
// import { hobbyRouter } from './modules/hobby/module';
// import swaggerUi from 'swagger-ui-express';
// import swaggerDoc from './swagger.json';

import { globalErrorHandler } from './shared/middlewares/globalErrorHandler';

const app = express();

app.use(express.json());
dotenv.config();
app.use(cors({ origin: process.env.CORS_ORIGINS?.split(',') }));
// mount all modules
// app.use('/api/ecommerce', ecommerceRouter);
// app.use('/api/blog',      blogRouter);
// app.use('/api/hobby',     hobbyRouter);

// // docs
// app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// global error handler
app.use(globalErrorHandler);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

console.log(`CORS_ORIGINS: ${process.env.CORS_ORIGINS}`);

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
