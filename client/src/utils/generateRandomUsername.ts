import axios from "axios";

export default async function generateRandomUsername() {
  return new Promise<any>((resolve, reject) => {
    axios.get("https://randomuser.me/api/").then(({ data }: any) => {
      const username = data.results[0].name.first;
      resolve(username);
    });
  });
}
