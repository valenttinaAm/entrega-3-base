import express from 'express';
import { engine } from 'express-handlebars';
import { neon } from '@neondatabase/serverless';

const app = express();

const sql = neon(
  'postgresql://neondb_owner:hXZosu27CHab@ep-nameless-thunder-a5pax8he.us-east-2.aws.neon.tech/p0?sslmode=require'
);

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use('/files', express.static('public'));

app.get('/', async (req, res) => {
  try {
    // Consultas para obtener datos
    const contratos = await sql`SELECT * FROM contratos`;
    const tiendas = await sql`SELECT * FROM tiendas`;
    const inventarios = await sql`SELECT * FROM inventarios`;
    const productos = await sql`SELECT * FROM productos`;
    const proveedores = await sql`SELECT * FROM proveedores`;
    const trabajadores = await sql`SELECT * FROM trabajadores`;
    const pedidos = await sql`SELECT * FROM pedidos`;
    const vehiculos = await sql`SELECT * FROM vehiculos`;
    const clientes = await sql`SELECT * FROM clientes`;

    // Enviar los datos a la vista
    res.render('home', {
      contratos,
      tiendas,
      inventarios,
      productos,
      proveedores,
      trabajadores,
      pedidos,
      vehiculos,
      clientes,
    });
  } catch (err) {
    console.error(err);
    res.send('Error al consultar la base de datos');
  }
});

app.use(express.json()); // Middleware para leer JSON
app.use(express.urlencoded({ extended: true })); // Para manejar datos de formularios*

// Ruta para agregar un nuevo contrato
app.post('/agregar-contrato', async (req, res) => {
  const { id_contrato, monto, fecha_inicio_de_contrato, fecha_fin_contrato } =
    req.body;
  try {
    // Verificar si ya existe el id_contrato
    const contratoExistente =
      await sql`SELECT id_contrato FROM contratos WHERE id_contrato = ${id_contrato}`;

    if (contratoExistente.length > 0) {
      res.send('El ID de contrato ya existe. Por favor elige otro.');
      return;
    }

    await sql`
      INSERT INTO contratos (id_contrato, monto, fecha_inicio_de_contrato, fecha_fin_contrato)
      VALUES (${id_contrato}, ${monto}, ${fecha_inicio_de_contrato}, ${fecha_fin_contrato})
    `;
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.send('Error al agregar el contrato');
  }
});

// Ruta para modificar un contrato
app.post('/modificar-contrato', async (req, res) => {
  const { id_contrato, monto, fecha_inicio_de_contrato, fecha_fin_contrato } =
    req.body;
  try {
    await sql`
      UPDATE contratos
      SET monto = ${monto}, fecha_inicio_de_contrato = ${fecha_inicio_de_contrato}, fecha_fin_contrato = ${fecha_fin_contrato}
      WHERE id_contrato = ${id_contrato}
    `;
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.send('Error al modificar el contrato');
  }
});

// Ruta para eliminar un contrato
app.post('/eliminar-contrato', async (req, res) => {
  const { id_contrato } = req.body;
  try {
    await sql`
      DELETE FROM contratos
      WHERE id_contrato = ${id_contrato}
    `;
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.send('Error al eliminar el contrato');
  }
});

// Ruta para agregar una nueva tienda
app.post('/agregar-tienda', async (req, res) => {
  const { id_tienda, nombre, direccion, region, numero_trabajadores } =
    req.body;
  try {
    // Verificar si ya existe el ID_Tienda
    const tiendaExistente =
      await sql`SELECT id_tienda FROM tiendas WHERE id_tienda = ${id_tienda}`;

    if (tiendaExistente.length > 0) {
      res.send('El ID de Tienda ya existe. Por favor elige otro.');
      return;
    }

    await sql`
      INSERT INTO tiendas (id_tienda, nombre, direccion, region, numero_trabajadores)
      VALUES (${id_tienda}, ${nombre}, ${direccion}, ${region}, ${numero_trabajadores})
    `;
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.send('Error al agregar la tienda');
  }
});

// Ruta para modificar una tienda
app.post('/modificar-tienda', async (req, res) => {
  const { id_tienda, nombre, direccion, region, numero_trabajadores } =
    req.body;
  try {
    await sql`
      UPDATE tiendas
      SET nombre = ${nombre}, direccion = ${direccion}, region = ${region}, numero_trabajadores = ${numero_trabajadores}
      WHERE id_tienda = ${id_tienda}
    `;
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.send('Error al modificar la tienda');
  }
});

