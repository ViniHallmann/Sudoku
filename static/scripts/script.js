document.addEventListener('DOMContentLoaded', function() {
    var cells = document.querySelectorAll('.sudoku_cel');
    cells.forEach(function(cell) {
        cell.addEventListener('click', function() {
            var valor = prompt('Insira um valor:');
            if (isNaN(valor)) {
                alert('Insira um valor válido!');
            }
            else{
                this.textContent = valor;
            }
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

        if (filledCells === cells.length) {
            filledCellsElement.textContent = "Sudoku completo";
        } else {
            filledCellsElement.textContent = `${filledCells}/${totalCells} `;
        }
        updateSudokuStatus();
    }
    
    function isSudokuComplete() {
        var isComplete = true;
        cells.forEach(function(cell) {
            if (cell.textContent === " ") {
                isComplete = false;
            }
        });
        if (isComplete){
            alert("Parabéns, você completou o Sudoku!");
        }
        return isComplete;
    }
    updateSudokuStatus();
});