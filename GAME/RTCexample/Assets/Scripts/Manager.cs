using UnityEngine;
using System.Collections;

public class Manager : MonoBehaviour
{
    public GameObject PlayerPrefab;

    private void Awake()
    {
        Debug.Log("Awake");
        WEB.onStart += Init;
    }

    private void Init(StartMessage start)
    {
        Debug.Log("init call");
        for (int i = 0; i < start.Peers.Length; i++)
        {
            GameObject Player = Instantiate(PlayerPrefab);
            Player.GetComponent<Player>().ID = start.Peers[i];
        }

        if (WEB.HOST == WEB.ID)
        {
            float pie = Mathf.PI * 2 / start.Peers.Length;
            Debug.Log(string.Format("THIS IS COUNT: {0}", start.Peers.Length));

            for (int i = 0; i < start.Peers.Length; i++)
            {
                AssignMessage msg = new AssignMessage()
                {
                    Position = new Vector3(Mathf.Cos(pie * i), 0, Mathf.Sin(pie * i)) * 10,
                    Target = start.Peers[i],
                    Type = PeerMessageType.ASSIGN
                };
                if (start.Peers[i] == WEB.ID)
                {
                    WEB.invokeMessage(new PeerMessage() { Content = msg });
                }
                else
                {
                    WEB.Broadcast(msg, new string[] { });
                }
            }
        }
    }
}