// Ruta para eliminar una tienda
app.post('/eliminar-tienda', async (req, res) => {
  const { id_tienda } = req.body;
  try {
    await sql`
      DELETE FROM tiendas
      WHERE id_tienda = ${id_tienda}
    `;
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.send('Error al eliminar la tienda');
  }
});

// Ruta para agregar un nuevo inventario
app.post('/agregar-inventario', async (req, res) => {
  const {
    id_inventario,
    capacidad,
    categoria,
    cantidad_disponible,
    id_tienda,
  } = req.body;
  try {
    await sql`
      INSERT INTO inventarios (id_inventario, capacidad, categoria, cantidad_disponible, id_tienda)
      VALUES (${id_inventario}, ${capacidad}, ${categoria}, ${cantidad_disponible}, ${id_tienda})
    `;
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.send('Error al agregar el inventario');
  }
});

// Ruta para modificar un inventario
app.post('/modificar-inventario', async (req, res) => {
  const {
    id_inventario,
    capacidad,
    categoria,
    cantidad_disponible,
    id_tienda,
  } = req.body;
  try {
    await sql`
      UPDATE inventarios
      SET capacidad = ${capacidad}, categoria = ${categoria}, cantidad_disponible = ${cantidad_disponible}, id_tienda = ${id_tienda}
      WHERE id_inventario = ${id_inventario}
    `;
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.send('Error al modificar el inventario');
  }
});

// Ruta para eliminar un inventario
app.post('/eliminar-inventario', async (req, res) => {
  const { id_inventario } = req.body;
  try {
    await sql`
      DELETE FROM inventarios
      WHERE id_inventario = ${id_inventario}
    `;
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.send('Error al eliminar el inventario');
  }
});

// Ruta para agregar un nuevo producto
app.post('/agregar-producto', async (req, res) => {
  const { id_producto, nombre, categoria, precio, marca, peso } = req.body;
  try {
    await sql`
      INSERT INTO productos (id_producto, nombre, categoria, precio, marca, peso)
      VALUES (${id_producto}, ${nombre}, ${categoria}, ${precio}, ${marca}, ${peso})
    `;
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.send('Error al agregar el producto');
  }
});

// Ruta para modificar un producto
app.post('/modificar-producto', async (req, res) => {
  const { id_producto, nombre, categoria, precio, marca, peso } = req.body;
  try {
    await sql`
      UPDATE productos
      SET nombre = ${nombre}, categoria = ${categoria}, precio = ${precio}, marca = ${marca}, peso = ${peso}
      WHERE id_producto = ${id_producto}
    `;
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.send('Error al modificar el producto');
  }
});

// Ruta para eliminar un producto
app.post('/eliminar-producto', async (req, res) => {
  const { id_producto } = req.body;
  try {
    await sql`
      DELETE FROM productos
      WHERE id_producto = ${id_producto}
    `;
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.send('Error al eliminar el producto');
  }
});

// Ruta para agregar un nuevo proveedor
app.post('/agregar-proveedor', async (req, res) => {
  const {
    id_proveedor,
    nombre,
    direccion,
    tiempo_entrega,
    tipo_productos,
    id_contrato,
  } = req.body;
  try {
    await sql`
      INSERT INTO proveedores (id_proveedor, nombre, direccion, tiempo_entrega, tipo_productos, id_contrato)
      VALUES (${id_proveedor}, ${nombre}, ${direccion}, ${tiempo_entrega}, ${tipo_productos}, ${id_contrato})
    `;
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.send('Error al agregar el proveedor');
  }
});

// Ruta para modificar un proveedor
app.post('/modificar-proveedor', async (req, res) => {
  const {
    id_proveedor,
    nombre,
    direccion,
    tiempo_entrega,
    tipo_productos,
    id_contrato,
  } = req.body;
  try {
    await sql`
      UPDATE proveedores
      SET nombre = ${nombre}, direccion = ${direccion}, tiempo_entrega = ${tiempo_entrega}, tipo_productos = ${tipo_productos}, id_contrato = ${id_contrato}
      WHERE id_proveedor = ${id_proveedor}
    `;
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.send('Error al modificar el proveedor');
  }
});

// Ruta para eliminar un proveedor
app.post('/eliminar-proveedor', async (req, res) => {
  const { id_proveedor } = req.body;
  try {
    await sql`
      DELETE FROM proveedores
      WHERE id_proveedor = ${id_proveedor}
    `;
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.send('Error al eliminar el proveedor');
  }
});

