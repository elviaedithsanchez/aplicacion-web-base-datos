const { DataTypes } = require('sequelize');
const { sequelize } = require('./database');

const Pension = sequelize.define(
  'Pension',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El nombre es requerido',
        },
        len: {
          args: [3, 255],
          msg: 'El nombre debe tener entre 3 y 255 caracteres',
        },
      },
    },
    anios_servicio: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: 'Los años de servicio deben ser un número entero',
        },
        min: {
          args: [1],
          msg: 'Los años de servicio deben ser al menos 1',
        },
        max: {
          args: [50],
          msg: 'Los años de servicio no pueden exceder 50',
        },
      },
    },
    salario_mensual: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: {
          msg: 'El salario mensual debe ser un número válido',
        },
        min: {
          args: [0.01],
          msg: 'El salario mensual debe ser mayor a 0',
        },
      },
    },
    pension_calculada: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: {
          msg: 'La pensión calculada debe ser un número válido',
        },
        min: {
          args: [0],
          msg: 'La pensión calculada debe ser mayor o igual a 0',
        },
      },
    },
  },
  {
    tableName: 'pensions',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);

Pension.calcularPension = (salarioMensual, aniosServicio) => {
  return parseFloat((salarioMensual * aniosServicio).toFixed(2));
};

module.exports = Pension;
