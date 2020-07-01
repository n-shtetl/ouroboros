window.onload = function() {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    const width = canvas.width = window.innerWidth;
    const height = canvas.height = window.innerHeight;

    const boxWidth = width / 50;
    const boxHeight = height / 25;

    const boardWidth = width / boxWidth;
    const boardHeight = height / boxHeight;
    
    const board = new Array(boardHeight);
    for (let i = 0; i < board.length; i++) {
        board[i] = new Array(boardWidth).fill(0);
    }

    let fps = 20;
    let curDir = 'down';
    let food = randomBoardLocation();

    

    class SnakeNode {
        constructor(x,y) {
            this.x = x;
            this.y = y;
            this.next = null;
        }
    }

    class Snake {
        constructor(tail) {
            this.tail = tail;
            let curNode = tail;
            while (curNode.next !== null) {
                curNode = curNode.next;
            }
            this.head = curNode;
        }
    }

    let head = new SnakeNode(Math.floor(boardWidth/2), Math.floor(boardHeight/2));
    let mid1 = new SnakeNode(Math.floor(boardWidth/2), Math.floor(boardHeight/2)-1);
    let mid2 = new SnakeNode(Math.floor(boardWidth/2), Math.floor(boardHeight/2)-2);
    let tail = new SnakeNode(Math.floor(boardWidth/2), Math.floor(boardHeight/2)-3);      
    tail.next = mid2;
    mid2.next = mid1;
    mid1.next = head;
 
    let player = new Snake(tail);
    
    document.body.addEventListener('keydown', (event) => {
        switch(event.keyCode) {
            case 38: 
                curDir = 'up';
                break;
            case 40:
                curDir = 'down'
                break;
            case 37: 
                curDir = 'left'
                break;
            case 39: 
                curDir = 'right';
                break;
        }
    })

    function updateSnake(snake) {
        let curNode = snake.tail;
        while (curNode.next !== null) {
            let [x,y] = [curNode.next.x,curNode.next.y]
            curNode.x = x;
            curNode.y = y;
            curNode = curNode.next;
        }
        switch(curDir) { 
            case 'right':
                snake.head.x += 1;
                break;
            case 'left':
                snake.head.x -= 1;
                break;
            case 'up':
                snake.head.y -= 1;
                break;
            case 'down':
                snake.head.y += 1;
                break;
            default:
                break;
        }
        if (snakeAte(snake.head)) {
            food = randomBoardLocation();
            fps += 1;
            fattenSnake(snake);
        };
    }

    function fattenSnake(snake) {
        let newTail;
        switch(curDir) { 
            case 'right':
                newTail = new SnakeNode(snake.tail.x-1, snake.tail.y)
                break;
            case 'left':
                newTail = new SnakeNode(snake.tail.x+1, snake.tail.y)
                break;
            case 'up':
                newTail = new SnakeNode(snake.tail.x+1, snake.tail.y)
                break;
            case 'down':
                newTail = new SnakeNode(snake.tail.x-1, snake.tail.y)
                break;
            default:
                break;
        }
        newTail.next = snake.tail;
        snake.tail = newTail;
    }

    function snakeAte(head) {
        return head.x === food[0] && head.y === food[1];
    }

    function drawSnake(player) {
        let curNode = player.tail;
        while (curNode !== null) {
            context.fillStyle = 'black';
            context.fillRect(curNode.x*boxWidth, curNode.y*boxHeight,boxWidth,boxHeight);
            context.fillStyle = 'white';
            context.fillRect(curNode.x*boxWidth, curNode.y*boxHeight,boxWidth-5,boxHeight-5);
            curNode = curNode.next;
        }
    }

    function randomBoardLocation() {
        return [Math.floor(Math.random() * boardWidth), Math.floor(Math.random() * boardHeight)];
    }

    function drawFood(food) {
        context.fillStyle = 'red';
        context.fillRect(food[0]*boxWidth, food[1]*boxHeight, boxWidth, boxHeight);
        context.fillStyle = 'white';
        context.fillRect(food[0]*boxWidth, food[1]*boxHeight,boxWidth-5,boxHeight-5);

    }
    
    update();

    function update() {
        setTimeout(function() {
            context.clearRect(0,0,width,height);
            updateSnake(player);
            drawSnake(player);
            drawFood(food);
            
            requestAnimationFrame(update)
        }, 1000 / fps);
    }
}