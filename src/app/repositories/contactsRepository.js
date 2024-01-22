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
      [name, email, phone, category_id]
    );
    return row;
  }

  async update(id, { name, email, phone, category_id }) {
    const [row] = await db.query(
      `
      update contacts 
      set name = $2, email = $3, phone = $4, category_id = $5
      where id = $1
      returning *
      `,
      [id, name, email, phone, category_id]
    );
    return row;
  }

  async delete(id) {
    const deleteOp = await db.query('delete from contacts where id = $1', [id]);
    return deleteOp;
  }
}

module.exports = new ContactRepository();
