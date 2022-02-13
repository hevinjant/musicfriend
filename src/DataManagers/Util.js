import { getUserTracks } from "./FirebaseManager";

/*
Find all tracks that match between two users.
 */
export async function getMatchesTracks(userEmail, otherUserEmail) {
  let result = [];
  let percentage = 0.0;
  const userTracks = await getUserTracks(userEmail);
  const otherUserTracks = await getUserTracks(otherUserEmail);
  // find the matches
  for (let track1 of userTracks) {
    for (let track2 of otherUserTracks) {
      if (track1.trackId === track2.trackId) {
        result.push(track1);
      }
    }
  }
  percentage = (result.length / userTracks.length) * 100;
  return { matches: result, percentage: percentage };
}
