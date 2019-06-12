# GAME OF WAR SERVER


## Purpose: 

This Node JS server acts as the controller for the game of war app and it's respective database on Heroku.com. All fetch requests go through here.


## Security: 

As the app does not hold any valuable information and is designed for single player use in mind, there is no security for who can access what files. If the

game is updated for multiple people, then security will be added in the future.


## Endpoints:



### FILES: Endpoints in regards to overall player stats

	GET "/files"

		Returns all player files

		required parameters: none

	GET "/files/:user"

		Returns file of specified user

		required parameters: player username in subsitute for ":user" in url

	POST "/files/"

		Creates a new player file and respective game file for player

		required parameters: username of new player (as "username" in body)

	PUT "/files/:user"

		Updates stats of specified user
	
		required parameters: username of player (as "username" in body), if they had won the finished game(boolean as "didWin" in body).

		NOTE: although the username is also in the url as well as the body sent in, as there is other data being sent in through body the username is also 
			accessed that way for consistency.

	

	DELETE "/files/:name"

		Deletes specified user and game
		
		required parameters: player username in substitute for ":user" in url



### GAMES: Endpoints in regards to current games saved in the database


	GET "/games/:user"
		
		Gets the current stats of the specified player's ongoing game

		required parameters: player username in substitute for ":user" in url

	GET "/games"

		Gets all current games from database

		required parameters: none

	PUT "/games/:user"

		Updates current game of specified player
	
		required parameters: Username (in the body, not the url, same reason as othe PUT), round completed (int), playerHand (array of five ints), npcHand (array of five ints), deck (array of ints) 