// Ruta para agregar un nuevo trabajador
app.post('/agregar-trabajador', async (req, res) => {
  const { rut_trabajador, nombre, edad, cargo, id_tienda, id_contrato } =
    req.body;
  try {
    await sql`
          INSERT INTO trabajadores (rut_trabajador, nombre, edad, cargo, id_tienda, id_contrato)
          VALUES (${rut_trabajador}, ${nombre}, ${edad}, ${cargo}, ${id_tienda}, ${id_contrato})
      `;
    res.redirect('/'); // Redirigir después de agregar
  } catch (err) {
    console.error(err);
    res.send('Error al agregar el trabajador');
  }
});

// Ruta para modificar un trabajador
app.post('/modificar-trabajador', async (req, res) => {
  const { rut_trabajador, nombre, edad, cargo, id_tienda, id_contrato } =
    req.body;
  try {
    await sql`
          UPDATE trabajadores
          SET nombre = ${nombre}, edad = ${edad}, cargo = ${cargo}, id_tienda = ${id_tienda}, id_contrato = ${id_contrato}
          WHERE rut_trabajador = ${rut_trabajador}
      `;
    res.redirect('/'); // Redirigir después de modificar
  } catch (err) {
    console.error(err);
    res.send('Error al modificar el trabajador');
  }
});

// Ruta para eliminar un trabajador
app.post('/eliminar-trabajador', async (req, res) => {
  const { rut_trabajador } = req.body;
  try {
    await sql`
          DELETE FROM trabajadores
          WHERE rut_trabajador = ${rut_trabajador}
      `;
    res.sendStatus(200); // Responder con código 200 si se eliminó correctamente
  } catch (err) {
    console.error(err);
    res.send('Error al eliminar el trabajador');
  }
});

// Ruta para agregar un nuevo pedido
app.post('/agregar-pedido', async (req, res) => {
  const { id_pedido, id_proveedor, id_tienda, fecha, id_producto, cantidad } =
    req.body;
  try {
    await sql`
          INSERT INTO pedidos (id_pedido, id_proveedor, id_tienda, fecha, id_producto, cantidad)
          VALUES (${id_pedido}, ${id_proveedor}, ${id_tienda}, ${fecha}, ${id_producto}, ${cantidad})
      `;
    res.redirect('/'); // Redirigir después de agregar
  } catch (err) {
    console.error(err);
    res.send('Error al agregar el pedido');
  }
});

// Ruta para modificar un pedido
app.post('/modificar-pedido', async (req, res) => {
  const { id_pedido, id_proveedor, id_tienda, fecha, id_producto, cantidad } =
    req.body;
  try {
    await sql`
          UPDATE pedidos
          SET id_proveedor = ${id_proveedor}, id_tienda = ${id_tienda}, fecha = ${fecha}, id_producto = ${id_producto}, cantidad = ${cantidad}
          WHERE id_pedido = ${id_pedido}
      `;
    res.redirect('/'); // Redirigir después de modificar
  } catch (err) {
    console.error(err);
    res.send('Error al modificar el pedido');
  }
});

// Ruta para eliminar un pedido
app.post('/eliminar-pedido', async (req, res) => {
  const { id_pedido } = req.body;
  try {
    await sql`
          DELETE FROM pedidos
          WHERE id_pedido = ${id_pedido}
      `;
    res.sendStatus(200); // Responder con código 200 si se eliminó correctamente
  } catch (err) {
    console.error(err);
    res.send('Error al eliminar el pedido');
  }
});

// Ruta para agregar un nuevo vehículo
app.post('/agregar-vehiculo', async (req, res) => {
  const { patente, rut_trabajador, capacidad, region } = req.body;
  try {
    await sql`
          INSERT INTO vehiculos (patente, rut_trabajador, capacidad, region)
          VALUES (${patente}, ${rut_trabajador}, ${capacidad}, ${region})
      `;
    res.redirect('/'); // Redirigir después de agregar
  } catch (err) {
    console.error(err);
    res.send('Error al agregar el vehículo');
  }
});

// Ruta para modificar un vehículo
app.post('/modificar-vehiculo', async (req, res) => {
  const { patente, rut_trabajador, capacidad, region } = req.body;
  try {
    await sql`
          UPDATE vehiculos
          SET rut_trabajador = ${rut_trabajador}, capacidad = ${capacidad}, region = ${region}
          WHERE patente = ${patente}
      `;
    res.redirect('/'); // Redirigir después de modificar
  } catch (err) {
    console.error(err);
    res.send('Error al modificar el vehículo');
  }
});

