import { Destination } from "../../model/destination/DestinationSchema.js";

const deleteDestination = async (req, res) => {
  const { id } = req.params;
  try {
    await Destination.findByIdAndDelete(id);
    res.status(200).json({ message: "Destination deleted successfully" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export default deleteDestination;
