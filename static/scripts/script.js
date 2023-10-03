document.addEventListener('DOMContentLoaded', function() {
    var cells = document.querySelectorAll('.sudoku_cel');
    cells.forEach(function(cell) {
        cell.addEventListener('click', function() {
            this.contentEditable = true;
            this.focus();
        });
    
        cell.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault(); // Evita a quebra de linha
                var valor = this.textContent.trim();
                if (isNaN(valor) || valor === '' || valor < 1 || valor > 9) {
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