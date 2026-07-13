import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import healthRoutes from './routes/health.routes';
import productoRoutes from './routes/producto.routes';
import catalogoRoutes from './routes/catalogo.routes';

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/inventory/health', healthRoutes);
app.use('/api/inventory/catalogos', catalogoRoutes);
app.use('/api/inventory/productos', productoRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Microservicio de inventario funcionando correctamente'
  });
});

export default app;