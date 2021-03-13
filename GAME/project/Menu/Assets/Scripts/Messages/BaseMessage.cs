using System;

public enum MessageType
{
    Assign = 0,
    Jump,
}

public class BaseMessage
{
    public string Type { get; set; }
}
