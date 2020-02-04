nodecg-smashcontrol v0.9.0
----

*This is a bundle for [NodeCG](http://nodecg.com/). It is required for use of this application.*


nodecg-smashcontrol, or SmashControl, is a NodeCG bundle/application that is designed for use by Smash
tournament streamers to make switching between sets easier, and to avoid the hassle of OBS text, positioning, etc.
 
  
This bundle does *not* come with any graphics, but a simple example of its usage can be found at [smashcontrol-simpletext](https://github.com/smashcontrol/smashcontrol-simpletext).

## Installation

To get started with SmashControl, you must have [Node.js](https://nodejs.org/) and [git](https://git-scm.com/) installed,
then look through the [NodeCG Documentation](http://nodecg.com/) to install that.

After these are installed, run the following in the directory in which you want to install the program:
```
npm install bower -g
npm install nodecg-cli -g
nodecg setup
npm install smashgg.js
nodecg install smashcontrol/nodecg-smashcontrol
nodecg start
```

After this, open `https://localhost:9090` (unless otherwise specified in config) in a browser.

Further documentation will be released as more features become developed.

Future features include:
* Better UI/Documentation

#### Used By
[RIT Smash Club](https://twitter.com/RITSmashClub)

#### Credits
This program is currently being written by [swc19](https://github.com/swc19) and is inspired by both [Scoreboard Assistant](https://obsproject.com/forum/resources/scoreboard-assistant.112/) and [nodecg-speedcontrol](https://github.com/speedcontrol/nodecg-speedcontrol).    

This program utilizes [smashgg.js](https://github.com/BrandonCookeDev/smashgg.js), developed by BrandonCookeDev.

#### Contribution/Issues
The `master` branch will always contain the most recent, stable version. Other branches may contain unstable or unfinished
features, so use at your own risk. If there are any issues with the program, feel free to raise an Issue/Pull Request on GitHub. 
