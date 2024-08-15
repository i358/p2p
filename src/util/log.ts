import colors from "colors";
import moment from "moment";

export default (t: any, fn?: Function): void => {
  t = t
    .replace("{success}", "✅")
    .replace("{online}", "🟢")
    .replace("{error}", "❌")
    .replace("{disturb}", "🔴")
    .replace("{ready}", "🟡")
    .replace("{idle}", "🟠")
    .replace("{ring}", "⭕");
  console.log(
    `${colors.bold(
      colors.yellow(`[${moment().format("DD.MM.YY ~ HH:mm:ss")}] (App)`)
    )} ${fn ? fn(t) : t}`
  );
};
