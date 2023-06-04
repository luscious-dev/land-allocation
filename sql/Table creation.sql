USE "Land Allocation"

CREATE TABLE [User](
	Id INT PRIMARY KEY IDENTITY(1,1),
	FirstName VARCHAR(50) NOT NULL,
	MiddleName VARCHAR(50),
	LastName VARCHAR(50) NOT NULL,
	DOB DATE NOT NULL,
	Email VARCHAR(50) NOT NULL,
	[Role] VARCHAR(20) NOT NULL,
	Phone VARCHAR(20) NOT NULL,
	[Password] VARCHAR(60) NOT NULL,
	PasswordChangedAt DATETIME,
	DateCreated DATETIME DEFAULT GETDATE(),
	LastChanged TIMESTAMP
);

CREATE TABLE Land(
	Id INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
	AddedBy INT NOT NULL,
	[Location] VARCHAR(100) NOT NULL,
	[State] VARCHAR(10) NOT NULL,
	City VARCHAR(10) NOT NULL,
	LGA VARCHAR(10),
	Size DECIMAL NOT NULL,
	LandBoundaries GEOMETRY NOT NULL,
	Price MONEY NOT NULL,
	Allocated BIT NOT NULL,
	DateCreated DATETIME DEFAULT GETDATE(),
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
	LastChanged ROWVERSION,
	CONSTRAINT CK_PurposeOfLandUse CHECK(PurposeOfLandUse IN ('Agriculture','Residential','Commercial')),
	FOREIGN KEY (UserId) REFERENCES [User](Id),
	FOREIGN KEY (LandId) REFERENCES [Land](Id)
);