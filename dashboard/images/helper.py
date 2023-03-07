import os

starting_path = "./ssbm/Renders/"


result = {}

for character in os.listdir(starting_path):
    result[character] = ["Default"]
    for costume in os.listdir(starting_path+character):
        costume = costume.split(".png")[0]
        if costume != "Default":
            result[character].append(costume)


print(result)