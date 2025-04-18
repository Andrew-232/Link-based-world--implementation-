class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title); 
        this.engine.addChoice("Begin the story");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation); 
    }
}

class Location extends Scene {
    create(key) {
        let locationData = this.engine.storyData.Locations[key]; 
        this.locationKey = key;
        this.engine.show(locationData.Body); 

        if (locationData.Mechanism === "moveClothes") {
            this.engine.addChoice("Move your clothes", { special: "moveClothes" });
        }
        
        if (locationData.Choices) {
            for (let choice of locationData.Choices) {
                if (choice.Requires && !this.engine.inventory.has(choice.Requires)) {
                    continue;
                }
                this.engine.addChoice(choice.Text, choice);
            }
        } 
        else {
            this.engine.addChoice("Die.", null);
        }
    }

    handleChoice(choice) {
        if (!choice) {
            this.engine.gotoScene(End);
            return;
        }

        if (choice.special === "moveClothes") {
            this.engine.gotoScene(Location, "foundKeys");
            return;
        }

        this.engine.show("&gt; " + choice.Text);

        if (choice.Gives) {
            this.engine.inventory.add(choice.Gives);
            this.engine.show(`You obtained: ${choice.Gives}`);
        }

        this.engine.gotoScene(Location, choice.Target);
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');