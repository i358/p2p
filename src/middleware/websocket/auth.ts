import userCheck from "@hooks/api/userCheck";

export default function (socket: any, next: Function) {
  const auth = socket.handshake.auth;

  if (!auth.token) next(new Error("Unauthorized"));
  else {
    let token = auth.token.split(" ")[1];
    userCheck(token)
      .then((user: any) => {
        if (user.id && user.username) {
          socket.token = token;
          socket.user = user;
          next();
        } else next(new Error("User not found."));
      })
      .catch((err) => {
        next(new Error(err));
      });
  }
}
