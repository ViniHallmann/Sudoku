
class CheckMatrix:
    def __init__ ( self, SIZE, grid ):
        self.SIZE = SIZE
        self.grid = grid
        self.box_size = 3

    def Check_Column ( self, num, column, grid ):
        for row in range( 0, self.SIZE ):
            if grid[ row ][ column ] == num:
                return False
        return True
    
    def Check_Row ( self, num, row, grid ):
        for column in range( 0, self.SIZE ):
            if grid[ row ][ column ] == num:
                return False
        return True
    
    def Check_Square ( self, num, column, row, grid ):
        column_check = column - column % self.box_size
        row_check = row - row % self.box_size
        for i in range( 0, self.box_size ):
            for j in range( 0, self.box_size ):
                if grid[ i + row_check ][ j + column_check ] == num:
                    return False
        return True

    def Check_Grid ( self, num, column, row, grid ):
        return self.Check_Column( num, column, grid ) and self.Check_Row( num, row, grid ) and self.Check_Square( num, column, row, grid )

    def Is_Grid_Full ( self ):
        for row in range ( 0, self.SIZE ):
            for column in range ( 0, self.SIZE ):
                if self.grid[ row ][ column ] == 0:
                    return False
        return True
                             
    def Is_Valid_Solution( self ):
        for row in range( self.SIZE ):
            for column in range( self.SIZE ):
                #print( self.grid[row][column], end = " " )
                number = self.grid[row][column]
                if not self.Check_Grid( number, column, row, self.grid ):
                    return False
            #print ( "" )
        return True