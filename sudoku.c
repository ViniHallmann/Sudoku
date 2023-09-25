#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <time.h>
#include <windows.h>

#define SIZE 9
#define BOX_SIZE 3
int stepsControl = 0;
void InitializeGrid( int Grid[SIZE][SIZE] ) {
    for (int row = 0; row < SIZE; row++) {
        for (int col = 0; col < SIZE; col++) {
            Grid[row][col] = 0;
        }
    }
}

void PrintSudokuGrid ( int Grid [SIZE][SIZE] ){
    system( "cls" );
    printf( "     " );
    for ( int i = 0; i < SIZE; i++){
        printf ( "%d   ", i );
    }
    printf ( "\n" );
    for ( int j = 0; j < 4*SIZE + 2; j++){
        printf ( "-");
    }
    printf ( "\n" );
    for ( int row = 0; row < SIZE; row++ ){
        if ( row == 3 || row == 6 ){
            for ( int j = 0; j < 4*SIZE + 2; j++){
                printf ( "-");
            }
            printf ( "\n" );
        }
        printf ( "%d |", row );
        for ( int column = 0; column < SIZE; column++ )
            if ( column == 2 || column == 5 ){
                printf( "%3d|", Grid[row][column] );
            }
            else {printf( "%3d ", Grid[row][column] );}
            
        printf( "\n" );
    }
}

bool CheckColumn ( int num, int column, int Grid [SIZE][SIZE] ){
    for ( int row = 0; row < SIZE; row++ ) {
        if (Grid[row][column] == num) {
            return false;
        }
    }
    return true;
}

bool CheckRow ( int num, int row, int Grid [SIZE][SIZE] ){
    for (int column = 0; column < SIZE; column++) {
        if (Grid[row][column] == num) {
            return false;
        }
    }
    return true;
}

bool CheckSquare ( int num, int column, int row, int Grid [SIZE][SIZE] ){
    int columnCheck = column - column % BOX_SIZE, rowCheck = row - row % BOX_SIZE;
    for ( int i = 0; i < BOX_SIZE; i++ ){
        for ( int j = 0; j < BOX_SIZE; j++ ){
            if ( Grid[i + rowCheck][j + columnCheck] == num ) 
                return false;
        }
    }
    return true;
}  

bool CheckGrid ( int num, int column, int row, int Grid [SIZE][SIZE] ){
    return CheckColumn( num, column, Grid ) 
        && CheckRow( num, row, Grid ) 
        && CheckSquare( num, column, row, Grid );
}

bool IsTheGridFull ( int Grid[SIZE][SIZE] ){
    for ( int row = 0; row < SIZE; row++ ) {
        for ( int column = 0; column < SIZE; column++ ) {
            if ( Grid[row][column] == 0) {
                return false;
            }
        }
    }
    return true; 
}

bool FillGrid( int Grid[SIZE][SIZE] ){
    for ( int row = 0; row < SIZE; row++ ){
        for ( int column = 0; column < SIZE; column++ ){
            if ( Grid[row][column] == 0 ){
                for ( int number = rand () % SIZE; number <= SIZE; number++ ){
                    if ( CheckGrid ( number, column, row, Grid ) ){
                        Grid[row][column] = number;
                        //stepsControl++;
                        /*if ( stepsControl % 100000 == 0 ){
                            PrintSudokuGrid ( Grid );
                        }*/
                        if ( FillGrid( Grid ) ) {
                            return true;
                        }
                        Grid[row][column] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

bool GenerateSudokuGrid( int Grid[SIZE][SIZE], int revealedNumbers ) {
    srand( time( NULL ) );
    InitializeGrid ( Grid );
    FillGrid( Grid );
    int count = 81 - revealedNumbers;
    while ( count > 0 ) {
        int row = rand() % SIZE;
        int column = rand() % SIZE;
        if ( Grid[row][column] != 0 ) {
            Grid[row][column] = 0;
            count--;
        }
    }
    return true;
}


void Play ( int Grid[SIZE][SIZE] ){
    int playerRow, playerColumn, playerNumber;
    printf( "Digite sua jogada [Linha][Coluna][Numero]: " );
    scanf( "%d %d %d", &playerRow, &playerColumn, &playerNumber );
    if ( CheckGrid ( playerNumber, playerColumn, playerRow, Grid ) ){
        Grid[playerRow][playerColumn] = playerNumber; 
    }
    system("cls");
    PrintSudokuGrid ( Grid );
}
int main(){
    int SudokuGrid[SIZE][SIZE];
    GenerateSudokuGrid( SudokuGrid, 60);
    PrintSudokuGrid ( SudokuGrid );
    printf( "%d", stepsControl );
    while ( !IsTheGridFull ( SudokuGrid ) )
        Play ( SudokuGrid );
    return 0;
}
