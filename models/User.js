const { sql, conn } = require("../db");
const bcrypt = require("bcrypt");
const { getCurrentDate } = require("../utils/dateUtils");

module.exports = class User {
  // Create - C
  async create(data) {
    const { FirstName, MiddleName, LastName, DOB, Email, Phone, Password } =
      data;
    const hashedPassword = await bcrypt.hash(Password, 12);

    await conn.connect();
    const result = await conn
      .request()
      .output("Id", undefined)
      .input("FirstName", sql.VarChar(50), FirstName)
      .input("MiddleName", sql.VarChar(50), MiddleName)
      .input("LastName", sql.VarChar(50), LastName)
      .input("DOB", sql.Date, DOB)
      .input("Email", sql.VarChar(50), Email)
      .input("Role", sql.VarChar(20), "user")
      .input("Phone", sql.VarChar(20), Phone)
      .input("Password", sql.VarChar(60), hashedPassword)
      .input("PasswordChangedAt", sql.Date, getCurrentDate())
      .input("DateCreated", sql.Date, getCurrentDate())
      .output("LastChanged", sql.VarBinary, undefined)
      .execute(`dbo.${process.env.UNIQUE_PREFIX}_User_Create`);

    return result.output;
  }

  // Read - R
  async readAll() {
    await conn.connect();

    const result = await conn
      .request()
      .execute(`dbo.${process.env.UNIQUE_PREFIX}_User_ReadList`);

    return result.recordset;
  }

  async readOne(Id) {
    await conn.connect();
    const result = await conn
      .request()
      .input("Id", Id)
      .execute(`dbo.${process.env.UNIQUE_PREFIX}_User_ReadOne`);

    return result.recordset[0];
  }

  async readConditional(condition, orderBy = undefined) {
    await conn.connect();
    const result = await conn
      .request()
      .input("WhereCondition", condition)
      .input("OrderByExpression", orderBy)
      .execute(`dbo.${process.env.UNIQUE_PREFIX}_User_ReadConditionList`);

    return result.recordset;
  }

  // Update - U
  async updateOne(Id, LastChanged, data) {
    await conn.connect();
    let hashedPassword = data.Password
      ? await bcrypt.hash(data.Password, 12)
      : undefined;

    await conn
      .request()
      .input("Id", Id)
      .input("FirstName", data.FirstName)
      .input("MiddleName", data.MiddleName)
      .input("LastName", data.LastName)
      .input("DOB", data.DOB)
      .input("Email", data.Email)
      .input("Role", undefined)
      .input("Phone", data.Phone)
      .input("Password", hashedPassword)
      .input("PasswordChangedAt", data.Password ? getCurrentDate() : undefined)
      .input("LastChanged", sql.VarBinary, Buffer.from(LastChanged))
      .output("NewLastChanged", sql.VarBinary, undefined)
      .execute(`dbo.${process.env.UNIQUE_PREFIX}_User_Update`);

    const updatedUser = await this.readOne(Id);
    return updatedUser;
  }

  // Delete - D
  async deleteOne(Id, options = {}) {
    await conn.connect();

    const oldData = await this.readOne(Id);

    const result = await conn
      .request()
      .input("Id", Id)
      .execute(`dbo.${process.env.UNIQUE_PREFIX}_User_Delete`);

    if (options.out) {
      return oldData;
    }

    return result.recordset;
  }
};
