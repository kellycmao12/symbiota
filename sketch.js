// arrays to hold our objects
let bifido_arr = [];
let lacto_arr = [];
let clost_arr = [];
let food_arr = [];
let bullet_arr = [];
let coin_arr = [];

// keeping score
let bifido_goal = 10;
let lacto_goal = 10;
let clost_goal = 2;
let coins = 10;
let health = 0;
let fullHealth = 100 * 20; 

// countdown for spawning bad bacteria
let spawn_time = 800;
let new_clost_countdown = spawn_time;

// state variables
let tutorial_count = 0;
let valid_can_afford = true;
let valid_item_available = true;
let game_won = false;
let game_lost = false;
let paused = false;
let bifido_clicked;
let lacto_clicked;
let clost_clicked;
let muted = false;

// images
let tutorial = [];
let bg;
let overlay;
let bifido;
let lacto;
let clost;
let bifido_bio;
let lacto_bio;
let clost_bio;
let coin;
let wheat_bread;
let apple;
let lettuce;
let kimchi;
let steak;
let tofu;
let milk;
let yogurt;
let muted_img;
let unmuted_img;

// audio
let music;
let chew_sound;

function preload() {
    bg = loadImage('images/background.png');
    overlay = loadImage('images/overlay.png');
    bifido = loadImage('images/bifido.png');
    lacto = loadImage('images/lacto.png');
    clost = loadImage('images/clost.png');
    wheat_bread = loadImage('images/wheat_bread.png');
    apple = loadImage('images/apple.png');
    lettuce = loadImage('images/lettuce.png');
    kimchi = loadImage('images/kimchi.png');
    steak = loadImage('images/steak.png');
    tofu = loadImage('images/tofu.png');
    milk = loadImage('images/milk.png');
    yogurt = loadImage('images/yogurt.png');
    bifido_bio = loadImage('images/bifido_bio.png');
    lacto_bio = loadImage('images/lacto_bio.png');
    clost_bio = loadImage('images/clost_bio.png');
    coin = loadImage('images/coin.png');
    muted_img = loadImage('images/muted.png');
    unmuted_img = loadImage('images/unmuted.png');

    tutorial[0] = loadImage('images/tutorial/landing page.png');
    tutorial[1] = loadImage('images/tutorial/bifido.png');
    tutorial[2] = loadImage('images/tutorial/lacto.png');
    tutorial[3] = loadImage('images/tutorial/clost.png');
    tutorial[4] = loadImage('images/tutorial/buttons.png');
    tutorial[5] = loadImage('images/tutorial/health bar.png');
    tutorial[6] = loadImage('images/tutorial/goals.png');
    tutorial[7] = loadImage('images/tutorial/lose.png');
    tutorial[8] = loadImage('images/tutorial/coins.png');
    tutorial[9] = loadImage('images/tutorial/buy food.png');
    tutorial[10] = loadImage('images/tutorial/next wave.png');
    tutorial[11] = loadImage('images/tutorial/dysbiosis.png');
    tutorial[12] = loadImage('images/tutorial/bullets.png');
    tutorial[13] = loadImage('images/tutorial/other.png');
    
    music = loadSound('audio/flying_jellyfish.mp3');
    chew_sound = loadSound('audio/chewing.wav');
}

function setup() {
    // create a canvas and grab a reference to it
    let cnv = createCanvas(1600, 900);

    // reparent the canvas to the 'canvas_container' div
    cnv.parent('#canvas_container');
    
    // remove perlin noise bias (towards negative)
    noiseDetail(24);

    // fill bacteria arrays: 2 bifido, 1 lacto, 3 clost
    for (let i = 0; i < 2; i++) {
        randX = width/2 * random(0.8, 1.2);
        randY = height/2 * random(0.6, 1.4);
        addBifido(1, randX, randY);
    }
    for (let i = 0; i < 1; i++) {
        randX = width/2 * random(0.8, 1.2);
        randY = height/2 * random(0.6, 1.4);
        addLacto(1, randX, randY);
    }
    for (let i = 0; i < 3; i++) {
        randX = width/2 * random(0.8, 1.2);
        randY = height/2 * random(0.6, 1.4);
        addClost(1, randX, randY);
    }

    // food panel
    food_arr.push(new Food(413, 187, 'wheat bread', 5));
    food_arr.push(new Food(330, 355, 'apple', 5));
    food_arr.push(new Food(330, 533, 'lettuce', 5));
    food_arr.push(new Food(413, 712, 'kimchi', 10));
    food_arr.push(new Food(1185, 190, 'steak', 5));
    food_arr.push(new Food(1270, 352, 'tofu', 5));
    food_arr.push(new Food(1265, 537, 'milk', 5));
    food_arr.push(new Food(1187, 715, 'yogurt', 10));

    // play music
    music.setVolume(0.5);
    music.loop();
}

