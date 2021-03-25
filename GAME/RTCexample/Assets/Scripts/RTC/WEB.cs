using UnityEngine;
using System.Runtime.InteropServices;
using System;

public class WEB : MonoBehaviour
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
    private static extern int UTWSend(string to, string message, string[] channels);

    [DllImport("__Internal")]
    private static extern void UTWBroadcast(string message, string[] channels);

    [DllImport("__Internal")]
    private static extern void UTWDisconnect();

    public static void Send(string to, BasicPeerContent message, string[] channels)
    {
        UTWSend(to, message.Serialize(), channels);
    }

    public static void Broadcast(BasicPeerContent message, string[] channels)
    {
        UTWBroadcast(message.Serialize(), channels);
    }

    public static void Disconnect()
    {
        UTWDisconnect();
    }

    // public functions

    // WEB-TO-UNITY functions
    public static void message(string strmessage)
    {
        string[] split = strmessage.Split('#');

        BasicPeerContent content = BasicPeerContent.Deserialize(split[3]);

        PeerMessage msg = new PeerMessage()
        {
            Channel = split[0],
            Peer = split[1], // FROM 
            Timestamp = DateTime.Parse(split[2]),
            Content = content,
        };

        onMessage(msg);
        Debug.Log(string.Format("[{0}] message channel: {1} peer: {2}", msg.Timestamp.ToString(), msg.Channel, msg.Peer));
    }

    public static void invokeMessage(PeerMessage msg)
    {
        onMessage(msg);
    }

    public void disconnect(string peer_id)
    {
        onDisconnect(peer_id);
        Debug.Log(string.Format("disconnected peer id: {0}", peer_id));
    }

    public void start(string strmessage)
    {
        string[] split = strmessage.Split('#');
        Debug.Log(string.Format("string: {0}, size: {1}", strmessage, split.Length));

        StartMessage start = new StartMessage()
        {
            Timestamp = DateTime.Parse(split[3]),
            Peers = split[4].Split(',')
        };

        WEB.ID = split[0];
        WEB.ROOM = split[1];
        WEB.HOST = split[2];

        Debug.Log("GAME IS NOW STARTING!!!!!");
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