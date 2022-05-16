DROP PROCEDURE IF EXISTS ScoresByGrid
GO
CREATE PROCEDURE ScoresByGrid @grid INT
AS
	SELECT TOP 100 username, score
	FROM Score
	WHERE gridID = @grid
GO