const router = require("express").Router();
const { requireUser } = require("./utils")
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//Returns all the stations
router.get("/", async (req, res) => {
  try {
    const allStations = await prisma.station.findMany();

    res.send(allStations);
  } catch (error) {
    res.send({ message: `error loading stations`, error });
  }
});

//Returns a station with specified id
router.get("/:id", async (req, res) => {
  try {
    const station = await prisma.station.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });

    if (!station) {
      res.send({ error: true, message: `no station by that id` });
    } else {
      res.send(station);
    }
  } catch (error) {
    res.send({ message: `error loading station`, error });
  }
});

//Creates a new station
router.post("/", requireUser, async (req, res) => {
  try {
    const newStation = await prisma.station.create({
      data: req.body,
    });

    if (!newStation) {
      res.send({ error: true, message: `couldn't create station` });
    } else {
      res.send({ message: `station created`, station: updateStation });
    }

    res.send(newStation);
  } catch (error) {
    res.send({ message: `error creating station`, error });
  }
});

//Updates the station with specified id
router.put("/:id", requireUser, async (req, res) => {
  try {
    const updateStation = await prisma.station.update({
      where: {
        id: Number(req.params.id),
      },
      data: req.body,
    });

    if (!updateStation) {
      res.send({ error: true, message: `no station by that id` });
    } else {
      res.send({ message: `station updated`, station: updateStation });
    }
  } catch (error) {
    res.send({ message: `error updating station`, error });
  }
});

//Deletes a station
router.delete("/:id", requireUser, async (req, res) => {
  try {
    const deleteStation = await prisma.station.delete({
      where: {
        id: Number(req.params.id),
      },
    });

    if (!deleteStation) {
      res.send({ error: true, message: `no station by that id` });
    } else {
      res.send({ message: `station deleted`, station: deleteStation });
    }
  } catch (error) {
    res.send({ message: `error deleting station`, error });
  }
});

module.exports = router;
