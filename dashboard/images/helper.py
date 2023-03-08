import os, json

starting_path = "./ssbult/Renders/"


result = {}

for root, dirnames, filenames in os.walk(starting_path):
    character = root.split('/')[-1]
    result[character] = ["Default"]
    for costume in os.listdir(root):
        costume = costume.split(".png")[0]
        if costume != "Default":
            result[character].append(costume)

info = json.dumps(result, indent=4)
print(info)