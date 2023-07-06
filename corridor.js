const game = {
    turn: "left",
    leftWalls: 9,
    rightWalls: 9,
    leftPawn: [8, 0],
    rightPawn: [8, 16],
    board: Array(17).fill().map(()=>Array(17).fill()),
    gameOver: false
};

let currentMove = undefined;
let leftPawnImg = undefined;
let rightPawnImg = undefined;

function createBoard(){
    let board = document.querySelector('#board');
    for (let i = 0; i < 9; i++)
    {
        let row = document.createElement('tr');
        board.append(row);
        for (let j = 0; j < 9; j++)
        {
            let pawnSquare = document.createElement('td');
            pawnSquare.classList.add("pawnSquare");
            pawnSquare.setAttribute("id", `${i * 2},${j * 2}`)
            pawnSquare.addEventListener("click", movePawn);
            row.append(pawnSquare);
            if (j !== 8)
            {
                let wallSquare = document.createElement('td');
                wallSquare.classList.add("wallVertical");
                wallSquare.classList.add("wall");
                wallSquare.addEventListener("click", placeWall);
                wallSquare.setAttribute("id", `${i * 2},${j * 2 + 1}`)
                row.append(wallSquare);
            }
        }
        if (i !== 8)
        {
            row = document.createElement('tr');
            board.append(row);
            for (let j = 0; j < 9; j++)
            {
                let wallSquare = document.createElement("td");
                wallSquare.classList.add("wallAcross");
                wallSquare.classList.add("wall");
                wallSquare.addEventListener('click', placeWall);
                wallSquare.setAttribute("id", `${i * 2 + 1},${j * 2}`);
                row.append(wallSquare);
                if (j !== 8)
                {
                    let intersection = document.createElement('td');
                    intersection.classList.add('intersection');
                    intersection.classList.add("wall");
                    intersection.setAttribute("id", `${i * 2 + 1},${j * 2 + 1}`);
                    row.append(intersection);
                }
            }
        }
    }
    rightPawnImg = document.createElement("img");
    rightPawnImg.setAttribute("src", "green_pawn.png");
    document.getElementById("8,16").append(rightPawnImg);
    leftPawnImg = document.createElement("img");
    leftPawnImg.setAttribute("src", "red_pawn.png");
    document.getElementById("8,0").append(leftPawnImg);
}

function cancelWallAcross()
{
    let y = Number(currentMove.split(",")[1]);
    let x = Number(currentMove.split(",")[2]);
    game.board[y][x] = undefined;
    game.board[y][x + 1] = undefined;
    game.board[y][x + 2] = undefined;
    //console.log(`${y},${x + 1}`);
    document.getElementById(`${y},${x}`).style.backgroundColor = "silver";
    document.getElementById(`${y},${x + 1}`).style.backgroundColor = "silver";
    document.getElementById(`${y},${x + 2}`).style.backgroundColor = "silver";
}

function cancelWallVertical()
{
    let y = Number(currentMove.split(",")[1]);
    let x = Number(currentMove.split(",")[2]);
    game.board[y][x] = undefined;
    game.board[y + 1][x] = undefined;
    game.board[y + 2][x] = undefined;
    document.getElementById(`${y},${x}`).style.backgroundColor = "silver";
    document.getElementById(`${y + 1},${x}`).style.backgroundColor = "silver";
    document.getElementById(`${y + 2},${x}`).style.backgroundColor = "silver";
}

function cancelPawnMove(){
    let y = Number(currentMove.split(",")[1]);
    let x = Number(currentMove.split(",")[2]);
    let pawn = (game.turn === "left" ? game.leftPawn : game.rightPawn);
    let pawnImg = (game.turn === "left" ? leftPawnImg : rightPawnImg);
    pawn[0] = y;
    pawn[1] = x;
    document.getElementById(`${y},${x}`).append(pawnImg);
}

function cancelCurrentMove()
{
    switch(currentMove.split(",")[0])
    {
        case "wallAcross":
            cancelWallAcross();
            break;
        case "wallVertical":
            cancelWallVertical();
            break;
        case "pawnMove":
            cancelPawnMove();
            break;
        default:
            console.error("Move unknown", currentMove.split(",")[0]);
    }
    currentMove = undefined;
}

function placeWall(e)
{
    if (game.gameOver)
        return;
    if ((game.turn === 'left' && game.leftWalls <= 0) || (game.turn === 'right' && game.rightWalls <= 0))
        return;
    if (currentMove){
        cancelCurrentMove();
    }
    let coords = e.target.id.split(",");
    let y = Number(coords[0]);
    let x = Number(coords[1]);
    if (e.target.classList.contains("wallAcross"))
    {
        //console.log(coords);
        if (x === 16 || game.board[y][x] || game.board[y][x + 1] || game.board[y][x + 2])
            return;
        currentMove = `wallAcross,${y},${x}`;
        game.board[y][x] = "Wall";
        game.board[y][x + 1] = "Wall";
        game.board[y][x + 2] = "Wall";
        document.getElementById(`${y},${x}`).style.backgroundColor = "red";
        document.getElementById(`${y},${x + 1}`).style.backgroundColor = "red";
        document.getElementById(`${y},${x + 2}`).style.backgroundColor = "red";
    }
    else
    {
        if (y === 16 || game.board[y][x] || game.board[y + 1][x] || game.board[y + 2][x])
            return;
        currentMove = `wallVertical,${y},${x}`;
        game.board[y][x] = "Wall";
        game.board[y + 1][x] = "Wall";
        game.board[y + 2][x] = "Wall";
        document.getElementById(`${y},${x}`).style.backgroundColor = "red";
        document.getElementById(`${y + 1},${x}`).style.backgroundColor = "red";
        document.getElementById(`${y + 2},${x}`).style.backgroundColor = "red";
    }
}

