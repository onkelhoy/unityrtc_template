using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Player : MonoBehaviour
{
    public Color color { get; set; }

    // Start is called before the first frame update
    void Start()
    {
        MeshRenderer gameObjectRenderer = gameObject.GetComponent<MeshRenderer>();

        Material newMaterial = new Material(Shader.Find("Standard"));

        newMaterial.color = color;
        gameObjectRenderer.material = newMaterial;
    }

    // Update is called once per frame
    void Update()
    {

    }
}