function draw() {
    if (tutorial_count <= 13) { // play tutorial
        imageMode(CORNER);
        image(tutorial[tutorial_count], 0, 0, width, height);
    } else {    // play actual game
        imageMode(CORNER);
        image(bg, 0, 0, width, height);

        textSize(20);
        textStyle(BOLD);
        textFont('Chivo');
        textAlign(LEFT);
        
        // display all bacteria, remove if they're out of play
        health = 0; // recalculate health each frame
        for (let i = 0; i < bifido_arr.length; i++) {
            if (bifido_arr[i].outOfPlay) {
                bifido_arr.splice(i, 1);
            } else {
                bifido_arr[i].moveAndDisplay();
                health += bifido_arr[i].health;
            }
        }
        for (let i = 0; i < lacto_arr.length; i++) {
            if (lacto_arr[i].outOfPlay) {
                lacto_arr.splice(i, 1);
            } else {
                lacto_arr[i].moveAndDisplay();
                health += lacto_arr[i].health;
            }
        }
        for (let i = 0; i < clost_arr.length; i++) {
            if (clost_arr[i].outOfPlay) {
                clost_arr.splice(i, 1);
            } else {
                clost_arr[i].moveAndDisplay();
            }
        }

        // display bullets and coins, remove if they're out of play
        for (let i = 0; i < bullet_arr.length; i++) {
            if (bullet_arr[i].outOfPlay) {
                bullet_arr.splice(i, 1);
            } else {
                bullet_arr[i].moveAndDisplay();
            }
        }
        for (let i = 0; i < coin_arr.length; i++) {
            if (!coin_arr[i].collected) {
                coin_arr[i].display();
            }
            if (coin_arr[i].timeOnScreen > 800) {
                coin_arr.splice(i, 1);
            }
        }

        if (!game_won && !game_lost && !paused) {
            // add new clost periodically
            if (new_clost_countdown <= 0) {
                goodBacteria = bifido_arr.length + lacto_arr.length;
                // number of clost added should be proportional to number of good bacteria
                if (goodBacteria < 8) {
                    addClost(1 + round(random(goodBacteria/3)), 0, 0);
                } else {
                    addClost(round(random(goodBacteria * 3/4)), 0, 0);
                }
                new_clost_countdown = spawn_time;
            } else {
                new_clost_countdown--;
            }

            // check if we should display winning message
            if (bifido_arr.length >= bifido_goal && lacto_arr.length >= lacto_goal 
                && clost_arr.length <= clost_goal) {
                    game_won = true;
            }

            // check if we should display losing message
            if (bifido_arr.length == 0 && lacto_arr.length == 0) {
                game_lost = true;
            }
        }
        
        // display overlay
        imageMode(CORNER);
        image(overlay, 0, 0, width, height);

        // want food to appear on top of overlay
        for (let i = 0; i < food_arr.length; i++) {
            food_arr[i].display();
        }
        
        rectMode(CENTER);
        // buttons/headings for each bacteria
        fill(255, 180, 210);
        rect(width/2 - 300, 45, 220, 70, 10);

        fill(205, 210, 255);
        rect(width/2, 45, 220, 70, 10);

        fill(165, 255, 165);
        rect(width/2 + 300, 45, 220, 70, 10);
        
        fill(0);
        textAlign(LEFT);
        
        text('BIFIDO', 460, 40);
        text('GOAL: ' + bifido_goal, 400, 65);
        text('| COUNT: ' + bifido_arr.length, 495, 65);

        text('LACTO', 770, 40);
        text('GOAL: ' + lacto_goal, 705, 65);
        text('| COUNT: ' + lacto_arr.length, 800, 65);

        text('CLOST', 1060, 40);
        text('GOAL: ' + clost_goal, 1010, 65);
        text('| COUNT: ' + clost_arr.length, 1090, 65);

        // display muted icon
        if (muted) {
            image(muted_img, 120, 35, 30, 30);
            music.setVolume(0);
        } else {
            image(unmuted_img, 120, 35, 30, 30);
            music.setVolume(0.5);
        }

        // display how much money you have
        text('COINS: ' + coins, 200, 40);

        // display time until next wave of clost as a progress bar
        text('NEXT WAVE', 1335, 40);
        if (new_clost_countdown > spawn_time * 0.4) {
            fill(0, 255, 0);
        } else if (new_clost_countdown > spawn_time * 0.2) {
            fill(255, 255, 0);
        } else {
            fill(255, 0, 0);
        }
        // colored inner bar is a little smaller and has no curved corners
        rectMode(CORNER);
        rect(1340, 56, map(new_clost_countdown, 0, spawn_time, 0, 100), 18);
        // outer border
        fill(255, 0);
        stroke(0);
        strokeWeight(3);
        rect(1338, 55, 105, 20, 10);
        noStroke();

        // display message if they won or lost
        textAlign(CENTER);
        if (game_won) {
            fill(255);
            textSize(40);
            text('YOU WIN!', width/2, height/2);
            health = fullHealth;
        } else if (game_lost) {
            fill(255);
            textSize(40);
            text('YOU LOSE :(', width/2, height/2);
        }
        textAlign(LEFT);
        textSize(20);

        // messages at the bottom: game paused, can't afford item, item not available
        if (!game_won && !game_lost) {
            if (paused) {
                fill(0);
                text('PAUSED', 750, 810);
            } else if (!valid_can_afford) {
                fill(0);
                text('NOT ENOUGH COINS', 700, 810); 
            } else if (!valid_item_available) {
                fill(0);
                text('ITEM NOT AVAILABLE', 700, 810); 
            }
        }

        // display health bar
        fill(0);
        text('HEALTH', 550, 860);
        if (health > fullHealth * 0.4) {
            fill(0, 255, 0);
        } else if (health > fullHealth * 0.2) {
            fill(255, 255, 0);
        } else {
            fill(255, 0, 0);
        }
        // colored inner bar is a little smaller and has no curved corners
        rect(652, 843, map(health, 0, fullHealth, 0, 400), 18);
        // outer border
        fill(255, 0);
        stroke(0);
        strokeWeight(3);
        rectMode(CORNER);
        rect(650, 842, 400, 20, 10);
        noStroke();
    }
    // check if we should display the bios
    imageMode(CENTER);
    if (bifido_clicked) {
        image(bifido_bio, width/2, height/2, 645, 645);
    } else if (lacto_clicked) {
        image(lacto_bio, width/2, height/2, 645, 645);
    } else if (clost_clicked) {
        image(clost_bio, width/2, height/2, 645, 645);
    }
}

