import { getUserInfo, getUserTracks } from "./FirebaseManager";

/*
Find all tracks that match between two users.
 */
export async function getMatchesTracks(userId, otherUserId) {
  let similarTracks = [];
  let percentage = 0.0;
  const userTracks = await getUserTracks(userId);
  const otherUserTracks = await getUserTracks(otherUserId);
  const otherUserInfo = await getUserInfo(otherUserId);
  // find the matches
  for (let track1 of userTracks) {
    for (let track2 of otherUserTracks) {
      if (track1.trackId === track2.trackId) {
        similarTracks.push(track1);
      }
    }
  }
  percentage = ((similarTracks.length / userTracks.length) * 100).toFixed(1);
  return {
    matches: similarTracks,
    percentage: percentage,
    otherUserInfo: otherUserInfo,
  };
}
