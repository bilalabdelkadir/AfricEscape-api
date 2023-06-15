import {
  Destination,
  validateDestination,
} from "../../model/destination/DestinationSchema.js";

const createDestination = async (req, res) => {
  const userId = req.user._id;
  const userRole = req.user.role;
  if (userRole !== "admin") {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to create a destination",
    });
  }

  const files = req.files;
  if (!files) {
    return res.status(400).json({ success: false, message: "No files found" });
  }
  let images = [];

  if (files) {
    files.map((file) => {
      images.push({ name: file.filename, path: file.path });
    });
  }

  const { name, description, price, startsAt, country, city, difficulty } =
    req.body;
  const { error } = validateDestination({
    name,
    description,
    price,
    startsAt,
    country,
    city,
    difficulty,
  });
  if (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }

  console.log({
    name,
    description,
    price,
    images,
    startsAt,
    country,
    city,
    difficulty,
    addedBy: userId,
  });
  const newDestination = new Destination({
    name,
    description,
    price,
    images,
    startsAt,
    country,
    city,
    difficulty,
    addedBy: userId,
  });
  try {
    const savedDestination = await newDestination.save();
    res.status(201).json(savedDestination);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default createDestination;
