
public class LockInTimer extends Thread{
    private SudokuJavaFx application;
    private int timerMilliseconds;
    
    public LockInTimer(int milliseconds, SudokuJavaFx app){
        timerMilliseconds = milliseconds;
        application = app;
    }
    
    public void run(){
        try {
            this.sleep(timerMilliseconds);
            application.lockIn();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        
    }
    
    public void updateApp(SudokuJavaFx app){
        application = app;
    }
}
