import pg from "pg";

let Client: any;

/**
 * A `module` that facilitates running queries on a Postgres database **without** using PostgreSQL commands.
 * @example
 * import { PostgresManager } from "path/to/pgManager";
 * const Postgres = new PostgresManager.Postgres();
 */
export namespace PostgresManager {
  /**
   * A `module` that facilitates running queries on a Postgres database **without** using PostgreSQL commands.
   * @example
   * import { PostgresManager } from "path/to/pgManager";
   * const Postgres = new PostgresManager.Postgres();
   */
  export class Postgres {
    /**
     * Modify the .env file as shown below, then connect to the database using this function, which will return the Client variable.
     * @example
     * // .env
     * POSTGRES_DBNAME = Your Postgres Database Name
     * POSTGRES_USERNAME = Your Postgres Username
     * POSTGRES_HOST = Your Postgres Host
     * POSTGRES_PASSWORD = Your Postgres Password
     * POSTGRES_PORT = 5432
     * // server.js
     * Postgres.Connect()
     * .then((client) => {
     * // Do somethings...
     * }).catch(console.error)
     * @returns {client | Promise<any>} Client variable or a Promise returning an error.
     */
    Connect(): Promise<any> {
      return new Promise((resolve, reject) => {
        const {
          POSTGRES_DBNAME,
          POSTGRES_HOST,
          POSTGRES_PASSWORD,
          POSTGRES_USERNAME,
          MODE,
        } = process.env;

        const client = new pg.Client({
          database: POSTGRES_DBNAME,
          host: POSTGRES_HOST,
          user: POSTGRES_USERNAME,
          password: POSTGRES_PASSWORD,
          ssl: MODE === "prod" ? true : MODE === "dev" && false,
        });

        client
          .connect()
          .then(() => resolve(client))
          .catch(reject);
        Client = client;
      });
    }
    /**
     * A function that allows directly querying the database and retrieving the result of the query.
     * @example
     * Postgres.Query('INSERT INTO "users" ("Username", "UserAvatar") VALUES ($1, $2)', ["358", "https://path/to/avatar"])
     * .then((result)=>{
     * // Do somethings...
     * }).catch(console.error)
     * @param {string} q The SQL query to be executed.
     * @param {any[]?} values The values of the variables to be used in this query.
     * @returns {Promise<any>} Returns the result from the database or an error message if applicable.
     */
    Query(q: any, values?: any[]): Promise<any> {
      if (!q) throw "Query string??";
      return new Promise((resolve, reject) => {
        Client.query(q, values || [], (err: any, res: any) => {
          if (err) reject(err);
          resolve(res);
        });
      });
    }
    /**
     * This function retrieves the data from the specified table that matches the `given conditions.`
     * @example
     * Postgres.Find({table: "messages", pick:["SenderName", "MessageCreationDate"], keys:["MessageContent"], values:["Hi!"], sort:10})
     * .then(()=>{
     * // Do somethings...
     * }).catch(console.error)
     * @param {Object[]} options An object containing query options.
     * @param {string} options.table Sets on which table the query will be performed.
     * @param {any[]?} options.keys An array containing the **conditions for the query**.`It can be left empty.`
     * @param {any[]?} options.values Sets the values that the conditioning keys **must satisfy**.
     * @param {any[]?} options.values Sets the values that the conditioning keys must satisfy.
     * @param {any[]?} options.pick Determines which keys of the data matching the desired results of the query will have their values returned. If left blank, it will return all key values.
     * @param {number?} options.sort **Retrieves** results up to the **specified length** and discards the rest. If left blank, it will retrieve all matching data without any limitations.
     * @returns {Promise<any>} Returns data that matches the desired results of the query or an error message if applicable.
     */
    Find(options: {
      table: any;
      keys?: any[];
      values?: any[];
      pick?: any[];
      sort?: Number;
    }): Promise<any> {
      let { table, keys, values, pick, sort } = options;
      return new Promise((resolve, reject) => {
        if (!table) throw "Query keys and values or table name??";
        let select = pick ? pick.map((p: any) => `"${p}"`).join(",") : "*";
        let where =
          keys && values
            ? `WHERE ${keys
                .map((key, id) => `"${key}"=$${id + 1}`)
                .join(" AND ")}`
            : "";
        Client.query(
          `SELECT ${select} FROM "${table}" ${where}`,
          values || [],
          (err: any, res: any) => {
            if (err) reject(err);
            if (sort) {
              if (res.rows && res.rows.length > 0) {
                let mapped = res.rows.filter(
                  //@ts-ignore
                  (row: any, id: any) => id + 1 <= sort
                );
                resolve({ rows: mapped });
              } else {
                resolve({ rows: {} });
              }
            } else {
              resolve(res);
            }
          }
        );
      });
    }
    /**
     * This function *retrieves* the **first data** from the **specified** table that matches the `given conditions.`
     * @example
     * Postgres.FindOne({table: "messages", pick:["SenderName", "MessageCreationDate"], keys:["MessageContent"], values:["Hi!"]})
     * .then(()=>{
     * // Do somethings...
     * }).catch(console.error)
     * @param {Object[]} options An object containing query options.
     * @param {string} options.table Sets on which table the query will be performed.
     * @param {any[]?} options.keys An array containing the **conditions for the query**.`It can be left empty.`
     * @param {any[]?} options.values Sets the values that the conditioning keys **must satisfy**.
     * @param {any[]?} options.values Sets the values that the conditioning keys must satisfy.
     * @param {any[]?} options.pick Determines which keys of the data matching the desired results of the query will have their values returned. If left blank, it will return all key values.
     * @returns {Promise<any>} Returns the first data that matches the desired results of the query or an error message if applicable.
     */
    FindOne(options: {
      table: any;
      keys?: any[];
      values?: any[];
      pick?: any[];
    }): Promise<any> {
      let { table, keys, values, pick } = options;
      return new Promise((resolve, reject) => {
        if (!table) throw "Table name??";
        let select = pick ? pick.map((p: any) => `"${p}"`).join(",") : "*";
        let where =
          keys && values
            ? `WHERE ${keys
                .map((key, id) => `"${key}"=$${id + 1}`)
                .join(" AND ")}`
            : "";
        Client.query(
          `SELECT ${select} FROM "${table}" ${where}`,
          values || [],
          (err: any, res: any) => {
            if (err) reject(err);
            if (res && res.rows && res.rows.length > 0) {
              resolve(res.rows[0]);
            } else {
              resolve({});
            }
          }
        );
      });
    }
    /**
     * This function allows you to perform a **data insertion** operation on a table in the database.
     * @example
     * Postgres.Create({table:"messages", keys:["MessageSender", "MessageContent", "MessageCreationDate"], values:["358", "Hello world!", "2024-02-25 19:34"]}).then(()=>{
     * // Do somethings...
     * }).catch(console.error)
     * @param {Object[]} options An object containing query options.
     * @param {string} options.table Specifies the table on which the data insertion operation will be performed.
     * @param {any[]?} options.keys Specifies which keys will be affected by the data insertion operation.
     * @param {any[]?} options.values Specifies the values that the affected keys will receive in the data insertion operation.
     * @returns {Promise<any>} Returns the result of the operation and an error message if applicable.
     */
    Create(options: {
      table: any;
      keys?: any[];
      values?: any[];
    }): Promise<any> {
      return new Promise((resolve, reject) => {
        let { table, keys, values } = options;
        if (!table) throw "Table name??";
        let keyString = keys
          ? `(${keys.map((key: any) => `"${key}"`).join(", ")})`
          : "";
        let valueString = values
          ? `VALUES (${keys?.map((key, id) => `$${id + 1}`)})`
          : "";
        let queryString = `INSERT INTO "${table}" ${keyString} ${valueString}`;
        Client.query(queryString, values || [], (err: any, res: any) => {
          if (err) reject(err);
          this.FindOne(options).then((res_) => {
            if (res_) {
              resolve("Object created.");
            } else {
              reject("Object can not created.");
            }
          });
        });
      });
    }
    Update(options: {
      table: any;
      keys?: any[];
      values?: any[];
      newKeys: any[];
      newValues: any[];
    }) {
      let { table, keys, values, newKeys, newValues } = options;
      if (!table || !newKeys || !newValues) throw "WTF???";
      return new Promise((resolve, reject) => {
        let where =
          keys && values
            ? `WHERE ${keys
                //@ts-ignore
                .map((key, id) => `"${key}"='${values[id]}'`)
                .join(" AND ")}`
            : "";
        let set = `${newKeys
          .map((newK: any, id) => `"${newK}"=$${id + 1}`)
          .join(", ")}`;
        let queryString = `UPDATE "${table}" SET ${set} ${where}`;
        Client.query(queryString, newValues, (err: any, r: any) => {
          if (err) reject(err);
          resolve("ok.");
        });
      });
    }
    /**
     * This function *deletes* the **first data** from the specified table that matches the `given conditions.`
     * @example
     * Postgres.FindOneAndDelete({table: "messages", keys:["MessageContent"], values:["Hi!"], IDKeyName:"MessageID"})
     * .then(()=>{
     * // Do somethings...
     * }).catch(console.error)
     * @param {Object[]} options An object containing query options.
     * @param {string} options.table Sets on which table the query will be performed.
     * @param {any[]?} options.keys An array containing the **conditions for the query**.`It can be left empty.`
     * @param {any[]?} options.values Sets the values that the conditioning keys **must satisfy**.
     * @param {string} options.IDKeyName **To delete the data** that matches the given conditions, an ID needs to be used. This parameter allows you to set the name of the key that identifies the ID in the table.
     * @returns {Promise<any>} A `Promise` representing the result of the deletion operation.
     */
    FindOneAndDelete(options: {
      table: any;
      keys?: any[];
      values?: any[];
      IDKeyName: any;
    }): Promise<any> {
      let { table, IDKeyName } = options;
      if (!table) throw "Table name??";
      return new Promise((resolve, reject) => {
        this.FindOne(options)
          .then((row: any) => {
            if (row) {
              let where = `WHERE "${IDKeyName}"=${row[IDKeyName]}`;
              let queryString = `DELETE FROM "${table}" ${where}`;
              Client.query(queryString, [], (err: any) => {
                if (err) reject(err);
                resolve(true);
              });
            }
          })
          .catch((err) => reject("There's no result."));
      });
    }
    /**
     * This function deletes the data from the specified table that matches the `given conditions.`
     * @example
     * Postgres.FindAndDelete({table: "messages", keys:["MessageContent"], values:["Hi!"], sort:10, IDKeyName:"MessageID"})
     * .then(()=>{
     * // Do somethings...
     * }).catch(console.error)
     * @param {Object[]} options An object containing query options.
     * @param {string} options.table Sets on which table the query will be performed.
     * @param {any[]?} options.keys An array containing the **conditions for the query**.`It can be left empty.`
     * @param {any[]?} options.values Sets the values that the conditioning keys **must satisfy**.
     * @param {string} options.IDKeyName **To delete the data** that matches the given conditions, an ID needs to be used. This parameter allows you to set the name of the key that identifies the ID in the table.
     * @param {number?} options.sort **Deletes** all matching data up to the **specified length** and does not touch the rest. If left blank, it will retrieve all matching data without any limitations.
     * @returns {Promise<any>} A `Promise` representing the result of the deletion operation.
     */
    FindAndDelete(options: {
      table: any;
      keys?: any[];
      values?: any[];
      IDKeyName: any;
      sort?: Number;
    }): Promise<any> {
      let { table, keys, values, sort, IDKeyName } = options;
      if (!table) throw "Table name??";
      return new Promise((resolve, reject) => {
        this.Find(options)
          .then((results: any) => {
            if (results && results.rows) {
              results.rows.map((row: any) => {
                let where = `WHERE "${IDKeyName}"=${row[IDKeyName]}`;
                let queryString = `DELETE FROM "${table}" ${where}`;
                Client.query(queryString, [], (err: any) => {
                  if (err) reject(err);
                });
                resolve(true);
              });
            }
          })
          .catch((err) => reject("There's no result."));
      });
    }
    FindTable() {}
    CreateTable() {}
    UpdateTable() {}
    DeleteTable() {}
    Client() {
      return Client;
    }
  }
}
