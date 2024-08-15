import xml from "xml";

export default function (req: any, res: any, next: Function) {
  res.type("application/xml");
  res.status(404);
  let resp: any = {
    ServerResponse: [
      {
        Route: req.path,
      },
      {
        Method: req.method,
      },
      {
        Status: res.statusCode,
      },
      {
        Content: "The page you search is not found.",
      },
    ],
  };
  res.send(xml(resp, { declaration: true }));
}
