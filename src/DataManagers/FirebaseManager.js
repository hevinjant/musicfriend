/* Check if user exists in database, 
if not then insert new user information to database */
function insertUserToDatabase(userInfo) {}

/* 
Insert user tracks information to database.
Always insert tracks for log in user (including existing users),
to always have their tracks up to date. 
*/
function insertTracksForUser(userEmail) {}

/* Get all tracks from user */
function getUserTracks(userEmail) {}

/* Database Scheme for user

Users:
    user-email:
        user-display-name
        user-picture-url
        tracks
            trackArtists
            trackArtistsId
            trackId
            trackImageUrl
            trackLink
            trackName
            trackPreviewUrl
            trackGenres
        user-match-history
            other-user-email
                match-percentage
                common-genres

*/
