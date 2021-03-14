using UnityEngine;
using System.Collections;

public class Manager : MonoBehaviour
{
    public GameObject PlayerPrefab;

    private void Awake()
    {
        WEB.onStart += Init;
    }

    private void Init(StartMessage start)
    {
        for (int i = 0; i < start.Peers.Length; i++)
        {
            GameObject Player = Instantiate(PlayerPrefab);
            Player.GetComponent<Player>().ID = start.Peers[i];
        }

        if (WEB.HOST == WEB.ID)
        {
            float pie = Mathf.PI * 2 / start.Peers.Length;

            for (int i = 0; i < start.Peers.Length; i++)
            {
                WEB.Broadcast(new AssignMessage()
                {
                    Position = new Vector3(Mathf.Cos(pie * i), 0, Mathf.Sin(pie * i)) * 10,
                    Target = start.Peers[i],
                    Type = PeerMessageType.ASSIGN
                }, new string[] { });
            }
        }
    }
}
