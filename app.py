from create_matrix import CreateMatrix
from display_matrix import DisplayMatrix
from flask import Flask, render_template, request, redirect, url_for, flash, session

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
    display.Reveal_Numbers(80)
    grid_data = display.Get_Grid_Data()  

    return render_template( 'index.html', grid_data = grid_data )

if __name__ == "__main__":
    #homepage()
    app.run( debug = True )