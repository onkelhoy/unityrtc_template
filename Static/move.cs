using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class move : MonoBehaviour
{

  // Update is called once per frame
  void Update()
  {
    if (Input.GetButtonDown("Jump"))
    {
      Vector3 p = transform.position + Vector3.up * 4f * Time.deltaTime;
      transform.position = p;
    }
  }
}