function mousePressed() {
    // is mouse over one of the bacteria headings?
    if (mouseY > 10 && mouseY < 70 && (tutorial_count == 4 || tutorial_count > 13)) {
        imageMode(CENTER);
        if (mouseX > width/2 - 410 && mouseX < width/2 - 410 + 220) {
            bifido_clicked = true;
            lacto_clicked = false;
            clost_clicked = false;
            paused = true;
        } else if (mouseX > width/2 - 110 && mouseX < width/2 - 110 + 220) {
            bifido_clicked = false;
            lacto_clicked = true;
            clost_clicked = false;
            paused = true;
        } else if (mouseX > width/2 + 190 && mouseX < width/2 + 190 + 220) {
            bifido_clicked = false;
            lacto_clicked = false;
            clost_clicked = true;
            paused = true;
        } else {
            bifido_clicked = false;
            lacto_clicked = false;
            clost_clicked = false;
            paused = false;
        }
    } else {
        bifido_clicked = false;
        lacto_clicked = false;
        clost_clicked = false;
        paused = false;
    }

    // is mouse over the mute button?
    let distMute = dist(120, 35, mouseX, mouseY);
    if (distMute < 15) {
        muted = !muted;
    }

    if (!game_won && !game_lost && !paused && tutorial_count > 13) {
        // have all foods check if they were dragged
        for (let i = 0; i < food_arr.length; i++) {
            food_arr[i].mouseCheckDrag();
        }
    }
}

