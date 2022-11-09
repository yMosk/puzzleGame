import { supabase } from "./supabaseClient";

export async function fetchUserLevels(id) {
  const { data, error } = await supabase
    .from("Players")
    .select("id,userId,currentLevel")
    .eq("userId", id);

  return { data, error };
}

export async function insertNewUser(id) {
  const { data, error } = await supabase
    .from("Players")
    .insert([{ userId: id, currentLevel: 1 }]);

  return { data, error };
}

export async function insertNewGame(gameId, playerId, gameLevel, time) {
  const { data, error } = await supabase
    .from("Games")
    .insert([{ id: gameId, playerId: playerId, level: gameLevel, time: time }]);

  return { data, error };
}

export async function updatePlayerCurrentLevel(playerId, gameLevel) {
  const { data, error } = await supabase
    .from("Players")
    .update({ currentLevel: gameLevel })
    .eq("id", playerId);

  return { data, error };
}

export async function getAllPlayerGamesByLevel(playerId, level) {
  const { data, error } = await supabase
    .from("Games")
    .select("id,playerId,level,time,created_at")
    .match({ playerId: playerId, level: level });

  return { data, error };
}
