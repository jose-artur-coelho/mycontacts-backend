const CategoriesRepository = require('../repositories/categoriesRepository');

class CategoryController {
  async index(request, response) {
    const categories = await CategoriesRepository.findAll();
    response.status(200).json(categories);
  }

  async store(request, response) {
    const { name } = request.body;

    if (!name) {
      response.status(400).json({ error: 'Category Name is required' });
    }
    const isRegistered = await CategoriesRepository.findByName(name);

    if (isRegistered) {
      response.status(409).json({ error: 'Category already exists' });
    } else {
      const category = await CategoriesRepository.create({ name });
      response.status(201).json(category);
    }
  }
  async update(request, response) {
    const { id } = request.params;
    const { name } = request.body;
    const idExist = CategoriesRepository.findById(id);
    if (!name) {
      response.status(200);
    }
    if (!idExist) {
      response.status(404).json({ error: 'Category not found' });
    } else {
      await CategoriesRepository.update(id, name);
      response.status(200).json({ sucess: 'Category updated' });
    }
  }
  async delete(request, response) {
    const { id } = request.params;
    const idExist = await CategoriesRepository.findById(id);
    if (!idExist) {
      response.status(404).json({ error: 'Category not found' });
    } else {
      await CategoriesRepository.delete(id);
      response.status(204);
    }
  }
}

module.exports = new CategoryController();
