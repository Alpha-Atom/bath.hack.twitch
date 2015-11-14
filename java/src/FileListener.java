import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileReader;
import java.io.BufferedReader;
import java.io.IOException;

class FileListener extends Thread{
  SudokuJavaFx app;

  public void setApp(SudokuJavaFx newApp){
    app = newApp;
  }

  public void run() {
    //File reading and game loop
    try {
      File file = new File("./res/command_list.txt");
      FileInputStream fr = new FileInputStream(file);
      BufferedInputStream br = new BufferedInputStream(fr);
      String line ="";
      while(true) {

        if(br.available() > 0){
          char readChar = (char) br.read();
          System.out.println("Reading Char: " + Character.toString(readChar));
          if(readChar != '\n')
            line += (Character.toString(readChar));
          else {
            app.handleCommand(line);
            line = "";
            try {
              Thread.sleep(1000);
            } catch (InterruptedException e) {
              e.printStackTrace();
              break;
            }
          }
        }
      }
      br.close();
      fr.close();
    }  catch (IOException e) {
      System.err.println("Caught IOException: " + e.getMessage());
    }
  }
}




