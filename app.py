from module.create_matrix import CreateMatrix
from module.display_matrix import DisplayMatrix
from module.check_matrix import CheckMatrix
from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify

app = Flask(__name__)
SIZE = 9

@app.route("/")
def homepage():
    return render_template('index.html', grid_data=None)

@app.route("/processar", methods=['POST'])
def processar():
    difficulty = request.form.get('difficulty')
    
    matrix = CreateMatrix(SIZE)
    matrix.Initialize_Grid()
    matrix.Fill_Grid()
    display = DisplayMatrix(SIZE, matrix.grid)
    
    if difficulty == "1":
        grid_with_hidden_numbers = display.Select_Hidden_Numbers(70)
    elif difficulty == "2":
        grid_with_hidden_numbers = display.Select_Hidden_Numbers(50)
    elif difficulty == "3":
        grid_with_hidden_numbers = display.Select_Hidden_Numbers(30)

    full_grid = matrix.grid 

    return render_template('index.html', full_grid=full_grid, grid_with_hidden_numbers=grid_with_hidden_numbers)

@app.route('/check_solution', methods=['POST'])
def checkSolution():
    grid = request.json['grid']
    CM = CheckMatrix(9, grid)
    if CM.Is_Valid_Solution():
        return jsonify({'message': 'Valid Solution'}), 200
    else:
        return jsonify({'message': 'Invalid Solution'}), 200

@app.route('/number_hint', methods=['POST'])
def returnHintNumber():
    grid = request.json['grid']
    row = request.json['rowIndex']
    column = request.json['columnIndex']
    CM = CheckMatrix(9, grid)
    DM = DisplayMatrix(9, grid)
    DM.Display_Grid()
    number = CM.Get_Cell_Number(row, column)
    print(number)
    return jsonify({'number': number}), 200
if __name__ == "__main__":
    app.run(debug=True)
