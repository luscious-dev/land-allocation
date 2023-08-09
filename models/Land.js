const { sql, conn } = require("../db");
const { getCurrentDate } = require("../utils/dateUtils");
const slugify = require("slugify");

function stringToBoolean(value) {
  if (value) return value.toLowerCase() === "true";
  return undefined;
}

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
      .input("Accessibility", sql.Bit, stringToBoolean(Accessibility))
      .input("nearShops", sql.Bit, stringToBoolean(nearShops))
      .input("nearHospital", sql.Bit, stringToBoolean(nearHospital))
      // .input("nearSchool", sql.Bit, nearSchool)
      .input("hasElectricity", sql.Bit, stringToBoolean(hasElectricity))
      .input("hasWater", sql.Bit, stringToBoolean(hasWater))
      .input("isFenced", sql.Bit, stringToBoolean(isFenced))
      .input("isCleared", sql.Bit, stringToBoolean(isCleared))
      .input("isPopular", sql.Bit, stringToBoolean(isPopular))
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

    console.log("From updateOne ----");
    console.log(data);
    await conn
      .request()
      .input("Id", Id)
      .input("LandName", sql.VarChar(50), data.LandName)
      .input("Description", sql.VarChar, data.Description)
      .input("ZoningReg", sql.VarChar(50), data.ZoningReg)
      .input("Topography", sql.VarChar(20), data.Topography)
      .input("Accessibility", sql.Bit, stringToBoolean(data.Accessibility))
      .input("nearShops", sql.Bit, stringToBoolean(data.nearShops))
      .input("nearHospital", sql.Bit, stringToBoolean(data.nearHospital))
      // .input("nearSchool", sql.Bit, stringToBoolean(data.nearSchool))
      .input("hasElectricity", sql.Bit, stringToBoolean(data.hasElectricity))
      .input("hasWater", sql.Bit, stringToBoolean(data.hasWater))
      .input("isFenced", sql.Bit, stringToBoolean(data.isFenced))
      .input("isCleared", sql.Bit, stringToBoolean(data.isCleared))
      .input("isPopular", sql.Bit, stringToBoolean(data.isPopular))
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
      .input("LandBoundaries", sql.NVarChar(500), data.LandBoundaries)
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
  async deleteOneFlag(Id, LastChanged) {
    await conn.connect();

    const result = await conn
      .request()
      .input("Id", Id)
      .input("DelFlag", 1)
      .input("LastChanged", sql.VarBinary, Buffer.from(LastChanged))
      .output("NewLastChanged", sql.VarBinary, undefined)
      .execute(`dbo.${process.env.UNIQUE_PREFIX}_Land_DeleteFlag`);

    return result.output;
  }
};
