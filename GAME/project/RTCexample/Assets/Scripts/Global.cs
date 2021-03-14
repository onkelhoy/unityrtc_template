using UnityEngine;
using System.Collections;

public class Global : MonoBehaviour
{
    public GameObject PlayerPrefab { get; set; }

    private void Awake()
    {
        WEB.onStart += Init;
    }

    private void Init(StartMessage start)
    {
        //Instantiate(PlayerPrefab, );
        if (WEB.HOST == WEB.ID)
        {
            float pie = Mathf.PI * 2 / start.Peers.Length;

            for (int i = 0; i < start.Peers.Length; i++)
            {

            }
        }
    }
}
