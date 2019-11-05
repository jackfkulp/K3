const { Game } = require("../classes");
const pool = require("../database");
const md5 = require("md5");
import { ACCESS_TAG } from "../pages/errorTypes";

const passwordUpdate = async (req, res) => {
	if (!req.session.ir3 || !req.session.ir3.courseDirector) {
		res.status(403).redirect(`/index.html?error=${ACCESS_TAG}`);
		return;
	}

	//TODO: delete all sockets assosiated with the game that was deleted?
	//send socket redirect? (if they were still on the game...prevent bad sessions from existing (extra protection from forgetting validation checks))

	const { team1Password,team2Password } = req.body;
	const { gameId } = req.session.ir3;
	if (!gameId) {
		res.status(400).redirect("/courseDirector.html?passwordUpdate=failed"); //TODO: could have better errors here saying 'gameid missing', or 'game did not exist'
		return;
	}

	const thisGame = await new Game({ gameId }).init();
	if (!thisGame) {
		res.status(400).redirect("/courseDirector.html?passwordUpdate=failed");
		return;
	}	

	if(!team1Password && !team2Password){
		res.status(400).redirect("/courseDirector.html?passwordUpdate=failed");
		return;
	}
	else if( !team1Password && team2Password){			
		const queryString = "UPDATE games SET game1Password = ? WHERE gameId = ?";
		const team2PasswordHashed = md5(team2Password);
		const inserts = [team2PasswordHashed, gameId];		
		await pool.query(queryString, inserts);
	}
	else if( team1Password && !team2Password){
		const queryString = "UPDATE games SET game0Password = ? WHERE gameId = ?";
		const team1PasswordHashed = md5(team1Password);
		const inserts = [team1PasswordHashed,gameId];
		await pool.query(queryString, inserts);
	}
	else{
		const queryString = "UPDATE games SET game0Password = ?, game1Password = ? WHERE gameId = ?";
		const team1PasswordHashed = md5(team1Password);
		const team2PasswordHashed = md5(team2Password);
		const inserts = [team1PasswordHashed,team2PasswordHashed, gameId];
		await pool.query(queryString, inserts);
	}

	res.redirect("/courseDirector.html?passwordUpdate=success");
};

module.exports = passwordUpdate;
