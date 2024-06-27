import Product from "../models/Product.model.js";
import ProductStat from "../models/ProductStat.model.js";
import User from "../models/user.model.js";
import Transaction from "../models/Transaction.model.js";
import getCountryIso3 from "country-iso-2-to-3";


export const getProducts = async (req, res) => {
    try {
      const products = await Product.find();
  
      const productsWithStats = await Promise.all(
        products.map(async (product) => {
          const stat = await ProductStat.find({
            productId: product._id,
          });
          return {
            ...product._doc,
            stat,
          };
        })
      );
  
      res.status(200).json(productsWithStats);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };

  export const getCustomers = async (req, res) => {
    try {
      const customers = await User.find({ role: "user" }).select("-password");
      res.status(200).json(customers);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };

  export const getTransactions = async (req, res) => {
    try {
      let { page = 0, pageSize = 20, sortModel = [], search = "" } = req.query;
  
      // Convert page and pageSize to numbers
      page = parseInt(page, 10);
      pageSize = parseInt(pageSize, 10);
  
      // Construct sort object
      let sort = {};
      if (sortModel.length > 0) {
        const sortItem = sortModel[0];
        sort[sortItem.field] = sortItem.sort === "asc" ? 1 : -1;
      }
  
      // Construct query for searching
      const searchQuery = {
        $or: [
          { cost: { $regex: new RegExp(search, "i") } },
          { userId: { $regex: new RegExp(search, "i") } },
        ],
      };
  
      // Fetch transactions with pagination, sorting, and search
      const transactions = await Transaction.find(searchQuery)
        .sort(sort)
        .skip(page * pageSize)
        .limit(pageSize);
  
      // Count total number of documents matching the search criteria
      const total = await Transaction.countDocuments(searchQuery);
  
      res.status(200).json({
        transactions,
        total,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  export const getGeography = async (req, res) => {
    try {
      const users = await User.find();
  
      const mappedLocations = users.reduce((acc, { country }) => {
        const countryISO3 = getCountryIso3(country);
        if (!acc[countryISO3]) {
          acc[countryISO3] = 0;
        }
        acc[countryISO3]++;
        return acc;
      }, {});
  
      const formattedLocations = Object.entries(mappedLocations).map(
        ([country, count]) => {
          return { id: country, value: count };
        }
      );
  
      res.status(200).json(formattedLocations);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };
  

 