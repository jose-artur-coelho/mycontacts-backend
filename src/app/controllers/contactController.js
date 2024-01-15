const ContactRepository = require('../repositories/contactsRepository');
const isValidUUID = require('../utils/isValidUUID');

class ContactController {
  async index(request, response) {
    const { orderBy } = request.query;
    const contacts = await ContactRepository.findAll(orderBy);
    return response.json(contacts);
  }

  async show(request, response) {
    const { id } = request.params;

    if (isValidUUID(id)) {
      const contact = await ContactRepository.findByID(id);
      if (contact) {
        return response.status(200).json(contact);
      } else {
        return response.status(404).json({ error: 'Contact not found' });
      }
    } else {
      return response.status(400).json({ error: 'Invalid user id' });
    }
  }

  async store(request, response) {
    const { name, email, phone, category_id } = request.body;

    if (!name) {
      return response
        .status(400)
        .json({ error: 'Invalid contact. Name is required' });
    }

    if (category_id && !isValidUUID(category_id)) {
      return response.status(400).json({ error: 'Invalid category' });
    }

    if (email) {
      const emailExist = await ContactRepository.findByEmail(email);
      if (emailExist) {
        return response
          .status(400)
          .json({ error: 'This e-mail is already taken' });
      }
    }
    const contact = await ContactRepository.create({
      name,
      email: email || null,
      phone,
      category_id: category_id || null,
    });
    return response.status(201).json(contact);
  }

  async update(request, response) {
    const { id } = request.params;
    const { name, email, phone, category_id } = request.body;

    if (!name) {
      return response.status(400).json({ error: 'Name is required' });
    }

    if (category_id && !isValidUUID(category_id)) {
      return response.status(400).json({ error: 'Invalid category' });
    }

    if (isValidUUID(id)) {
      const contactExist = await ContactRepository.findByID(id);
      if (!contactExist) {
        return response.status(404).json({ error: 'Contact not found' });
      }
      if (email) {
        const contactByEmail = await ContactRepository.findByEmail(email);
        if (contactByEmail && contactByEmail.id !== id) {
          return response.status(400).json({ error: 'Email already in use' });
        }
      }

      const contact = await ContactRepository.update({
        name,
        email,
        phone,
        category_id: category_id || null,
      });
      return response.status(200).json(contact);
    } else {
      return response.status(400).json({ error: 'Invalid user id' });
    }
  }

  async delete(request, response) {
    const { id } = request.params;
    await ContactRepository.delete(id);
    return response.sendStatus(204);
  }
}

module.exports = new ContactController();