function removeWall()
{
    if (game.turn === "left")
    {
        game.leftWalls--;
        document.getElementById("leftWallsNumber").innerText = game.leftWalls;
    }
    else
    {
        game.rightWalls--;
        document.getElementById("rightWallsNumber").innerText = game.rightWalls;
    }
}

function isMoveOneSquare(a, b)
{
    //Check that squares are next to each other
    if  (!((Math.abs(a[0] - b[0]) === 2 && Math.abs(a[1] - b[1]) === 0) ||
        (Math.abs(a[0] - b[0] === 0) && Math.abs(a[1] - b[1]) === 2)))
        return false;

    //Check that there are no walls between the two squares
    let wallPosY = a[0];
    let wallPosX = a[1];
    if (a[0] > b[0])
        wallPosY--;
    else if(a[0] < b[0])
        wallPosY++;
    else if (a[1] < b[1])
        wallPosX++;
    else if(a[1] > b[1])
        wallPosX--;
    else
        console.error("Pawn and target square are the same");
    return game.board[wallPosY][wallPosX] === undefined;
}

function isJumpingStraight(coords, pawn, opponent)
{
    //Check all three square are in same column or line
    if (!((coords[0] === pawn[0] && coords[0] === opponent[0]) || (coords[1] === pawn[1] && coords[1] === opponent[1])))
        return false;
    
    return isMoveOneSquare(coords,opponent) && isMoveOneSquare(opponent,pawn);
}

function isWallbehindOpp(pawn, opponent)
{
    let wallY = opponent[0];
    let wallX = opponent[1];
    if (pawn[0] < opponent[0])
        wallY++;
    else if (pawn[0] > opponent[0])
        wallY--;
    else if (pawn[1] < opponent[1])
        wallX++;
    else if (pawn[1] > opponent[1])
        wallX--;
    return (wallY === -1 || wallY === 17 || wallX === -1 || wallY === 17 || game.board[wallY][wallX]);
}

function isJumpingDiagonal(coords, pawn, opponent)
{
    if ((coords[0] === pawn[0] && coords[0] === opponent[0]) || (coords[1] === pawn[1] && coords[1] === opponent[1]))
        return false;
    if (!isMoveOneSquare(opponent, pawn) && !isMoveOneSquare(opponent, coords))
        return false;
    if (isWallbehindOpp(pawn, opponent))
        return true;
}

function movePawn(e)
{
    if (game.gameOver)
        return;
    if (currentMove){
        cancelCurrentMove();
    }
    let coords = e.target.id.split(",");
    let y = Number(coords[0]);
    let x = Number(coords[1]);
    coords = [y, x];
    let pawn = (game.turn === "left" ? game.leftPawn : game.rightPawn);
    let opponent = (game.turn === "right" ? game.leftPawn : game.rightPawn);

    if (opponent[0] === y && opponent[1] === x)
        return;

    if (!isMoveOneSquare(coords, pawn) && !isJumpingStraight(coords, pawn, opponent) && !isJumpingDiagonal(coords, pawn, opponent))
        return;

    currentMove = `pawnMove,${pawn[0]},${pawn[1]}`;
    pawn[0] = y;
    pawn[1] = x;
    
    let pawnImg = (game.turn === "left" ? leftPawnImg : rightPawnImg);
    document.getElementById(`${y},${x}`).append(pawnImg);
    
}

function endTurn()
{
    if (!currentMove)
        return;

    switch(currentMove.split(",")[0])
    {
        case "wallAcross":
        case "wallVertical":
            removeWall();
            break;
        default:
            //console.error("Unkown action: ", currentMove.split(",")[0])
    }
    currentMove = undefined;
    let turntext = (game.turn === "left" ? "Right to play" : "Left to play");
    document.getElementById("turn").innerText = turntext;
    game.turn = (game.turn === "left" ? "right" : "left");
    if (game.leftPawn[1] === 16)
    {
        game.gameOver = true;
        document.getElementById("gameOver").innerText = "LEFT WINS ! GG";
        document.getElementById("turn").style.display = "none";
    }
    if (game.rightPawn[1] === 0)
    {
        game.gameOver = true;
        document.getElementById("gameOver").innerText = "RIGHT WINS ! GG";
        document.getElementById("turn").style.display = "none";
    }
}

createBoard();