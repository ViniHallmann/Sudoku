document.addEventListener('DOMContentLoaded', function() {
    
    var savedDifficulty = localStorage.getItem('dificulty');
    if (savedDifficulty) {
        document.getElementById('difficulty').value = savedDifficulty;
    }
    document.getElementById('difficulty').addEventListener('change', function() {
        localStorage.setItem('dificulty', this.value);
    });
    var cells = document.querySelectorAll('.sudoku-cell');
    cells.forEach(function(cell) {
        cell.addEventListener('input', function() { 
            var content = this.textContent.trim();
            if (content.length > 1 || !/^[1-9]$/.test(content)) {
                this.textContent = '';
            }
        });
        
        cell.addEventListener('click', function() {
            cells.forEach(function(c) {
                c.classList.remove('selected-cell');
                c.classList.remove('primary-cell');
            });

            this.classList.add('primary-cell');
            var cellIndex = Array.from(this.parentNode.children).indexOf(this);
            var rowCells = Array.from(this.parentNode.children);
            
            rowCells.forEach(function(rowCell) {
                if (!rowCell.classList.contains('primary-cell')){
                    rowCell.classList.add('selected-cell');
                }
            });
        
            cells.forEach(function(colCell) {
                if (Array.from(colCell.parentNode.children).indexOf(colCell) === cellIndex && !colCell.classList.contains('primary-cell') ) {
                    colCell.classList.add('selected-cell');
                }
            });

            var rowIndex = Array.from(this.parentNode.parentNode.children).indexOf(this.parentNode);
            var colIndex = Array.from(this.parentNode.children).indexOf(this);

            cells.forEach(function(squareCell) {
                var squareRowIndex = Array.from(squareCell.parentNode.parentNode.children).indexOf(squareCell.parentNode);
                var squareColIndex = Array.from(squareCell.parentNode.children).indexOf(squareCell);
        
                if (Math.floor(rowIndex / 3) === Math.floor(squareRowIndex / 3) && Math.floor(colIndex / 3) === Math.floor(squareColIndex / 3) && !squareCell.classList.contains('primary-cell')) {
                    squareCell.classList.add('selected-cell');
                }
            });
            updateSudokuStatus();
            isSudokuComplete();
        });

        cell.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault(); 
                var value = this.textContent.trim();
                if (isNaN(value) || value === '') {
                    //alert('Por favor, insira um valor!');
                    this.textContent = '';
                } else {
                    this.contentEditable = true;
                }
                isValidRow(this);
                isValidColumn(this);
                removeConflict();
                resetToWhiteColor(this);
                updateSudokuStatus();
                isSudokuComplete();
            }
            if ( event.key === 'Backspace' || event.key === 'Delete'){
                this.textContent = '';
                isValidRow(this);
                isValidColumn(this);
                removeConflict();
                resetToWhiteColor(this);
                updateSudokuStatus();
                isSudokuComplete();
            }
        });
        
        cell.addEventListener('blur', function() {
            isValidRow(this);
            isValidColumn(this);
            updateSudokuStatus();
            isSudokuComplete();
        });
    });

    function updateSudokuStatus() {
        var filledCells = 0;
        cells.forEach(function(cell) {
            if (cell.textContent !== " ") {
                filledCells++;
            }
        });
        var totalCells = cells.length;
        var filledCellsElement = document.getElementById("filled_cells");
        /*
        if (filledCells === cells.length) {
            filledCellsElement.textContent = "Sudoku completo";
        } else {
            filledCellsElement.textContent = `${filledCells}/${totalCells} `;
        }*/
    }
    
    function isSudokuComplete() {
        var isComplete = true;
        cells.forEach(function(cell) {
            if (cell.textContent === " ") {
                isComplete = false;
            }
        });
        if (isComplete){
            verifySolution();
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
            console.log(data);
            if (data.message === 'Valid Solution') {
                alert('Parabens voce completou o sudoku!!');
            } else if (data.message === 'Invalid Solution') {
                alert('Solução inválida.');
            } 
        })
    }
    function resetToWhiteColor( cell ){
        cell.classList.remove('red-number');
    }
    function removeConflict(){
        cells.forEach( function(c) {
            c.classList.remove('red-number');
            isValidRow(c);
            isValidColumn(c);
        }); 
    }
    function isValidRow( cell ){
        var row = cell.parentNode;
        var rowCells = Array.from(row.children);
        for ( i = 0; i < rowCells.length; i++){
            for ( j = i + 1; j < rowCells.length; j++){
                if (rowCells[i].textContent.trim() === rowCells[j].textContent.trim()){
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
                if (colCells[i].textContent.trim() === colCells[j].textContent.trim()){
                    colCells[i].classList.add('red-number');
                    colCells[j].classList.add('red-number');
                }
            }
        }
    }
    
    updateSudokuStatus();
    
});
/* 
    document.querySelector('.button-easy').addEventListener('click', function() {
        fetch('/processar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ difficulty: 1 }) // Envie a dificuldade como JSON
        })
        .then(function(response) {
            if (response.ok) {
                return response.json();
            }
        })
        .then(function(data) {
            // Atualize o grid na página HTML com os dados atualizados
           //  updateGrid(data.grid_data);
        });
    });
    

    
    
    document.querySelector('.button-medium').addEventListener('click', function() {
        alert('Você clicou no botão "Médio"');
    });
    
    document.querySelector('.button-hard').addEventListener('click', function() {
        alert('Você clicou no botão "Difícil"');
    });
*/