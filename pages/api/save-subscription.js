// const dummyDb = { subscription:null }
const dummyDb = { subscription: "test-subscription" };

const saveToDatabase = async (subscription) => {
  dummyDb.subscription = subscription;
  //Stored in dummy memory
};

/**
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const subscription = req.body;
      await saveToDatabase(subscription);
      res.status(200).json({ message: "Subscription Success" });
    } catch (err) {
      console.error("New Error 1", err);
      res.status(400).json({ message: "Subscription error" });
    }
  } else {
    // Handle any other HTTP method
  }
}
