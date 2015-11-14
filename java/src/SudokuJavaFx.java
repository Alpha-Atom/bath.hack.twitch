import java.awt.Point;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;

import javafx.application.Application;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.layout.Pane;
import javafx.scene.layout.StackPane;
import javafx.scene.paint.Color;
import javafx.scene.shape.Rectangle;
import javafx.scene.text.Font;
import javafx.scene.text.Text;
import javafx.stage.Stage;

public class SudokuJavaFx extends Application {

    private static final int TILE_SIZE = 40;

    private static final int X_TILES = 9;
    private static final int Y_TILES = 9;
    private static final int BORDER_SIZE = 1;
    private static final int BONUS_BORDER = 2;
    private static final int W = X_TILES*TILE_SIZE + BORDER_SIZE + 3*BONUS_BORDER;
    private static final int H = Y_TILES*TILE_SIZE + BORDER_SIZE + 3*BONUS_BORDER;


    private Tile[][] grid = new Tile[X_TILES][Y_TILES];
    private char[][] initialBoard = new char[9][9];
    private Scene scene;
    private Stage globalStage;
    public boolean gameWon = false;
    private int gameNumber = 4;
    FileListener fListener;


    private Tile currentTile;

    private Parent createContent(int number) {
        
        try {
            PrintWriter writer = new PrintWriter("./res/current_game.mattsucks", "UTF-8"); //TODO FIX THIS
            writer.println("game" + number);
            writer.close();            
        } catch (FileNotFoundException e1) {
            e1.printStackTrace();
        } catch (UnsupportedEncodingException e1) {
            e1.printStackTrace();
        } 
        
        
        
        gameNumber = number;
        Pane root = new Pane();
        root.setPrefSize(W, H);
        root.setStyle("-fx-background-color: black;");


        try {
            File file = new File("./res/game" + gameNumber + ".txt");
            FileReader fr;
            fr = new FileReader(file);
            BufferedReader br = new BufferedReader(fr);

            for(int y = 0; y < 9; y++){
                for(int x = 0; x < 9; x++){
                    initialBoard[x][y] = (char)br.read();
                }
                br.read();
            }  

            br.close();
            fr.close();
        } catch (FileNotFoundException e) {
            System.err.println("Caught IOException: " + e.getMessage());
        } catch (IOException e) {
            System.err.println("Caught IOException: " + e.getMessage());
        }


        for (int y = 0; y < Y_TILES; y++) {
            for (int x = 0; x < X_TILES; x++) {
                char value = initialBoard[x][y];
                Tile tile = new Tile(x, y, value, (value == '0') ? false : true);

                grid[x][y] = tile;
                root.getChildren().add(tile);
            }
        }

        currentTile = grid[0][0];

        currentTile.setSelected(true);

        return root;
    }

    private class Tile extends StackPane {
        private int x, y;
        private boolean selected = false;
        private boolean readOnly = false;

        private Rectangle cell = new Rectangle(TILE_SIZE - 2*BORDER_SIZE, TILE_SIZE - 2*BORDER_SIZE);
        private Rectangle border = new Rectangle(TILE_SIZE, TILE_SIZE);
        private Text text = new Text();

        public Tile(int x, int y, char value, boolean readonly) {
            this.readOnly = readonly;
            this.x = x;
            this.y = y;

            border.setStroke(Color.BLUE);
            border.setFill(Color.BLUE);
            cell.setStroke(Color.LIGHTGRAY);
            cell.setFill(Color.WHITE);

            text.setFont(Font.font(18));
            text.setText(Character.toString(value));
            text.setVisible(readOnly);
            border.setVisible((selected ? true : false));

            getChildren().addAll(border, cell, text);

            setTranslateX(x * TILE_SIZE + BORDER_SIZE + BONUS_BORDER*(x/3));
            setTranslateY(y * TILE_SIZE + BORDER_SIZE + BONUS_BORDER*(y/3));
        }

        public void setSelected(boolean bool){
            selected = bool;

            border.setVisible(bool);
            if(bool){ //Decrease the white cell size, to increase the selected border size
                cell.setWidth(TILE_SIZE - 6*BORDER_SIZE);
                cell.setHeight(TILE_SIZE - 6*BORDER_SIZE);
            } else { //Increase the white cell size, to revert the border size
                cell.setWidth(TILE_SIZE - 2*BORDER_SIZE);
                cell.setHeight(TILE_SIZE - 2*BORDER_SIZE);
            }
        }


        public void setTileText(String newText){
            text.setText(newText);
            text.setVisible(true);

            if(newText.equals("0"))
                text.setVisible(false);
        }
        
        public void setReadOnly(boolean read){
            this.readOnly = read;
        }

    }

    private void move(Point moveCoord) {
        int newX = currentTile.x + moveCoord.x;
        int newY = currentTile.y + moveCoord.y;

        if((newX < 0 || newX > 8) || (newY < 0 || newY > 8)){
            System.out.println("Co-ordinate out of bound. Movement Ignored");
            return;
        }

        currentTile.setSelected(false);
        currentTile = grid[newX][newY];
        currentTile.setSelected(true);

    }

    private void insert(char number){
        if(!currentTile.readOnly)
            currentTile.setTileText(Character.toString(number));

        int winValue = hasWonBySolution();
        
        if(winValue == -1){
            winValue = (hasWon() ? 1 : 0);
        }
        
        if(winValue == 1)
            gameWon = true;
       
        if(gameWon){
            System.out.println("HOLY SHIT YOU WON");
            won();
        }
    }
    
