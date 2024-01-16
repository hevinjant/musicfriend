import { getUserInfo, getUserTracks, getUserGenres } from "./FirebaseManager";

/*
Find all tracks that match between two users.
 */
export async function getMatchesTracks(userId, otherUserId) {
  let similarTracks = [];
  let percentage = 0.0;

  const [userTracks, otherUserTracks, otherUserInfo] = await Promise.all([
    getUserTracks(userId),
    getUserTracks(otherUserId),
    getUserInfo(otherUserId),
  ]);

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

export async function getMatchesGenres(userId, otherUserId) {
  let similarGenres = [];
  let percentage = 0.0;

  const [userGenres, otherUserGenres, otherUserInfo] = await Promise.all([
    getUserGenres(userId),
    getUserGenres(otherUserId),
    getUserInfo(otherUserId),
  ]);

  // find the matches
  for (let genre1 of userGenres) {
    for (let genre2 of otherUserGenres) {
      if (genre1 === genre2) {
        similarGenres.push(genre1);
      }
    }
  }
  percentage = ((similarGenres.length / userGenres.length) * 100).toFixed(1);
  return {
    matches: similarGenres,
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
      otherUser.long
      // && currentUser.email !== otherUser.email
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
