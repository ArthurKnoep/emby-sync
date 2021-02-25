# Emby Sync

Emby Sync is a web application that allows you to play synchronously content from your Emby server.

> :warning: Emby Sync is currently a work in progress project and is therefore not entirely functional at the moment

## Summary

- [Screenshots](#screenshots)
- [Features](#features)
- [Technologies](#technologies)

## Screenshots

Coming soon

## Features

Here are the features currently implemented, or the one I plan to add:
- [x] Login using its Emby Connect account
- [ ] Login using a local Emby account
- [x] Create a room, and optionally protect it with a password
- [x] Join a room
- [x] Implement a room chat
- [ ] Create an easy to share invitation code to join a room
- [x] Select a server to connect to (only if using an Emby Connect account)
- [x] Select default language for audio and subtitles
- [x] Select, or auto detect, default video quality
- [x] Show Emby homepage, with your media in progress, the last one added, ...
- [ ] Search for contents
- [ ] List contents of a library
- [ ] Show information about a movie or an episode
- [x] Play synchronously an item with all the member of the same room
- [ ] Synchronise play/pause/seek event
- [ ] More granular permission within a room

## Technologies

Both the server and the webapp are written using TypeScript. 
The backend use express and socket.io, currently the backend doesn't use any database system. All the rooms and the users 
information are stored inside the RAM, this is probably something that will change in the future. 
The fontend use react, hls.js to play movies, socket.io, axios and ant design. 
