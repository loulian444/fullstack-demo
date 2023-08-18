const router = require(`express`).Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require(`bcrypt`);
const jwt = require(`jsonwebtoken`);

router.get(`/`, (req, res) => {
  res.send(`you have reaches the auth router`);
});

//Registers a user
router.post(`/register`, async (req, res) => {
  try {
    const user = req.body;

    user.password = await bcrypt.hash(user.password, 10);

    const result = await prisma.user.create({
      data: user,
    });

    if (result) {
      const token = jwt.sign({ id: result.id }, process.env.JWT);

      res.status(201).send(token);
    } else {
      res.send({ message: `could not add user` });
    }
  } catch (error) {
    res.send(error.message);
  }
});

//Checks if user is valid
router.post(`/login`, async (req, res) => {
  const { username, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (user) {
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      const token = jwt.sign({ id: user.id }, process.env.JWT);

      res.send(token);
    } else {
      res.send({ message: `invalid login` });
    }
  } else {
    res.send({ message: `invalid login` });
  }
});

router.get(`/me`, async (req, res) => {
  // Checks the request for userId which was set by middleware in server/index.js
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
  });

  if (user) {
    res.send(user);
  } else {
    res.send(`user not found`);
  }
});

module.exports = router;