// Ruta para eliminar un vehículo
app.post('/eliminar-vehiculo', async (req, res) => {
  const { patente } = req.body;
  try {
    await sql`
          DELETE FROM vehiculos
          WHERE patente = ${patente}
      `;
    res.sendStatus(200); // Responder con código 200 si se eliminó correctamente
  } catch (err) {
    console.error(err);
    res.send('Error al eliminar el vehículo');
  }
});

// Ruta para agregar un nuevo cliente
app.post('/agregar-cliente', async (req, res) => {
  const { rut_cliente, nombre, fecha_inscripcion, id_tienda, puntos } =
    req.body;
  try {
    await sql`
          INSERT INTO clientes (rut_cliente, nombre, fecha_inscripcion, id_tienda, puntos)
          VALUES (${rut_cliente}, ${nombre}, ${fecha_inscripcion}, ${id_tienda}, ${puntos})
      `;
    res.redirect('/'); // Redirigir después de agregar
  } catch (err) {
    console.error(err);
    res.send('Error al agregar el cliente');
  }
});

// Ruta para modificar un cliente
app.post('/modificar-cliente', async (req, res) => {
  const { rut_cliente, nombre, fecha_inscripcion, id_tienda, puntos } =
    req.body;
  try {
    await sql`
          UPDATE clientes
          SET nombre = ${nombre}, fecha_inscripcion = ${fecha_inscripcion}, id_tienda = ${id_tienda}, puntos = ${puntos}
          WHERE rut_cliente = ${rut_cliente}
      `;
    res.redirect('/'); // Redirigir después de modificar
  } catch (err) {
    console.error(err);
    res.send('Error al modificar el cliente');
  }
});

// Ruta para eliminar un cliente
app.post('/eliminar-cliente', async (req, res) => {
  const { rut_cliente } = req.body;
  try {
    await sql`
          DELETE FROM clientes
          WHERE rut_cliente = ${rut_cliente}
      `;
    res.sendStatus(200); // Responder con código 200 si se eliminó correctamente
  } catch (err) {
    console.error(err);
    res.send('Error al eliminar el cliente');
  }
});

