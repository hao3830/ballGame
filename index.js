const game = document.getElementById('game');
const c = game.getContext('2d');

game.width = innerWidth ;
game.height = innerHeight ;
const score = document.getElementById('socre');
var s = 0;
class Player {

    constructor(x,y,radius,color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    draw() {
        c.beginPath();
        c.arc(this.x,this.y,this.radius,0,2*Math.PI);
        c.fillStyle = this.color;
        c.fill();
    }

}

class Projectile {

    constructor(x,y,radius,color,velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw() {
        c.beginPath();
        c.arc(this.x,this.y,this.radius,0,2*Math.PI);
        c.fillStyle = this.color;
        c.fill();
    }

    update() {
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
        this.draw();
    }
}

class Enemy {
    constructor(x,y,radius,color,velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw() {
        c.beginPath();
        c.arc(this.x,this.y,this.radius,0,2*Math.PI);
        c.fillStyle = this.color;
        c.fill();
    }

    update() {
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
        this.draw();
    }

}

class Particle {

    constructor(x,y,radius,color,velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1;
        this.reduction = 0.99;
    }

    draw() {
        c.save();
        c.globalAlpha = this.alpha;
        c.beginPath();
        c.arc(this.x,this.y,this.radius,0,2*Math.PI);
        c.fillStyle = this.color;
        c.fill();
        c.restore();
    }

    update() {
        this.velocity.x *= this.reduction;
        this.velocity.y *= this.reduction;
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
        this.alpha -= 0.01;
        this.draw();
    }
}


const enemies = [];
const particles = [];
const listColor = ['green', 'yellow', 'purple','orange'];
const max = 50;
const min = 10;
function spawnEnemy() {
    setInterval(() => {
        let x;
        let y;

        var radius = Math.random() * (max - min) + min;

        if(Math.random() < 0.5) {

            x = Math.random() < 0.5 ? 0 - radius : game.width + radius; 
            y = Math.random()*game.height;
        } else {
            y = Math.random() < 0.5 ? 0 - radius : game.height + radius;
            x = Math.random()*game.width;
        }


        const arg = Math.atan2(innerHeight/2 -  y, innerWidth/2 - x);
        k1 = Math.cos(arg);
        k2 = Math.sin(arg);


        const color = listColor[Math.floor( Math.random() * 4)];

        const velocity = {
            'x': k1,
            'y': k2
        }
        enemies.push(new Enemy(x,y,radius,color,velocity));
    },1000)
}

const x = innerWidth/2;
const y = innerHeight/2;

const player = new Player(x,y,30,'blue');
player.draw();

var listProperties = [];

const animate = () => {
    gameId = requestAnimationFrame(animate);
    c.fillStyle = 'rgba(0,0,0,0.1)'
    c.fillRect(0,0,game.width,game.height);
    const player = new Player( innerWidth/2,innerHeight/2,30,'blue');
    player.draw();

    listProperties.forEach((item,index) => {
        item.update();
        
        if(
            item.x + item.radius < 0 || 
            item.x - item.radius > game.width ||
            item.y - item.radius > game.height ||
            item.y + item.radius < 0
        ) {
            setTimeout(() => {
                listProperties.splice(index,1);
            },0)
        }
    })
    particles.forEach((particle,index) => {
        particle.update();
        if(particle.alpha <= 0) {
            particles.splice(index,1)
        }
    })
    enemies.forEach((item,index) => {
        item.update();
        
        listProperties.forEach((property,propertyIndex) => {
            const dist = Math.hypot(item.x - property.x, item.y - property.y)
            if( dist - item.radius - property.radius < 1) {
                var audio = new Audio('hitSound.mp3');
                audio.play();
                for(i = 0 ; i < item.radius/2 ; i++) {
                    particles.push(new Particle(item.x,item.y, Math.random() * 4,item.color,{
                        'x' : (Math.random()-0.5) *6,
                        'y' : (Math.random()-0.5 )*6
                    }))
                }
                if( item.radius - 10 > 10) {
                    s += 10;
                    score.innerHTML = s;
                    gsap.to(item, {
                        radius: item.radius - 10
                    })
                    setTimeout(() => {
                        listProperties.splice(propertyIndex,1);
                    },0)
                }else {
                    setTimeout(() => {
                        
                        enemies.splice(index,1);
                        listProperties.splice(propertyIndex,1);
                    },0)
                }
            }
        })
    
    
     
    const dist = Math.hypot(item.x - innerWidth/2, item.y - innerHeight/2);
    if(dist - item.radius - player.radius < 1) {
        var audio = new Audio('gameOver.mp3');
        audio.play();
        cancelAnimationFrame(gameId)
    }
    })
}

game.addEventListener('mousedown', e => {
    const x = e.clientX - innerWidth/2;
    const y = e.clientY -innerHeight/2;
    const eg = Math.atan2(y,x)

    const properties = new Projectile(
        innerWidth/2
        ,innerHeight/2
        ,10
        ,'blue'
        ,{
            'x': Math.cos(eg)*4,
            'y': Math.sin(eg)*4
        });
    
    properties.draw();
    listProperties.push(properties)
})
animate();
spawnEnemy();