from create_matrix import CreateMatrix
from display_matrix import DisplayMatrix
from check_matrix import CheckMatrix
from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify

app = Flask(__name__)
SIZE = 9

@app.route("/")
def homepage():
    matrix = CreateMatrix(SIZE)
    matrix.Initialize_Grid()
    matrix.Fill_Grid()
    grid_data = matrix.grid 
    return render_template('index.html', grid_data = grid_data)

@app.route("/processar", methods=['POST'])
def processar():
    difficulty = request.form.get('difficulty')
    
    matrix = CreateMatrix(SIZE)
    matrix.Initialize_Grid()
    matrix.Fill_Grid()
    display = DisplayMatrix(SIZE, matrix.grid)

    if difficulty == "1":
        display.Reveal_Numbers(70)
    elif difficulty == "2":
        display.Reveal_Numbers(50)
    elif difficulty == "3":
        display.Reveal_Numbers(30)

    grid_data = matrix.grid 

    return render_template('index.html', grid_data=grid_data)

@app.route('/check_solution', methods=['POST'])
def checkSolution():
    grid = request.json['grid']
    CM = CheckMatrix(9, grid)
    if CM.Is_Valid_Solution():
        return jsonify({'message': 'Valid Solution'}), 200
    else:
        return jsonify({'message': 'Invalid Solution'}), 200
"""
@app.route( '/check_number', methods=['POST'] )
def checkNumber():
    grid = request.json['grid']
    num = request.json['num']
    row = request.json['row']
    column = request.json['column']
    CM = CheckMatrix(9, grid)
    if CM.Check_Grid(num, column, row, grid):
        print("Número válido")
        return jsonify( { 'message': 'Valid Number' } ), 200
    else:
        print("Número inválido")
        return jsonify( { 'message': 'Invalid Number' } ), 200
"""

if __name__ == "__main__":
    app.run(debug=True)
