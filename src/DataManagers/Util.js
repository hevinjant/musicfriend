import { getUserInfo, getUserTracks } from "./FirebaseManager";

/*
Find all tracks that match between two users.
 */
export async function getMatchesTracks(userId, otherUserId) {
  let result = [];
  let percentage = 0.0;
  const userTracks = await getUserTracks(userId);
  const otherUserTracks = await getUserTracks(otherUserId);
  const otherUserInfo = await getUserInfo(otherUserId);
  // find the matches
  for (let track1 of userTracks) {
    for (let track2 of otherUserTracks) {
      if (track1.trackId === track2.trackId) {
        result.push(track1);
      }
    }
  }
  percentage = (result.length / userTracks.length) * 100;
  return {
    matches: result,
    percentage: percentage,
    otherUserInfo: otherUserInfo,
  };
}
