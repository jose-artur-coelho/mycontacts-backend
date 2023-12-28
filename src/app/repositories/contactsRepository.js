const db = require('../../database');

class ContactRepository {
  async findAll(orderBy = 'asc') {
    const direction = orderBy.toLowerCase() === 'desc' ? 'desc' : 'asc';
    const rows = await db.query(
      `select contacts.*, categories.name as category_name
      from contacts
      left join categories on categories.id = contacts.category_id
      order by name ${direction}`
    );
    return rows;
  }

  async findByID(id) {
    const [row] = await db.query(
      `select contacts.*, categories.name as category_name 
      from contacts
      left join categories on categories.id = contacts.category_id 
      where contacts.id = $1`,
      [id]
    );
    return row;
  }

  async findByEmail(email) {
    const [row] = await db.query('select * from contacts where email = $1', [
      email,
    ]);
    return row;
  }

  async create(contact) {
    const { name, phone, email, category_id } = contact;
    const [row] = await db.query(
      `insert into contacts(name, email, phone, category_id) values($1, $2, $3, $4) returning *`,
      [name, phone, email, category_id]
    );
    return row;
  }

  async update(id, { name, email, phone, category_id }) {
    const selectedId = id;
    const [row] = await db.query(
      `
    update contacts where id = ${selectedId}
    set name = $1, email = $2, phone = $3, category_id = $4
    returning *`,
      [name, email, phone, category_id]
    );
    return row;
  }

  async delete(id) {
    const deleteOp = await db.query('delete from contacts where id = $1', [id]);
    return deleteOp;
  }
}

module.exports = new ContactRepository();
