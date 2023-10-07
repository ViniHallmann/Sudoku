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
        var tabela = document.getElementById('sudoku_table');
        var dadosDoGrid = [];
    
        for (var i = 0; i < tabela.rows.length; i++) {
            var linha = tabela.rows[i];
            var linhaDoGrid = [];

            for (var j = 0; j < linha.cells.length; j++) {
                var celula = linha.cells[j];
                var valor = celula.textContent.trim(); 
                linhaDoGrid.push(valor);
            }
    
            dadosDoGrid.push(linhaDoGrid);
        }
    
        return dadosDoGrid;
    }

    function verifySolution () {
        var dados = getGridData();
        
        var dadosParaEnviar = {
            grid: dados
        };
        fetch('/check_solution', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosParaEnviar)
        })
        .then(function(response) {
            console.log(response);
            return response.json(); // Analisa a resposta JSON do servidor
        })
        .then(function(data) {
            // Manipule o resultado retornado pelo servidor (data)
            console.log(data.resultado);
        })
        .catch(function(error) {
            // Lide com erros, se houver algum
            console.error('Erro:', error);
        });
    }
    updateSudokuStatus();
});
