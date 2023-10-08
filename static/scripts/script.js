document.addEventListener('DOMContentLoaded', function() {

    var cells = document.querySelectorAll('.sudoku_cel');
    cells.forEach(function(cell) {
        cell.addEventListener('click', function() {
            this.contentEditable = true;
            this.focus();
        });
    
        cell.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault(); 
                var value = this.textContent.trim();
                if (isNaN(value) || value === '' || value < 1 || value > 9) {
                    alert('Insira um valor válido de 1 a 9!');
                    this.textContent = '';
                } else {
                    this.contentEditable = false;
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
            alert("Parabéns, você completou o Sudoku!");
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
                gridRow.push(value);
            }
    
            gridData.push(gridRow);
        }
    
        return gridData;
    }

    function verifySolution () {
        fetch('/check_solution', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify( {grid:getGridData( )} )
        })
        .then(function(response) {
            console.log(response);
            return response.json(); 
        })
        .catch(function(error) {
            console.error('Erro:', error);
        });
    }
    updateSudokuStatus();
});
