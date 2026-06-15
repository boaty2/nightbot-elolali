export default async function handler(req, res) {
  const API_KEY = process.env.RIOT_KEY;

  return res.status(200).send(API_KEY || "NO_API_KEY");
}

  const GAME_NAME = "lalitamugiwara";
  const TAG_LINE = "lali";

  try {
    const accountReq = await fetch(
      `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${GAME_NAME}/${TAG_LINE}`,
      {
        headers: {
          "X-Riot-Token": API_KEY
        }
      }
    );

    const account = await accountReq.json();

    if (!account.puuid) {
      return res.status(200).json({
        paso: "account",
        respuesta: account
      });
    }

    const summonerReq = await fetch(
      `https://la2.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${account.puuid}`,
      {
        headers: {
          "X-Riot-Token": API_KEY
        }
      }
    );

    const summoner = await summonerReq.json();

    if (!summoner.id) {
      return res.status(200).json({
        paso: "summoner",
        respuesta: summoner
      });
    }

    const rankedReq = await fetch(
      `https://la2.api.riotgames.com/lol/league/v4/entries/by-summoner/${summoner.id}`,
      {
        headers: {
          "X-Riot-Token": API_KEY
        }
      }
    );

    const ranked = await rankedReq.json();

    return res.status(200).json({
      paso: "ranked",
      respuesta: ranked
    });

  } catch (err) {
    return res.status(200).json({
      error: err.message
    });
  }
}
