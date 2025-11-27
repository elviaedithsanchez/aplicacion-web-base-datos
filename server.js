const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
require('dotenv').config();

const { testConnection } = require('./models/database');
const pensionRoutes = require('./routes/pensionRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));

app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});

app.get('/', (req, res) => {
  res.render('index');
});

app.use('/pensiones', pensionRoutes);

app.use((req, res) => {
  res.status(404).render('index', {
    error: 'Página no encontrada',
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).render('index', {
    error: 'Error interno del servidor',
  });
});

const startServer = async () => {
  const dbConnected = await testConnection();

  if (!dbConnected) {
    console.error('No se pudo conectar a la base de datos.');
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`  Servidor corriendo en http://localhost:${PORT}`);
    console.log(`  Entorno: ${process.env.NODE_ENV || 'development'}`);
    console.log(`${'='.repeat(50)}\n`);
    console.log('Rutas disponibles:');
    console.log(`  - GET    /                       (Página principal)`);
    console.log(`  - GET    /pensiones              (Listar pensiones)`);
    console.log(`  - GET    /pensiones/nuevo        (Formulario nuevo)`);
    console.log(`  - POST   /pensiones              (Crear pensión)`);
    console.log(`  - GET    /pensiones/:id          (Ver detalle)`);
    console.log(`  - GET    /pensiones/:id/editar   (Formulario editar)`);
    console.log(`  - PUT    /pensiones/:id          (Actualizar)`);
    console.log(`  - DELETE /pensiones/:id          (Eliminar)\n`);
  });
};

startServer();

module.exports = app;
