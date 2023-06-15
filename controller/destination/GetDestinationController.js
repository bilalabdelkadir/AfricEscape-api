import { Destination } from "../../model/destination/DestinationSchema.js";

const getDestination = async (req, res) => {
  const { id } = req.params;
  try {
    const destination = await Destination.findById(id)
      .populate("addedBy")
      .populate("reviews.user");
    res.status(200).json(destination);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export default getDestination;
