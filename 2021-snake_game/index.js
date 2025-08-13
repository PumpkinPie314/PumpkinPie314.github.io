var canvas = document.getElementById('game');
pixel_size = [20, 20]
game_size = [20, 20]
// canvas.width = window.innerWidth
// canvas.height = window.innerHeight
canvas.width = pixel_size[0]*game_size[0]
canvas.height = pixel_size[1]*game_size[1]
const ctx = canvas.getContext('2d');
game_state = 'welcome'
function set_game(){
    snake = {
        input_buffer: '',
        facing: 'east',
        length: 5,
        head:{
            x:5,
            y:5
        },
        body:[]
    }
    apple = {
        x:0,
        y:0
    }
    place_apple()
}
function game_loop(){
    //logic
    move_snake();
    check_collisions();

    render();
    if(game_state == 'play')setTimeout(game_loop, 1000/10)
    if(game_state == 'game over'){
        //gameover text
        ctx.fillStyle = 'white'
        ctx.font=`${canvas.width*(1/7)}px sans-serif`;
        ctx.fillText('Game Over', canvas.width*(1/5) ,canvas.height*(1/2), canvas.width*(3/5));
        ctx.font=`${canvas.width*(1/21)}px sans-serif`;
        ctx.fillText('press any button to play again', canvas.width*(1/5) ,canvas.height*(2/3), canvas.width*(3/5));
        ctx.stroke();
    }
};



function move_snake(){
    if(snake.input_buffer)snake.facing = snake.input_buffer  //inputs
    snake.body.push({x:snake.head.x, y:snake.head.y})
    if(snake.body.length > snake.length)snake.body.shift();
    if(snake.facing == 'north')snake.head.y -=1
    if(snake.facing == 'east')snake.head.x +=1
    if(snake.facing == 'south')snake.head.y +=1
    if(snake.facing == 'west')snake.head.x -=1
};
function place_apple(){
    apple.x = Math.floor(Math.random()*game_size[0])
    apple.y = Math.floor(Math.random()*game_size[1])
    snake.body.forEach(segment => {
        if(segment.x == apple.x && segment.y == apple.y)place_apple()
    });
}
function check_collisions(){
    //apple
    if(snake.head.x == apple.x && snake.head.y == apple.y){
        place_apple();
        snake.length ++;
    }
    //body
    snake.body.forEach(segment => {
        if(segment.x == snake.head.x && segment.y == snake.head.y)game_state = 'game over';
    });
    //edge of screen
    if(snake.head.x < 0 || snake.head.x >= game_size[0]) game_state = 'game over';
    if(snake.head.y < 0 || snake.head.y >= game_size[1]) game_state = 'game over';
};
function clear_screen(){
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.stroke();
};
function draw_game_pixel(color, x, y){
    ctx.fillStyle = color
    ctx.fillRect(x*(canvas.width/game_size[0]), y*(canvas.height/game_size[1]) , canvas.width/game_size[0], canvas.height/game_size[1]);
    ctx.stroke();
}
function render(){
    if(game_state != 'play')return
    clear_screen();
    draw_game_pixel('red', apple.x, apple.y)  //apple
    //body
    snake.body.forEach(segment => {draw_game_pixel('green', segment.x, segment.y)});
    draw_game_pixel('orange', snake.head.x, snake.head.y)  //snake head
};

//inputs
document.body.addEventListener('keydown', key_down);
function key_down(event){
    //start and reset the game when any key is pressed
    if(game_state != 'play'){
        game_state = 'play'
        set_game()
        game_loop()
        return
    }
    //inputs for the actual game
    if(game_state == 'play'){
        if(event.key == 'w' && snake.facing != 'south')snake.input_buffer = 'north'
        if(event.key == 'a' && snake.facing != 'east')snake.input_buffer = 'west'
        if(event.key == 's' && snake.facing != 'north')snake.input_buffer = 'south'
        if(event.key == 'd' && snake.facing != 'west')snake.input_buffer = 'east'
    }
    //inputs go through a buffer so you cant turn multiple times between game loops
};

//welcome screen
clear_screen();
ctx.fillStyle = 'white'
ctx.font=`${canvas.width*(1/14)}px sans-serif`;
ctx.fillText('Welcome to Snake!', canvas.width*(1/5) ,canvas.height*(1/2), canvas.width*(3/5));
ctx.font=`${canvas.width*(1/21)}px sans-serif`;
ctx.fillText('press any button to start playing', canvas.width*(1/5) ,canvas.height*(2/3), canvas.width*(3/5));
ctx.stroke();