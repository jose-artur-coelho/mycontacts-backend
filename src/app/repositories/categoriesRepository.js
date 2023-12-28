const db = require('../../database');

class CategoriesRepository {
  async findAll() {
    const rows = await db.query('select * from categories order by name');
    return rows;
  }
  async findById(id) {
    const [row] = await db.query('select * from categories where id = $1', [
      id,
    ]);
    return row;
  }
  async findByName(name) {
    const [row] = await db.query('select * from categories where name = $1', [
      name,
    ]);
    return row;
  }

  async create({ name }) {
    const [row] = await db.query(
      `
    insert into categories(name)
    values($1)
    returning *
    `,
      [name]
    );
    return row;
  }
  async update(id, name) {
    const selectedId = id;
    const [row] = await db.query(
      `update categories where id = ${selectedId}
    set name = $1
    returning *
    `,
      [name]
    );
    return row;
  }
  async delete(id) {
    const deleteOp = await db.query('delete from categories where id = $1', [
      id,
    ]);
    return deleteOp;
  }
}

module.exports = new CategoriesRepository();
