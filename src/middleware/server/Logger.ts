//@ts-ignore
import AsciiTable from "ascii-table";
import * as path from "path"
import log from "@util/log";
//@ts-ignore
import ipware from "ipware"
import colors from "colors";
import xml from "xml";

export default function (req: any, res: any, next: any) {
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  let table = new AsciiTable();
  table
    .setHeading("Ref", "Content")
    .addRow("Method", req.method)
    .addRow("Path", req.path)
    .addRow("Address", ip)
    .addRow("Status", `${res.statusCode}`)
    .addRow("Params", JSON.stringify(req.query))
  log(
    "\n" +
      colors.blue(`${req.method} ${colors.bgBlue(colors.white(req.path))}`) +
      "\n" +
      table.toString(),
    colors.bold
  );
  
 
  next();
}
