from random import randint
class DisplayMatrix:
    
    def __init__( self, SIZE, grid ):
        self.SIZE = SIZE   
        self.grid = grid

    """def Display_Grid( self ):
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
                    print( f"{self.grid[row][column]:3d}|", end="" )
                else:
                    print( f"{self.grid[row][column]:3d} ", end="" )
            print( "\n", end="" )
            #time.sleep(0.1)"""

    def Reveal_Numbers( self, qtd ):
        count = 81 - qtd
        while ( count > 0 ):
            row = randint( 0, self.SIZE - 1 )
            column = randint( 0, self.SIZE - 1 )
            if self.grid[row][column] != ' ': 
                self.grid[row][column] = ' '
                count-= 1

    def Get_Grid_Data(self):
        grid_data = []
        for row in range(self.SIZE):
            row_data = []
            for column in range(self.SIZE):
                row_data.append(self.grid[row][column])
            grid_data.append(row_data)
        return grid_data