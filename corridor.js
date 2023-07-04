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
            row.append(pawnSquare);
            if (j !== 8)
            {
                let wallSquare = document.createElement('td');
                wallSquare.classList.add("wallVertical");
                wallSquare.classList.add("wall");
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
                row.append(wallSquare);
                if (j !== 8)
                {
                    let intersection = document.createElement('td');
                    intersection.classList.add('intersection');
                    intersection.classList.add("wall");
                    row.append(intersection);
                }
            }
        }
    }
}

createBoard();