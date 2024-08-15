"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validator_1 = __importStar(require("validator"));
const crypter_1 = require("../../../../lib/security/crypter");
const Snowflake_1 = require("../../../../util/api/token/Snowflake");
const PostgresManager_1 = require("../../../../lib/db/PostgresManager");
const Timestamp_1 = require("../../../../util/api/token/Timestamp");
const moment_1 = __importDefault(require("moment"));
const base64url_1 = __importDefault(require("base64url"));
const isEmail_1 = __importDefault(require("validator/lib/isEmail"));
const router = (0, express_1.Router)();
const Postgres = new PostgresManager_1.PostgresManager.Postgres();
const MD5 = new crypter_1.Crypter.MD5();
const HMAC = new crypter_1.Crypter.HMAC();
const Snowflake = new Snowflake_1.Snowflake();
const Timestamp = new Timestamp_1.Timestamp();
router.post("/sign", async (req, res) => {
    let { email, password } = req.body;
    if (email && password) {
        if (validator_1.default.isEmail(email) &&
            !validator_1.default.isEmpty(password) &&
            !validator_1.default.isEmpty(email)) {
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
                let data = await MD5.create({ username: User.username, email }, { encoding: "base64url" });
                const userValidator = await HMAC.validate(UserSecret.secret, password, data, { encoding: "base64url" });
                const nextAuth = async () => {
                    let [act] = User.permLevels.split(",");
                    if (act === "N")
                        return res.json({
                            error: "Your account is waiting for activation.",
                            status: {
                                description: "INVALID_ACTIVATION",
                            },
                        });
                    else if (act === "N-R")
                        return res.json({
                            error: "Verify your email address to activate your account.",
                            status: {
                                description: "EMAIL_IS_NOT_VERIFIED"
                            }
                        });
                    else if (act === "B")
                        return res.json({
                            error: "Your account has been suspended due to a violation of our terms of service",
                            status: {
                                description: "SUSPENDEND_ACCOUNT"
                            }
                        });
                    else if (act === "R") {
                        let id_ = base64url_1.default.fromBase64(Buffer.from(String(User.id), "utf-8")
                            .toString("base64url"));
                        let TokenTimestamp = await Timestamp.Convert({ encoding: "base64url" }, User.createdAt);
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
            }
            else
                res.json({
                    error: "The email or password is wrong.",
                    status: {
                        description: "AUTH_FAILED",
                    },
                });
        }
        else
            res.json({
                error: "Email address is invalid.",
                status: {
                    description: "INVALID_EMAIL_ADDRESS",
                },
            });
    }
    else if (!email || !password)
        res.json({
            error: "Email or password is missing.",
            status: {
                description: "MISSING_FORM_MEMBER",
            },
        });
});
router.post("/new", async (req, res) => {
    let { username, email, password, color } = req.body;
    if (username && email && password && color) {
        if (!(0, validator_1.isEmpty)(username) &&
            !(0, validator_1.isEmpty)(email) &&
            (0, isEmail_1.default)(email) &&
            !(0, validator_1.isEmpty)(password) &&
            (0, validator_1.isStrongPassword)(password) &&
            (0, validator_1.isHexColor)(color) &&
            !(0, validator_1.isEmpty)(color) &&
            username.length >= 2 &&
            username.length < 20) {
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
            const now_ = (0, moment_1.default)().valueOf();
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
                    }).catch((err) => {
                        console.log("An error occurred while creating new secret with '" +
                            uid +
                            "' user id: ", err);
                        return res.json({
                            error: "An error occurred while creating new secret with '" +
                                uid +
                                "' user id.",
                            status: {
                                description: "UNKNOWN_CLUSTER_ERROR",
                            },
                        });
                    });
                }
                const pwCr = await MD5.create(password, { encoding: "none" });
                const metadata = await MD5.create({ username, email }, { encoding: "base64url" });
                let HMACGeneratedKey = await HMAC.create(metadata, pwCr, {
                    encoding: "base64url",
                });
                Postgres.Create({
                    table: "secrets",
                    keys: ["id", "secret", "createdAt"],
                    values: [uid, HMACGeneratedKey, now_],
                }).then(() => {
                    console.log("User successfully created with '" + uid + "' ID. Log in.");
                    res.json({
                        message: "User successfully created with '" + uid + "' ID. Log in.",
                        status: {
                            description: "USER_CREATED",
                        },
                    });
                });
            })
                .catch((err) => {
                console.log("An error occurred while creating new user with '" +
                    uid +
                    "' user id: ", err);
                return res.json({
                    error: "An error occurred while creating new user with '" +
                        uid +
                        "' user id.",
                    status: {
                        description: "UNKNOWN_CLUSTER_ERROR",
                    },
                });
            });
        }
        else {
            if ((0, validator_1.isEmpty)(username) ||
                (0, validator_1.isEmpty)(email) ||
                (0, validator_1.isEmpty)(password) ||
                (0, validator_1.isEmpty)(color)) {
                res.json({
                    error: "bos yer bırakma oc",
                    status: {
                        description: "MISSING_FORM_MEMBER",
                    },
                });
            }
            else if (!(0, isEmail_1.default)(email)) {
                res.json({
                    error: "Email address is invalid.",
                    status: {
                        description: "INVALID_EMAIL_ADDRESS",
                    },
                });
            }
            else if (!(0, validator_1.isStrongPassword)(password)) {
                res.json({
                    error: "Your password must be at least 8 characters long and include at least one uppercase letter, lowercase letter, number, and special character (#, $, %, etc.)",
                    status: {
                        description: "WEAK_PASSWORD",
                    },
                });
            }
            else if (!(0, validator_1.isHexColor)(color)) {
                res.json({
                    error: "amk. renk.",
                    status: {
                        description: "IS_NOT_HEX",
                    },
                });
            }
            else if (username.length >= 20 || username.length < 2) {
                res.json({
                    error: "Your username must be between 2 and 20 characters long.",
                    status: {
                        description: "UNEXPECTED_USERNAME_LENGTH",
                    },
                });
            }
        }
    }
    else {
        res.json({
            error: "bos yer bırakma oc",
            status: {
                description: "MISSING_FORM_MEMBER",
            },
        });
    }
});
exports.default = router;
//# sourceMappingURL=session.js.map