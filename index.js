const express = require("express");
const app = express();
const { Joke } = require("./db");
const { Op } = require("sequelize");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/jokes", async (req, res, next) => {
  try {
    // TODO - filter the jokes by tags and content
    /**
     * where: {
     * tags: {[Op.like]: %tags%},
     * joke: {[Op.like]: %content%}
     * }
     */
    const { tags, content } = req.query;
    const constraint = {};
    if (tags) {
      constraint.tags = { [Op.like]: `%${tags}%` };
    }
    if (content) {
      constraint.joke = { [Op.like]: `%${content}%` };
    }
    const jokes = await Joke.findAll({ where: constraint });
    res.send(jokes);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

app.post("/jokes", async (req, res) => {
  const { joke, tags } = req.body;
  if (joke && tags) {
    try {
      await Joke.create({ joke, tags });
      res.sendStatus(201);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
});

app.delete("/jokes/:id", async (req, res) => {
  const { id } = req.params;
  if (id) {
    try {
      await Joke.destroy({ where: { id: id } });
      res.sendStatus(200);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
});

app.put("/jokes/:id", async (req, res) => {
  const { id } = req.params;
  const { joke, tags } = req.body;
  if (!id) {
    res.sendStatus(204);
  }
  const update = {};
  if (joke) {
    update.joke = joke;
  }
  if (tags) {
    update.tags = tags;
  }

  try {
    await Joke.update(update, { where: { id: id } });
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// we export the app, not listening in here, so that we can run tests
module.exports = app;
