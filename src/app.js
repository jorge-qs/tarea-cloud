const express = require('express');
const morgan = require('morgan');
const db = require('./database');

const app = express();

app.set('port', process.env.PORT || 4000);
app.use(express.json());
app.use(morgan('dev'));

// CREATE - Crear un nuevo usuario
app.post('/user', (req, res) => {
  const { email, name, lastName } = req.body;
  db.run(
    "INSERT INTO user(email, name, lastName) VALUES (?, ?, ?)",
    [email, name, lastName],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({
        id: this.lastID,
        message: "Usuario creado exitosamente"
      });
    }
  );
});

// READ - Obtener todos los usuarios
app.get('/user', (req, res) => {
  db.all("SELECT * FROM user", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// READ - Obtener un usuario por ID
app.get('/user/:id', (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM user WHERE id = ?", id, (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }
    res.json(row);
  });
});

// UPDATE - Actualizar un usuario
app.put('/user/:id', (req, res) => {
  const { id } = req.params;
  const { email, name, lastName } = req.body;
  db.run(
    `UPDATE user 
     SET email = COALESCE(?, email), 
         name = COALESCE(?, name), 
         lastName = COALESCE(?, lastName) 
     WHERE id = ?`,
    [email, name, lastName, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ message: "Usuario no encontrado" });
        return;
      }
      res.json({ message: "Usuario actualizado exitosamente" });
    }
  );
});

// DELETE - Eliminar un usuario
app.delete('/user/:id', (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM user WHERE id = ?", id, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }
    res.json({ message: "Usuario eliminado exitosamente" });
  });
});

app.listen(app.get('port'), () => {
  console.log(`Servidor corriendo en el puerto ${app.get('port')}`);
});