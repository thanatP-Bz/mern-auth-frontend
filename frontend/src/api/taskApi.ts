import axios from "axios";

export const setTask = async (token: string) => {
  const res = await axios.get("http://localhost:4004/api/task/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const createTask = async (
  token: string,
  data: { title: string; description: string; completed: boolean }
) => {
  const res = await axios.post("http://localhost:4004/api/task/", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
