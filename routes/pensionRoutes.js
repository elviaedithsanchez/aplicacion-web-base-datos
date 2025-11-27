const express = require('express');
const router = express.Router();
const Pension = require('../models/Pension');

router.get('/', async (req, res) => {
  try {
    const pensiones = await Pension.findAll({
      order: [['created_at', 'DESC']],
    });
    res.render('list', { pensiones });
  } catch (error) {
    console.error('Error al obtener pensiones:', error);
    res.status(500).render('list', {
      pensiones: [],
      error: 'Error al cargar las pensiones',
    });
  }
});

router.get('/nuevo', (req, res) => {
  res.render('form', {
    pension: null,
    action: '/pensiones',
    method: 'POST',
    title: 'Nueva Pensión',
  });
});

router.post('/', async (req, res) => {
  try {
    const { nombre, anios_servicio, salario_mensual } = req.body;

    const pension_calculada = Pension.calcularPension(
      parseFloat(salario_mensual),
      parseInt(anios_servicio),
    );

    await Pension.create({
      nombre,
      anios_servicio: parseInt(anios_servicio),
      salario_mensual: parseFloat(salario_mensual),
      pension_calculada,
    });

    res.redirect('/pensiones');
  } catch (error) {
    console.error('Error al crear pensión:', error);
    res.status(400).render('form', {
      pension: req.body,
      action: '/pensiones',
      method: 'POST',
      title: 'Nueva Pensión',
      error: error.errors
        ? error.errors[0].message
        : 'Error al crear la pensión',
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const pension = await Pension.findByPk(req.params.id);

    if (!pension) {
      return res.status(404).render('list', {
        pensiones: [],
        error: 'Pensión no encontrada',
      });
    }

    res.render('form', {
      pension,
      action: null,
      method: null,
      title: 'Detalle de Pensión',
      readonly: true,
    });
  } catch (error) {
    console.error('Error al obtener pensión:', error);
    res.status(500).redirect('/pensiones');
  }
});

router.get('/:id/editar', async (req, res) => {
  try {
    const pension = await Pension.findByPk(req.params.id);

    if (!pension) {
      return res.status(404).render('list', {
        pensiones: [],
        error: 'Pensión no encontrada',
      });
    }

    res.render('form', {
      pension,
      action: `/pensiones/${pension.id}?_method=PUT`,
      method: 'POST',
      title: 'Editar Pensión',
    });
  } catch (error) {
    console.error('Error al obtener pensión:', error);
    res.status(500).redirect('/pensiones');
  }
});

router.put('/:id', async (req, res) => {
  try {
    const pension = await Pension.findByPk(req.params.id);

    if (!pension) {
      return res.status(404).render('list', {
        pensiones: [],
        error: 'Pensión no encontrada',
      });
    }

    const { nombre, anios_servicio, salario_mensual } = req.body;

    const pension_calculada = Pension.calcularPension(
      parseFloat(salario_mensual),
      parseInt(anios_servicio),
    );

    await pension.update({
      nombre,
      anios_servicio: parseInt(anios_servicio),
      salario_mensual: parseFloat(salario_mensual),
      pension_calculada,
    });

    res.redirect('/pensiones');
  } catch (error) {
    console.error('Error al actualizar pensión:', error);
    res.status(400).render('form', {
      pension: { ...req.body, id: req.params.id },
      action: `/pensiones/${req.params.id}?_method=PUT`,
      method: 'POST',
      title: 'Editar Pensión',
      error: error.errors
        ? error.errors[0].message
        : 'Error al actualizar la pensión',
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const pension = await Pension.findByPk(req.params.id);

    if (!pension) {
      return res.status(404).json({
        success: false,
        message: 'Pensión no encontrada',
      });
    }

    await pension.destroy();

    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.json({
        success: true,
        message: 'Pensión eliminada correctamente',
      });
    }

    res.redirect('/pensiones');
  } catch (error) {
    console.error('Error al eliminar pensión:', error);

    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.status(500).json({
        success: false,
        message: 'Error al eliminar la pensión',
      });
    }

    res.status(500).redirect('/pensiones');
  }
});

module.exports = router;
