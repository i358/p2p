//@ts-ignore
import AsciiTable from "ascii-table";
import * as path from "path"
import log from "@util/log";
import colors from "colors";
import getIPAddr from "@hooks/server/getIPAddr";
import xml from "xml";

export default function (req: any, res: any, next: any) {
 
  let table = new AsciiTable();
  table
    .setHeading("Ref", "Content")
    .addRow("Method", req.method)
    .addRow("Path", req.path)
    .addRow("Address", getIPAddr(req))
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
