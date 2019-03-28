# nodecg-smashcontrol
----

nodecg-smashcontrol is a bundle for NodeCG that will help Smash Bros. tournament streamers efficiently change player names, character icons and place in braceket.

#### Proposed Features
* Change Player names, character icons and score to output to the stream via html/css.
* Different modes for each Smash game, each with their own package of character icons.
* Use of smash.gg and Challonge's APIs to load and display sets.

#### Timeline/Order of Feature Rollout

  ##### NodeCG
  * Make panels for players/scores, buttons to increment score + update on stream
  * Radio buttons for game selection, possible using event name to auto select for character icons.
  * Allow custom image packages (default is Smash games, can be expanded to Rivals, other FGC games if requested).
  * Access API's depending on source (likely one panel for each source, overwrite if re-entered).

  ##### API Usage
  * Manually enter players/scores, output to JSON or an API to be accessed by frontend.
  * Use smash.gg's API to get tournaments -> events -> output sets in events, also get place in bracket (Pool number, winner's bracket, loser's eighths, etc).
  * Use Challonge's API (if necessary) for wider access.
  * Allow all values to be manually updated if the streamer wants a different value than is automatically generated.



#### Credits
This program is currently being written by [swc19](https://github.com/swc19) and is inspired by both [Scoreboard Assistant](https://obsproject.com/forum/resources/scoreboard-assistant.112/) and [nodecg-speedcontrol](https://github.com/speedcontrol/nodecg-speedcontrol).

