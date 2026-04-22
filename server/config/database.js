async function query(sql, params = []) {
  throw new Error("Banco de dados ainda nao configurado. Implemente em server/config/database.js");
}

module.exports = { query };
