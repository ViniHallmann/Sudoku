from create_matrix import CreateMatrix
from display_matrix import DisplayMatrix
from check_matrix import CheckMatrix
from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify

app =  Flask(__name__)
#Toda pagina tem um route e uma função
@app.route("/")
def homepage():
    SIZE = 9
    matrix = CreateMatrix(SIZE)
    matrix.Initialize_Grid()
    matrix.Fill_Grid()

    display = DisplayMatrix(SIZE, matrix.grid)
    display_answer = DisplayMatrix(SIZE, matrix.grid)
    display.Reveal_Numbers(79)
    grid_data = display.Get_Grid_Data()  
    print("GRID COM NUMEROS ESCONDIDOS")
    for i in range (9):
        print(grid_data[i])
    return render_template( 'index.html', grid_data = grid_data )

@app.route( '/check_solution', methods=['POST'] )
def checkSolution():
    grid = request.json['grid']
    CM = CheckMatrix(9, grid)
    if CM.Is_Valid_Solution():
        print("Solução válida")
        return jsonify( { 'message': 'Valid Solution' } ), 200
    else:
        print("Solução inválida")
        return jsonify( { 'message': 'Invalid Solution' } ), 200
    
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

if __name__ == "__main__":
    #homepage()
    app.run( debug = True )