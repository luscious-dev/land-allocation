const { sql, conn } = require("../db");
const { getCurrentDate } = require("../utils/dateUtils");
const slugify = require("slugify");

module.exports = class Land {
  // Create - C
  async create(data) {
    const {
      LandName,
      Description,
      ZoningReg,
      Topography,
      Accessibility,
      nearShops,
      nearHospital,
      nearSchool,
      hasElectricity,
      hasWater,
      isFenced,
      isCleared,
      isPopular,
      Lng,
      Lat,
      AddedBy,
      Location,
      State,
      City,
      LGA,
      Size,
      LandBoundaries,
      Price,
    } = data;

    await conn.connect();
    const result = await conn
      .request()
      .output("Id", undefined)
      .input("LandName", sql.VarChar(50), LandName)
      .input("Description", sql.VarChar, Description)
      .input("ZoningReg", sql.VarChar(50), ZoningReg)
      .input("Topography", sql.VarChar(20), Topography)
      .input("Accessibilty", sql.Bit, Accessibility)
      .input("nearShops", sql.Bit, nearShops)
      .input("nearHospital", sql.Bit, nearHospital)
      .input("nearSchool", sql.Bit, nearSchool)
      .input("hasElectricity", sql.Bit, hasElectricity)
      .input("hasWater", sql.Bit, hasWater)
      .input("isFenced", sql.Bit, isFenced)
      .input("isCleared", sql.Bit, isCleared)
      .input("isPopular", sql.Bit, isPopular)
      .input("Lng", sql.Decimal(9, 6), Lng)
      .input("Lat", sql.Decimal(9, 6), Lat)
      .input(
        "Slug",
        sql.VarChar(60),
        slugify(LandName, { lower: true, remove: /[*+~.()'"!:@]/g })
      )
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

    console.log(LastChanged);
    await conn
      .request()
      .input("Id", Id)
      .input("LandName", sql.VarChar(50), data.LandName)
      .input("Description", sql.VarChar, data.Description)
      .input("ZoningReg", sql.VarChar(50), data.ZoningReg)
      .input("Topography", sql.VarChar(20), data.Topography)
      .input("Accessibilty", sql.Bit, data.Accessibility)
      .input("nearShops", sql.Bit, data.nearShops)
      .input("nearHospital", sql.Bit, data.nearHospital)
      .input("nearSchool", sql.Bit, data.nearSchool)
      .input("hasElectricity", sql.Bit, data.hasElectricity)
      .input("hasWater", sql.Bit, data.hasWater)
      .input("isFenced", sql.Bit, data.isFenced)
      .input("isCleared", sql.Bit, data.isCleared)
      .input("isPopular", sql.Bit, data.isPopular)
      .input("Lng", sql.Decimal(9, 6), data.Lng)
      .input("Lat", sql.Decimal(9, 6), data.Lat)
      .input(
        "Slug",
        sql.VarChar(60),
        data.LandName
          ? slugify(data.LandName, { lower: true, remove: /[*+~.()'"!:@]/g })
          : undefined
      )
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
      .input("Allocated", sql.Bit, data.Allocated)
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
