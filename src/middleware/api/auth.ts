export default function (req: any, res: any, next: any) {
  let { authorization } = req.headers;
  if (!authorization)
    res.json({
      error:
        "Access Denied. Not authenticated, token might be invalid or missing.",
      status: {
        code: 403,
        message: "UNAUTHORIZED",
      },
    });
  else next();
}
