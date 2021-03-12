using UnityEngine;
using System.Runtime.InteropServices;

public class RTC : MonoBehaviour
{

  [DllImport("__Internal")]
  private static extern int send(string to, string message, string[] channels);

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

  [DllImport("__Internal")]
  private static extern void unityToWeb(string message, string a, string b);

  public void connectionUpdate(string strmessage)
  {
    string[] split = strmessage.Split('#');
    string id = split[0];
    string state = split[1];

    Debug.Log(string.Format("connectionUpdate id: {1}, state: {2}", id, state));
  }

  public void channelUpdate(string strmessage)
  {
    string[] split = strmessage.Split('#');
    string label = split[0];
    string state = split[1];

    Debug.Log(string.Format("channelUpdate label: {1} state: {2}", label, state));
  }

  public void message(string strmessage)
  {
    string[] split = strmessage.Split('#');
    string channel = split[0];
    string peer_id = split[1];
    string message = split[2];

    Debug.Log(string.Format("message channel: {1} peer_id: {2}, message: {3}", channel, peer_id, message));
  }

  public void error(string strmessage)
  {
    string[] split = strmessage.Split('#');
    string type = split[0];
    string peer_id = split[1];
    string error = split[2];

    Debug.Log(string.Format("error type: {1} peer_id: {2} error: {3}", type, peer_id, error));
  }

  public void disconnect(string peer_id)
  {
    Debug.Log(string.Format("disconnected peer id: {1}", peer_id));
  }

  public void hostChange(string host)
  {
    Debug.Log(string.Format("hostChange : {1}", host));
  }

  public void setID(string id)
  {
    Debug.Log(string.Format("Set ID : {1}", id));
  }

  public void socketError(string strmessage)
  {
    string[] split = strmessage.Split('#');
    string type = split[0];
    string message = split[1];

    Debug.Log(string.Format("socketError type: {1}, message: {2}", type, message));
  }

  public void answerError(string error)
  {
    Debug.Log(string.Format("answerError : {1}", error));
  }

  public void webToUnity(string message)
  {
    Debug.Log(string.Format("Web To Unity : {1}", message));
  }
}