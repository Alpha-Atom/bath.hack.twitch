import java.io.File;
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
			File file = new File("./command_list.txt");
			FileReader fr = new FileReader(file);
			BufferedReader br = new BufferedReader(fr);
			String line;
			while((line = br.readLine()) != null) {
				System.out.println("HI MATT YOU TWAT ps i'm reading");
				app.handleCommand(line);
				try {
					Thread.sleep(1000);
				} catch (InterruptedException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
			br.close();
			fr.close();
		}  catch (IOException e) {
			System.err.println("Caught IOException: " + e.getMessage());
		}
	}
}


