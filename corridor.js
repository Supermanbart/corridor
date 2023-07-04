const game = {
    turn: "left",
    leftWalls: 9,
    rightWalls: 9,
    leftPawn: [8, 0],
    rightPawn: [8, 16],
    board: Array(17).fill().map(()=>Array(17).fill())
}

let currentMove = undefined;
let leftPawn = undefined;
let rightPawn = undefined;

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
    rightPawn = document.createElement("img");
    rightPawn.setAttribute("src", "green_pawn.png");
    document.getElementById("8,16").append(rightPawn);
    leftPawn = document.createElement("img");
    leftPawn.setAttribute("src", "red_pawn.png");
    document.getElementById("8,0").append(leftPawn);
}

function cancelWallAcross()
{
    let y = Number(currentMove.split(",")[1]);
    let x = Number(currentMove.split(",")[2]);
    game.board[y][x] = undefined;
    game.board[y][x + 1] = undefined;
    game.board[y][x + 2] = undefined;
    console.log(`${y},${x + 1}`);
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
        default:
            console.error("Move unknown", currentMove.split(",")[0]);
    }
}

function placeWall(e)
{
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
            console.error("Unkown action: ", currentMove.split(",")[0])
    }
    currentMove = undefined;
    let turntext = (game.turn === "left" ? "Right to play" : "Left to play");
    document.getElementById("turn").innerText = turntext;
    game.turn = (game.turn === "left" ? "right" : "left");
}

createBoard();