    /**
     * YOU
     * WON
     * YAY
     */
    public void won(){
        for(int x = 0; x < 9; x++){
            for (int y = 0; y < 9; y++){
                grid[x][y].setTileText("0");
            }
        }

        grid[3][3].setTileText("Y");
        grid[4][3].setTileText("O");
        grid[5][3].setTileText("U");
        grid[3][4].setTileText("W");
        grid[4][4].setTileText("O");
        grid[5][4].setTileText("N");
        grid[3][5].setTileText("Y");
        grid[4][5].setTileText("A");
        grid[5][5].setTileText("Y");

        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        newGame();

    }

    public void newGame(){

        
        gameWon = false;
        int newGameNumber = (gameNumber++%4)+1;
        
        try {
            PrintWriter writer = new PrintWriter("./res/current_game.mattsucks", "UTF-8"); //TODO FIX THIS
            writer.println("game" + newGameNumber);
            writer.close();            
        } catch (FileNotFoundException e1) {
            e1.printStackTrace();
        } catch (UnsupportedEncodingException e1) {
            e1.printStackTrace();
        } 
        
        
        
        gameNumber = newGameNumber;


        try {
            File file = new File("./res/game" + newGameNumber + ".txt");
            FileReader fr;
            fr = new FileReader(file);
            BufferedReader br = new BufferedReader(fr);

            for(int y = 0; y < 9; y++){
                for(int x = 0; x < 9; x++){
                    initialBoard[x][y] = (char)br.read();
                }
                br.read();
            }  

            for (char [] row : initialBoard){
                for (char cell : row){
                    System.out.print(cell);
                }
                System.out.println();
            }

            br.close();
            fr.close();
        } catch (FileNotFoundException e) {
            System.err.println("Caught IOException: " + e.getMessage());
        } catch (IOException e) {
            System.err.println("Caught IOException: " + e.getMessage());
        }


        for (int y = 0; y < Y_TILES; y++) {
            for (int x = 0; x < X_TILES; x++) {
                char value = initialBoard[x][y];

                Tile tile = grid[x][y];
                tile.setTileText(Character.toString(value));
                tile.setReadOnly( (value == '0') ? false : true);
            }
        }
        
        
        

        currentTile = grid[0][0];

        currentTile.setSelected(true);
        

        
        try {
            PrintWriter writer = new PrintWriter("./res/command_list.txt"); 
            writer.write("");
            writer.close();            
        } catch (IOException e1) {
            e1.printStackTrace();
        }
        //Interrupts previous listener, forcing close
        fListener.interrupt();
        //Creates new listener for the new game
        fListener = new FileListener();
        fListener.setApp(this);
        fListener.start();
       
    }

    public void handleCommand(String command){
        switch(command.charAt(0)){
        case 'M':
            switch(command.charAt(1)){
            case 'U':
                move(new Point(0, -1));
                break;
            case 'R':
                move(new Point(1, 0));
                break;
            case 'D':
                move(new Point(0, 1));
                break;
            case 'L':
                move(new Point(-1, 0));
                break;
            }
            break;
        case 'I':
            insert(command.charAt(1));
            break;
        case 'D':
            insert('0');
            break;
        }

    }

    /**
     * Checks if the sudoku matches the solution
     * @return an integer, 1 for true, 0 for false, -1 for error
     */
    public int hasWonBySolution(){
        
        try {
            File file = new File("./res/game" + gameNumber + "solution.txt");
            FileReader fr;
            fr = new FileReader(file);
            BufferedReader br = new BufferedReader(fr);

            //Form win[x][y]
            for(int y = 0; y < 9; y++){
                for(int x = 0; x < 9; x++){
                    if(!grid[x][y].text.getText().equals(Character.toString(((char)br.read()))))
                        return 0;
                }
                br.read();
            }  

            br.close();
            fr.close();
        } catch (IOException e) {
            System.err.println("Caught IOException: " + e.getMessage());
            return -1;
        }
        
        return 1;
        
    }
    
    public boolean hasWon(){

        if (containsZeroes())
            return false;

        ArrayList<String> checked = new ArrayList<String>();
        System.out.println("Across");
        for(int y = 0; y < 9; y++){
            for(int x = 0; x < 9; x++){
                if(checked.contains(grid[x][y].text.getText())){
                    return false;
                }
                checked.add(grid[x][y].text.getText());
            }
            checked.clear();
        }

        System.out.println("Down");
        for(int x = 0; x < 9; x++){
            for(int y = 0; y < 9; y++){
                if(checked.contains(grid[x][y].text.getText()))
                    return false;
                checked.add(grid[x][y].text.getText());
            }
            checked.clear();
        }  

        System.out.println("Grids");
        for(int x = 0; x < 3; x++){
            for(int y = 0; y < 3; y++){
                if(!checkGrid(x, y))
                    return false;
            }
        }  

        return true;
    }

    public boolean checkGrid(int xGrid, int yGrid){

        ArrayList<String> checked = new ArrayList<String>();
        for(int x = 0; x < 3; x++){
            for(int y = 0; y < 3; y++){
                if(checked.contains(grid[x + 3*xGrid][y + 3*yGrid].text.getText()))
                    return false;
                checked.add(grid[x + 3*xGrid][y + 3*yGrid].text.getText());
            }
        }  
        checked.clear();

        return true;
    }

    public boolean containsZeroes(){

        for(int y = 0; y < 9; y++){
            for(int x = 0; x < 9; x++){
                if(grid[x][y].text.getText() == "0"){
                    return true;
                }
            }
        }

        return false;
    }

    @Override
    public void start(Stage stage) throws IOException {
        scene = new Scene(createContent(4));

        globalStage = stage;
        globalStage.setScene(scene);
        globalStage.show();

        fListener = new FileListener();
        fListener.setApp(this);
        fListener.start();

    }

    public static void main(String[] args) {
        launch(args);
        System.exit(0);
    }
}
