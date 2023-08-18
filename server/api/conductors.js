const router = require("express").Router();
const { requireUser } = require("./utils")
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//Returns all the conductors (with their train)
router.get("/", async (req, res) => {
  try {
    const conductors = await prisma.conductor.findMany({
      include: {
        train: true,
      },
    });
    res.send(conductors);
  } catch (error) {
    res.send(error);
  }
});

//Returns a conductor with specified id
router.get("/:id", async (req, res) => {
  try {
    const conductor = await prisma.conductor.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });
    if (!conductor) {
      res.send({ error: true, message: "Conductor Not Found" });
    } else {
      res.send(conductor);
    }
  } catch (error) {
    res.send(error);
  }
});

//Creates a new conductor
router.post("/", requireUser, async (req, res) => {
  try {
    const conductor = await prisma.conductor.create({
      data: req.body,
    });

    res.send(conductor);
  } catch (error) {
    res.send(conductor);
  }
});

//Updates conductor with specified id
router.put("/:id", requireUser, async (req, res) => {
  try {
    const conductor = await prisma.conductor.update({
      where: {
        id: Number(req.params.id),
      },
      data: req.body,
    });
    if (!conductor) {
      res.send({ error: true, message: "Conductor Not Found" });
    } else {
      res.send(conductor);
    }
  } catch (error) {
    res.send(error);
  }
});

//Deletes a conductor
router.delete("/:id", requireUser, async (req, res) => {
  try {
    const conductor = await prisma.conductor.delete({
      where: {
        id: Number(req.params.id),
      },
    });

    if (!conductor) {
      res.send({ error: true, message: "Conductor Not Found" });
    } else {
      res.send(conductor);
    }
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
