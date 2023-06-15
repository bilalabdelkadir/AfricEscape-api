import { Destination } from "../../model/destination/DestinationSchema.js";
import fs from "fs";

const updateDestination = async (req, res) => {
  const { id } = req.params;
  const files = req.files;
  const { name, description, price, startsAt, country, city, difficulty } =
    req.body;

  try {
    // Fetch existing destination
    let destination = await Destination.findById(id);

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: "Destination not found",
      });
    }

    // Delete old images from disk and remove from images array
    if (req.body.deleteImages) {
      const imagesToDelete = JSON.parse(req.body.deleteImages);
      imagesToDelete.forEach((image) => {
        const filename = destination.images[image].name;
        const imagePath = `public/upload/images/${filename}`;

        // Remove from disk
        fs.unlinkSync(imagePath);

        // Remove from images array
        destination.images.splice(image, 1);
      });
    }

    // Add new images to images array
    let images = destination.images;
    if (files) {
      files.map((file) => {
        images.push({ name: file.filename, path: file.path });
      });
    }

    // Update destination object
    if (name) {
      destination.name = name;
    }
    if (description) {
      destination.description = description;
    }
    if (price) {
      destination.price = price;
    }
    if (startsAt) {
      destination.startsAt = startsAt;
    }
    if (country) {
      destination.country = country;
    }
    if (city) {
      destination.city = city;
    }
    if (difficulty) {
      destination.difficulty = difficulty;
    }

    // Save updated destination in the database
    const updatedDestination = await destination.save();

    res.status(200).json(updatedDestination);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export default updateDestination;
