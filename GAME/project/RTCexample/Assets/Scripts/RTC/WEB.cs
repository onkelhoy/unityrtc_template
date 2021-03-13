using UnityEngine;
using System.Runtime.InteropServices;
using System;

public class WEB : ScriptableObject
{
    public static string ROOM;
    public static string ID;
    public static string HOST;

    // events 
    public static event Action<string> onDisconnect = delegate { };
    public static event Action<PeerMessage> onMessage = delegate { };
    public static event Action<StartMessage> onStart = delegate { };

    // UNITY-TO-WEB functions
    [DllImport("__Internal")]
    public static extern int Send(string to, string message, string[] channels);

    [DllImport("__Internal")]
    public static extern void Broadcast(string message, string[] channels);

    [DllImport("__Internal")]
    public static extern void Disconnect();

    // public functions

    // WEB-TO-UNITY functions
    public void message(string strmessage)
    {
        string[] split = strmessage.Split('#');

        PeerMessage msg = new PeerMessage()
        {
            Channel = split[0],
            Peer = split[1],
            Timestamp = DateTime.Parse(split[2]),
            Content = split[3]
        };

        onMessage(msg);
        Debug.Log(string.Format("[{0}] message channel: {1} peer: {2}", msg.Timestamp.ToString(), msg.Channel, msg.Peer));
    }

    public void disconnect(string peer_id)
    {
        onDisconnect(peer_id);
        Debug.Log(string.Format("disconnected peer id: {0}", peer_id));
    }

    public void start(string strmessage)
    {
        string[] split = strmessage.Split('#');

        StartMessage start = new StartMessage()
        {
            Timestamp = DateTime.Parse(split[3]),
            Peers = split[4].Split(',')
        };

        WEB.ID = split[0];
        WEB.ROOM = split[1];
        WEB.HOST = split[2];

        onStart(start);
        Debug.Log(string.Format("Starting game {0} at {1}", WEB.ROOM, start.Timestamp));
    }

    // other functions

    public void hostChange(string host)
    {
        WEB.HOST = host;
        Debug.Log(string.Format("hostChange : {0}", host));
    }
}