const express = require('express');
const mysql = require('mysql');

const app = express();

// Configura la conexión a la base de datos MariaDB
const db = mysql.createConnection({
  host: 'precios-1.c0f6dm2ucnlg.us-east-2.rds.amazonaws.com',
  user: 'candidatoPrueba',
  password: 'gaspre21.M',
  database: 'prueba',
});

// Conéctate a la base de datos
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Conectado a la base de datos MariaDB');
});

// Define la ruta GET para obtener la información de la estación y competidores
app.get('/prueba/:stationId/:brandId', (req, res) => {
  const stationId = req.params.stationId;
  const brandId = req.params.brandId;

  // Consulta SQL para obtener la información requerida
  const sql = `
  SELECT
    s.name AS Nombre,
    sc.distance AS Distancia,
    p.value AS "Precio por producto",
    b.name AS Marca,
    (p.value - AVG(pc.value)) AS "Diferencia de Precio de tu estación vs precio de tus competidores"
  FROM
    stations s
  JOIN
    stations_competitors sc ON s.cre_id = sc.id
  JOIN
    stations_brands sb ON s.cre_id = sb.id
  JOIN
    brands b ON sb.id_brand = b.id
  JOIN
    prices p ON sb.cre_id = p.cre_id
  LEFT JOIN
    prices pc ON s.cre_id = pc.cre_id
  WHERE
    b.id = ? AND s.cre_id = ?
  GROUP BY
    s.name, sc.distance, p.value, b.name;
  `;

  // Ejecuta la consulta SQL con los valores de los parámetros
  db.query(sql, [brandId, stationId], (err, result) => {
    if (err) {
      throw err;
    }

    if (result.length === 0) {
      res.status(404).json({ message: 'Estación no encontrada' });
    } else {
      res.json(result[0]); // Devuelve el primer resultado encontrado
    }
  });
});

const PORT = process.env.PORT || 3306;

app.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});
