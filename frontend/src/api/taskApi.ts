import axios from "axios";

const taskApi = async (token: string) => {
  const res = await axios.get("http://localhost:4004/api/task/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export default taskApi;
