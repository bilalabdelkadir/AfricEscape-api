import { Destination } from "../../model/destination/DestinationSchema.js";
const getAllDestination = async (req, res) => {
  const { name, country, minPrice, maxPrice, sortBy, sortOrder, page, limit } =
    req.query;
  const skip = (page - 1) * limit;
  const query = {};

  if (name) {
    query.name = new RegExp(name, "i");
  }

  if (country) {
    query.country = new RegExp(country, "i");
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) {
      query.price.$gte = minPrice;
    }
    if (maxPrice) {
      query.price.$lte = maxPrice;
    }
  }

  const sort = {};
  if (sortBy && sortOrder) {
    sort[sortBy] = sortOrder;
  }

  try {
    const destinations = await Destination.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const count = await Destination.countDocuments(query);

    res.status(200).json({
      destinations,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export default getAllDestination;

// name: Filter destinations by name, case-insensitive. Example: /destinations?name=paris
// country: Filter destinations by country, case-insensitive. Example: /destinations?country=france
// minPrice and maxPrice: Filter destinations by price range. Example: /destinations?minPrice=100&maxPrice=200
// sortBy and sortOrder: Sort destinations by a field and in a specific order (asc or desc). Example: /destinations?sortBy=price&sortOrder=desc
// page and limit: Paginate the results, with a specific number of items per page. Example: /destinations?page=1&limit=10
