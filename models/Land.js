const { sql, conn } = require("../db");
const { getCurrentDate } = require("../utils/dateUtils");

module.exports = class Land {
  // Create - C
  async create(data) {
    const { AddedBy, Location, State, City, LGA, Size, LandBoundaries, Price } =
      data;

    await conn.connect();
    const result = await conn
      .request()
      .output("Id", undefined)
      .input("AddedBy", sql.Int, AddedBy)
      .input("Location", sql.VarChar(100), Location)
      .input("State", sql.VarChar(10), State)
      .input("City", sql.VarChar(10), City)
      .input("LGA", sql.VarChar(50), LGA)
      .input("Size", sql.Decimal, Size)
      .input(
        "LandBoundaries",
        sql.NVarChar(500),
        JSON.stringify(LandBoundaries)
      )
      .input("Price", sql.Money, Price)
      .input("Allocated", sql.Bit, 0)
      .input("DateCreated", sql.Date, getCurrentDate())
      .output("LastChanged", sql.VarBinary, undefined)
      .execute(`dbo.${process.env.UNIQUE_PREFIX}_Land_Create`);

    return result.output;
  }

  // Read - R
  async readAll() {
    await conn.connect();

    const result = await conn
      .request()
      .execute(`dbo.${process.env.UNIQUE_PREFIX}_Land_ReadList`);

    return result.recordset;
  }

  async readOne(Id) {
    await conn.connect();
    const result = await conn
      .request()
      .input("Id", Id)
      .execute(`dbo.${process.env.UNIQUE_PREFIX}_Land_ReadOne`);

    return result.recordset[0];
  }

  async readConditional(condition, orderBy = undefined) {
    await conn.connect();
    const result = await conn
      .request()
      .input("WhereCondition", condition)
      .input("OrderByExpression", orderBy)
      .execute(`dbo.${process.env.UNIQUE_PREFIX}_Land_ReadConditionList`);

    return result.recordset;
  }

  // Update - U
  async updateOne(Id, LastChanged, data) {
    await conn.connect();

    await conn
      .request()
      .input("Id", Id)
      .input("AddedBy", sql.Int, data.AddedBy)
      .input("Location", sql.VarChar(100), data.Location)
      .input("State", sql.VarChar(10), data.State)
      .input("City", sql.VarChar(10), data.City)
      .input("LGA", sql.VarChar(50), data.LGA)
      .input("Size", sql.Decimal, data.Size)
      .input(
        "LandBoundaries",
        sql.NVarChar(500),
        JSON.stringify(data.LandBoundaries)
      )
      .input("Price", sql.Money, data.Price)
      .input("Allocated", sql.Bit, 0)
      .input("DateCreated", sql.Date, getCurrentDate())
      .input("LastChanged", sql.VarBinary, Buffer.from(LastChanged))
      .output("NewLastChanged", sql.VarBinary, undefined)
      .execute(`dbo.${process.env.UNIQUE_PREFIX}_Land_Update`);

    const updatedLand = await this.readOne(Id);
    return updatedLand;
  }

  // Delete - D
  async deleteOne(Id, options = {}) {
    await conn.connect();

    const oldData = await this.readOne(Id);

    const result = await conn
      .request()
      .input("Id", Id)
      .execute(`dbo.${process.env.UNIQUE_PREFIX}_Land_Delete`);

    if (options.out) {
      return oldData;
    }

    return result.recordset;
  }
};
