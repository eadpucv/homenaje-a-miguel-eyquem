/** a note is a note is a note  */

class Note {
    constructor(lat, lon, title, content, author) {
        // console.log("creating: "+title);
        this.connectedTo = "nothing";
        this.springDist = 0;
        this.creatingSpring = false;
        let margin = w / 10;
        this.x = map(lon, minlon, maxlon, margin, w - margin);
        this.y = map(lat, minlat, maxlat, h - margin, margin);
        this.px = this.x;
        this.py = this.y;
        this.title = title;
        this.content = content;
        this.author = author;
        this.r = map(this.title.length, 2, 40, 5, 32);
        this.over = false;
        this.touched = false;
        this.angle;
        this.col = color(random(210, 255), random(60, 180), random(10), 90);
        this.colOver = color(red(this.col)*.8, green(this.col)*.8, 2, 95);
        let options = {
            friction: 0,
            restitution: 0.77,
            mass: 30
        };
        this.body = Bodies.circle(this.x, this.y, this.r, options);
        World.add(world, this.body);
    }
    rollover(x, y) {
        if (dist(this.x, this.y, x, y) < this.r) {
            this.over = true;
        } else {
            this.over = false;
        }
    }
    display() {
        this.rollover(mouseX, mouseY);
        this.angle = this.body.angle;
        let pos = this.body.position;
        this.x = pos.x;
        this.y = pos.y;
        push();
        translate(pos.x, pos.y);
        rotate(this.angle);
            if(this.touched){
                g.blendMode(MULTIPLY);
                g.stroke(this.colOver);
                g.strokeWeight(1);
                g.line(this.px, this.py, this.x, this.y);
                g.blendMode(BLEND);
                if (this.over) {
                    fill(this.colOver);
                    noStroke();
                    ellipse(0, 0, this.r * 2);
                    stroke(this.colOver);
                    strokeWeight(3);
                    point(0, 0); 
                }else{
                    noFill();
                    strokeWeight(2);
                    stroke(0, 20);
                    ellipse(0, 0, this.r * 2);
                    stroke(0);
                    strokeWeight(5);
                    point(0, 0);
                }
            }else{
                if (this.over) {
                    fill(this.colOver);
                    stroke(180, 30, 0, 250);
                    strokeWeight(1);
                    ellipse(0, 0, this.r * 2);
                }else{
                    noStroke();
                    strokeWeight(1.5);
                    fill(this.col);
                    ellipse(0, 0, this.r * 2);
                }
            }
        pop();
        if (this.creatingSpring) {
            // paint growing circle
            g.fill(this.colOver);
            g.blendMode(MULTIPLY);
            g.noStroke();
            g.ellipse(this.x, this.y, this.springDist * 2);
            // check all other notes
            for (let other of notes) {
                // if its different and not already connected
                if (this.body != other.body && this.title != other.connectedTo) {
                    // calculate the distance between notes
                    let d = dist(this.x, this.y, other.x, other.y);
                    // if its closer that the growing circle
                    if (d <= this.springDist) {
                        let options = {
                            label: "spring",
                            length: d,
                            bodyA: this.body,
                            bodyB: other.body,
                            stiffness: 1
                        }
                        this.connectedTo = other.title;
                        // create new spring
                        let spring = Constraint.create(options);
                        World.add(world, spring);
                        springs.push(spring);
                        this.creatingSpring = false;
                    }
                    this.springDist += .1;  /* i don't understand this number, it should be 1 */
                }
            }
        }
    // for drawing the trails connecting current to previous position
    this.px = this.x;
    this.py = this.y;
    }
}