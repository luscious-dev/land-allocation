const { sql, conn } = require("../db");
const { getCurrentDate } = require("../utils/dateUtils");

module.exports = class Land {
  // Create - C
  async create(data) {
    const { LandId, ImageName } = data;
    await conn.connect();
    const result = await conn
      .request()
      .output("Id", undefined)
      .input("LandId", sql.Int, LandId)
      .input("ImageName", sql.VarChar(100), ImageName)
      .input("DateCreated", sql.Date, getCurrentDate())
      .execute(`dbo.${process.env.UNIQUE_PREFIX}_LandImage_Create`);

    return result.output;
  }

  // Read - R
  async readAll() {
    await conn.connect();

    const result = await conn
      .request()
      .execute(`dbo.${process.env.UNIQUE_PREFIX}_LandImage_ReadList`);

    return result.recordset;
  }

  async readOne(Id) {
    await conn.connect();
    const result = await conn
      .request()
      .input("Id", Id)
      .execute(`dbo.${process.env.UNIQUE_PREFIX}_LandImage_ReadOne`);

    return result.recordset[0];
  }

  async readConditional(condition, orderBy = undefined) {
    await conn.connect();
    const result = await conn
      .request()
      .input("WhereCondition", condition)
      .input("OrderByExpression", orderBy)
      .execute(`dbo.${process.env.UNIQUE_PREFIX}_LandImage_ReadConditionList`);

    return result.recordset;
  }

  // Update - U
  async updateOne(Id, LastChanged = null, data) {
    await conn.connect();

    await conn
      .request()
      .input("Id", Id)
      .input("LandId", sql.Int, data.LandId)
      .input("ImageName", sql.VarChar(100), data.ImageName)
      .execute(`dbo.${process.env.UNIQUE_PREFIX}_LandImage_Update`);

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
      .execute(`dbo.${process.env.UNIQUE_PREFIX}_LandImage_Delete`);

    if (options.out) {
      return oldData;
    }

    return result.recordset;
  }
};
