using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Player : MonoBehaviour
{
    public string ID { get; set; }

    // Start is called before the first frame update
    void Start()
    {
        MeshRenderer gameObjectRenderer = gameObject.GetComponent<MeshRenderer>();

        Material newMaterial = new Material(Shader.Find("Standard"));

        newMaterial.color = WEB.HOST == WEB.ID ? Color.red : Color.blue;
        gameObjectRenderer.material = newMaterial;

        WEB.onMessage += WEB_onMessage;
    }

    private void WEB_onMessage(PeerMessage obj)
    {
        if (obj.Content.Type == PeerMessageType.ASSIGN)
        {
            var info = (AssignMessage)obj.Content;

            Debug.Log("ASSIGN INVOKED MUTHERFUKKKKAAAAAAAHHHHHH!!!!!!!");
            transform.position = info.Position;
        }
    }
}