app.post('/consulta', async (req, res) => {
  const { consulta, campos } = req.body;

  console.log('Consulta recibida:', consulta);
  console.log('Campos recibidos:', campos);

  try {
    let resultado;

    switch (consulta) {
      case 'inventario':
        resultado = await sql`
              SELECT i.* 
              FROM inventarios i
              JOIN tiendas t ON i.id_tienda = t.id_tienda
              WHERE t.nombre = ${campos.tienda}
          `;
        break;

      case 'regionVehiculo':
        resultado =
          await sql`SELECT patente, region FROM vehiculos WHERE patente = ${campos.patente}`;
        break;

      case 'stockProducto':
        resultado = await sql`
                    SELECT t.direccion From tiendas t
                    JOIN Inventarios i ON t.id_tienda = i.id_tienda 
                    WHERE i.categoria = ${campos.producto} AND i.cantidad_disponible <= ${campos.stock}
                `;
        break;

      case 'productosVendidos':
        const startDate = `${campos.fecha}-01`; // Convierte "2024-08" a "2024-08-01"
        const endDate = `${campos.fecha}-31`; // Asume el último día del mes

        resultado = await sql`
                    SELECT p.nombre AS producto, p.marca, SUM(pe.cantidad) AS total_vendido
                    FROM pedidos pe
                    JOIN productos p ON pe.id_producto = p.id_producto
                    WHERE pe.fecha >= ${startDate} AND pe.fecha <= ${endDate}
                    GROUP BY p.id_producto, p.nombre, p.marca
                    ORDER BY total_vendido DESC
                `;
        break;

      case 'categoriaProducto':
        resultado = await sql`
                    SELECT categoria
                    FROM productos
                    WHERE nombre = ${campos.producto}
                `;
        break;

      case 'proveedoresProducto':
        resultado = await sql`
                    SELECT pr.nombre AS proveedor, pr.direccion, pr.tiempo_entrega, pr.tipo_productos
                    FROM proveedores pr
                    WHERE pr.tipo_productos = ${campos.categoria}
                `;
        break;

      case 'proveedorEntrega':
        resultado = await sql`
                    SELECT nombre
                    FROM proveedores
                    WHERE tiempo_entrega < ${campos.tiempoEntrega}
                `;
        break;

      case 'cantidadPedidos':
        resultado = await sql`
                    SELECT COUNT(*) AS total_pedidos
                    FROM pedidos
                    WHERE id_tienda = (SELECT id_tienda FROM tiendas WHERE nombre = ${campos.tienda})
                    AND fecha BETWEEN  ${campos.fechaInicio} AND  ${campos.fechaFin}
                `;
        break;

      case 'contratoProveedor':
        resultado = await sql`
                    SELECT p.nombre, p.id_contrato, pe.fecha
                    FROM proveedores p
                    JOIN pedidos pe ON p.id_proveedor = pe.id_proveedor
                    WHERE pe.fecha = ${campos.fecha}
                `;
        break;

      case 'productoRegion':
        resultado = await sql`
                    SELECT t.id_tienda, t.nombre
                    FROM tiendas t
                    JOIN inventarios i ON t.id_tienda = i.id_tienda
                    WHERE t.region = ${campos.region}
                    AND i.categoria = ${campos.producto}
                    AND i.cantidad_disponible > 0
                `;
        break;

      case 'trabajador':
        resultado = await sql`
                    SELECT c.fecha_inicio_de_contrato, c.fecha_fin_contrato
                    FROM contratos c
                    JOIN trabajadores t ON c.id_contrato = t.id_contrato
                    WHERE t.nombre = ${campos.trabajador}
                `;
        break;

      case 'capacidadVehiculo':
        resultado = await sql`
                    SELECT patente
                    FROM vehiculos
                    WHERE capacidad > 1000 AND region = ${campos.region}
                `;
        break;

      case 'empleadosEdad':
        resultado = await sql`
                    SELECT rut_trabajador, nombre
                    FROM trabajadores
                    WHERE edad > 45 AND cargo = ${campos.trabajo}
                `;
        break;

      case 'productosBaratos':
        resultado = await sql`
                    SELECT marca, categoria
                    FROM productos
                    WHERE precio = (SELECT MIN(precio) FROM productos) 
                `;
        break;

      case 'puntosCliente':
        resultado = await sql`
                    SELECT c.puntos, t.nombre AS tienda
                    FROM clientes c
                    JOIN tiendas t ON c.id_tienda = t.id_tienda
                    WHERE c.nombre  = ${campos.cliente}
                `;
        break;

      case 'clientesInscritos':
        resultado = await sql`
                    SELECT c.rut_cliente, c.nombre
                    FROM clientes c
                    JOIN tiendas ti ON c.id_tienda = ti.id_tienda
                    WHERE ti.nombre = ${campos.tienda}
                    AND c.fecha_inscripcion BETWEEN ${campos.fechaInicio} AND ${campos.fechaFin}
                `;
        break;

      case 'trabajadoresContrato':
        resultado = await sql`
                    SELECT COUNT(*) AS total_trabajadores
                    FROM trabajadores t
                    JOIN contratos c ON t.id_contrato = c.id_contrato
                    JOIN tiendas ti ON t.id_tienda = ti.id_tienda
                    WHERE ti.nombre = ${campos.tienda} AND c.fecha_fin_contrato BETWEEN '2024-01-01' AND '2024-12-31'
                `;
        break;

      default:
        throw new Error('Consulta no soportada');
    }

    if (!resultado.length) {
      res.json({ error: 'No se encontraron resultados para esta consulta.' });
    } else {
      res.json({ resultado });
    }
  } catch (err) {
    console.error('Error en el servidor:', err);
    res.json({ error: `Error al procesar la consulta: ${err.message}` });
  }
});

app.delete('/delete/:table/:id', async (req, res) => {
  const { table, id } = req.params;

  // Validación de tablas permitidas
  const validTables = [
    'contratos',
    'tiendas',
    'inventarios',
    'productos',
    'proveedores',
    'trabajadores',
    'pedidos',
    'vehiculos',
    'clientes',
  ];
  if (!validTables.includes(table)) {
    return res.status(400).json({ error: 'Tabla no válida' });
  }

  try {
    // Eliminación segura del registro
    await sql`DELETE FROM ${sql(table)} WHERE id = ${id}`;
    res
      .status(200)
      .json({ message: `Registro eliminado de la tabla ${table}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el registro' });
  }
});

app.listen(3000, () => console.log('Listo'));
