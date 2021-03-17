using System;

public enum PeerMessageType
{
    ASSIGN = 0,
}

[Serializable]
public class PeerMessage : MessageStructure
{
    public string Peer { get; set; }

    public string Channel { get; set; }

    public BasicPeerContent Content { get; set; }

    public string Serialize()
    {
        return string.Format("{0}#{1}#{2}#{3}", Channel, Peer, DateTime.Now, Content.Serialize());
    }
}
