USE "Land Allocation"

CREATE TABLE [User](
	Id INT PRIMARY KEY IDENTITY(1,1),
	FirstName VARCHAR(50) NOT NULL,
	MiddleName VARCHAR(50),
	LastName VARCHAR(50) NOT NULL,
	DOB DATE NOT NULL,
	Email VARCHAR(50) NOT NULL UNIQUE,
	[Role] VARCHAR(20) NOT NULL,
	Phone VARCHAR(20) NOT NULL,
	[Password] VARCHAR(60) NOT NULL,
	PasswordChangedAt DATETIME,
	DateCreated DATETIME DEFAULT GETDATE(),
	LastChanged TIMESTAMP
);

CREATE TABLE Land(
	[Id] [int] IDENTITY(1,1) PRIMARY KEY,
	[LandName] [varchar](50) NOT NULL UNIQUE,
	[Description] [varchar](50) NOT NULL,
	[AddedBy] [int] NOT NULL,
	[Location] [varchar](100) NOT NULL,
	[State] [varchar](10) NOT NULL,
	[City] [varchar](10) NOT NULL,
	[LGA] [varchar](10) NULL,
	[Size] [decimal](18, 4) NOT NULL,
	[LandBoundaries] [varchar](MAX) NOT NULL,
	[Price] [money] NOT NULL,
	[Allocated] [bit] NOT NULL,
	[ZoningReg] [varchar](50) NOT NULL,
	[Topography] [varchar](20) NOT NULL,
	[Accessibilty] [bit] DEFAULT 0 NOT NULL,
	[nearShops] [bit] DEFAULT 0 NOT NULL,
	[nearHospital] [bit] DEFAULT 0 NOT NULL,
	[nearSchool] [bit] DEFAULT 0 NOT NULL,
	[hasElectricity] [bit] DEFAULT 0 NOT NULL,
	[hasWater] [bit] DEFAULT 0 NOT NULL,
	[isFenced] [bit] DEFAULT 0 NOT NULL,
	[isCleared] [bit] DEFAULT 0 NOT NULL,
	[isPopular] [bit] DEFAULT 0 NOT NULL,
	[Lng] [decimal](9, 6) NOT NULL,
	[Lat] [decimal](9, 6) NOT NULL,
	[Slug] [varchar](60) NOT NULL,
	[DateCreated] [datetime] NOT NULL,
	[LastChanged] [timestamp] NOT NULL,
	FOREIGN KEY (AddedBy) REFERENCES [dbo].[User](Id)
);


CREATE TABLE LandImage(
	Id INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
	LandId INT NOT NULL,
	ImageName VARCHAR(50) NOT NULL,
	DateCreated DATETIME DEFAULT GETDATE(),
	FOREIGN KEY (LandId) REFERENCES Land(Id)
);

CREATE TABLE AllocatedTo(
	Id INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
	UserId INT NOT NULL,
	LandId INT NOT NULL,
	DateAllocated DATETIME DEFAULT GETDATE(),
	FOREIGN KEY (LandId) REFERENCES Land(Id),
	FOREIGN KEY (UserId) REFERENCES [User](Id)

)

CREATE TABLE [CofOApplication](
	Id INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
	UserId INT NOT NULL,
	LandId INT NOT NULL,
	PurposeOfLandUse VARCHAR(20) NOT NULL,
	-- This could be an image/document of Propose building plan, Site Layout, Business Proposal, Agricultural Plan, Affidavit of land use
	EvidenceOfLandUse VARCHAR(20),
	ApplicationFee MONEY NOT NULL,
	ApplicationDate DATETIME DEFAULT GETDATE(),
	PassportPhoto VARCHAR(20),
	NIN CHAR(11) NOT NULL,
	Approved BIT DEFAULT 0,
	DelFlag BIT DEFAULT 0,
	LastChanged ROWVERSION,
	CONSTRAINT CK_PurposeOfLandUse CHECK(PurposeOfLandUse IN ('Agriculture','Residential','Commercial')),
	FOREIGN KEY (UserId) REFERENCES [User](Id),
	FOREIGN KEY (LandId) REFERENCES [Land](Id)
);