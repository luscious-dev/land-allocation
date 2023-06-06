const { sql, conn } = require("../db");
const { getCurrentDate } = require("../utils/dateUtils");

module.exports = class Land {
  // Create - C
  async create(data) {
    const { UserId, LandId } = data;
    await conn.connect();
    const result = await conn
      .request()
      .output("Id", undefined)
      .input("UserId", sql.Int, UserId)
      .input("LandId", sql.VarChar(100), LandId)
      .input("DateAllocated", sql.Date, getCurrentDate())
      .output("LastChanged", sql.VarBinary, undefined)
      .execute(`dbo.${process.env.UNIQUE_PREFIX}_AllocatedTo_Create`);

    return result.output;
  }

  // Read - R
  async readAll() {
    await conn.connect();
    const result = await conn
      .request()
      .execute(`dbo.${process.env.UNIQUE_PREFIX}_AllocatedTo_ReadList`);

    return result.recordset;
  }

  async readOne(Id) {
    await conn.connect();
    const result = await conn
      .request()
      .input("Id", Id)
      .execute(`dbo.${process.env.UNIQUE_PREFIX}_AllocatedTo_ReadOne`);

    return result.recordset[0];
  }

  async readConditional(condition, orderBy = undefined) {
    await conn.connect();
    const result = await conn
      .request()
      .input("WhereCondition", condition)
      .input("OrderByExpression", orderBy)
      .execute(
        `dbo.${process.env.UNIQUE_PREFIX}_AllocatedTo_ReadConditionList`
      );

    return result.recordset;
  }

  // Update - U
  async updateOne(Id, LastChanged, data) {
    await conn.connect();

    await conn
      .request()
      .input("Id", Id)
      .input("UserId", sql.Int, data.UserId)
      .input("LandId", sql.VarChar(100), data.LandId)
      .input("DateAllocated", sql.Date, getCurrentDate())
      .input("LastChanged", sql.VarBinary, LastChanged)
      .output("NewLastChanged", sql.VarBinary, undefined)
      .execute(`dbo.${process.env.UNIQUE_PREFIX}_AllocatedTo_Update`);

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
      .execute(`dbo.${process.env.UNIQUE_PREFIX}_AllocatedTo_Delete`);

    if (options.out) {
      return oldData;
    }

    return result.recordset;
  }
};