function mouseDragged() {
    // if a food is currently being dragged, update its position
    if (!game_won && !game_lost && !paused && tutorial_count > 13) {
        for (let i = 0; i < food_arr.length; i++) {
            food_arr[i].mouseDragged();
        }
    }
}

function mouseReleased() {
    // have all foods check if they were released
    if (!game_won && !game_lost && !paused && tutorial_count > 13) {
        for (let i = 0; i < food_arr.length; i++) {
            food_arr[i].mouseReleased();
        }
    }
}

function keyPressed() {
    if (keyCode === 13 && tutorial_count <= 13) {    // enter
        tutorial_count++;
    } else if (keyCode === 66 && tutorial_count >= 1 && tutorial_count <= 13) {
        tutorial_count--;
    } else if (keyCode === 32 && tutorial_count > 13) {   // space bar
        paused = !paused;
        return false;   // disable default space bar scroll
    } else if (keyCode === 77) {   // M key
        muted = !muted;
    } 
  }

function addBifido(num, x, y) {
    for (let i = 0; i < num; i++) {
        if (bifido_arr.length < bifido_goal) {
            bifido_arr.push(new Bacteria(x, y, 'bifido'));
        }
    }
}

function addLacto(num, x, y) {
    for (let i = 0; i < num; i++) {
        if (lacto_arr.length < lacto_goal) {
            lacto_arr.push(new Bacteria(x, y, 'lacto'));
        }
    }
}

function addClost(num, x, y) {
    for (let i = 0; i < num; i++) {
        let temp_x, temp_y;
        if (x && y) {   // if x and y are set
            temp_x = x;
            temp_y = y;
        } else {
            temp_x = width/2 * random(0.8, 1.2);
            temp_y = height/2 * random(0.6, 1.4);
        }
        clost_arr.push(new Bacteria(temp_x, temp_y, 'clost'));
        console.log(temp_x);
        console.log(temp_y);
        console.log("created clost");
    }
}

function decreaseBifido(num) {
    for (let i = 0; i < num; i++) {
        bifido_arr.pop();
    }
}

function decreaseLacto(num) {
    for (let i = 0; i < num; i++) {
        lacto_arr.pop();
    }
}

function decreaseClost(num) {
    for (let i = 0; i < num; i++) {
        clost_arr.pop();
    }
}

class Bacteria {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.size = 150;
        this.type = type;
        this.angle = random(360);
        this.health = 100;
        this.outOfPlay = false;
        this.attackCountdown = random(100);
        this.coinCountdown = random(400);

        // from type, determine actual width and height
        if (this.type == 'bifido') {
            this.w = this.size * 0.4;
            this.h = this.size * 0.6;
        } else if (this.type == 'lacto') {
            this.w = this.size * 0.2;
            this.h = this.size * 0.6;
        } else if (this.type == 'clost') {
            this.w = this.size * 0.2;
            this.h = this.size * 0.6;
        }

