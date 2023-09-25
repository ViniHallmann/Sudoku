from create_matrix import CreateMatrix
from display_matrix import DisplayMatrix


def main():
    SIZE = 9
    matrix = CreateMatrix(SIZE)
    matrix.Initialize_Grid()
    matrix.Fill_Grid()

    display = DisplayMatrix(SIZE, matrix.grid)
    display.Display_Grid()


if __name__ == "__main__":
    main()