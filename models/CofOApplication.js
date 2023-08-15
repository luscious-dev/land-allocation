const { sql, conn } = require("../db");
const { getCurrentDate } = require("../utils/dateUtils");

module.exports = class CofOApplication {
  // Create - C
  async create(data) {
    const {
      UserId,
      LandId,
      PurposeOfLandUse,
      EvidenceOfLandUse,
      ApplicationFee,
      PassportPhoto,
      NIN,
    } = data;
    await conn.connect();
    const result = await conn
      .request()
      .output("Id", undefined)
      .input("UserId", sql.Int, UserId)
      .input("LandId", sql.Int, LandId)
      .input("SiteLayout", sql.VarChar(50), data.SiteLayout)
      .input("AffidavitOfLandUse", sql.VarChar(50), data.AffidavitOfLandUse)
      .input("BusinessProposal", sql.VarChar(50), data.BusinessProposal)
      .input("ProposedBuildingPlan", sql.VarChar(50), data.ProposedBuildingPlan)
      .input("PurposeOfLandUse", sql.VarChar(50), data.PurposeOfLandUse)
      .input("EvidenceOfLandUse", sql.VarChar(50), data.EvidenceOfLandUse)
      .input("ApplicationFee", sql.Money, ApplicationFee)
      .input("ApplicationDate", sql.Date, getCurrentDate())
      // Change this
      .input("DelFlag", sql.Bit, 0)
      .input("PassportPhoto", sql.VarChar(50), PassportPhoto)
      .input("NIN", sql.Char(11), NIN)
      .input("Approved", sql.Bit, 0)
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
      .input("SiteLayout", sql.VarChar(50), data.SiteLayout)
      .input("AffidavitOfLandUse", sql.VarChar(50), data.AffidavitOfLandUse)
      .input("BusinessProposal", sql.VarChar(50), data.BusinessProposal)
      .input("ProposedBuildingPlan", sql.VarChar(50), data.ProposedBuildingPlan)
      .input("PurposeOfLandUse", sql.VarChar(50), data.PurposeOfLandUse)
      .input("EvidenceOfLandUse", sql.VarChar(50), data.EvidenceOfLandUse)
      .input("ApplicationFee", sql.Money, data.ApplicationFee)
      .input("ApplicationDate", sql.Date, data.ApplicationDate)
      .input("PassportPhoto", sql.VarChar(50), data.PassportPhoto)
      .input("NIN", sql.Char(11), data.NIN)
      .input("Approved", sql.Bit, data.Approved)
      .input("DelFlag", sql.Bit, data.DelFlag)
      .input("LastChanged", sql.VarBinary, Buffer.from(LastChanged))
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
