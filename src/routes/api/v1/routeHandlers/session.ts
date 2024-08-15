import { Router } from "express";
import apiAuthMiddleware from "@middleware/api/auth";
import userCheck from "@hooks/api/userCheck";
import validator, { isEmpty, isHexColor, isStrongPassword } from "validator";
import { Crypter } from "@lib/security/crypter";
import { Snowflake as SnowflakeInstance } from "@util/api/token/Snowflake";
import { PostgresManager } from "@lib/db/PostgresManager";
import { Timestamp as TimestampInstance } from "@util/api/token/Timestamp";
import moment from "moment";
import base64url from "base64url";
import isEmail from "validator/lib/isEmail";

const router = Router();
const Postgres = new PostgresManager.Postgres();
const MD5 = new Crypter.MD5();
const HMAC = new Crypter.HMAC();
const Snowflake = new SnowflakeInstance();
const Timestamp = new TimestampInstance();

router.post("/sign", async (req: any, res: any) => {
  let { email, password } = req.body;
  if (email && password) {
    if (
      validator.isEmail(email) &&
      !validator.isEmpty(password) &&
      !validator.isEmpty(email)
    ) {
      const User = await Postgres.FindOne({
        table: "users",
        pick: ["id", "createdAt", "username", "permLevels"],
        keys: ["email"],
        values: [email],
      });
      if (User.username && User.id && User.createdAt) {
        const UserSecret = await Postgres.FindOne({
          table: "secrets",
          pick: ["secret"],
          keys: ["id"],
          values: [User.id],
        });
        password = await MD5.create(password, { encoding: "none" });
        let data = await MD5.create(
          { username: User.username, email },
          { encoding: "base64url" }
        );
        const userValidator = await HMAC.validate(
          UserSecret.secret,
          password,
          data,
          { encoding: "base64url" }
        );

        const nextAuth = async () => {
          let [act] = User.permLevels.split(",");
          if (act === "N")
            return res.json({
              error: "Your account is waiting for activation.",
              status: {
                description: "INVALID_ACTIVATION",
              },
            });
          else if(act==="N-R")
            return res.json({
          error:"Verify your email address to activate your account.",
          status:{
            description:"EMAIL_IS_NOT_VERIFIED"
          }
            })
          else if (act === "B")
            return res.json({        
              error:"Your account has been suspended due to a violation of our terms of service",
              status:{
                description:"SUSPENDEND_ACCOUNT"
              }
            })
          else if(act==="R"){
          let id_ = base64url.fromBase64(
            Buffer.from(String(User.id), "utf-8")
            .toString("base64url")
          );
          let TokenTimestamp = await Timestamp.Convert(
            { encoding: "base64url" },
            User.createdAt
          );
          let token = `${id_}.${TokenTimestamp}.${UserSecret.secret}`;

          res.json({
            token,
            status: {
              description: "AUTHORIZED",
            },
          });
        }
        };
        userValidator
          ? nextAuth()
          : res.json({
              error: "The email or password is wrong.",
              status: {
                description: "AUTH_FAILED",
              },
            });
      } else
        res.json({
          error: "The email or password is wrong.",
          status: {
            description: "AUTH_FAILED",
          },
        });
    } else
      res.json({
        error: "Email address is invalid.",
        status: {
          description: "INVALID_EMAIL_ADDRESS",
        },
      });
  } else if (!email || !password)
    res.json({
      error: "Email or password is missing.",
      status: {
        description: "MISSING_FORM_MEMBER",
      },
    });
});

router.post("/new", async (req: any, res: any) => {
  let { username, email, password, color } = req.body;
  if (username && email && password && color) {
    if (
      !isEmpty(username) &&
      !isEmpty(email) &&
      isEmail(email) &&
      !isEmpty(password) &&
      isStrongPassword(password) &&
      isHexColor(color) &&
      !isEmpty(color) &&
      username.length >= 2 &&
      username.length < 20
    ) {
      const isEmailExists = await Postgres.FindOne({
        table: "users",
        pick: ["email"],
        keys: ["email"],
        values: [email],
      });
      if (isEmailExists.email)
        return res.json({
          error: "This email address already exists.",
          status: {
            description: "EMAIL_ADDRESS_ALREADY_REGISTERED",
          },
        });
      const now_ = moment().valueOf();
      const uid = await Snowflake.createUUID({ encoding: "none" });
      Postgres.Create({
        table: "users",
        keys: ["id", "username", "email", "createdAt", "color", "permLevels"],
        values: [uid, username, email, now_, color, "N,N-R,0,0,0"],
      })
        .then(async () => {
          const isSecretExists = await Postgres.FindOne({
            table: "secrets",
            pick: ["id"],
            keys: ["id"],
            values: [uid],
          });
          if (isSecretExists.id) {
            Postgres.FindOneAndDelete({
              table: "secrets",
              keys: ["id"],
              values: [uid],
              IDKeyName: "id",
            }).catch((err: any) => {
              console.log(
                "An error occurred while creating new secret with '" +
                  uid +
                  "' user id: ",
                err
              );
              return res.json({
                error:
                  "An error occurred while creating new secret with '" +
                  uid +
                  "' user id.",
                status: {
                  description: "UNKNOWN_CLUSTER_ERROR",
                },
              });
            });
          }
          const pwCr = await MD5.create(password, { encoding: "none" });
          const metadata = await MD5.create(
            { username, email },
            { encoding: "base64url" }
          );
          let HMACGeneratedKey = await HMAC.create(metadata, pwCr, {
            encoding: "base64url",
          });
          Postgres.Create({
            table: "secrets",
            keys: ["id", "secret", "createdAt"],
            values: [uid, HMACGeneratedKey, now_],
          }).then(() => {
            console.log(
              "User successfully created with '" + uid + "' ID. Log in."
            );
            res.json({
              message:
                "User successfully created with '" + uid + "' ID. Log in.",
              status: {
                description: "USER_CREATED",
              },
            });
          });
        })
        .catch((err: any) => {
          console.log(
            "An error occurred while creating new user with '" +
              uid +
              "' user id: ",
            err
          );
          return res.json({
            error:
              "An error occurred while creating new user with '" +
              uid +
              "' user id.",
            status: {
              description: "UNKNOWN_CLUSTER_ERROR",
            },
          });
        });
    } else {
      if (
        isEmpty(username) ||
        isEmpty(email) ||
        isEmpty(password) ||
        isEmpty(color)
      ) {
        res.json({
          error: "bos yer bırakma oc",
          status: {
            description: "MISSING_FORM_MEMBER",
          },
        });
      } else if (!isEmail(email)) {
        res.json({
          error: "Email address is invalid.",
          status: {
            description: "INVALID_EMAIL_ADDRESS",
          },
        });
      } else if (!isStrongPassword(password)) {
        res.json({
          error:
            "Your password must be at least 8 characters long and include at least one uppercase letter, lowercase letter, number, and special character (#, $, %, etc.)",
          status: {
            description: "WEAK_PASSWORD",
          },
        });
      } else if (!isHexColor(color)) {
        res.json({
          error: "amk. renk.",
          status: {
            description: "IS_NOT_HEX",
          },
        });
      } else if (username.length >= 20 || username.length < 2) {
        res.json({
          error: "Your username must be between 2 and 20 characters long.",
          status: {
            description: "UNEXPECTED_USERNAME_LENGTH",
          },
        });
      }
    }
  } else {
    res.json({
      error: "bos yer bırakma oc",
      status: {
        description: "MISSING_FORM_MEMBER",
      },
    });
  }
});

export default router;
