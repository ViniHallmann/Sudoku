document.addEventListener('DOMContentLoaded', function() {
    var annotationMode = false;
    //Salva a dificuldade no local storage
    var savedDifficulty = localStorage.getItem('dificulty');
    //Verifica se existe uma dificuldade salva
    if (savedDifficulty) {
        document.getElementById('difficulty').value = savedDifficulty;
    }
    //Salva a dificuldade selecionada
    document.getElementById('difficulty').addEventListener('change', function() {
        localStorage.setItem('dificulty', this.value);
    });
    //Pega as celulas do sudoku
    var cells = document.querySelectorAll('.sudoku-cell');
    cells.forEach(function(cell) {
        //Evento de input que verifica se o valor é valido
        cell.addEventListener('input', function() { 
            var content = this.textContent.trim();
            if (content.length > 1 || !/^[1-9]$/.test(content)) {
                this.textContent = '';
            }
        });
        //Evento de click que seleciona a celula
        cell.addEventListener('click', function() {
            //Reseta as celulas
            cells.forEach(function(c) {
                c.classList.remove('selected-cell');
                c.classList.remove('primary-cell');
            });
            //Seleciona a celula para ser a primary (cor verde)
            this.classList.add('primary-cell');

            //Seleciona a linha e adiciona a classe selected-cell
            var cellsInRow = Array.from(this.parentNode.children);
            cellsInRow.forEach(function(rowCell) {
                if (!rowCell.classList.contains('primary-cell')){
                    rowCell.classList.add('selected-cell');
                }
            });
            //Seleciona a coluna e adiciona a classe selected-cell
            var selectedCellColIndex = Array.from(this.parentNode.children).indexOf(this);
            //Itera sobre cada celula e adiciona aquelas que possuem o mesmo index de coluna da celula selecionada
            cells.forEach(function(cell) {
                if (Array.from(cell.parentNode.children).indexOf(cell) === selectedCellColIndex && !cell.classList.contains('primary-cell') ) {
                    cell.classList.add('selected-cell');
                }
            });
            //Seleciona a linha da celula selecionada
            var selectedCellRowIndex = Array.from(this.parentNode.parentNode.children).indexOf(this.parentNode);
            /*
            Itera sobre cada celula e adiciona as celulas ao quadrado que a celula selecionada pertence
            
              0 1 2   3 4 5   6 7 8
            0 0 0 0 | 0 0 0 | 0 0 0
            1 0 0 0 | 0 0 0 | 0 0 0
            2 0 0 0 | 0 0 0 | 0 0 0

             Por exemplo nesse caso aqui, vamos usar a celula (linha: 0, coluna: 0). 

             Agora olhando para funcao forEach abaixo, ela vai pegar o valor de linha e coluna de cada celula 
             e fazer o calculo dividindo por 3 a linha e coluna de cada celula que foi iterada e comparar com o resultado da celula exemplo
             O calculo: Arredondar para baixo(index/3) e se o resultado for igual a celula exemplo, entao a celula pertence ao quadrado da celula exemplo

             A celula exemplo vai resultar em 0/3 e 0/3 -> (0,0) ja a celula da iteracao tambem vai resultar em 0/3 e 0/3 -> (0,0)
             agora se pegarmos outra celula da iteracao = (linha: 1, coluna: 1)
             1/3 e 1/3 -> (0.333,0.333) arredondando para baixo fica (0,0) o que fica igual a celula exemplo
             agora outra celula da iteracao = (linha: 2, coluna: 2)
             2/3 e 2/3 -> (0.666,0.666) arredondando para baixo fica (0,0), tambem pertence ao quadrado da celula exemplo
             por ultimo se pegarmos mais uma celula da iteracao = (linha: 3, coluna: 3)
            3/3 e 3/3 -> (1,1) arredondando para baixo fica (1,1) que nao pertence ao quadrado da celula exemplo
            */
            cells.forEach(function(cell) {
                var cellRowIndex = Array.from(cell.parentNode.parentNode.children).indexOf(cell.parentNode);
                var cellColIndex = Array.from(cell.parentNode.children).indexOf(cell);
        
                if (Math.floor(selectedCellRowIndex / 3) === Math.floor(cellRowIndex / 3) && Math.floor(selectedCellColIndex / 3) === Math.floor(cellColIndex / 3) && !cell.classList.contains('primary-cell')) {
                    cell.classList.add('selected-cell');
                }
            });
            isSudokuComplete();
        });

        cell.addEventListener('input', function() {
            handleCellConflict(this);
        });

        cell.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault(); 
                var value = this.textContent.trim();
                if (isNaN(value) || value === '') {
                    this.textContent = '';
                } else {
                    this.contentEditable = true;
                }
                handleCellConflict(this);
            }
            if ( event.key === 'Backspace' || event.key === 'Delete'){ // se usar backspace ou del 
                this.textContent = '';  // zera a cell 
                handleCellConflict(this); // verifica conflitos 
            }
        });
        
        cell.addEventListener('blur', function() {
            handleCellConflict(this);
        });
    });

    function verifyCell(cell){
        isValidRow(cell);
        isValidColumn(cell);
        isValidSquare(cell);
        isSudokuComplete();
    }

    function handleCellConflict(cell) {
        removeConflict();
        resetToWhiteColor(cell);
        verifyCell(cell);
    }

    function isSudokuComplete() { // funcao que testa se o sudoku esta completo 
        var isComplete = true;
        cells.forEach(function(cell) {
            if (cell.textContent === " ") { // se achar alguma vazia n esta
                isComplete = false;
            }
        });
        if (isComplete){
            verifySolution(); // verifica se eh uma solucao valida
            // existe mais de uma solucao possivel
        }
        return isComplete;
    }

    function getGridData() {
        var sudokuTable = document.getElementById('sudoku-table');
        var gridData = [];
    
        for (var i = 0; i < sudokuTable.rows.length; i++) {
            var row = sudokuTable.rows[i];
            var gridRow = [];

            for (var j = 0; j < row.cells.length; j++) {
                var cell = row.cells[j];
                var value = cell.textContent.trim(); 
                gridRow.push(parseInt(value));
            }
            gridData.push(gridRow);
        }
        return gridData;
    }

    function verifySolution() {
        fetch('/check_solution', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ grid: getGridData() })
        })
        .then(function(response) {
            if (response.ok) {
                return response.json();
            }
        })
        .then(function(data) {
            if (data.message === 'Valid Solution') {
                //alert('Parabens voce completou o sudoku!!');
            } else if (data.message === 'Invalid Solution') {
                //alert('Solução inválida.');
            } 
        })
    }
    function resetToWhiteColor( cell ){
        cell.classList.remove('red-number');
    }
    function removeConflict(){
        cells.forEach( function(c) {
            c.classList.remove('red-number');
            verifyCell(c);
        }); 
    }
    function isValidRow( cell ){
        var row = cell.parentNode;
        var rowCells = Array.from(row.children);
        for ( i = 0; i < rowCells.length; i++){
            for ( j = i + 1; j < rowCells.length; j++){
                if (rowCells[i].textContent.trim() === rowCells[j].textContent.trim() && rowCells[i].textContent.trim() !== ''){
                    rowCells[i].classList.add('red-number');
                    rowCells[j].classList.add('red-number');
                }
            }
        } 
    }
    
    function isValidColumn(cell){
        var column = cell.parentNode;
        var colIndex = Array.from(column.children).indexOf(cell);
        var colCells = new Array();
        cells.forEach(function(c) {
            var rowIndex = Array.from(c.parentNode.children).indexOf(c);
            if (rowIndex === colIndex) {
                colCells.push(c);
            }
        });
        for ( i = 0; i < colCells.length; i++){
            for ( j = i + 1; j < colCells.length; j++){
                if (colCells[i].textContent.trim() === colCells[j].textContent.trim() && colCells[i].textContent.trim() !== ''){
                    colCells[i].classList.add('red-number');
                    colCells[j].classList.add('red-number');
                }
            }
        }
    }

    function isValidSquare(cell){
        var rowIndex = Array.from(cell.parentNode.parentNode.children).indexOf(cell.parentNode);
        var colIndex = Array.from(cell.parentNode.children).indexOf(cell);
        
        var startRowIndex = Math.floor(rowIndex / 3) * 3;
        var startColIndex = Math.floor(colIndex / 3) * 3;
        var squareCells = new Array();
        for (i = startRowIndex; i < startRowIndex + 3; i++){
            for (j = startColIndex; j < startColIndex + 3; j++){
                var currentCell = cell.parentNode.parentNode.children[i].children[j];
                squareCells.push(currentCell);
            }
        }
        for (i = 0; i < squareCells.length; i++){
            for (j = i + 1; j < squareCells.length; j++){
                if (squareCells[i].textContent.trim() === squareCells[j].textContent.trim() && squareCells[i].textContent.trim() !== ''){
                    squareCells[i].classList.add('red-number');
                    squareCells[j].classList.add('red-number');
                }
            }
        }
    }

    document.querySelectorAll('.btn-number').forEach(function(button) {
        button.addEventListener('click', function() {
            var number = this.textContent;
            addNumberToCell(number);
        });
    });

    document.querySelector('.btn-remove').addEventListener('click', function() {
        removeNumberFromCell();
    });

    document.querySelector('.btn-hint').addEventListener('click', function() {
        hint();
    });

    document.querySelector('.btn-notes').addEventListener('click', function() {
        notes();
    });
    
    function addNumberToCell(number) {
        var selectedCell = document.querySelector('.primary-cell');
        if (selectedCell && !selectedCell.classList.contains('default-cell')) {  // se a celula nao for default
            if (annotationMode) {
                // Adicionar número à grade de anotações
                var annotationGrid = selectedCell.querySelector('.annotation-grid');
                if (!annotationGrid) {
                    // Criar a grade de anotações se ainda não existir
                    annotationGrid = document.createElement('div');
                    annotationGrid.classList.add('annotation-grid');
                    selectedCell.appendChild(annotationGrid);
                }
                var annotationCell = document.createElement('div');
                annotationCell.classList.add('annotation-cell');
                annotationCell.textContent = number;
                annotationGrid.appendChild(annotationCell);
            } else {
                // Adicionar número à célula principal
                selectedCell.textContent = number;
            }
            handleCellConflict(selectedCell);  // verifica conflitos 
        }
    }

    function notes(){
        annotationMode = !annotationMode;
        console.log('Modo de anotação:', annotationMode);
    }

    function removeNumberFromCell() {
        var selectedCell = document.querySelector('.primary-cell');
        if (selectedCell && !selectedCell.classList.contains('default-cell')) { // se a celula nao for default
            selectedCell.textContent = ''; // remove e deixa vazio 
            handleCellConflict(selectedCell); // verifica novos conflitos 
        }
    }

    function hint(){
        var selectedCell = document.querySelector('.primary-cell');
        var selectedCellColIndex = Array.from(selectedCell.parentNode.children).indexOf(selectedCell);
        var selectedCellRowIndex = Array.from(selectedCell.parentNode.parentNode.children).indexOf(selectedCell.parentNode)
        var bodyElement = document.querySelector('body');
        var fullGridData = JSON.parse(bodyElement.getAttribute('data-full-grid'));
        if (selectedCell && !selectedCell.classList.contains('default-cell') && selectedCell.textContent === ' '){
            selectedCell.textContent = fullGridData[selectedCellRowIndex][selectedCellColIndex];
            handleCellConflict(selectedCell);
        }
        console.log(fullGridData);
    }

// funcao do contador ( cronometro )
var timer;
var ele = document.getElementById('timer'); // var usada no startTimer pra formatar
var sec = 0;
var min = 0; 

function startTimer() {
  timer = setInterval(() => {
    if (sec == 60) {
      min++;
      sec = 0; // reinicia os segundos quando chegar a 60
    }
    var formattedSec = sec < 10 ? '0' + sec : sec;
    var formattedMin = min < 10 ? '0' + min : min;
    ele.innerHTML = formattedMin + ':' + formattedSec;
    sec++;
  }, 1000); // a cada 1 segundo
}

function pause() { // pausa o timer 
  clearInterval(timer);
}

// Pausa o timer quando a janela perde o foco
window.onblur = function() {
  pause();
};

// Retoma o timer quando a janela recupera o foco
window.onfocus = function() {
if (window.location.pathname === '/processar')
    startTimer();
};


// Inicia o timer somente se estiver no endereço que possui algum jogo
// nao inicia na pag inicial 

if (window.location.pathname === '/processar') {
    // Execute sua função aqui
    startTimer();
}
//startTimer();

});


