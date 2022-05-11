CREATE DATABASE Match2Game
GO

USE Match2Game
GO

DROP TABLE IF EXISTS Grid
CREATE TABLE Grid(
	gridID INT IDENTITY(1,1) NOT NULL,
	gridName VARCHAR(15) NOT NULL,
	rows INT NOT NULL,
	cols INT NOT NULL,

	CONSTRAINT PK_Grid PRIMARY KEY CLUSTERED(gridID ASC)
)
GO

DROP TABLE IF EXISTS Score
CREATE TABLE Score(
	scoreID INT IDENTITY(1,1) NOT NULL,
	username VARCHAR(10) NOT NULL,
	score INT NOT NULL,
	gridID INT NOT NULL,

	CONSTRAINT PK_Score PRIMARY KEY CLUSTERED(scoreID ASC),
	CONSTRAINT FK_ScoreGrid FOREIGN KEY(gridID) REFERENCES Grid(gridID)
)
GO