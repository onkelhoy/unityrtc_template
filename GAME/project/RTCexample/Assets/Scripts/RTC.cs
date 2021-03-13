using UnityEngine;
using System.Runtime.InteropServices;

public class RTC : ScriptableObject
{
    public static string ROOM;
    public static string ID;
    public static string HOST;

    [DllImport("__Internal")]
    public static extern int Send(string to, string message, string[] channels);

    [DllImport("__Internal")]
    public static extern void Broadcast(string message, string[] channels);

    [DllImport("__Internal")]
    public static extern void Disconnect();

    public void message(string strmessage)
    {
        string[] split = strmessage.Split('#');
        string channel = split[0];
        string peer_id = split[1];
        string message = split[2];

        Debug.Log(string.Format("message channel: {0} peer_id: {1}, message: {2}", channel, peer_id, message));
    }

    public void disconnect(string peer_id)
    {
        Debug.Log(string.Format("disconnected peer id: {0}", peer_id));
    }

    public void hostChange(string host)
    {
        RTC.HOST = host;
        Debug.Log(string.Format("hostChange : {0}", host));
    }

    public void init(string strmessage)
    {
        string[] split = strmessage.Split('#');
        string id = split[0];
        string room = split[1];
        string timestamp = split[2];

        RTC.ID = id;
        RTC.ROOM = room;

        Debug.Log(string.Format("Starting game {0} at {1}", room, timestamp));
    }
}