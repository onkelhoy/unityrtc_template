using System;
using System.Collections.Generic;
using UnityEngine;

public class PlayerManager : ScriptableObject
{
    public static Dictionary<string, GameObject> Players = new Dictionary<string, GameObject>();

    public static void NewPlayer(string id)
    {
        Instantiate<GameObject>()
        PlayerManager.Players.Add(id, )
    }

    public static void Start()
    {
        if (RTC.HOST == RTC.ID)
        {
            int size = RTC.PEERS.Count + 1; // + yourself
            float i = 1;
            float dist = 10f;

            Vector3 myPos = new Vector3(dist, 0, 0);

            foreach (string peer in RTC.PEERS)
            {
                float angle = i / size * Mathf.PI * 2;
                Vector3 pos = new Vector3(Mathf.Cos(angle), 0, Mathf.Sin(angle)) * dist;


                AssignMessage msg = new AssignMessage(pos);
                RTC.Send(peer, msg);

                i++;
            }
        }
    }
}
