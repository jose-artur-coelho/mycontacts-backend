const ContactRepository = require('../repositories/contactsRepository');

class ContactController {
  async index(request, response) {
    const { orderBy } = request.query;
    const contacts = await ContactRepository.findAll(orderBy);
    response.json(contacts);
  }

  async show(request, response) {
    const { id } = request.params;

    const contact = await ContactRepository.findByID(id);
    if (contact) {
      return response.status(200).json(contact);
    }
    response.status(404).json({ error: 'Contact not found' });
  }

  async store(request, response) {
    const { name, email, phone, category_id } = request.body;

    const emailExist = await ContactRepository.findByEmail(email);
    if (!name) {
      response.status(400).json({ error: 'Invalid contact. Name is required' });
    } else if (emailExist) {
      response.status(400).json({ error: 'This e-mail is already taken' });
    } else {
      await ContactRepository.create({ name, email, phone, category_id });
      response.status(201).json({ sucess: 'New contact created' });
    }
  }

  async update(request, response) {
    const { id } = request.params;
    const { name, email, phone, category_id } = request.body;
    const contactExist = await ContactRepository.findByID(id);

    if (!contactExist) {
      response.status(404).json({ error: 'Contact not found' });
    } else {
      await ContactRepository.update(id, { name, email, phone, category_id });
      response.status(200).json({ sucess: 'Contact updated' });
    }
  }

  async delete(request, response) {
    const { id } = request.params;
    await ContactRepository.delete(id);
    response.sendStatus(204);
  }
}

module.exports = new ContactController();