        // pick a random spot on the noise curve to pull values from
        this.noiseLocationX = random(0, 1000);
        this.noiseLocationY = random(0, 1000);
    }

    moveAndDisplay() {
        if (!paused) {

            // grab perlin y value at our noise location
            let numX = noise(this.noiseLocationX);
            let numY = noise(this.noiseLocationY);

            // after i pull a number move onto the next number on the graph
            this.noiseLocationX += 0.01;
            this.noiseLocationY += 0.01;

            // turn the noise float into our speed
            let xSpeed = map(numX, 0, 1, -2, 2);
            let ySpeed = map(numY, 0, 1, -2, 2);

            // update position
            this.x += xSpeed;
            this.y += ySpeed;
            this.angle++;

            // move into circle if it has hit the boundary of circle
            let distCenter = dist(this.x, this.y, width/2, height/2);
            if (distCenter >= 320) {
                this.x = width/2 * random(0.8, 1.2);
                this.y = height/2 * random(0.6, 1.4);
            }

            // attack periodically
            if (this.attackCountdown <= 0) {
                this.attack();
                this.attackCountdown = 100;
            } else {
                this.attackCountdown -= 2;
            }

            // good bacteria produce coins periodically
            if (!game_won && !game_lost && !paused) {
                if (this.type == 'bifido' || this.type == 'lacto') {
                    if (this.coinCountdown <= 0.1) {
                        coin_arr.push(new Coin(this.x, this.y));
                        this.coinCountdown = 400;
                    } else {
                        this.coinCountdown--;
                    }
                }
            }

            // if health is 0 remove from play
            if (this.health <= 0) {
                this.outOfPlay = true;
            }
        }

        // draw w rotation
        imageMode(CENTER);
        push();
        translate(this.x, this.y);
        rotate(radians(this.angle));
        if (this.type == 'bifido') {
            image(bifido, 0, 0, this.w, this.h);
        } else if (this.type == 'lacto') {
            image(lacto, 0, 0, this.w, this.h);
        } else if (this.type == 'clost') {
            image(clost, 0, 0, this.w, this.h);
        }
        pop();

        // draw health bar
        fill(255);
        noStroke();
        rectMode(CORNER);
        rect(this.x - this.size/10, this.y + this.size/3, 50, 10, 5);
        if (this.health > 65) {
            fill(0, 255, 0);
        } else if (this.health > 35) {
            fill(255, 255, 0);
        } else {
            fill(255, 0, 0);
        }
        rect(this.x - this.size/10, this.y + this.size/3, this.health/2, 10, 5, 0, 0, 5);
    }

    attack() {
        let toAttack;
        if ((this.type == 'bifido' || this.type == 'lacto') && clost_arr.length >= 3) {
            toAttack = clost_arr[int(random(clost_arr.length))];
            bullet_arr.push(new Bullet(this.x, this.y, toAttack, 'white'));
        } else if (this.type == 'clost' && clost_arr.length >= 3) {
            let randType = random([1,2]);
            if (randType == 1) {
                toAttack = bifido_arr[int(random(bifido_arr.length))];  
            } else if (randType == 2) {
                toAttack = lacto_arr[int(random(lacto_arr.length))]; 
            }
            bullet_arr.push(new Bullet(this.x, this.y, toAttack, 'black'));
        }
    }
}

class Food {
    constructor(x, y, type, price) {
        this.originalX = x;
        this.originalY = y;
        this.x = x;
        this.y = y;
        this.w = 80;
        this.h = 80;
        this.dragging = false;
        this.type = type;
        this.price = price;
        this.cooldownCount = 0;
    }

    display() {
        imageMode(CENTER);

        if (this.type == 'white bread') {
            image(white_bread, this.x, this.y, this.w * 0.9, this.h * 0.9);
        } else if (this.type == 'wheat bread') {
            image(wheat_bread, this.x, this.y, this.w, this.h);
        } else if (this.type == 'apple') {
            image(apple, this.x, this.y, this.w, this.h);
        } else if (this.type == 'lettuce') {
            image(lettuce, this.x, this.y, this.w, this.h);
        } else if (this.type == 'kimchi') {
            image(kimchi, this.x, this.y, this.w, this.h);
        } else if (this.type == 'steak') {
            image(steak, this.x, this.y, this.w, this.h);
        } else if (this.type == 'tofu') {
            image(tofu, this.x, this.y, this.w * 1.1, this.h * 1.1);
        } else if (this.type == 'milk') {
            image(milk, this.x, this.y, this.w * 0.7, this.h);
        } else if (this.type == 'yogurt') {
            image(yogurt, this.x, this.y, this.w, this.h);
        }

        if (this.cooldownCount > 0 && !paused) {
            fill(0);
            textAlign(CENTER);
            let w = textWidth(this.cooldownCount) + 10;
            fill(255);
            rectMode(CENTER);
            rect(this.x, this.y - 2, w, 30, 5);
            rectMode(CORNER);
            fill(0);
            text(this.cooldownCount, this.x, this.y + 5);
            this.cooldownCount--;
        }
    }

