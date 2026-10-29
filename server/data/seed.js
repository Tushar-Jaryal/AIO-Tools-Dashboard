import User from "../models/User.js";
import Product from "../models/Product.js";
import ProductStat from "../models/ProductStat.js";
import Transaction from "../models/Transaction.js";
import OverallStat from "../models/OverallStat.js";
import AffiliateStat from "../models/AffiliateStat.js";
import {
  dataUser,
  dataProduct,
  dataProductStat,
  dataTransaction,
  dataOverallStat,
  dataAffiliateStat,
} from "./index.js";

// The sample data has no dates, so spread the transactions across 2021
// (the year the sales stats cover) instead of stamping them all with today.
const start = Date.UTC(2021, 0, 1);
const end = Date.UTC(2021, 10, 15);
const datedTransactions = dataTransaction.map((transaction, i) => {
  const createdAt = new Date(start + ((end - start) * i) / dataTransaction.length);
  return { ...transaction, createdAt, updatedAt: createdAt };
});

const collections = [
  [User, dataUser],
  [Product, dataProduct],
  [ProductStat, dataProductStat],
  [Transaction, datedTransactions],
  [OverallStat, dataOverallStat],
  [AffiliateStat, dataAffiliateStat],
];

export const seedIfEmpty = async ({ force = false } = {}) => {
  for (const [Model, data] of collections) {
    if (force) await Model.deleteMany({});
    if ((await Model.estimatedDocumentCount()) === 0) {
      await Model.insertMany(data);
      console.log(`Seeded ${data.length} ${Model.collection.name}`);
    }
  }
};
