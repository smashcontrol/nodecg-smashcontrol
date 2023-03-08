import os, json

starting_path = "T:/nodecg-smashcontrol/bundles/nodecg-smashcontrol/dashboard/images/roa/Renders/"


result = {}

for character in os.listdir(starting_path):
    result[character] = ["Default"]
    for costume in os.listdir(starting_path+character):
        orig_name = costume
        costume = costume.split(".png")[0]
        if costume != "Default":
            result[character].append(costume)

info = json.dumps(result, indent=4)
print(info)