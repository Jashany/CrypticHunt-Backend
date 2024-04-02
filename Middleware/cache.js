import client from "../Db/redis-client.js";

const getQuesById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const quesID = await client.get(`question:${id}`);
    if (quesID) {
      const data = JSON.parse(quesID);
      const { _id, question, score, solved, link } = data;
      const responseData = { _id, score, question, link, solved };
      return res.status(200).json(responseData);
    } else {
      next();
    }
  } catch (error) {
    return res.status(500).json({
      status: "failure",
      reason: "Server failure!",
    });
  }
};

const getLeaderBoardUsers = async (req, res, next) => {
  console.log("using zadd");
};

export { getQuesById };
