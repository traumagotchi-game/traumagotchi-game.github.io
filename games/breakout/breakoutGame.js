"use strict";


let breakoutGameInstance = function(p) { // p could be any variable name

  p.canvas;
  p.context;

  // p.debug = true; // enable debug to see collider outlines


  p.animationFrame;
  p.lastAnimationFrame;

  p.level = 0; // level is different levels of game
  p.stage = 'waiting';
  p.score = 0;

  // variable for player
  p.player;

  // arrays to store other sprites
  p.ballSprite;
  p.ballInitialVelocityX = 4;
  p.ballInitialVelocityY = 8;
  p.breakoutSprites = [];
  p.collisionSprites = [];
  p.colSprIndex;
  p.displayCollision = false;

  p.gravity = .001;


  p.restartBool = false;



  p.setup = function() {
    p.canvas = p.createCanvas(600, 450);
    p.canvas.parent("canvasDiv");
    p.canvas.class("gameCanvas");
    p.canvas.id("breakoutGameCanvas");
    p.canvas.style("z-index: 5;");

    p.frameRate(30);
    // p.background(0);

    // context is for HTML5 Canvas
    let c = document.querySelector("#breakoutGameCanvas");
    p.context = c.getContext("2d");

    p.canvas.mousePressed(localMousePressed);
    p.canvas.mouseClicked(localMouseClicked);

    p.lastAnimationFrame = p.animationFrame;



    p.imageMode(CENTER);

    p.player = new p5Sprite(slimePlatform, p.width / 2, p.height - 32, 1);
    // p.player = new p5Sprite(sprite32x100_yellow, p.width / 2, p.height - 32, 1);
    // console.log(p.player.imgArray[0].width) // SOOOO weird this is not registering actual width sooner...

    // add collider if you want it to be different than the default image size
    // good to make it a little smaller so people enjoy game play more ;-=)
    // enable debug variable to see collider outline
    p.player.addCollider(128, 34);
    p.player.addAnimation("still", 0, 0);
    p.player.addAnimation("drip", 0, 8);
    // console.log(p.player);




    p.ballSprite = new p5Sprite(sprite32, p.width * 0.5, 133, 1, p.ballInitialVelocityX, p.ballInitialVelocityY);

    // p.ballSprite.addCollider(20, 20);
    p.ballSprite.addAnimation("still", 0, 0);


    // angelabelle: initialized breakoutSprites here =)
    for (let i = 0; i < 10; i++) {
      if (i < 5) {
        // initialize 5 sprites for top of breakout board. Their x positions acount for space inbetween (100 empty pixels / 6) and width of each of them. Their x y positions are centered bc image mode is center]
        p.breakoutSprites.push(new p5Sprite(sprite32x100_purple, (i + 1) * (Math.floor(100 / 6)) + (i * 100) + 50, 20, 1));

        // p.breakoutSprites.push(new p5Sprite(spriteYellowLong, (i + 1) * (Math.floor(100 / 6)) + (i * 100) + 50, 33, .5));
        // p.breakoutSprites[i].addAnimation("still", 0, 0);
        // p.breakoutSprites[i].addAnimation("animated", 0, 20);
        // p.breakoutSprites[i].addCollider(50, 20);

        // p.breakoutSprites.push(new p5Sprite(clouds, (i + 1) * (Math.floor(100 / 6)) + (i * 100) + 50, 33, 1/8));
        p.breakoutSprites[i].addAnimation("still", 2, 2);
        p.breakoutSprites[i].addAnimation("animated", 0, 20);
        p.breakoutSprites[i].addCollider(50, 20);

      } else {

        p.breakoutSprites.push(new p5Sprite(sprite32x100_purple, (i - 4) * (Math.floor(100 / 6)) + ((i - 5) * 100) + 50, 70, 1));

        // p.breakoutSprites.push(new p5Sprite(spriteYellowLong, (i - 4) * (Math.floor(100 / 6)) + ((i - 5) * 100) + 50, 90, .5));

        // p.breakoutSprites[i].addAnimation("still", 0, 0);
        // p.breakoutSprites[i].addAnimation("animated", 0, 20);
        // p.breakoutSprites[i].addCollider(50, 20);

        // p.breakoutSprites.push(new p5Sprite(clouds, (i - 4) * (Math.floor(100 / 6)) + ((i - 5) * 100) + 50, 90, 1/8));
        p.breakoutSprites[i].addAnimation("still", 2, 2);
        p.breakoutSprites[i].addAnimation("animated", 0, 20);
        p.breakoutSprites[i].addCollider(50, 20);
      }
    }

  };

  p.draw = function() {

    // for debugging
    // mouseEvents();


    switch (p.stage) {
      case 'waiting':
        // do nothing
        break;
      case 'intro':
        intro();
        // restartBool flag makes it so it only restarts once, this initializes the boolean so it will restart again
        p.restartBool = false;
        break;
      case 'play':
        play();
        break;
      case 'gameOver':
        gameOver();
        break;
      case 'youWon':
        youWon();
        break;
      default:
        break;
    }
  };


  // code for mousePressed on THIS canvas
  function localMousePressed() {

    // got to fix attraction point code so it doesn't pendulum
    // p.player.attractionPoint(mouseX, mouseY);

    return false;
  }

  // code for mouseClicked on THIS canvas
  // this fires only once after the mouse is pressed - not really seeing it behave differently rn tho....
  function localMouseClicked() {
    // got to fix attraction point code so it doesn't pendulum
    // p.player.attractionPoint(mouseX, mouseY);
    return false;
  }


  function intro() {
    // clear to have a clear background, if background is drawn on another canvas layer
    // p.clear();
    // p.background(0);

  }

  function play() {
    // clear to have a clear background, if background is drawn on another canvas layer
    p.clear();
    // p.background(0);

    //*
    // create animation frame counter approx 8fps (if browser is running at 30fps)
    p.animationFrame = Math.floor(frameCount / 3.75);


    // angelabelle: for breakout initialization
    for (let i = 0; i < p.breakoutSprites.length; i++) {
      // p.breakoutSprites[i].displayAnim("animated");
      p.breakoutSprites[i].displayAnim("still");
    }

    p.ballSprite.moveSprite();
    p.ballSprite.keepInFrameExceptBottom();

    p.ballSprite.displayAnim("still");

    // move and display player
    p.player.moveSprite();
    p.player.keepInFrame();
    // player follows mouse with 0.05 ease (lower the ease the more drag)
    // p.player.followMouse(0.05);

    // player follows mouse, restriced to X Axis
    p.player.followMouseX(0.05);
    // ^ angelabelle: use this for breakout. OR place this function INSIDE of the localMousePressed() function, so it only moves when people have mouse pressed


    p.player.drawConnectiveTissue(5);
    // p.player.displayAnim("animated", true);

    p.player.displayAnim("drip");

    // // this is where sprites could be animated...
    //     if (mouseIsPressed) {
    //       // p.player.followMouse(0.1);
    //       p.player.displayAnim("animated");
    //     } else {
    //       p.player.displayAnim("still");
    //     }


    // check collision for breakoutSprites
    // iterate through them backwards in case you want to splice them from array, that way it won't skip one in loop.
    for (let i = p.breakoutSprites.length - 1; i >= 0; i--) {
      // seems redundant to check for visibility when the collidesWith function also checks for it, but for some reason there is a delay in setting the visibility to false in collision function, dunno! this fixes it so it only fires once instead of 5-15 times

      if (p.ballSprite.collidesWith(p.breakoutSprites[i])) {

        p.collisionSprites.push(new p5Sprite(collisionAnimation_128, 100, 100, .75));
        p.colSprIndex = p.collisionSprites.length - 1;
        p.collisionSprites[p.colSprIndex].x = p.breakoutSprites[i].x;
        p.collisionSprites[p.colSprIndex].y = p.breakoutSprites[i].y;
        p.collisionSprites[p.colSprIndex].addAnimation("explode", 0, 10);
        p.collisionSprites[p.colSprIndex].isPlaying = true;
        p.displayCollision = true;


        p.breakoutSprites[i].hide();
        // reverse ball direction
        p.ballSprite.velocityX *= -1;
        p.ballSprite.velocityY *= -1;
        // p.pointSprites.splice(i, 1); // if splice from array will need to repopulate it in the restart function

        sound_thud1.play();
        p.score += 10;
      }
    }


    if (p.displayCollision) {
      // if (p.displayCollision && p.collisionSprites[p.colSprIndex]) {
      for (let i = p.collisionSprites.length - 1; i >= 0; i--) {
        if (p.collisionSprites[i].isPlaying) {
          // create a new collision sprite and push it to the array
          p.collisionSprites[i].displayAnim("explode", false);
        } else {
          p.collisionSprites.splice(i, 1)
        }
      }
    }


    if (p.ballSprite.collidesWith(p.player)) {
      p.ballSprite.velocityY *= -1;

      sound_beep1.play();
      // measure distance from middle of platform. have velocity x change MORE the farther it is from middle
      // max is p.player.width / 2
      if (p.ballSprite.velocityX > 0) {
        p.ballSprite.velocityX = p.ballSprite.velocityX + 4 * Math.abs(p.ballSprite.x - p.player.x) / (p.player.width * 0.5);
      } else {
        p.ballSprite.velocityX = p.ballSprite.velocityX - 4 * Math.abs(p.ballSprite.x - p.player.x) / (p.player.width * 0.5);
      }
    }

    if (p.ballSprite.y > p.height + 30) {
      sound_fizzDown_hiPitch.play();
      p.stage = 'gameOver';
    }

    pointsRunningTotal.innerHTML = `${p.score}`;


    p.lastAnimationFrame = p.animationFrame;
  }


  function gameOver() {
    p.clear();
    drawGameOverBGBool = true;

    restart();
  }

  function youWon() {
    p.context.font = "60px Verdana";
    p.context.fillStyle = "#ACD02D";
    let str = "YOU WON";
    let txt = p.context.measureText(str);
    let left = (p.canvas.width - txt.width) / 2;
    let top = p.canvas.height / 2;
    p.context.fillText("YOU WON", left, top);


    restart();
  }

  function restart() {
    // note: changes made here have to also match the initial positions when sprites are created in setup.
    p.clear();

    // restart bool is a flag to make sure it restarts only once
    if (p.restartBool == false) {

      if (p.level <= 5) {
        p.level += 1;
        p.ballSprite.velocityX = p.level + p.ballInitialVelocityX;
        p.ballSprite.velocityY = p.level + p.ballInitialVelocityY;
      } else {
        p.level = 0;
        p.ballSprite.velocityX = p.ballInitialVelocityX;
        p.ballSprite.velocityY = p.ballInitialVelocityY;
      }

      // reset variables
      p.player.x = p.width / 2;
      p.player.y = p.height - 50;
      p.player.velocityX = 0;
      p.player.velocityY = 0;

      p.ballSprite.x = p.width * 0.5;
      p.ballSprite.y = 100;


      // if sprites are spliced from breakoutSprites array (instead of just being hidden) then you would need to repopulate array here
      for (let i = 0; i < p.breakoutSprites.length; i++) {
        p.breakoutSprites[i].show();
      }


    }
    p.restartBool = true;
  }


  //create sprite class
  class p5Sprite {
    constructor(_imgArray, _x, _y, _scaleFactor = 1, _velocityX = 0, _velocityY = 0) {
      this.imgArray = _imgArray;
      this.x = _x;
      this.y = _y;
      this.scaleFactor = _scaleFactor;
      this.velocityX = _velocityX;
      this.velocityY = _velocityY;

      this.animations = [];
      this.rotation = 0;
      this.visible = true;
      this.isPlaying = true;
      // width and height not loading properly bc for some reason img not fully loaded (even tho it is visible in array :?)
      this.width = this.imgArray[0].width * this.scaleFactor;
      this.height = this.imgArray[0].height * this.scaleFactor;
    }

    addCollider(_colliderWidth, _colliderHeight) {
      this.colliderWidth = _colliderWidth;
      this.colliderHeight = _colliderHeight
    }

    // if no frame start and frame sound added, default is to display a still of first frame
    addAnimation(_animation, _frameStart = 0, _frameEnd = 0, _sound, _animWidth, _animHeight, _frameCount = 0) {
      this.animations.push({
        name: _animation,
        frameStart: _frameStart,
        frameEnd: _frameEnd,
        sound: _sound,
        animWidth: _animWidth,
        animHeight: _animHeight,
        frameCount: _frameCount
      })
    }


    displayAnim(_animation, _looping = true, _delay = 1) {

      // bug (could be better if only declared once in setup but imgArray[0].width doesn't load until frame 5)
      // declaring this here bc so weird the image width won't load in setup, delays a few frames
      this.width = this.imgArray[0].width * this.scaleFactor;
      this.height = this.imgArray[0].height * this.scaleFactor;

      let animation;
      let animationIndex;
      let spriteFrame;
      let frameIndex;


      // find the animation in animation array
      for (let i = 0; i < this.animations.length; i++) {
        if (_animation == this.animations[i].name) {
          animation = this.animations[i];
        }
      }


      // bug doesn't start from first frame, trying to use timerStart...
      if (animation && this.visible && this.isPlaying) {
        // // try step thru frame index with animation frame....

        // if (!frameIndex) {
        //   frameIndex = 0;
        // }

        // if (p.animationFrame != p.lastAnimationFrame) {
        //   // console.log('animation frame change')
        //   // step the frame index here ( would have to account for delay)
        //   if (this.isPlaying && frameIndex <= animation.frameEnd) {
        //     frameIndex++
        //   } else {
        //     frameIndex = animation.frameStart;
        //     this.isPlaying = true;
        //   }
        // }

        // console.log(animation.frameCount)

        if (p.animationFrame != p.lastAnimationFrame) {

          animation.frameCount = (animation.frameCount + 1) % (animation.frameEnd - animation.frameStart + 1);

        }
        if (!_looping && animation.frameCount == animation.frameEnd) {
          // destroy -- remove sprite from array
          this.isPlaying = false;

        } else {

          // animation.frameCount = Math.floor(p.animationFrame / _delay) % (animation.frameEnd - animation.frameStart + 1) + animation.frameStart;

          spriteFrame = this.imgArray[animation.frameCount];

          // // no rotation
          p.image(spriteFrame, this.x, this.y, this.imgArray[0].width * this.scaleFactor, this.imgArray[0].height * this.scaleFactor);

          if (p.debug && this.colliderWidth) {
            p.rectMode(CENTER);
            p.noFill();
            p.stroke(255);
            p.strokeWeight(3);
            p.rect(this.x, this.y, this.colliderWidth / this.scaleFactor, this.colliderHeight / this.scaleFactor);

            // to rotate (buggy)
            // p.push();
            //
            // p.translate(this.x, this.y);
            //
            // p.rotate(this.rotation);
            //
            // p.image(spriteFrame, 0, 0, this.imgArray[0].width * this.scaleFactor, this.imgArray[0].height * this.scaleFactor);
            //
            // p.pop();
          }
        }
      }
    }

    hide() {
      this.visible = false;
    }

    show() {
      this.visible = true;
    }

    // smaller the ease the slower it follows you, default .1
    followMouse(_ease = .1) {
      this.x += (mouseX - this.x) * _ease;
      this.y += (mouseY - this.y) * _ease;
    }

    followMouseX(_ease = .1) {
      this.x += (mouseX - this.x) * _ease;
    }

    followMouseY(_ease = .1) {
      this.y += (mouseY - this.y) * _ease;
    }

    attractionPoint(_pointX, _pointY, _magnitude = 8) {
      let angle = Math.atan2(_pointY - this.y, _pointX - this.x);
      this.velocityX += cos(angle) * _magnitude;
      this.velocityY += sin(angle) * _magnitude;

      // Rotate us to face the player
      this.rotation = angle;

      // // Calculate direction towards player
      //   let toPointX = _pointX - this.x;
      //   let toPointY = _pointY - this.y;
      //
      //   // Normalize
      //   let toPointLength = Math.sqrt(toPointX * toPointX + toPointY * toPointY);
      //   toPointX = toPointX / toPointLength;
      //   toPointY = toPointY / toPointLength;
      //
      //   // // Move towards the player
      //   // this.x += toPointX * this.speed * 8;
      //   // this.y += toPointY * this.speed * 8;
      //   this.velocityX *= toPointX * 8;
      //   this.velocityY *= toPointY * 8;
      //
      //   // Rotate us to face the player
      //   this.rotation = Math.atan2(toPointY, toPointX);


      // attractionPoint(_otherSprite) {
      //   if (_otherSprite) {
      //
      //   } else {
      //     // Calculate direction towards player
      //     let toMouseX = mouseX - this.x;
      //     let toMouseY = mouseY - this.y;
      //
      //     // Normalize
      //     let toMouseLength = Math.sqrt(toMouseX * toMouseX + toMouseY * toMouseY);
      //     toMouseX = toMouseX / toMouseLength;
      //     toMouseY = toMouseY / toMouseLength;
      //
      //     // Move towards the player
      //     this.x += toMouseX * this.speed * 8;
      //     this.y += toMouseY * this.speed * 8;
      //
      //     // Rotate us to face the player
      //     this.rotation = Math.atan2(toMouseY, toMouseX);
      //   }
    };

    moveSprite() {
      this.x += this.velocityX;
      this.y += this.velocityY;
    }

    // this for bouncing
    keepInFrameBouncing() {
      if (this.x <= 0 + this.width / 2 || this.x >= p.width - this.width / 2) {
        this.velocityX *= -1;
      }
      if (this.y <= 0 + this.height / 2 || this.y >= p.height - this.height / 2) {
        this.velocityY *= -1;
      }
    }

    keepInFrame() {
      if (this.x < 0 + this.width / 2) {
        this.x = 0 + this.width / 2;
      } else if (this.x > p.width - this.width / 2) {
        this.x = p.width - this.width / 2;
      }
      if (this.y < 0 + this.height / 2) {
        this.y = 0 + this.height / 2;
      } else if (this.y >= p.height - this.height / 2) {
        this.y = p.height - this.height / 2;
      }
    }

    keepInFrameExceptBottom() {
      if (this.x <= 0 + this.width / 2 || this.x >= p.width - this.width / 2) {
        this.velocityX *= -1;
      }
      if (this.y <= 0 + this.height / 2) {
        this.velocityY *= -1;
      }
    }

    collidesWith(_otherSprite) {
      if (this.visible && _otherSprite.visible) {
        if (this.colliderWidth && _otherSprite.colliderWidth && Math.abs(this.x - _otherSprite.x) < (this.colliderWidth + _otherSprite.colliderWidth) / 2 && Math.abs(this.y - _otherSprite.y) < (this.colliderHeight + _otherSprite.colliderHeight) / 2) {

          return true;

        } else if (this.colliderWidth && Math.abs(this.x - _otherSprite.x) < (this.colliderWidth + _otherSprite.width) / 2 && Math.abs(this.y - _otherSprite.y) < (this.colliderHeight + _otherSprite.height) / 2) {

          return true;

        } else if (_otherSprite.colliderWidth && Math.abs(this.x - _otherSprite.x) < (this.width + _otherSprite.colliderWidth) / 2 && Math.abs(this.y - _otherSprite.y) < (this.height + _otherSprite.colliderHeight) / 2) {

          return true;

        } else if (Math.abs(this.x - _otherSprite.x) < (this.width + _otherSprite.width) / 2 && Math.abs(this.y - _otherSprite.y) < (this.height + _otherSprite.height) / 2) {
          return true;

        } else {

          return false;
        }
      } else {

        return false;
      }

    }

    // if no parameter given, default number of lines is 3, default color is bright green
    drawConnectiveTissue(_number = 5, _color = 'rgb(0,255,0)') {

      p.stroke(_color);
      p.strokeWeight(2);
      p.line(mouseX, mouseY, p.player.x, p.player.y);
      // console.log(p.player.width);
      for (let i = 3; i < _number; i++) {
        p.line(mouseX, mouseY, p.player.x + p.player.width / i, p.player.y + p.player.height / i);
        p.line(mouseX, mouseY, p.player.x - p.player.width / i, p.player.y - p.player.height / i);
        // p.line(mouseX, mouseY, p.player.x + 10 * i, p.player.y + 10 * i);
        // p.line(mouseX, mouseY, p.player.x - 10 * i, p.player.y - 10 * i);
      }
      p.strokeWeight(0);
    }
  }
};
