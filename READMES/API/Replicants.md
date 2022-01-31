# SmashControl Replicants


*If you're unfamiliar with a Replicant, [NodeCG's documentation for them is here.](https://nodecg.com/NodeCG.html#Replicant)*  


## playerDataArray

### Data  
* `player1tag` *[`string`]* - The left (Player 1)'s tag.
* `player2tag` *[`string`]* - The right (Player 2)'s tag.
* `bracketlocation` *[`string`]* - The current set in bracket (Grand Final, Winner's Final, etc)
* `player1character` *[`string`]* - The character Player 1 is using.
* `player2character` *[`string`]* - The character Player 2 is using.
* `game` *[`string`]* - The game in which to load assets for. 
    * Possible values are `ssb64, ssbm, ssbb, ssbpm, ssb4, ssbult`.



### Example data (defaultSetObject)
```
{
    player1tag: '',
    player2tag: '',
    bracketlocation: '',
    player1character: 'Mario',
    player2character: 'Mario',
    commentator1: '',
    commentator2: '',
    game: 'ssb64',
}
```

## streamQueueRepl

### Data
* `Array` *[`Array`[* *[`streamName, player1tag, player2tag, bracketlocation`]]* - Contains the following information in each entry of the Array:  
    * `streamName` *[`string`]* - The name of the stream a given set will be on.
    * `player1tag` *[`string`]* - Player 1's tag from smash.gg. Will return "TBD" if there is no player in the set yet.
    * `player2tag` *[`string`]* - Player 2's tag from smash.gg. Will return "TBD" if there is no player in the set yet.
    * `bracketlocation` *[`string`]* - The location of the bracket, given by smash.gg
    
### Example Data
```
[
    ['RITSmashClub', 'ChefKef', 'Nightmare', 'Winner's Quarter-Final'],
    ['RITSmashClub', 'JBoss', 'Bricky', 'Winner's Round 3'],
    ['swc19', 'TBD', 'TBD', 'Winner's Final']
]    
```

## Other Replicants
* `apiRepl` *[`string`]* - A user's API key to use with smash.gg integration.
* `tourneyRepl` *[`Object`]* - A JSON response containing all of a tournament's information.
* `eventListRepl` *[`Array[String]`]* - A list of all the events in a given tournament.
* `gameSelection` *[`string`]* - The game to load assets for (refer to [playerDataArray](#playerDataArray)).
* `player1Score` *[`Integer`]* - Player 1's score in a set.
* `player2Score` *[`Integer`]* - Player 2's score in a set.


