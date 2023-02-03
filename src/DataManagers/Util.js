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

export function getDistanceFromLatLong(lat1, long1, lat2, long2) {
  const _long1 = (long1 * Math.PI) / 180;
  const _long2 = (long2 * Math.PI) / 180;
  const _lat1 = (lat1 * Math.PI) / 180;
  const _lat2 = (lat2 * Math.PI) / 180;

  const dLon = _long2 - _long1;
  const dLat = _lat2 - _lat1;
  const a =
    Math.pow(Math.sin(dLat / 2), 2) +
    Math.cos(_lat1) * Math.cos(_lat2) * Math.pow(Math.sin(dLon / 2), 2);

  const c = 2 * Math.asin(Math.sqrt(a));

  const r = 3956; // miles (use 6371 for kilometer)

  return c * r;
}

export function getAllUsersWithinMiles(currentUser, users, miles) {
  const nearbyUsers = users.filter((otherUser) => {
    if (
      currentUser.lat &&
      currentUser.long &&
      otherUser.lat &&
      otherUser.long &&
      currentUser.email !== otherUser.email
    ) {
      return (
        getDistanceFromLatLong(
          currentUser.lat,
          currentUser.long,
          otherUser.lat,
          otherUser.long
        ) < miles
      );
    }
    return false;
  });
  return nearbyUsers;
}
