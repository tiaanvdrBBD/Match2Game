USE Match2Game
GO

INSERT INTO Grid
	(gridName, rows, cols)
VALUES
	('Beginner', 4, 4),
	('Intermediate', 6, 6),
	('Advanced', 8, 8)
GO

INSERT INTO Score
	(username, score, gridID)
VALUES
	-- Beginner
	('marco', 2, 1),
	('luan', 30, 1),

	-- Intermediate
	('tiaan', 45, 2),
	('carmen', 21, 2),
	
	-- Advanced
	('TheLgnd27', 999, 3)
GO