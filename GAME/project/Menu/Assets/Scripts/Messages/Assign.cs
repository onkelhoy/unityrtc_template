using System;
using UnityEngine;

public class AssignMessage : CollectionMessage
{
    public Vector3 Position { get; set; }

    public AssignMessage()
    {
        Type = "AssignMessage";
    }

    public AssignMessage(Vector3 Position)
    {
        Type = "AssignMessage";
        this.Position = Position;
    }
}
