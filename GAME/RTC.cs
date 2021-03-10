using UnityEngine;
using System.Runtime.InteropServices;

public class RTC : MonoBehaviour {

    [DllImport("__Internal")]
    private static extern boolean send(string to, string message, string[] channels);
    
    [DllImport("__Internal")]
    private static extern void broadcast(string message, string[] channels);
    
    [DllImport("__Internal")]
    private static extern void terminateSocket();
    
    [DllImport("__Internal")]
    private static extern void terminate();
    
    [DllImport("__Internal")]
    private static extern void farwell();
    
    [DllImport("__Internal")]
    private static extern void create(string room, string password);
    
    [DllImport("__Internal")]
    private static extern void connect(string room, string password);


    public void connectionUpdate(string id, string state) {
      Debug.Log(string.Format("connectionUpdate id: {1}, state: {2}", id, state));
    }

    public void channelUpdate(string label, string state) {
      Debug.Log(string.Format("channelUpdate label: {1} state: {2}", label, state));
    }

    public void message(string channel, string peer_id, string message) {
      Debug.Log(string.Format("message channel: {1} peer_id: {2}, message: {3}", channel, peer_id, message));
    }
     
    public void error(string type, string peer_id, string error) {
      Debug.Log(string.Format("error type: {1} peer_id: {2} error: {3}", type, peer_id, error));
    }

    public void disconnect(string peer_id) {
      Debug.Log(string.Format("disconnected peer id: {1}", id));
    }

    public void hostChange(string host) {
      Debug.Log(string.Format("hostChange : {1}", host));
    }

    public void setID(string id) {
      Debug.Log(string.Format("Set ID : {1}", id));
    }

    public void socketError(string type, string message) {
      Debug.Log(string.Format("socketError type: {1}, message: {2}", type, message));
    }

    public void answerError(any error) {
      Debug.Log(string.Format("answerError : {1}", error));
    }
}