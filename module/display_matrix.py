from random import randint
import copy
class DisplayMatrix:
    
    def __init__( self, SIZE, grid ):
        self.SIZE = SIZE   
        self.grid = grid

    def Display_Grid( self ):
        #os.system( "cls" )
        print( "     ", end="" )
        for i in range(  self.SIZE ) :
            print( f"{i}   ", end="" )
        print( "\n", end="" )
        
        for j in range( 4 *  self.SIZE + 2) :
            print( "-", end="" )
        print( "\n", end="" )
        
        for row in range(  self.SIZE ) :
            if row == 3 or row == 6:
                for j in range( 4 *  self.SIZE + 2) :
                    print( "-", end="" )
                print( "\n", end="" )
            
            #print( f"{row} |", end="" )
            for column in range( self.SIZE  ):
                if column == 2 or column == 5:
                    print( f"{self.grid[row][column]}|", end="" )
                else:
                    print( f"{self.grid[row][column]} ", end="" )
            print( "\n", end="" )
            #time.sleep(0.1)

    def Select_Hidden_Numbers(self, qtd):
        count = 81 - qtd
        grid_data = []
        while ( count > 0 ):
            row = randint( 0, self.SIZE - 1 )
            column = randint( 0, self.SIZE - 1 )
            if self.grid[row][column] != ' ': 
                grid_data.append([row, column, self.grid[row][column]])
                count-= 1
        return self.Hide_Numbers(self.grid, grid_data)
    
    def Hide_Numbers(self, full_grid, hidden_numbers):
        grid_data = copy.deepcopy(full_grid)
        for number in hidden_numbers:
            grid_data[number[0]][number[1]] = ' '
        
        return grid_data

    def Get_Grid_Data(self):
        grid_data = []
        for row in range(self.SIZE):
            row_data = []
            for column in range(self.SIZE):
                row_data.append(self.grid[row][column])
            grid_data.append(row_data)
        return grid_data