    mouseCheckDrag() {
        // is mouse close enough to consider drag event
        if (mouseX > this.x - this.w/2 && mouseX < this.x + this.w/2 &&
            mouseY > this.y - this.h/2 && mouseY < this.y + this.h/2) {
                // can player afford this food? is this food available?
                valid_can_afford = this.price <= coins;
                valid_item_available = this.cooldownCount == 0;

                if (valid_can_afford && valid_item_available) {
                    // allowed to buy item
                    this.dragging = true;
                    valid_can_afford = true;
                    valid_item_available = true;
                }
        }
    }

    mouseDragged() {
        // check if mouse was trying to drag this food object
        if (this.dragging) {
                this.x = mouseX;
                this.y = mouseY;
        }
    }

    mouseReleased() {
        // check if it's been moved into the circle
        let distCenter = dist(this.x, this.y, width/2, height/2);
        if (distCenter <= 315) {
            // complete transaction
            coins -= this.price;
            if (!muted) {
                chew_sound.play();
            }

            // start the cooldown count, this food can temporarily not be bought
            this.cooldownCount = 500;

            if (this.type == 'wheat bread') {
                addBifido(1, mouseX, mouseY);
            } else if (this.type == 'apple') {
                addBifido(1, mouseX, mouseY);
            } else if (this.type == 'lettuce') {    
                addBifido(1, mouseX, mouseY);
            } else if (this.type == 'kimchi') {
                addBifido(1, mouseX, mouseY);
                addLacto(1, mouseX, mouseY);
            } else if (this.type == 'steak') {
                addClost(1, mouseX, mouseY);
            } else if (this.type == 'tofu') {
                addBifido(1, mouseX, mouseY);
            } else if (this.type == 'milk') {
                addLacto(1, mouseX, mouseY);
            } else if (this.type == 'yogurt') {
                addLacto(2, mouseX, mouseY);
            }
        }

        // go back to original position
        this.x = this.originalX;
        this.y = this.originalY;

        this.dragging = false;
    }

}

class Bullet {
    constructor(x, y, target, color) {
        this.x = x;
        this.y = y;
        this.w = 10;
        this.h = 10;
        this.target = target;
        this.color = color;
        this.outOfPlay = false;
    }

    moveAndDisplay() {
        // if the target no longer exists, remove from play
        if (this.target == null) {
            this.outOfPlay = true;
        } else {
            // draw a circle where the bullet is
            if (this.color == 'white') {
                fill(255);
            } else if (this.color == 'black') {
                fill(0);
            }
            ellipseMode(CENTER);
            ellipse(this.x, this.y, this.w, this.h);

            if (!paused) {
                // move the bullet closer to target
                let distX = this.target.x - this.x;
                let distY = this.target.y - this.y;
                let distAngle = atan(distY/distX);
                if (this.target.x > this.x) {
                    this.x += cos(distAngle) * 5;
                    this.y += sin(distAngle) * 5;
                } else {
                    this.x -= cos(distAngle) * 5;
                    this.y -= sin(distAngle) * 5;
                }

                // if it hits target, decrease health of target and remove from play
                let distTarget = dist(this.x, this.y, this.target.x, this.target.y);
                if (distTarget < 10) {
                    this.target.health -= 10;
                    this.outOfPlay = true;
                }

                // if it goes out of bounds, remove from play
                let distCenter = dist(this.x, this.y, width/2, height/2);
                if (distCenter >= 340) {
                    this.outOfPlay = true;
                }
            }
        }
    }
}

class Coin {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 30;
        this.collected = false;
        this.timeOnScreen = 0;
    }

    display() {
        imageMode(CENTER);
        image(coin, this.x, this.y, this.size, this.size);
        if (!game_won && !game_lost && !paused) {
            // player hovers over to collect coin
            let mouseDist = dist(this.x, this.y, mouseX, mouseY);
            if (mouseDist <= 100) {
                this.collected = true;
                coins++;
            }
            this.timeOnScreen++;
        }
    }
}
