document.addEventListener('DOMContentLoaded', function() {

    var cells = document.querySelectorAll('.sudoku_cel');
    cells.forEach(function(cell) {
        cell.addEventListener('input', function() { // Função para testar os caracteres e só permitir 1 por vez
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
                rowCell.classList.add('selected-cell');
            });
            cells.forEach(function(colCell) {
                if (Array.from(colCell.parentNode.children).indexOf(colCell) === cellIndex) {
                    colCell.classList.add('selected-cell');
                }
            });
        });
    
        cell.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault(); 
                var value = this.textContent.trim();
                if (isNaN(value) || value === '') {
                    alert('Por favor, insira um valor!');
                    this.textContent = '';
                } else {
                    this.contentEditable = true;
                }
                updateSudokuStatus();
                isSudokuComplete();
            }
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

        if (filledCells === cells.length) {
            filledCellsElement.textContent = "Sudoku completo";
        } else {
            filledCellsElement.textContent = `${filledCells}/${totalCells} `;
        }
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
        var sudokuTable = document.getElementById('sudoku_table');
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

    function printGridData() {
        var gridData = getGridData();
        console.log(gridData);
    }

    function verifySolution() {
        printGridData();
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
                // alert("");
                alert('Parabens voce completou o sudoku!!');
            } else if (data.message === 'Invalid Solution') {
                alert('Solução inválida.');
            } 
        })
    }
    
    updateSudokuStatus();
    cells.setAttribute('contentEditable', 'true');
});
