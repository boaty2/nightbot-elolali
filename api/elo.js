export default async function handler(req, res) {
  const API_KEY = process.env.RIOT_KEY;

  const GAME_NAME = "lalitamugiwara";
  const TAG_LINE = "lali";

  try {
    // Obtener PUUID
    const accountReq = await fetch(
      `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${GAME_NAME}/${TAG_LINE}`,
      {
        headers: {
          "X-Riot-Token": API_KEY
        }
      }
    );

    const account = await accountReq.json();

    // Obtener summoner
    const summonerReq = await fetch(
      `https://la2.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${account.puuid}`,
      {
        headers: {
          "X-Riot-Token": API_KEY
        }
      }
    );

    const summoner = await summonerReq.json();

    // Obtener ranked
    const rankedReq = await fetch(
      `https://la2.api.riotgames.com/lol/league/v4/entries/by-summoner/${summoner.id}`,
      {
        headers: {
          "X-Riot-Token": API_KEY
        }
      }
    );

    const ranked = await rankedReq.json();

    const solo = ranked.find(
      q => q.queueType === "RANKED_SOLO_5x5"
    );

    if (!solo) {
      return res.status(200).send("No tiene rango en SoloQ.");
    }

    const wr =
      ((solo.wins / (solo.wins + solo.losses)) * 100)
      .toFixed(1);

    return res.status(200).send(
      `🏆 ${solo.tier} ${solo.rank} ${solo.leaguePoints} LP | 📈 ${wr}% WR`
    );

  } catch (err) {
    return res.status(200).send("Error obteniendo elo.");
  }
}
