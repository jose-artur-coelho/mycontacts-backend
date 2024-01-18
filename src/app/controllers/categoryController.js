const CategoriesRepository = require('../repositories/categoriesRepository');
const isValidUUID = require('../utils/isValidUUID');

class CategoryController {
  async index(request, response) {
    const categories = await CategoriesRepository.findAll();
    response.status(200).json(categories);
  }

  async store(request, response) {
    const { name } = request.body;

    if (!name) {
      response.status(400).json({ error: 'Nome da categoria é obrigatório' });
    }
    const isRegistered = await CategoriesRepository.findByName(name);

    if (isRegistered) {
      response.status(409).json({ error: 'Categoria já existente' });
    } else {
      const category = await CategoriesRepository.create({ name });
      response.status(201).json(category);
    }
  }
  async update(request, response) {
    const { id } = request.params;
    const { name } = request.body;

    if (!name) {
      response.status(200);
    }
    if (!isValidUUID(id)) {
      response.status(400).json({ error: 'ID de categoria inválido' });
    }

    const idExist = CategoriesRepository.findById(id);

    if (!idExist) {
      response.status(404).json({ error: 'Categoria não encontrada' });
    } else {
      const category = await CategoriesRepository.update(id, name);
      response.status(200).json(category);
    }
  }
  async delete(request, response) {
    const { id } = request.params;
    if (!isValidUUID(id)) {
      response.status(400).json({ error: 'ID de categoria inválido' });
    }

    const idExist = await CategoriesRepository.findById(id);
    if (!idExist) {
      response.status(404).json({ error: 'Ca' });
    } else {
      await CategoriesRepository.delete(id);
      response.status(204);
    }
  }
}

module.exports = new CategoryController();
