const Task = require('../models/Task');

// Controller com funções básicas
const TaskController = {
  // Listar todas as tarefas
  async index(req, res) {
    try {
      const tasks = await Task.findAll();
      return res.json(tasks);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar tarefas' });
    }
  },

  // Criar uma nova tarefa
  async store(req, res) {
    try {
      const { title, description } = req.body;
      const task = await Task.create({ title, description });
      return res.status(201).json(task);
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao criar tarefa' });
    }
  }
};

module.exports = TaskController;