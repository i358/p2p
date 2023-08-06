import { init, control } from "@utils/controllers/redisServerControl";

export default () => {
  init();
  let last: string = "establish";
  let tryreestablish: boolean = false;
  setInterval(async () => {
    tryreestablish = false;
    await control().catch(() => {
      last = "tryreestablish";
      tryreestablish = true;
      return init();
    });
    if (!tryreestablish && last === "tryreestablish") {
      last = "establish";
      init();
    }
  }, 8000);
};
