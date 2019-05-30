GAME OF WAR SERVER


Purpose: This Node JS server acts as the controller for the game of war app and it's respective database on Heroku.com. All fetch requests go through here.


Security: As the app does not hold any valuable information and is designed for single player use in mind, there is no security for who can access what files. If the

game is updated for multiple people, then security will be added in the future.


Endpoints:



	FILES: Endpoints in regards to overall player stats

	GET "/files"

		Returns all player files

		required parameters: none

	GET "/files/:user"

		Returns file of specified user

		required parameters: player username in subsitute for ":user" in url

	POST "/files/"

		Creates a new player file and respective game file for player

		required parameters: username of new player (as "username" in body)

	