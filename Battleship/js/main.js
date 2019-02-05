//VIEW
let view = {
    displayMessage: function(msg){
        let messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },
    displayHit: function(location){
        let cell = document.getElementById(location);
        cell.setAttribute("class","hit");
    },
    displayMiss: function(location){
        let cell = document.getElementById(location);
        cell.setAttribute("class","miss");
    }
};


//MODEL
let model = {
    boardSize: 7,
    numShips: 3,//кол-во размешенных
    shipLength: 3,
    shipSunk: 0, //количество потопленных кораблей

    ships: [
        ship1 = { 
            location: ["0", "0", "0"],
            hits: ["", "", ""] 
        },
        ship2 = { 
            location: ["0", "0", "0"],
            hits: ["", "", ""] 
        },
        ship3 = { 
            location: ["0", "0", "0"],
            hits: ["", "", ""] 
        }
    ],

    //передаём координаты выстрела
    fire: function(guess){
        for(let i = 0 ; i < this.numShips; i++){
            let ship  = this.ships[i];
            let index = ship.location.indexOf(guess);
            if(index >= 0){
                ship.hits[index] = "hit";
                view.displayHit(guess);
                view.displayMessage("Попадание по кораблю!");
                if(this.isSunk(ship)){
                    view.displayMessage("Вы потапили корабль пративника!!!");
                    this.shipSunk++;
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage("К сожалению, но Вы промазали!!! ");
        return false;
    },

    //потоплен ли корабль
    isSunk: function(ship){
        for(let i=0; i<this.shipLength; i++){
            if(ship.hits[i] != "hit"){
                return false;
            }
        }
        return true;
    },

    //generate ships
    generateShipLocation: function(){
        let location;
        for(let i=0; i<this.numShips; i++){
            do{
           location = this.genereteShip();
            }while(this.collision(location));
            this.ships[i].location = location;
        }
    },

    //случайные позиции корабля
    genereteShip:function(){
        let direction = Math.floor(Math.random() * 2);
        let row, col;

        if(direction === 1){
            //Сгенерируем начальную позицию для корабля по горизонтали
            row = Math.floor(Math.random() * this.boardSize);
            col =  Math.floor(Math.random() * (this.boardSize -  this.shipLength));
        }else{
            //Сгенерируем начальную позицию для корабля по вертикали
            row = Math.floor(Math.random() * (this.boardSize -  this.shipLength));
            col =  Math.floor(Math.random() * this.boardSize);
        }

        let newShipLocation = [];

        for(let i = 0; i< this.shipLength; i++){
            if(direction === 1){
                //добавить в массив для горизонтального корабля
                newShipLocation.push(row + "" + (col + i));
           
            }else{
                //добавить в массив для вертикального корабля
               newShipLocation.push((row + i) + "" + col);
            }
        }
        return newShipLocation;
    },

    //пересечение кораблей
    collision: function(location){
        for(let i = 0; i < this.shipLength; i++){
            let ship = model.ships[1];
            for(let j = 0; j < location.length; j++){
                if(ship.location.indexOf(location[j]) >= 0){
                    return true;
                }
            }
        }
        return false;
    }

};

//CONTROLLER
let controller = {
    guesses: 0,

    processGuesses: function(guess){
        let location = parceGuess(guess);
        if(location){
            this.guesses++;
            let hit =  model.fire(location);
            if(hit && model.shipSunk === model.numShips){
                view.displayMessage("Вы потапили " + model.numShips + " корабля за: " + this.guesses + " выстрелов.");
            }
        }
    }
};

function parceGuess(guess){
    let alphabet = ["A", "B","C", "D","E", "F","G"];

    if(guess === null || guess.length !== 2){
        alert("Вы ввели не верные координаты!");
    }else{
        let firstChar = guess.charAt(0); //first symbol
        let row = alphabet.indexOf(firstChar);
        let column = guess.charAt(1); //second symbol
        if(isNaN(row) || isNaN(column)  || row < 0 || row >= model.boardSize
         || column < 0 || column >= model.boardSize ){
            alert("Вы ввели не верные координаты!");
        }else{
            return row + column;
        }
    }
    return null;
}

function init(){
    //событие для мыши
    let fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;
    //событие для ENTER
    let guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyButton;

    model.generateShipLocation();

}

function handleFireButton(){
    let guessInput = document.getElementById("guessInput");
    let guess = guessInput.value;
    controller.processGuesses(guess);

    guessInput.value = "";
}

function handleKeyButton(e){
    let fireButton = document.getElementById("fireButton");
    if(e.keyCode == 13){
        fireButton.click();
        return false;
    }
}

window.onload = init;