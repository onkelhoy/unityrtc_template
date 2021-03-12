using UnityEngine;
using System.Runtime.InteropServices;

public class RTC : MonoBehaviour
{
  public Transform player;

  [DllImport("__Internal")]
  public static extern int send(string to, string message, string[] channels);

  [DllImport("__Internal")]
  public static extern void broadcast(string message, string[] channels);

  [DllImport("__Internal")]
  public static extern void terminateSocket();

  [DllImport("__Internal")]
  public static extern void terminate();

  [DllImport("__Internal")]
  public static extern void farwell();

  [DllImport("__Internal")]
  public static extern void create(string room, string password);

  [DllImport("__Internal")]
  public static extern void connect(string room, string password);

  public void connectionUpdate(string strmessage)
  {
    string[] split = strmessage.Split('#');
    string id = split[0];
    string state = split[1];

    Debug.Log(string.Format("connectionUpdate id: {0}, state: {1}", id, state));
  }

  public void channelUpdate(string strmessage)
  {
    string[] split = strmessage.Split('#');
    string label = split[0];
    string state = split[1];

    Debug.Log(string.Format("channelUpdate label: {0} state: {1}", label, state));
  }

  public void message(string strmessage)
  {
    string[] split = strmessage.Split('#');
    string channel = split[0];
    string peer_id = split[1];
    string message = split[2];

    Debug.Log(string.Format("message channel: {0} peer_id: {1}, message: {2}", channel, peer_id, message));
  }

  public void error(string strmessage)
  {
    string[] split = strmessage.Split('#');
    string type = split[0];
    string peer_id = split[1];
    string error = split[2];

    Debug.Log(string.Format("error type: {0} peer_id: {1} error: {2}", type, peer_id, error));
  }

  public void disconnect(string peer_id)
  {
    Debug.Log(string.Format("disconnected peer id: {0}", peer_id));
  }

  public void hostChange(string host)
  {
    Debug.Log(string.Format("hostChange : {0}", host));
  }

  public void setID(string id)
  {
    Debug.Log(string.Format("Set ID : {0}", id));
  }

  public void socketError(string strmessage)
  {
    string[] split = strmessage.Split('#');
    string type = split[0];
    string message = split[1];

    Debug.Log(string.Format("socketError type: {0}, message: {1}", type, message));
  }

  public void answerError(string error)
  {
    Debug.Log(string.Format("answerError : {0}", error));
  }
}