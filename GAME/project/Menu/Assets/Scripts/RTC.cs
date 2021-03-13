using UnityEngine;
using System.Runtime.InteropServices;
using System.Collections.Generic;

public class RTC : MonoBehaviour
{
    public static string ROOM;
    public static string ID;
    public static string HOST;
    public static HashSet<string> PEERS = new HashSet<string>();

    public MainMenu mainMenu;
    public LobbyMenu lobbyMenu;

    [DllImport("__Internal")]
    public static extern int send(string to, string message, string[] channels);

    [DllImport("__Internal")]
    public static extern void broadcast(string message, string[] channels);

    [DllImport("__Internal")]
    public static extern void terminateSocket();

    [DllImport("__Internal")]
    public static extern void terminate();

    [DllImport("__Internal")]
    public static extern void Start(string timestamp);

    [DllImport("__Internal")]
    public static extern void create(string room, string password);

    [DllImport("__Internal")]
    public static extern void connect(string room, string password);

    // helper function to send BaseMessages
    public static void Send(string to, CollectionMessage message)
    {
        RTC.Send(to, message, new string[0]);
    }
    public static void Send(string to, CollectionMessage message, string[] channels)
    {
        string msg = message.Stringify();
        RTC.send(to, msg, channels);
    }
    public static void Broadcast(CollectionMessage message)
    {
        RTC.Broadcast(message, new string[0]);
    }
    public static void Broadcast(CollectionMessage message, string[] channels)
    {
        string msg = message.Stringify();
        RTC.broadcast(msg, channels);
    }

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
        RTC.PEERS.Remove(peer_id);
        Debug.Log(string.Format("disconnected peer id: {0}", peer_id));
    }

    public void hostChange(string host)
    {
        RTC.HOST = host;
        Debug.Log(string.Format("hostChange : {0}", host));
    }

    public void setID(string strmessage)
    {
        string[] split = strmessage.Split('#');
        string id = split[0];
        string room = split[1];

        RTC.ID = id;
        RTC.ROOM = room;
        Debug.Log(string.Format("Connected to Room {0} with ID : {1}", room, id));
    }

    public void socketError(string strmessage)
    {
        string[] split = strmessage.Split('#');
        string type = split[0]; // join, room, host
        string message = split[1];

        switch (type)
        {
            case "host":
                lobbyMenu.showError(message);
                break;
            case "join":
            case "room":
                mainMenu.showError(message);
                break;
        }

        Debug.Log(string.Format("socketError type: {0}, message: {1}", type, message));
    }

    public void answerError(string strmessage)
    {
        string[] split = strmessage.Split('#');
        string peer_id = split[0];
        string error = split[1];

        Debug.Log(string.Format("Answer Error from : {0} - {1}", peer_id, error));
    }

    public void newPeer(string peer_id)
    {
        Debug.Log(string.Format("Incomming peer connection : {0}", peer_id));
        RTC.PEERS.Add(peer_id);
    }

    public void start(string timestamp)
    {
        Debug.Log(string.Format("Starting game {0}", timestamp));
    }
}