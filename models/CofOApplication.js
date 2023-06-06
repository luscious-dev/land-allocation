const { sql, conn } = require("../db");
const { getCurrentDate } = require("../utils/dateUtils");

module.exports = class Land {
  // Create - C
  async create(data) {
    const {
      UserId,
      LandId,
      PurposeOfLandUse,
      EvidenceOfLandUse,
      ApplicationFee,
      ApplicationDate,
      NIN,
    } = data;
    await conn.connect();
    const result = await conn
      .request()
      .output("Id", undefined)
      .input("UserId", sql.Int, UserId)
      .input("LandId", sql.Int, LandId)
      .input("PurposeOfLandUse", sql.VarChar(20), PurposeOfLandUse)
      .input("EvidenceOfLandUse", sql.VarChar(20), EvidenceOfLandUse)
      .input("ApplicationFee", sql.Money, ApplicationFee)
      .input("ApplicationDate", sql.Date, ApplicationDate)
      .input("PassportPhoto", sql.Geometry, PassportPhoto)
      .input("NIN", sql.Char(11), NIN)
      .input("Approved", sql.Bit, 0)
      .input("DateCreated", sql.Date, getCurrentDate())
      .output("LastChanged", sql.VarBinary, undefined)
      .execute(`dbo.${process.env.UNIQUE_PREFIX}_CofOApplication_Create`);

    return result.output;
  }

  // Read - R
  async readAll() {
    await conn.connect();

    const result = await conn
      .request()
      .execute(`dbo.${process.env.UNIQUE_PREFIX}_CofOApplication_ReadList`);

    return result.recordset;
  }

  async readOne(Id) {
    await conn.connect();
    const result = await conn
      .request()
      .input("Id", Id)
      .execute(`dbo.${process.env.UNIQUE_PREFIX}_CofOApplication_ReadOne`);

    return result.recordset[0];
  }

  async readConditional(condition, orderBy = undefined) {
    await conn.connect();
    const result = await conn
      .request()
      .input("WhereCondition", condition)
      .input("OrderByExpression", orderBy)
      .execute(
        `dbo.${process.env.UNIQUE_PREFIX}_CofOApplication_ReadConditionList`
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
      .input("LandId", sql.Int, data.LandId)
      .input("PurposeOfLandUse", sql.VarChar(20), data.PurposeOfLandUse)
      .input("EvidenceOfLandUse", sql.VarChar(20), data.EvidenceOfLandUse)
      .input("ApplicationFee", sql.Money, data.ApplicationFee)
      .input("ApplicationDate", sql.Date, data.ApplicationDate)
      .input("PassportPhoto", sql.Geometry, data.PassportPhoto)
      .input("NIN", sql.Char(11), data.NIN)
      .input("Approved", sql.Bit, 0)
      .input("DateCreated", sql.Date, undefined)
      .input("LastChanged", sql.VarBinary, LastChanged)
      .output("NewLastChanged", sql.VarBinary, undefined)
      .execute(`dbo.${process.env.UNIQUE_PREFIX}_CofOApplication_Update`);

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
      .execute(`dbo.${process.env.UNIQUE_PREFIX}_CofOApplication_Delete`);

    if (options.out) {
      return oldData;
    }

    return result.recordset;
  }
};
