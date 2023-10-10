from create_matrix import CreateMatrix
from display_matrix import DisplayMatrix
from check_matrix import CheckMatrix
from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify

app = Flask(__name__)

@app.route("/")
def homepage():
    SIZE = 9
    matrix = CreateMatrix(SIZE)
    matrix.Initialize_Grid()
    matrix.Fill_Grid()

    display = DisplayMatrix(SIZE, matrix.grid)
    display_answer = DisplayMatrix(SIZE, matrix.grid)
    display.Reveal_Numbers(80)

    return render_template('index.html', grid_data=display.Get_Grid_Data())

@app.route('/processar', methods=['POST'])
def option():
    data = request.get_json()
    difficulty = data.get('difficulty')
    SIZE = 9
    matrix = CreateMatrix(SIZE)
    matrix.Initialize_Grid()
    matrix.Fill_Grid()
    
    display = DisplayMatrix(SIZE, matrix.grid)
    
    if difficulty == 1:
        print('FÁCIL')
        display.Reveal_Numbers(70)
    elif difficulty == 2:
        display.Reveal_Numbers(50)
    elif difficulty == 3:
        display.Reveal_Numbers(30)
    
    grid_data = display.Get_Grid_Data()
    
    return jsonify(grid_data=grid_data)


@app.route('/check_solution', methods=['POST'])
def checkSolution():
    grid = request.json['grid']
    CM = CheckMatrix(9, grid)
    
    if CM.Is_Valid_Solution():
        return jsonify({'message': 'Valid Solution'}), 200
    else:
        return jsonify({'message': 'Invalid Solution'}), 200

if __name__ == "__main__":
    app.run(debug=True)
